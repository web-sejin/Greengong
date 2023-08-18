import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
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

let t1;
let tcounter;
let temp;

const MyInfo = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [mbHp, setMbHp] = useState('');
	const [certNumber, setCertNumber] = useState('');
	const [mbEmail, setMbEmail] = useState('');
	const [mbNickname, setMbNickname] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  const [phoneIntervel, setPhoneInterval] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setMbHp('');
				setCertNumber('');
				setMbEmail('');
				setMbNickname('');
        setTimeStamp('');
        setPhoneInterval(false);
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

  const timer_start = () => {
		tcounter = 180;
		t1 = setInterval(Timer, 1000);
		//console.log(t1);
	};

	const Timer = () => {
		//setPhoneInterval(false);
		tcounter = tcounter - 1;
		// temp = Math.floor(tcounter / 60);
		// temp = temp + (tcounter % 60);

		temp = Math.floor(tcounter/60);
		if(Math.floor(tcounter/60) < 10)  temp = '0'+temp;
		temp = temp + ":";
		if((tcounter % 60) < 10)temp = temp + '0';
		temp = temp + (tcounter % 60);

		//console.log(temp);
		setTimeStamp(temp);
		//setIntervals(true); //실행중


		if (tcounter <= 0) {
				//timer_stop();
				setPhoneInterval(false);
		}
	};

	const _sendSmsButton = () => {
		// console.log('sms');
		if(mbHp == "" || mbHp.length!=11){
			ToastMessage('휴대폰번호를 정확히 입력해 주세요.');
			return false;
		}

		// timer_start();
		if(phoneIntervel){
			ToastMessage(tcounter + '초 후에 재발송할 수 있습니다.');
			return false;
		}

		//setSmsRandNumber(randomNumber(6));
		setPhoneInterval(true);
	}

	const _authComplete = () => {
    if(mbHp == "" || mbHp.length!=11){
			ToastMessage('휴대폰번호를 정확히 입력해 주세요.');
			return false;
		}

    if(certNumber == "" || certNumber.length!=6){
			ToastMessage('인증번호를 정확히 입력해 주세요.');
			return false;
		}

		if(tcounter <= 0){
			ToastMessage('인증시간이 만료되었습니다.\n인증번호를 재발송 받아주세요.');
			return false;
		 }
		 timer_stop();
		//  if(smsRandNumber == ransoo){
		// 	setAuthTitle('인증확인');
		// 	setPhoneInterval(false);
		// 	setAuthButtonState(true);//인증버튼 비활성화
		// 	ToastMessage('본인인증이 완료되었습니다.\n다음단계로 이동하세요.');
		// 	setNextButtonState(false);
		// 	return true;
		//  }else{
		// 	setAuthTitle('인증완료');
		// 	setAuthButtonState(false); //인증버튼 비활성화
		// 	ToastMessage('인증번호가 일치하지 않습니다.');
		// 	setNextButtonState(true);
		// 	return false;
		//  }
	}

	const timer_stop = () => {
		clearInterval(t1);
		setTimeStamp('');
		setPhoneInterval(false);
	};

	useEffect(()=>{
		if(!phoneIntervel){
			timer_stop();
		}else{
			timer_start();
		}
	},[phoneIntervel]);

  function _submit(){

  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'계정정보 설정'} />
			<KeyboardAwareScrollView>
				<View style={styles.registArea}>
					<View style={[styles.registBox, styles.registBox2, styles.borderBot]}>
						<View style={styles.alertBox}>
							<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
							<Text style={styles.alertBoxText}>등록된 휴대폰 번호로 거래를 하실 수 있습니다.</Text>
						</View>

						<View style={[styles.typingBox, styles.mgTop30]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>휴대폰 번호</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={mbHp}
									keyboardType = 'numeric'
									onChangeText={(v) => {setMbHp(v)}}
									placeholder={"휴대폰번호를 입력해 주세요."}
									style={[styles.input, styles.input2]}
									placeholderTextColor={"#8791A1"}
									maxLength={11}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={() => {_sendSmsButton()}}
								>
									<Text style={styles.certChkBtnText}>인증번호</Text>
								</TouchableOpacity>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={certNumber}
									keyboardType = 'numeric'
									onChangeText={(v) => {setCertNumber(v)}}
									placeholder={"인증번호 입력"}
									style={[styles.input]}
									placeholderTextColor={"#8791A1"}
									maxLength={11}
								/>
								<View style={styles.timeBox}>
									<Text style={styles.timeBoxText}>
										{timeStamp}
									</Text>
								</View>
								<TouchableOpacity 
									style={styles.certChkBtn2}
									activeOpacity={opacityVal}
									onPress={() => {_authComplete()}}
								>
									<Text style={styles.certChkBtnText2}>인증번호 확인</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View style={[styles.registBox, styles.borderTop, styles.paddBot13]}>
						<View style={[styles.typingBox]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>이메일</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									keyboardType='email-address'
									value={mbEmail}
									onChangeText={(v) => {setMbEmail(v)}}
									placeholder={'이메일을 입력해 주세요.'}
									placeholderTextColor="#C5C5C6"
									style={[styles.input, styles.input2]}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={() => {}}
								>
									<Text style={styles.certChkBtnText}>중복확인</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>닉네임</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={mbNickname}									
									onChangeText={(v) => {setMbNickname(v)}}
									placeholder={"닉네임을 입력해 주세요."}
									style={[styles.input, styles.input2]}
									placeholderTextColor={"#8791A1"}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={() => {}}
								>
									<Text style={styles.certChkBtnText}>중복확인</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => _submit()}
				>
					<Text style={styles.nextBtnText}>수정</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:20,},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	typingBox: {},
	typingTitle: {},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	certChkBtn: {width:80,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#353636'},
	certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:16,color:'#fff'},
	certChkBtn3: {width:110,height:58,backgroundColor:'#31B481',borderWidth:0,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText3: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default MyInfo