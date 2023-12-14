import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Image, Pressable, Platform, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import Postcode from '@actbase/react-daum-postcode';
import Toast from 'react-native-toast-message'
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import {Avatar} from '../../components/Avatar';
import {phoneFormat, pwd_check, randomNumber, validateDate, email_check} from '../../components/DataFunc';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

let t1;
let tcounter;
let temp;

const Register3 = ({navigation, route}) => {	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

	const [mbHp, setMbHp] = useState(route.params.mbHp);
	const [mbEmail, setMbEmail] = useState(route.params.mbEmail);
	const [mbNickname, setMbNickname] = useState(route.params.mbNickname);
	const [pw, setPw] = useState('');
	const [pw2, setPw2] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{			
			setRouteLoad(true);
			setPageSt(!pageSt);
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	function nextStep2(){
		if(pw == ""){
			ToastMessage('비밀번호를 입력해 주세요.');
			return false;
		}

		const pwChk = pwd_check(pw);
		if(!pwChk || pw.length < 6){
			ToastMessage('비밀번호는 6자 이상 영문,숫자,특수문자를 조합해서 입력해 주세요.');
			return false;
		}

		if(pw2 == ""){
			ToastMessage('비밀번호를 한 번 더 입력해 주세요.');
			return false;
		}

		if(pw != pw2){
			ToastMessage('비밀번호가 일치하지 않습니다.\n다시 입력해 주세요.');
			return false;
		}

		navigation.navigate('Register4', {mbHp:mbHp, mbEmail:mbEmail, mbNickname:mbNickname, mbPw:pw});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'비밀번호 설정'} />
			<KeyboardAwareScrollView keyboardShouldPersistTaps="always">
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.registArea}>
						<View style={[styles.registBox, styles.registBox3]}>
							<View style={styles.alertBox}>
								<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
								<Text style={styles.alertBoxText}>비밀번호는 일반 로그인에 사용됩니다.</Text>
								<Text style={[styles.alertBoxText, styles.alertBoxText2]}>6자 이상 영문, 숫자, 특수문자만 가능합니다.</Text>
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
				</TouchableWithoutFeedback>
			</KeyboardAwareScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => nextStep2()}
				>
					<Text style={styles.nextBtnText}>다음</Text>
				</TouchableOpacity>
			</View>			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	safeAreaView2: {},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:0,marginTop:-5},
	registBox3: {paddingTop:20,},
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
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},

	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
	headerCloseBtn: {width:34,height:50,position:'absolute',right:10,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},

	typingFactory: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,
	paddingLeft:12,display:'flex',justifyContent:'center',position:'relative',},
	typingFactoryOn: {borderColor:'#31B481'},
	myFactoryText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#8791A1'},
	myFactoryText2: {color:'#000'},
	myFactoryTextOn: {fontFamily:Font.NotoSansMedium,color:'#31B481'},
	myFactoryArr: {position:'absolute',right:20,top:21,},
	addBtn: {width:innerWidth,height:58,backgroundColor:'#E3E9ED',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20,},
	addBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#8791A1',marginLeft:8},
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},	
	photoBoxBtn: {width:102,height:102,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center',marginTop:10,},
	photoBox: {marginTop:10,borderWidth:1,borderColor:'#E1E1E1',borderRadius:12,overflow:'hidden'},
	resetBtn: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',width:75,height:24,backgroundColor:'#31B481',borderRadius:12,},
	resetBtnText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:22,color:'#fff',marginLeft:5,},
	timeBox: {position:'absolute',right:20,top:21,},
	timeBoxText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#000'},
	findLocal: {marginTop:10,},
	findLocalBtn: {width:innerWidth,height:58,backgroundColor:'#E9ECF0',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',},
	findLocalBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#8791A1',marginLeft:5},
	toastModal: {width:widnowWidth,height:(widnowHeight - 125),display:'flex',alignItems:'center',justifyContent:'flex-end'},

	modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},

	certDisabled: {backgroundColor:'#efefef'},
	certDisabledText: {color:'#aaa'},
	certChkBtn2Disabled: {backgroundColor:'#efefef'},
	certChkBtn2DisabledText: {color:'#aaa'},
});

export default Register3