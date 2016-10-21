import React, { Component } from 'react';
import { Navigator, View, Text, TouchableOpacity } from 'react-native';

import styles from './style';
import navBar from './navbar';
import TabBar from './tabbar';
import * as actions from './actions';
import reducer from './reducer';

const actionTypes = actions.actionTypes;

const actionMap = {
    push: actionTypes.ROUTER_PUSH,
    replace: actionTypes.ROUTER_REPLACE,
    reset: actionTypes.ROUTER_RESET,
};

class Route extends React.Component {
    className() {
        return 'Route';
    }

    render() {
        return null;
    }
}

class TabRoute extends React.Component {
    className() {
        return 'TabRoute';
    }

    render() {
        return null;
    }
}

/**
 *
 */
class Router extends React.Component {
    constructor(props) {
        super(props);

        const { actions = {}, dispatch } = props;
        actions.routes = {};

        this.routes = {};
        this.initial = {
            name: props.initial
        };
        this.tabbarStyles = {};
        this.tabs = {};
        this.otherEl = null;

        React.Children.forEach(props.children, (child, index) => {
            let name = child.props.name;
            let classname = child.type.prototype.className && child.type.prototype.className();

            if (classname == 'TabRoute') {
                const tabBarName = child.props.name;
                this.routes[tabBarName] = {};

                this.tabbarStyles = {
                    barTint: child.props.barTint,
                    tint: child.props.tint,
                };


                actions.routes[tabBarName] = {};
                React.Children.forEach(child.props.children, (tabChild, tabIndex) => {
                    const tabName = tabChild.props.name;
                    this.routes[tabBarName][tabName] = tabChild.props;
                    this.routes[tabName] = tabChild.props;
                    if (tabChild.props.initial || !this.initial.name) {
                        this.initial.name = tabName;
                        this.initial.tabBarName = tabBarName;
                    }
                    if (props.initial === tabName) {
                        this.initial.tabBarName = tabBarName;
                    }

                    actions.routes[tabBarName][tabName] = (data = {}) => e => {
                        if (typeof(data) !== 'object') {
                            data = { data }
                        }

                        dispatch({
                            type: actionMap[data.type || tabChild.props.type] || 'ROUTER_PUSH',
                            payload: { name: tabName, tabBarName, data }
                        });
                    };

                    if (!tabChild.props.component) {
                        console.error('No route component is defined for route[name=' + tabName + ']');
                        return;
                    }
                });
            } else if (classname == 'Route') {
                if (child.props.initial || !this.initial.name) {
                    this.initial.name = name;
                }

                this.routes[name] = child.props;

                actions.routes[name] = (data = {}) => e => {
                    if (typeof(data) !== 'object') {
                        data = { data }
                    }

                    dispatch({
                        type: actionMap[data.type || child.props.type] || 'ROUTER_PUSH',
                        payload: { name, data },
                    });
                };

                if (!child.props.component && !child.props.children) {
                    console.error('No route component is defined for route[name=' + name + ']');
                    return;
                }
            } else {
                this.otherEl = this.otherEl || [];
                this.otherEl = [...this.otherEl, child];
            }
        });

        if (!this.routes[this.initial.name]) {
            console.error('No initial route ' + this.initial.name);
        }

        // 路由前置处理
        if (this.props.onEnter) {
            let initialRoute = this.routes[this.initial.name];
            let onEnterRoute = this._wrapEnterRoute(initialRoute, this.props.onEnter(initialRoute, this.routes));

            this.initial = {...this.initial, data: onEnterRoute.data};
        }
    }

    /**
     * 配置场景动画
     * @param route 路由
     * @param routeStack 路由栈
     * @returns {*} 动画
     */
    _configureScene(route, routeStack) {
        if (route.type == 'Bottom') {
            return Navigator.SceneConfigs.FloatFromBottom; // 底部弹出

            // 自定义场景动画类型
        } else if (route.type) {
            return route.type;
        }

        return Navigator.SceneConfigs.PushFromRight; // 右侧弹出
    }

    _renderScene (route, navigator) {
        this.navigator = navigator;

        let name = route.name,
            params = route.params,
            Component = route.component;

        if (route.targetRoute) {
            params.targetRoute = route.targetRoute;
        }

        return <Component key={name} actions={this.props.actions} {...params}/>;
    }

