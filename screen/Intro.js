import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import Header from '../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Intro = (props) => {
	const {navigation, member_login, member_info} = props;
	const [appToken, setAppToken] = useState();

	//토큰값 구하기
  useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            //console.log('Authorization status:', authStatus);
        if (enabled) {
            //console.log('Authorization status:', authStatus);
            await get_token();
        }
    }

    //기기토큰 가져오기
    async function get_token() {
			await messaging()
			.getToken()
			.then(token => {
				//console.log("appToken", token);
				if(token) {
					AsyncStorage.setItem('appToken', token);
					setAppToken(token);
					movePageCheck(token);
					return true;
				} else {
					return false;
				}
			});
    }

    requestUserPermission();

    return messaging().onTokenRefresh(token => {
      setAppToken(token);
    });
  } ,[])

	function movePageCheck(token){
		AsyncStorage.getItem('mb_id').then(async (response) => {
			//console.log("response : ",response);
			
      if (response === null || response == undefined) {
        setTimeout(() => {
					navigation.replace('Login');
				}, 2000);
      }else{
        const payload = {'is_api':1, 'id':response, 'mb_regnum':token};
				const member_info_list = await member_info(payload);
				//console.log("payload : ",payload);
				//console.log("member_info_list :::::::::::::::: ",member_info_list);
				if(member_info_list.result_code == 1){
					setTimeout(() => {
						//navigation.replace('TabNavigator', {
						navigation.replace('TabNav', {
							screen: 'Home',
							params: {
								msg : member_info_list.result,
							}
						})
					}, 2000);
				}else{
					setTimeout(() => {
						navigation.replace('Login');
					}, 2000);
				}
      }
    });
	}

  useEffect(()=>{
    // AsyncStorage.getItem('mb_id').then(async (response) => {
    //   if (response === null || response == undefined) {
    //     setTimeout(() => {
		// 			navigation.replace('Login', {appToken:appToken});
		// 		}, 2000);
    //   }else{
    //     const payload = {'is_api': 1, 'id': response};
    //   }
    // })
  }, []);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.splash}>
        <AutoHeightImage width={110} source={require("../assets/img/logo.png")} style={styles.logo} />
      </View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	splash: {flex:1,alignItems:'center',justifyContent:'center'},
  logo: {position:'relative',top:-60,},
})

//export default Intro
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),

	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Intro);