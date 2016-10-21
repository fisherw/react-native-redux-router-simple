# react-native-redux-router-simple
react native的路由组件,结合redux实现。它提供路由配置、路由跳转、顶部导航栏、底栏功能。
支持onEnter配置,可以在路由跳转前做登录授权验证决定是否重定向(replace)到登录页。

#关于该组件
组件是react-native-router-redux的简化版(去掉Schema配置,仅支持单个TabRoute配置),并在它的基础上增加了以下功能:
1.Router标签下除了定义Route及TabRoute标签外,还可以添加其它全局标签(View,Text,自定义组件如全局Loading组件等)
2.每个路由页可配置navbar或tabbar是否显示
3.Router组件提供onEnter配置,可用于做跳转前置控制(登录拦截)

#安装
```
npm install --save react-native-redux-router-simple
```

#使用文档
请参考react-native-router-redux文档及example示例获取基础用法(路由跳转方法与它保持一致),其它如onEnter使用请参考下方示例。

#示例
```
'use strict';

import React, { Component } from 'react';

import { Navigator, StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loading from '../components/loading';

import Hello from '../containers/hello';
import OrderDetail from '../containers/order-detail';
import Orders from '../containers/orders';
import Setting from '../containers/setting';

import { Router, Route, TabRoute, actions as routerActions } from '../components/router';

const mapStateToProps = state => ({
    router: state.router, // 一定要暴露出来(先在reducer中引入,请参考react-native-router-redux的示例中的reducer声明引用)
    global: state.global
});

const mapDispatchToProps = (dispatch) => ({
    // actions一定要暴露出来
    actions: bindActionCreators({
        ...routerActions,
    }, dispatch),
    dispatch
});

const assets = {
    'setting_active': require('../assets/img/setting_active.png'),
    'setting': require('../assets/img/setting.png'),
    'order_active': require('../assets/img/order_active.png'),
    'order': require('../assets/img/order.png')
};

class App extends Component {
    // 参数说明:
    // route --  当前即将进入的页面路由对象
    // routes -- 所有路由对象组成的列表
    // 返回说明: 返回路由对象, 组件根据返回路由replace到对应的
    // 页面(并会在跳转后的页面中注入属性: targetRoute=route, 用于登录成功后可回到route页)。
    handleRouteEnter (route, routes) {
        // 可作登录拦截
        // 此处仅判断路由是orderDetail页时,跳转至hello页
        if (route.name === 'orderDetail') {
            return routes['hello'];
        }

        return route;
    }

    // hideNavBar -- 是否不显示navbar
    // hideTabBar -- 是否不显示tabbar
    // Router的children中可添加多个全局组件显示,此处添加了Loading组件用来显示全局加载状态条。
    render() {
        const { fetchCount } = this.props.global;

        return (
            <Router {...this.props} assets={assets} initial="orders" onEnter={this.handleRouteEnter.bind(this)}>
                <Route name="hello" component={Hello} type="reset" hideNavBar={false} hideTabBar={false} title={"nothing"} />
                <Route name="orderDetail" component={OrderDetail} hideNavBar={true} title={"订单详情"} />
                <TabRoute name="tabBar" barTint='#fcfff7' tint="red">
                    <Route name="orders" component={Orders} title="订单" tabItem={{selectedColor: '#9ab270', color: '#babfb0', selectedIcon: assets['order_active'], icon: assets['order'], title: '订单'}} />
                    <Route name="setting" component={Setting} title="设置" tabItem={{selectedColor: '#9ab270', color: '#babfb0', selectedIcon: assets['setting_active'], icon: assets['setting'], title: '设置'}} />
                </TabRoute>
                <Loading isVisible={fetchCount ? true: false} />
            </Router>
        );
    }
}

let ConnectApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectApp;

```