    componentDidMount() {
        this.props.actions.init(this.initial);
    }

    componentWillReceiveProps(nextProps) {
        const routeKey = router => (
            '' + router.activeTabBar + router.activeTab + router.currentRoute
        );

        if (routeKey(this.props.router) !== routeKey(nextProps.router)) {
            this.handleRouteChange(nextProps.router);
        }
    }

    render() {

        const { router } = this.props;
        const currentRouteObj = this.routes[router.currentRoute];
        const hideNavBar = currentRouteObj && currentRouteObj.hideNavBar || false;
        const hideTabBar = currentRouteObj && currentRouteObj.hideTabBar || false;

        if (!(this.props.initial || this.initial.name)) {
            console.error('No initial attribute!');
        }

        let route = this.routes[this.initial.name];

        this.initialRoute = this.getRoute(route);

        const tabs = this.routes[router.activeTabBar];

        return (
            <View style={styles.container}>
                <Navigator
                    // 初始页面
                    initialRoute={this.initialRoute}
                    style={styles.container}
                    ref={(nav) => this.nav = nav}
                    // 路由入口
                    renderScene={this._renderScene.bind(this)}
                    configureScene={this._configureScene.bind(this)}
                    sceneStyle={hideNavBar ? {}: {flex: 1, top: 64}}
                    navigationBar={hideNavBar ? null : navBar}
                />{ tabs && !hideTabBar ?
                    <TabBar
                        actions={this.props.actions}
                        navigator={this.navigator}
                        activeTab={router.activeTab}
                        tabStyles={this.tabbarStyles}
                        tabs={tabs}
                    />: null}
                {this.otherEl ? this.otherEl: null}
            </View>
        );
    }

    getRoute(routeProps, router = { data: {} }) {
        const { data = {} } = router;

        if (!routeProps) {
            return {};
        }

        return {
            component: routeProps.component,
            type: routeProps.type,
            name: routeProps.name,
            title: routeProps.title,
            hideTabBar: routeProps.hideTabBar,
            hideNavBar: routeProps.hideNavBar,
            actions: this.props.actions,
            params: data ,
        }
    }

    /**
     * 将前置路由包装,使当前路由作为前置路由页面的targetRoute
     * @param route
     * @param onEnterRoute
     * @returns {*}
     * @private
     */
    _wrapEnterRoute (route, onEnterRoute) {
        let enterRoute = Object.assign({}, onEnterRoute);

        enterRoute.data = enterRoute.data || {};
        enterRoute.data = {...enterRoute.data, targetRoute: route};

        return enterRoute;
    }

    handleRouteChange(router) {
        const { data = {}, mode } = router;

        // 前置路由处理
        if (this.props.onEnter) {
            let currentRouteObj = this.routes[router.currentRoute];
            let onEnterRoute = this.props.onEnter(currentRouteObj, this.routes);

            if (onEnterRoute.name != currentRouteObj.name) {
                this.props.actions.replace(this._wrapEnterRoute(currentRouteObj, onEnterRoute));
                return;
            }
        }

        if (mode === actionTypes.ROUTER_CHANGE_TAB) {
            let routes = [];

            if (router.routeStacks[router.activeTab]) {
                routes = router.routeStacks[router.activeTab];
            } else {
                routes = router.routes.map(route => (
                    this.getRoute(this.routes[route], router)
                ));
            }

            this.nav.immediatelyResetRouteStack(routes);
        }

        if (mode === actionTypes.ROUTER_POP) {
            const num = data.num || 1;
            const routes = this.nav.getCurrentRoutes();
            if (num < routes.length) {
                this.nav.popToRoute(routes[routes.length - 1 - num]);
            } else {
                this.nav.popToTop();
            }
        }

        if (mode === actionTypes.ROUTER_PUSH) {
            this.nav.push(this.getRoute(
                this.routes[router.currentRoute], router
            ));
        }

        if (mode === actionTypes.ROUTER_REPLACE) {
            this.nav.replace(this.getRoute(
                this.routes[router.currentRoute], router
            ));
        }

        if (mode === actionTypes.ROUTER_RESET) {
            this.nav.immediatelyResetRouteStack([
                this.getRoute(this.routes[router.currentRoute], router)
            ]);
        }
    }
}

module.exports = {
    Route,
    TabRoute,
    Router,
    actions,
    reducer,
};
