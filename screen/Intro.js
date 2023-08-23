import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import Header from '../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Intro = ({navigation, route}) => {
  useEffect(()=>{
    AsyncStorage.getItem('mb_id').then(async (response) => {
      if (response === null || response == undefined) {
        setTimeout(() => {
					navigation.replace('Login');
				}, 2000);
      }else{
        const payload = {'is_api': 1, 'id': response};
      }
    })
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