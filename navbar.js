import React, { Component } from 'react';
import { Navigator, View, Text, TouchableOpacity } from 'react-native';

import styles from './style';


const NavigationBarMap = {
    // 左键
    LeftButton(route, navigator, index, navState) {

        if (index > 0) {
            var previousRoute = navState.routeStack[index - 1];

            return (
                <View style={[styles.navBarItem, styles.navBarLeftButton]}>
                    <TouchableOpacity
                        underlayColor='transparent'
                        onPress={() => {if (index > 0) {route.actions.pop()}}}>
                        <Text style={[styles.navBarText, styles.navBarButtonText]}>

                            {'返回'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    },
    // 右键
    RightButton(route, navigator, index, navState) {
        if (route.rightNavBtn) {
            return (
                <View style={[styles.navBarItem, styles.navBarRightButton]}>
                    <TouchableOpacity
                        onPress={() => route.rightNavBtn.onPress()}>
                        <Text style={[styles.navBarText, styles.navBarButtonText]}>
                            {route.rightNavBtn.title || '右键'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    },
    // 标题
    Title(route, navigator, index, navState) {
        return (
            <View style={[styles.navBarItem]}>
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                    {route.title || ''}
                </Text>
            </View>
        );
    }
};


export default  (
    <Navigator.NavigationBar
        routeMapper={NavigationBarMap}
        style={styles.navBar}
        navigationStyles={Navigator.NavigationBar.StylesIOS}
    />
)