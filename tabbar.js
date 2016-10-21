import React, { Component } from 'react';
import Tabs from './tabs';
import { Image, StyleSheet, Text, View, PixelRatio } from 'react-native';

const imageStyle = props => ({
    resizeMode: 'contain',
});

const tabBarStyle = props => ({
    backgroundColor: props.tabStyles.barTint || '#F9F9F9',
    borderTopColor: '#ebf0e6',
    borderTopWidth: 1,
    alignItems: 'stretch'
});

const tabContainerStyle = (props) => {
    var styles = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return styles;
};

const selectedIconStyle = (props) => ({
    borderBottomColor: '#9ab270', //todo,支持配置
    borderBottomWidth: 3
});

const textStyle = props => ({
    color: props.selected ? props.selectedColor: props.color,
    fontSize: 16,
    letterSpacing: 0.2,
    textAlign:'center',
});

class TabBarIcon extends Component {
    render() {
        const { name, tabItem, selected } = this.props;

        return (
            <View name={name} style={tabContainerStyle(this.props)}>
                {tabItem.icon &&
                <Image
                    source={selected ? tabItem.selectedIcon : tabItem.icon}
                    style={imageStyle(this.props)}
                />
                }
                {tabItem.title &&
                <Text style={textStyle(this.props)}>{tabItem.title}</Text>
                }
            </View>
        );
    }
}

export default class TabBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            //activeTab: props.activeTab
        };
    }

    handleTabSelect = (props) => el => {
        props.actions.changeTab({
            from: props.activeTab,
            name: el.props.name,
            navigator: props.navigator,
        });

        return {
            selectionColor: props.tabStyles.tint || '#037AFF',
        };
    }

    render() {
        const { tabs, activeTab } = this.props;
        const tabBarItems = Object.keys(tabs).map(tabName => {
            const tab = tabs[tabName];
            const tabItem = tab.tabItem || {};

            return (
                <TabBarIcon
                    color={tabItem.color}
                    selectedColor={tabItem.selectedColor}
                    selected={activeTab === tabName}
                    key={tabName}
                    name={tabName}
                    tabItem={tabItem}
                    tabStyles={this.props.tabStyles}
                />
            );
        });

        return (
            <Tabs
                activeOpacity={1.0}
                onSelect={this.handleTabSelect(this.props)}
                selected={activeTab}
                style={tabBarStyle(this.props)}
                selectedIconStyle={selectedIconStyle(this.props)}
            >
                {tabBarItems}
            </Tabs>
        );
    }
}