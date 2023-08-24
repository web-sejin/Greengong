import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const SnsRegister = ({navigation, route}) => {	
  const email = route.params.email;
  const provider = route.params.provider;
  const regiType = route.params.regiType;
  const uid = route.params.uid;
	const ssIdx = route.params.ss_idx;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [all, setAll] = useState(false);
	const [chk1, setChk1] = useState(false);
	const [chk2, setChk2] = useState(false);
	const [chk3, setChk3] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setAll(false);
				setChk1(false);
				setChk2(false);
				setChk3(false);
			}
		}else{
			//console.log("isFocused");
			if(route.params){
				//console.log("route on!!");
			}else{
				//console.log("route off!!");
			}
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	function fnAllChk(){
		if(all){
			setChk1(false);
			setChk2(false);
			setChk3(false);
		}else{
			setChk1(true);
			setChk2(true);
			setChk3(true);
		}
		setAll(!all);
	}

	function fnChk(v){
		if(v == "chk1"){
			setChk1(!chk1);
		}else if(v == "chk2"){
			setChk2(!chk2);
		}else if(v == "chk3"){
			setChk3(!chk3);
		}
	}

	useEffect(() => {
		if(chk1 && chk2 && chk3){
			setAll(true);
		}else{
			setAll(false);
		}
	}, [chk1, chk2, chk3]);

	function nextStep(){
		if(!chk1){ ToastMessage('서비스 이용약관에 동의해 주세요.'); return false; }
		if(!chk2){ ToastMessage('개인정보 처리방침에 동의해 주세요.'); return false; }
		if(!chk3){ ToastMessage('위치기반 서비스에 동의해 주세요.'); return false; }

		navigation.navigate('SnsRegister2', {
      email:email, 
      regiType:regiType,
      provider:provider,
      uid:uid,
			ssIdx:ssIdx,	
    })
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'약관동의'} />
			<ScrollView>
				<View style={styles.chkArea}>
					<View style={[styles.allChkBox]}>
						<TouchableOpacity
							style={[styles.allChkBtn, all ? styles.chkBoxOn : null]}
							activeOpacity={opacityVal}
							onPress={() => {fnAllChk()}}
						>
							{all ? (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_on.png")} style={styles.chkIcon} />
							) : (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_off.png")} style={styles.chkIcon} />
							)}
							<Text style={[styles.allChkBtnText, all ? styles.allChkBtnTextOn : null]}>전체 약관에 동의합니다.</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.chkBox}>
						<TouchableOpacity
							style={[styles.chkBtn]}
							activeOpacity={opacityVal}
							onPress={() => {fnChk('chk1')}}
						>
							{chk1 ? (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_on2.png")} />
							) : (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_off.png")} />
							)}
							<Text style={styles.chkBtnText}>서비스 이용약관 동의</Text>
							<Text style={styles.chkBtnText2}>(필수)</Text>
						</TouchableOpacity>
						<View style={styles.pollContent}>
							<ScrollView>
								<Text style={styles.pollContentText}>구매한 물건의 배송 서비스, 그 밖에 중고마켓이 수시로 제공하는 오프라인 서비스 오프라인 서비스는 다른 사용자 또는 사람에 의해 수행되어야 합니다. 중고마켓 서비스 사용자는 오프라인 서비스 이용과 관려하여 중고버디와 만나는 경우 중고마켓의 약관, 운영정책과 거래매너를 반드시 준수하여야 합니다.</Text>
							</ScrollView>
						</View>
					</View>

					<View style={styles.chkBox}>
						<TouchableOpacity
							style={[styles.chkBtn]}
							activeOpacity={opacityVal}
							onPress={() => {fnChk('chk2')}}
						>
							{chk2 ? (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_on2.png")} />
							) : (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_off.png")} />
							)}
							<Text style={styles.chkBtnText}>개인정보 처리방침 동의</Text>
							<Text style={styles.chkBtnText2}>(필수)</Text>
						</TouchableOpacity>
						<View style={styles.pollContent}>
							<ScrollView>
								<Text style={styles.pollContentText}>구매한 물건의 배송 서비스, 그 밖에 중고마켓이 수시로 제공하는 오프라인 서비스 오프라인 서비스는 다른 사용자 또는 사람에 의해 수행되어야 합니다. 중고마켓 서비스 사용자는 오프라인 서비스 이용과 관려하여 중고버디와 만나는 경우 중고마켓의 약관, 운영정책과 거래매너를 반드시 준수하여야 합니다.</Text>
							</ScrollView>
						</View>
					</View>

					<View style={styles.chkBox}>
						<TouchableOpacity
							style={[styles.chkBtn]}
							activeOpacity={opacityVal}
							onPress={() => {fnChk('chk3')}}
						>
							{chk3 ? (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_on2.png")} />
							) : (
								<AutoHeightImage width={16} source={require("../../assets/img/icon_chk_off.png")} />
							)}
							<Text style={styles.chkBtnText}>위치기반 서비스 동의</Text>
							<Text style={styles.chkBtnText2}>(필수)</Text>
						</TouchableOpacity>
						<View style={styles.pollContent}>
							<ScrollView>
								<Text style={styles.pollContentText}>구매한 물건의 배송 서비스, 그 밖에 중고마켓이 수시로 제공하는 오프라인 서비스 오프라인 서비스는 다른 사용자 또는 사람에 의해 수행되어야 합니다. 중고마켓 서비스 사용자는 오프라인 서비스 이용과 관려하여 중고버디와 만나는 경우 중고마켓의 약관, 운영정책과 거래매너를 반드시 준수하여야 합니다.</Text>
							</ScrollView>
						</View>
					</View>					
				</View>
			</ScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => nextStep()}
				>
					<Text style={styles.nextBtnText}>다음</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
	chkArea: {padding:20,paddingBottom:15,},
	allChkBox: {},
	allChkBtn: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderRadius:12,borderColor:'#ECECEC',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
	chkIcon: {position:'absolute',left:20,top:22},
	allChkBtnText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:56,color:'#C5C5C6'},
	allChkBtnTextOn: {},
	chkBox: {marginTop:30,},
	chkBtn: {display:'flex',flexDirection:'row',alignItems:'center'},
	chkBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',marginLeft:12,marginRight:5,},
	chkBtnText2: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#ED0000',},
	pollContent: {width:innerWidth,height:114,backgroundColor:'#fff',borderWidth:1,borderRadius:12,borderColor:'#ECECEC',padding:15,marginTop:10,},
	pollContentText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:22,color:'#878991',},
	chkBoxOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	allChkBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#fff',},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default SnsRegister