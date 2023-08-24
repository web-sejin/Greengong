import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { KakaoOAuthToken, KakaoProfile, getProfile as getKakaoProfile, KakaoProfileNoneAgreement, login, logout, unlink } from '@react-native-seoul/kakao-login';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Login = (props) => {
	const {navigation, member_login, member_info} = props;
	const [routeLoad, setRouteLoad] = useState(false);
	const [email ,setEmail] = useState();
	const [pw ,setPw] = useState();
	const [pageSt, setPageSt] = useState(false);
	const [kakaoResult, setKakaoResult] = useState('');
	const [appToken, setAppToken] = useState();
	const [indi, setIndi] = useState(false);

	useEffect(() => {
		AsyncStorage.getItem('appToken').then(async (response) => {
			if (response) {
				setAppToken(response);
			}
		})
	}, []);	

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setEmail('');
				setPw('');
				setRouteLoad(false);
			}
		}else{			
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	const _sendLogin = async () => {		
		if(!email || email == ""){
			ToastMessage('이메일을 입력해 주세요.');
			return false;
		}

		if(!pw || pw == ""){
			ToastMessage('비밀번호를 입력해 주세요.');
			return false;
		}

		const formData = new FormData();
		formData.append('is_api', 1);
		formData.append('mb_id', email);
		formData.append('pass', pw);
		formData.append('mb_os', Platform.OS);
		formData.append('mb_regnum', appToken);
		formData.append('method', 'member_login');
		
		setIndi(true);
		const login = await member_login(formData);
		console.log('login : ', login);

		if(login.state){
			const payload = {'is_api': 1, 'id': login.result.mb_id}			
			const member_info_list = await member_info(payload);
			console.log("member_info_list : ",member_info_list);
			if(member_info_list.state){
				setTimeout(() => {
					navigation.replace('TabNavigator', {
						screen: 'Home',
						params: {
							msg: member_info_list.result,
						}
					});
				}, 1000);
			}
		}else{
			ToastMessage(login.msg);
			setIndi(false);
			return false;
		}
	}

	const _snsLogin = async (ss_idx) => {
		console.log("ss_idx : ",ss_idx);
		const formData = new FormData();
		formData.append('is_api', 1);
		formData.append('ss_idx', ss_idx);
		formData.append('method', 'member_login');
		formData.append('mb_os', Platform.OS);
		formData.append('mb_regnum', appToken);
		formData.append('method', 'member_login');
		
		const login = await member_login(formData);
		console.log('sns_login : ', login);

		if(login.state){
			const payload = {'is_api': 1, 'id': login.result.mb_id}			
			const member_info_list = await member_info(payload);
			if(member_info_list.state){
				setTimeout(() => {
					setIndi(false);
					navigation.replace('TabNavigator', {
						screen: 'Home',
						params: {
							msg: member_info_list.result,
						}
					});
				}, 1000);
			}else{
				setIndi(false);
				ToastMessage(login.msg);
			}
		}else{			
			setIndi(false);
			ToastMessage(login.msg);
			return false;
		}
	}

	/* 카카오 시작 */
  const signInWithKakao = async () => {
		//setIndi(true);
    try {			
      const token: KakaoOAuthToken = await login();
      getMyKakaoProfile();      
      setKakaoResult(JSON.stringify(token));
    } catch(err) {
      console.log("error : ",err);
      //setIndi(false);
    }
  };
  
  const signOutWithKakao = async () => {
    console.log("카톡 로그아웃");
    try {
      const message = await logout();
      console.log(message);
      
      setKakaoResult(message);
    } catch(err) {
      console.log(err);
      
    }
  };
  
  const getMyKakaoProfile = async () => {	
		setIndi(true);	
    try {      
      const profile: KakaoProfile|KakaoProfileNoneAgreement = await getKakaoProfile();
      //console.log(profile);
      const kakaoData =JSON.stringify({
          type: "sns_login",
          name: "",
          email: profile.email,
          provider: "kakao",
          photourl: "",
          uid: profile.id,          
          //token: appToken,
      });          
      setKakaoResult(JSON.stringify(kakaoData));
      //unlinkKakao();

			console.log(appToken);
			console.log(profile.id);

			Api.send('POST', 'sns_check', {is_api:1, ss_from:'kakao', access_token:appToken, ss_id:profile.id}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
	
				if(responseJson.result === 'success'){
					console.log("sns responseJson : ", responseJson);
					if(responseJson.screen == 'register'){
						navigation.navigate('SnsRegister', {
							email:profile.email, 
							regiType:"sns",
							provider:"kakao",
							uid:profile.id,
							ss_idx:responseJson.ss_idx,
						});
					}else{
						_snsLogin(responseJson.ss_idx);
					}					
				}else{
					console.log('결과 출력 실패!', resultItem);
					ToastMessage(responseJson.result_text);
				}
			});
			
    } catch(err) {
      console.log(err);
    }
  };
  
  const unlinkKakao = async () => {
    try {
      
      const message = await unlink();
      console.log(message);
    
      setKakaoResult(message);
    } catch(err) {
      console.log(err);
      
    }
  };
  /* 카카오 끝 */

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<KeyboardAwareScrollView>
				<View style={styles.loginBox}>
					<View style={styles.logo}>
						<AutoHeightImage width={78} source={require("../../assets/img/logo.png")} />
					</View>
					<View style={styles.loginDesc}>
						<Text style={styles.loginDescText}>투명한 산업 거래</Text>
						<Text style={[styles.loginDescText, styles.loginDescText2]}>모두가 만족하는 모두를 위한거래,</Text>
						<Text style={[styles.loginDescText, styles.loginDescText2, styles.loginDescTextBold]}>지금 시작해보세요!</Text>
					</View>				
					<View style={styles.loginIptBox}>
					<Text style={styles.loginIptBoxText}>이메일</Text>
						<TextInput
							keyboardType='email-address'
							value={email}
							onChangeText={(v) => {setEmail(v)}}
							placeholder={'이메일 입력'}
							placeholderTextColor="#C5C5C6"
							style={[styles.input]}
						/>
					</View>
					<View style={[styles.loginIptBox, styles.loginIptBox2]}>
						<Text style={styles.loginIptBoxText}>비밀번호</Text>
						<TextInput
							secureTextEntry={true}
							value={pw}
							onChangeText={(v) => {setPw(v)}}
							placeholder={'비밀번호 입력'}
							placeholderTextColor="#C5C5C6"
							style={[styles.input]}
						/>
					</View>
					<View style={styles.loginBtnBox}>
						<TouchableOpacity 
							style={styles.loginBtn}
							activeOpacity={opacityVal}
							onPress={() => {_sendLogin()}}
						>
							<Text style={styles.loginBtnText}>로그인</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.snsBtnBox}>
						<TouchableOpacity 
							style={styles.snsBtn}
							activeOpacity={opacityVal}
							onPress={() => {signInWithKakao()}}
						>
							<AutoHeightImage width={21} source={require("../../assets/img/kakao_login.png")} style={styles.kakaoLogo} />
							<Text style={styles.snsBtnText}>카카오 로그인</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.loginFindBox}>
						<TouchableOpacity
							style={styles.loginFindBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								setPageSt(true);
								navigation.navigate('Register', {appToken: appToken});
							}}
						>
							<Text style={styles.loginFindBtnText}>회원가입</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.loginFindBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								setPageSt(true);
								navigation.navigate('Findid', {appToken: appToken})
							}}
						>
							<Text style={styles.loginFindBtnText}>아이디 찾기</Text>
							<View style={[styles.btnBar, styles.btnBar1]}></View>
							<View style={[styles.btnBar, styles.btnBar2]}></View>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.loginFindBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								setPageSt(true);
								navigation.navigate('Findpw', {appToken: appToken})
							}}
						>
							<Text style={styles.loginFindBtnText}>비밀번호 찾기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAwareScrollView>
			{indi ? (
			<View style={[styles.indicator]}>
				<ActivityIndicator size="large" />
			</View>
			) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
	loginBox: {padding:50,paddingLeft:20,paddingRight:20,},
	logo: {display:'flex',alignItems:'center',},
	loginDesc: {marginTop:25,},
	loginDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:18,lineHeight:20,color:'#000000',},
	loginDescText2: {marginTop:10,},
	loginDescTextBold: {fontFamily:Font.NotoSansBold},
	loginIptBox: {marginTop:35,},
	loginIptBox2: {marginTop:30},
	loginIptBoxText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000000'},
	input: {width:innerWidth,height:46,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:8,paddingLeft:13,fontSize:14,color:'#000',marginTop:10,},
	loginBtnBox: {marginTop:35,},
	loginBtn: {width:innerWidth,height:50,backgroundColor:'#31B481',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'},
	loginBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:50,color:'#fff'},
	snsBtnBox: {marginTop:15,},
	snsBtn: {width:innerWidth,height:50,backgroundColor:'#FFE812',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'},
	kakaoLogo: {position:'absolute',left:20,top:16,},
	snsBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:50,color:'#3C1E1E'},
	loginFindBox: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:15,},
	loginFindBtn: {width:(innerWidth/3),heiht:40,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'},
	loginFindBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:40,color:'#000'},
	btnBar: {width:1,height:11,backgroundColor:'#D8DBE1',position:'absolute',top:10},
	btnBar1: {left:0,},
	btnBar2: {right:0},
	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

//export default Login
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Login);