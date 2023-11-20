import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../Api';
import {phoneFormat, pwd_check, randomNumber, validateDate, email_check} from '../../components/DataFunc';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

let t1;
let tcounter;
let temp;

const Find_pw = ({navigation, route}) => {	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [mbEmail, setMbEmail] = useState('');
	const [mbHp, setMbHp] = useState('');
	const [pw, setPw] = useState('');
	const [pw2, setPw2] = useState('');
	const [certNumber, setCertNumber] = useState('');
	const [certNumberSt, setCertNumberSt] = useState(false);
	const [timeStamp, setTimeStamp] = useState('');
	const [phoneIntervel, setPhoneInterval] = useState(false);
	const [visible, setVisible] = useState(false);
	const [ransoo, setRansoo] = useState('');
	const [toastModal, setToastModal] = useState(false);
	const [toastText, setToastText] = useState('');
	const [mbId, setMbId] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setMbEmail('')
				setMbHp('');
				setCertNumber('');
				setCertNumberSt(false);
				setTimeStamp('');
				setPhoneInterval(false);
				setVisible(false);				
				setRansoo('');
				clearInterval(t1);
				setPw('');
				setPw2('');
				setToastModal(false);
				setToastText('');				
			}
			timer_stop();
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
		if(mbHp == "" || mbHp.length!=13){
			ToastMessage('휴대폰 번호를 정확히 입력해 주세요.');
			return false;
		}

		// timer_start();
		if(phoneIntervel){
			ToastMessage(tcounter + '초 후에 재발송할 수 있습니다.');
			return false;
		}

		Api.send('GET', 'send_munja', {hp: mbHp, is_api: 1, mode: 'join'}, (args)=>{
			let resultItem = args.resultItem;
			let arrItems = args.arrItems;
			let responseJson = args.responseJson;
			//console.log(args);
			console.log(resultItem);
			if(resultItem.result === 'Y' && responseJson){
					console.log('출력확인..', responseJson);
					setRansoo(responseJson.ce_num);
					setPhoneInterval(true);
			}else if(responseJson.result === 'error'){
					ToastMessage(responseJson.result_text);
			}else{
					console.log('결과 출력 실패!', resultItem);
					//ToastMessage(resultItem.message);
			}
		});
	}

	const _authComplete = () => {		
		//console.log(ransoo);
		if(mbHp == "" || mbHp.length!=13){
			ToastMessage('휴대폰 번호를 정확히 입력해 주세요.');
			return false;
		}

		if(certNumber == ""){
			ToastMessage('인증번호를 입력해 주세요.');
			return false;
		}

		if(tcounter <= 0){
			ToastMessage('인증시간이 만료되었습니다.\n인증번호를 재발송 받아주세요.');
			return false;
		 }

		 if(ransoo == certNumber){
			//ToastMessage('본인인증이 완료되었습니다.');
			setCertNumberSt(true);
			timer_stop();

			Api.send('POST', '	find_id', {is_api:1, mb_hp:mbHp}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
	
				if(responseJson.result === 'success'){
					//console.log(responseJson);
					setMbId(responseJson.mb_id);
					setVisible(true);
				}else{
					console.log('결과 출력 실패!', resultItem);
					ToastMessage(responseJson.result_text);
				}
			});
						
		 }else{
			ToastMessage('인증번호가 일치하지 않습니다.\n다시 확인해 주세요.');
			return false;
		 }
	}

	const timer_stop = () => {
		clearInterval(t1);
		setTimeStamp('');
		setPhoneInterval(false);
		setRansoo('');
		tcounter = 0;
		temp = '';
	};

	useEffect(()=>{
		if(!phoneIntervel){
			timer_stop();
		}else{
			timer_start();
		}
	},[phoneIntervel]);

	function fnSubmit(){
		if(!mbEmail || mbEmail == ""){
			ToastMessage('이메일을 입력해 주세요.');
			return false;
		}

		const emailChk = email_check(mbEmail);
		if(!emailChk){
			ToastMessage('이메일을 정확히 입력해 주세요.');
			return false;
		}

		if(!mbHp || mbHp == ""){
			ToastMessage('휴대폰 번호를 입력해 주세요.');
			return false;
		}

		if(!certNumber || certNumber == ""){
			ToastMessage('인증번호를 입력해 주세요.');
			return false;
		}
		
		_authComplete();
	}

	function changePw(){
		if(pw == ""){
			setToastText('비밀번호를 입력해 주세요.');
			setToastModal(true);
			setTimeout(()=>{ setToastModal(false) },2000);
			return false;
		}

		const pwChk = pwd_check(pw);
		if(!pwChk || pw.length < 6){
			setToastText('비밀번호는 6자 이상 영문,숫자,특수문자를 조합해서 입력해 주세요.');
			setToastModal(true);
			setTimeout(()=>{ setToastModal(false) },2000);
			return false;
		}

		if(pw2 == ""){
			setToastText('비밀번호를 한 번 더 입력해 주세요.');
			setToastModal(true);
			setTimeout(()=>{ setToastModal(false) },2000);
			return false;
		}

		if(pw != pw2){
			setToastText('비밀번호가 일치하지 않습니다.\n다시 입력해 주세요.');
			setToastModal(true);
			setTimeout(()=>{ setToastModal(false) },2000);
			return false;
		}

		Api.send('POST', '	find_pass', {is_api:1, mb_id:mbId, mb_pass:pw, mb_pass_re:pw2}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				setToastText('비밀번호가 변경되었습니다.\n로그인 페이지로 돌아갑니다.');
				setToastModal(true);
				setTimeout(()=>{ navigation.navigate('Login') },2000);
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'비밀번호 찾기'} />
			<ScrollView>				
				<View style={styles.registArea}>
					<View style={styles.logo}>
						<AutoHeightImage width={78} source={require("../../assets/img/logo.png")} />
					</View>
					<View style={[styles.registBox, styles.borderBot]}>
						<View style={styles.alertBox}>
							<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
							<Text style={styles.alertBoxText}>가입하신 이메일, 휴대폰 번호로 비밀번호 비밀번호 재설정이 가능합니다.</Text>
						</View>

						<View style={[styles.typingBox, styles.mgTop30]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>이메일</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
								keyboardType='email-address'
								value={mbEmail}
								onChangeText={(v) => {setMbEmail(v)}}
								placeholder={'이메일을 입력해 주세요.'}
								placeholderTextColor="#8791A1"
								style={[styles.input]}
							/>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>휴대폰 번호</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={mbHp}
									keyboardType = 'numeric'
									onChangeText={(v) => {
										const phone = phoneFormat(v);
										setMbHp(phone);
										setCertNumber('');
										setCertNumberSt(false);
									}}
									placeholder={"휴대폰 번호를 입력해 주세요."}
									style={[styles.input, styles.input2]}
									placeholderTextColor={"#8791A1"}
									maxLength={132}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									onPress={() => {
										//console.log("phoneIntervel : ",phoneIntervel);
										!phoneIntervel ? ( _sendSmsButton() ) : null
										!phoneIntervel ? ( setCertNumber('') ) : null
										!phoneIntervel ? ( setCertNumberSt(false) ) : null
									}}
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
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => fnSubmit()}
				>
					<Text style={styles.nextBtnText}>다음</Text>
				</TouchableOpacity>
			</View>

			<Modal
        visible={visible}
				animationType={"slide"}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity 
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => (setVisible(false))}
					>
						<AutoHeightImage width={9} source={require("../../assets/img/icon_header_back.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>비밀번호 재설정</Text>
					</>
				</View>
				<ScrollView>				
					<View style={styles.registArea}>
						<View style={styles.logo}>
							<AutoHeightImage width={78} source={require("../../assets/img/logo.png")} />
						</View>
						<View style={[styles.registBox, styles.borderBot]}>
							<View style={styles.alertBox}>
								<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
								<Text style={styles.alertBoxText}>새로운 비밀번호를 입력해 주세요.</Text>
							</View>

							<View style={[styles.typingBox, styles.mgTop30]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>비밀번호</Text>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										secureTextEntry={true}
										value={pw}
										onChangeText={(v) => {setPw(v)}}
										placeholder={'비밀번호 입력(6자 이상 영문, 숫자, 특수문자)'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										secureTextEntry={true}
										value={pw2}
										onChangeText={(v) => {setPw2(v)}}
										placeholder={'비밀번호 재입력'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>
						</View>
					</View>
				</ScrollView>
				<View style={[styles.nextFix]}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {changePw()}}
					>
						<Text style={styles.nextBtnText}>비밀번호 재설정</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
        visible={toastModal}
				animationType={"slide"}
				transparent={true}
      >
				<View style={styles.toastModal}>
					<View
						style={{
							backgroundColor: '#000',
							borderRadius: 10,
							paddingVertical: 10,
							paddingHorizontal: 20,
							opacity: 0.7,
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								color: '#FFFFFF',
								fontSize: 15,
								lineHeight: 22,
								fontFamily: Font.NotoSansRegular,
								letterSpacing: -0.38,
							}}
						>
							{toastText}
						</Text>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	logo: {display:'flex',alignItems:'center',paddingTop:35,},
	registBox: {padding:20,paddingTop:35,paddingBottom:35},
	registBox2: {paddingTop:0,marginTop:-5},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	typingBox: {},
	typingTitle: {paddingLeft:9},
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
	nextFix2: {height:160,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
	findPassword: {paddingBottom:20,marginBottom:12,},
	findPasswordText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#A0A8B1'},
	timeBox: {position:'absolute',right:20,top:0,},
	timeBoxText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:56,color:'#000'},

	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},
	modalWrap: {paddingHorizontal:20,paddingTop:120},
	modalDescBox: {},
	modalDesc: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'},
	modalDescText: {fontFamily:Font.NotoSansRegular,fontSize:18,lineHeight:27,color:'#191919'},
	modalDescTextBold: {fontFamily:Font.NotoSansBold,color:'#10AA7A',marginRight:4,},
	grayBox: {width:innerWidth,height:58,backgroundColor:'#F2F2F2',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:35,},
	grayBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#6C6C6C',marginLeft:4,},

	toastModal: {width:widnowWidth,height:(widnowHeight - 125),display:'flex',alignItems:'center',justifyContent:'flex-end'},
})

export default Find_pw