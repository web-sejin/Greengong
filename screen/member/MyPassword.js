import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import {phoneFormat, pwd_check, randomNumber, validateDate, email_check} from '../../components/DataFunc';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MyPassword = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;  
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [pw, setPw] = useState('');
	const [pw2, setPw2] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  function _submit(){
		console.log("userInfo : ",userInfo);

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

		Api.send('POST', 'change_pass', {pass:pw}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				setPw('');
				setPw2('');
				ToastMessage("비밀번호가 변경되었습니다.");				
			}else{
				console.log('결과 출력 실패!', responseJson);
				ToastMessage(responseJson.result_text);
			}
		});
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'비밀번호 설정'} />
			<KeyboardAwareScrollView>
        <View style={styles.registArea}>
          <View style={[styles.registBox]}>
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
  mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
  registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:0,marginTop:-5},
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

//export default MyPassword
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
		member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
		member_out: (user) => dispatch(UserAction.member_out(user)), //회원탈퇴
	})
)(MyPassword);