import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import {phoneFormat, pwd_check, randomNumber, validateDate, email_check} from '../../components/DataFunc';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

let t1;
let tcounter;
let temp;

const MyInfo = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [mbHp, setMbHp] = useState('');
	const [certNumber, setCertNumber] = useState('');
	const [certNumberSt, setCertNumberSt] = useState(false);
	const [mbEmail, setMbEmail] = useState('');
	const [mbEmailSt, setMbEmailSt] = useState(false);
	const [mbNickname, setMbNickname] = useState('');
	const [mbNicknameSt, setMbNicknameSt] = useState(false);
  const [timeStamp, setTimeStamp] = useState('');
  const [phoneIntervel, setPhoneInterval] = useState(false);
	const [ransoo, setRansoo] = useState('');
	const [oldHp, setOldHp] = useState('');
	const [oldEmail, setOldEmail] = useState('');
	const [oldNick, setOldNick] = useState('');
	const [disable, setDisable] = useState(true);
	const [disable2, setDisable2] = useState(true);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;		
		if(!isFocused){
			if(!pageSt){
				setMbHp('');
				setCertNumber('');
				setCertNumberSt(false);
				setMbEmail('');
				setMbEmailSt(false);
				setMbNickname('');
				setMbNicknameSt(false);
        setTimeStamp('');
        setPhoneInterval(false);
				setRansoo('');
				clearInterval(t1);
			}
		}else{
			//console.log('userInfo : ',userInfo);			
			setRouteLoad(true);
			setPageSt(!pageSt);
			getMyInfo();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	const getMyInfo = async () => {
		await Api.send('GET', 'get_member_info', {'is_api': 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("get_member_info : ",responseJson);
				setMbHp(responseJson.mb_hp);
				setMbEmail(responseJson.mb_email);
				setMbNickname(responseJson.mb_nick);
				setOldHp(responseJson.mb_hp);
				setOldEmail(responseJson.mb_email);
				setOldNick(responseJson.mb_nick);
			}else{
				console.log('결과 출력 실패!');
			}
		});
	}

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

		Api.send('GET', 'send_munja', {hp: mbHp, is_api: 1, mode: ''}, (args)=>{
			let resultItem = args.resultItem;
			let arrItems = args.arrItems;
			let responseJson = args.responseJson;
			//console.log(args);
			if(resultItem.result === 'Y' && responseJson){
					console.log('send_munja', responseJson);
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

	const _authComplete = (v) => {		
		//console.log(ransoo);
		if(mbHp == "" || mbHp.length!=13){
			ToastMessage('휴대폰 번호를 정확히 입력해 주세요.');
			return false;
		}

		if(oldHp != mbHp || v == 'cert_chk'){
			if(certNumber == ""){
				ToastMessage('인증번호를 입력해 주세요.');
				return false;
			}
		
			if(!certNumberSt && tcounter <= 0){
				ToastMessage('인증번호를 발송하지 않았거나\n인증시간이 만료되었습니다.\n인증번호를 재발송 받아주세요.');
				return false;
			}

			if(ransoo == certNumber){
				ToastMessage('본인인증이 완료되었습니다.');
				setCertNumberSt(true);
				timer_stop();
				Keyboard.dismiss();
			 }else{
				ToastMessage('인증번호가 일치하지 않습니다.\n다시 확인해 주세요.');
				return false;
			 }
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

	function emailChk(){
		if(mbEmail == ""){
			ToastMessage('이메일을 입력해 주세요.');
			return false;
		}

		const emailChk = email_check(mbEmail);
		if(!emailChk){
			ToastMessage('이메일을 정확히 입력해 주세요.');
			return false;
		}		
		

		Api.send('GET', '	validation_email', {email: mbEmail, is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let arrItems = args.arrItems;
			let responseJson = args.responseJson;
			//console.log(args);
			if(resultItem.result === 'Y' && responseJson){
				//console.log('출력확인..', responseJson);
				setMbEmailSt(true);
				ToastMessage('사용가능한 이메일입니다.');
			}else if(responseJson.result === 'error'){
				setMbEmailSt(false);
				setDisable(true);
				ToastMessage(responseJson.result_text);
			}else{
				setDisable(true);
				console.log('결과 출력 실패!', resultItem);
				//ToastMessage(resultItem.message);
			}
		});
	}

	function nickChk(){
		if(mbNickname == ""){
			ToastMessage('닉네임을 입력해 주세요.');
			return false;
		}

		Api.send('GET', '	validation_nick', {nick: mbNickname, is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let arrItems = args.arrItems;
			let responseJson = args.responseJson;
			//console.log(args);
			if(resultItem.result === 'Y' && responseJson){
				//console.log('출력확인..', responseJson);
				setMbNicknameSt(true);
				ToastMessage('사용가능한 닉네임입니다.');
			}else if(responseJson.result === 'error'){
				setMbNicknameSt(false);
				setDisable(true);
				ToastMessage(responseJson.result_text);
			}else{
				setDisable(true);
				console.log('결과 출력 실패!', resultItem);
				//ToastMessage(resultItem.message);
			}
		});
	}

  function _submit(){
		if(!mbHp || mbHp == ""){
			ToastMessage('휴대폰 번호를 입력해 주세요.');
			return false;
		}
		
		if(oldHp != mbHp){
			if(!certNumberSt){
				Keyboard.dismiss();
				ToastMessage('인증번호 확인을 완료해 주세요.');
				return false;
			}
		}
		
		if(mbEmail == ""){
			ToastMessage('이메일을 입력해 주세요.');
			return false;
		}

		const emailChk = email_check(mbEmail);
		if(!emailChk){
			ToastMessage('이메일을 정확히 입력해 주세요.');
			return false;
		}

		if(oldEmail != mbEmail){
			if(!mbEmailSt){
				ToastMessage('이메일 중복확인을 완료해 주세요.');
				return false;
			}
		}

		if(mbNickname == ""){
			ToastMessage('닉네임을 입력해 주세요.');
			return false;
		}

		if(oldNick != mbNickname){
			if(!mbNicknameSt){
				ToastMessage('닉네임 중복확인을 완료해 주세요.');
				return false;
			}
		}

		let formData = {
			is_api:1,				
			mb_hp:mbHp,
			mb_email:mbEmail,
			mb_nick:mbNickname,
			os:Platform.OS,
		};

		Api.send('POST', 'modify_personal', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('modify_personal : ',responseJson);
				ToastMessage('수정이 완료되었습니다.');
				setCertNumber('');
				setCertNumberSt(false);
				setMbEmailSt(false);
				setMbNicknameSt(false);
				setTimeStamp('');
				setPhoneInterval(false);
				setRansoo('');	
				clearInterval(t1);
				setOldHp(mbHp);
				setOldEmail(mbEmail);
				setOldNick(mbNickname);
			}else{
				console.log('결과 출력 실패!!', responseJson);
				ToastMessage(responseJson.result_text);
			}
		});
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'계정정보 설정'} />
			<KeyboardAwareScrollView keyboardShouldPersistTaps="always">
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
										onChangeText={(v) => {
											const phone = phoneFormat(v);
											setMbHp(phone);
											setCertNumber('');
											setCertNumberSt(false);
											if(oldHp == phone){
												setDisable(true);
												setDisable2(true);
											}else{
												setDisable(false);
												setDisable2(false);
											}
										}}
										placeholder={"휴대폰번호를 입력해 주세요."}
										style={[styles.input, styles.input2]}
										placeholderTextColor={"#8791A1"}
										maxLength={13}
									/>
									<TouchableOpacity 
										style={[styles.certChkBtn, phoneIntervel ? styles.certDisabled : null]}
										activeOpacity={opacityVal}
										onPress={() => {
											//console.log("phoneIntervel : ",phoneIntervel);
											!phoneIntervel ? ( _sendSmsButton() ) : null
											!phoneIntervel ? ( setCertNumber('') ) : null
											!phoneIntervel ? ( setCertNumberSt(false) ) : null
										}}
									>
										<Text style={[styles.certChkBtnText, phoneIntervel ? styles.certDisabledText : null]}>
											인증번호
										</Text>
									</TouchableOpacity>

									{/* <TouchableOpacity 
										style={styles.certChkBtn}
										activeOpacity={opacityVal}
										onPress={() => {_sendSmsButton()}}
									>
										<Text style={styles.certChkBtnText}>인증번호</Text>
									</TouchableOpacity> */}
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={certNumber}
										keyboardType = 'numeric'
										onChangeText={(v) => {setCertNumber(v)}}
										placeholder={"인증번호 입력"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
									<View style={styles.timeBox}>
										<Text style={styles.timeBoxText}>
											{timeStamp}
										</Text>
									</View>									
									<TouchableOpacity 
										style={[styles.certChkBtn2, certNumberSt ? styles.certChkBtn2Disabled : null, disable2 ? styles.disableBtn : null]}
										activeOpacity={opacityVal}
										onPress={() => {_authComplete('cert_chk')}}
										disabled={disable2}
									>
										<Text style={[styles.certChkBtnText2, certNumberSt ? styles.certChkBtn2DisabledText : null, disable2 ? styles.disableBtnText : null]}>
											인증번호 확인
										</Text>
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
										onChangeText={(v) => {											
											setMbEmail(v);
											if(oldEmail == v){
												setDisable(true);
											}else{
												setDisable(false);
											}											
										}}
										placeholder={'이메일을 입력해 주세요.'}
										placeholderTextColor="#C5C5C6"
										style={[styles.input, styles.input2]}
									/>
									<TouchableOpacity 
										style={styles.certChkBtn}
										activeOpacity={opacityVal}
										onPress={() => {emailChk()}}
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
										onChangeText={(v) => {
											setMbNickname(v);
											if(oldNick == v){
												setDisable(true);
											}else{
												setDisable(false);
											}
										}}
										placeholder={"닉네임을 입력해 주세요."}
										style={[styles.input, styles.input2]}
										placeholderTextColor={"#8791A1"}
									/>
									<TouchableOpacity 
										style={styles.certChkBtn}
										activeOpacity={opacityVal}
										onPress={() => {nickChk()}}
									>
										<Text style={styles.certChkBtnText}>중복확인</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={[styles.nextBtn, disable ? styles.disableBtn : null]}
					activeOpacity={opacityVal}
					onPress={() => _submit()}
					disabled={disable}
				>
					<Text style={[styles.nextBtnText, disable ? styles.disableBtnText : null]}>수정</Text>
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
	timeBox: {position:'absolute',right:20,top:0,},
	timeBoxText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:56,color:'#000'},
	certDisabled: {backgroundColor:'#efefef'},
	certDisabledText: {color:'#aaa'},
	certChkBtn2Disabled: {backgroundColor:'#efefef'},
	certChkBtn2DisabledText: {color:'#aaa'},
	disableBtn: {backgroundColor:'#efefef'},
	disableBtnText: {color:'#aaa'},
})

//export default MyInfo
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(MyInfo);