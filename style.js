
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'transparent',
        flex: 1,
    },
    navBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9ab270',
        overflow: 'hidden',
    },
    navBarItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    navBarText: {
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    navBarTitleText: {
        color: '#fff',
    },
    navBarLeftButton: {
        paddingLeft: 10,
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: '#fff'
    },
});
