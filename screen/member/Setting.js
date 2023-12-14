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

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Setting = (props) => {
  const {navigation, userInfo, member_logout, member_out, route} = props;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setVisible(false);
        setVisible2(false);
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
    Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  //로그아웃
	const memberLogout = async () => {
		const formData = new FormData();
		formData.append('is_api', 1);
		formData.append('mb_idx', userInfo?.mb_idx);
		const logout =  await member_logout(formData);
		console.log("logout : ",logout);
    setVisible(false);
		ToastMessage('로그아웃처리 되었습니다.');
		navigation.reset({
			routes: [{ name: 'Login'}],
		});
	}

	//회원탈퇴
	const memberLeaveHandler = async () => {
		const formData = new FormData();
		formData.append('id', userInfo?.mb_id);
		formData.append('is_api', '1');
		formData.append('mb_idx', userInfo?.mb_idx);
		formData.append('method', 'out_member');
		//console.log('formData', formData);
		const leaved =  await member_out(formData);
		console.log("leaved : ",leaved)
		
		// ToastMessage('탈퇴처리 되었습니다.');
		// navigation.reset({
		// 	routes: [{ name: 'Intro'}],
		// });

	}

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'설정'} />
			<ScrollView>
        <View style={styles.settingBox}>

          <View style={[styles.paddBot15, styles.borderBot]}>
              <View style={styles.mypageTit}>
                <Text style={styles.mypageTitText}>알림 설정</Text>
              </View>
              <View style={styles.mypageLinkList}>
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {									
                    navigation.navigate('Alim', {});
                  }}
                >
                  <Text style={styles.mypageLinkListBtnText}>알림 설정</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.paddTop30]}>
              <View style={styles.mypageTit}>
                <Text style={styles.mypageTitText}>사용자 설정</Text>
              </View>
              <View style={styles.mypageLinkList}>
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {setVisible(true)}}			
                >
                  <Text style={styles.mypageLinkListBtnText}>로그아웃</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {setVisible2(true)}}			
                >
                  <Text style={styles.mypageLinkListBtnText}>회원탈퇴</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>

        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={() => {setVisible(false)}}
        >
          <Pressable 
            style={styles.modalBack}
            onPress={() => {setVisible(false)}}
          ></Pressable>
          <View style={[styles.modalCont3, styles.modalCont4]}>
            <View style={styles.avatarTitle}>
              <Text style={styles.avatarTitleText}>로그아웃</Text>
            </View>
            <View style={styles.avatarDesc}>
              <Text style={styles.avatarDescText}>로그아웃을 진행하시겠습니까?</Text>
            </View>
            <View style={styles.avatarBtnBox}>
              <TouchableOpacity 
                style={styles.avatarBtn}
                onPress={() => {setVisible(false)}}
              >
                <Text style={styles.avatarBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.avatarBtn, styles.avatarBtn2]}
                onPress={() => {memberLogout()}}
              >
                <Text style={styles.avatarBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={visible2}
          transparent={true}
          onRequestClose={() => {setVisible2(false)}}
        >
          <Pressable 
            style={styles.modalBack}
            onPress={() => {setVisible2(false)}}
          ></Pressable>
          <View style={[styles.modalCont3]}>
            <View style={styles.avatarTitle}>
              <Text style={styles.avatarTitleText}>회원탈퇴</Text>
            </View>
            <View style={styles.avatarDesc}>
              <Text style={styles.avatarDescText}>회원탈퇴를 진행하시겠습니까?</Text>
              <Text style={styles.avatarDescText}>모든 정보가 사라지게 됩니다.</Text>
            </View>
            <View style={styles.avatarBtnBox}>
              <TouchableOpacity 
                style={styles.avatarBtn}
                onPress={() => {setVisible2(false)}}
              >
                <Text style={styles.avatarBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.avatarBtn, styles.avatarBtn2]}
                onPress={() => {memberLeaveHandler()}}
              >
                <Text style={styles.avatarBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  paddTop20: {paddingTop:20},
	paddTop30: {paddingTop:30},
	paddBot15: {paddingBottom:15},
	paddBot30: {paddingBottom:30},
  settingBox: {paddingVertical:30,paddingHorizontal:20},  
  mypageTit: {},
	mypageTitText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000',},
  mypageLinkList: {marginTop:5},
	mypageLinkListBtn: {paddingVertical:15,},
	mypageLinkListBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#000',},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
  modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
  modalCont4: {top:((widnowHeight/2)-120)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  typingInputBox: {marginTop:20,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:(innerWidth-130),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
  certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
  indicator: {width:widnowWidth,height:widnowHeight, display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,zIndex:10,backgroundColor:'rgba(0,0,0,0.5)'},
})

//export default Setting
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
		member_out: (user) => dispatch(UserAction.member_out(user)), //회원탈퇴
	})
)(Setting);