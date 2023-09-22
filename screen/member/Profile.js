import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import {Avatar3} from '../../components/Avatar3';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Profile = (props) => {
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [picture, setPickture] = useState();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setVisible(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    Api.send('GET', '	get_member_info', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let arrItems = args.arrItems;
			let responseJson = args.responseJson;
			//console.log(args);
			if(responseJson.result === 'success' && responseJson){
				//console.log('get_member_info', responseJson);
        setPickture(responseJson.mb_img1);
			}else{
        console.log('에러 : ', responseJson.result_text);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  const onAvatarChange = (image: ImageOrVideo) => {
    //console.log(image);
		setVisible(false);
		setPickture(image.path);
    // upload image to server here 

    let formData = {
			is_api:1,					
      mb_img: {
        'uri': image.path,
        'type': 'image/png',
        'name': 'profile_setting.png',
      }
		};

    Api.send('POST', 'save_profile_image', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);        
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  };

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'프로필 설정'} />
			<ScrollView>
        <View style={styles.profileBox}>
          <View style={styles.profile}>
            <TouchableOpacity
              style={styles.profileBtn}
              activeOpacity={opacityVal}
              onPress={()=>{setVisible(true);}}
            >              
              {picture ? (
                <AutoHeightImage width={100} source={{uri: picture}} />
              ) : (
                <AutoHeightImage width={100} source={require("../../assets/img/icon_profile.png")} />
              )}
              <View style={styles.profileEdit}>
                <Text style={styles.profileEditText}>편집</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.paddTop30, styles.paddBot15, styles.borderBot]}>
              <View style={styles.mypageTit}>
                <Text style={styles.mypageTitText}>계정/정보관리</Text>
              </View>
              <View style={styles.mypageLinkList}>
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {									
                    navigation.navigate('MyInfo', {});
                  }}
                >
                  <Text style={styles.mypageLinkListBtnText}>계정정보 설정</Text>
                </TouchableOpacity>

                {userInfo?.mb_is_sso != 1 ? (
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    navigation.navigate('MyPassword', {});
                  }}			
                >
                  <Text style={styles.mypageLinkListBtnText}>비밀번호 설정</Text>
                </TouchableOpacity>
                ):null}
              </View>
            </View>

            <View style={[styles.paddTop30]}>
              <View style={styles.mypageTit}>
                <Text style={styles.mypageTitText}>공장 및 인증정보관리</Text>
              </View>
              <View style={styles.mypageLinkList}>
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    navigation.navigate('MyCompany', {});
                  }}	
                >
                  <Text style={styles.mypageLinkListBtnText}>공장 및 인증정보관리</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mypageLinkListBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    navigation.navigate('Distance');
                  }}	
                >
                  <Text style={styles.mypageLinkListBtnText}>반경 설정</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </ScrollView>

      <Modal
				visible={visible}
				transparent={true}
				onRequestClose={() => {setVisible(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
          <Avatar3
						onChange={onAvatarChange} 
					/>
					
          <TouchableOpacity 
            style={[styles.modalCont2Btn, styles.delete]}
            activeOpacity={opacityVal}
            onPress={() => {
              setPickture();
              setVisible(false);
            }}
          >
            <Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제</Text>
          </TouchableOpacity>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible(false);
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>
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
  profileBox: {paddingVertical:30,paddingHorizontal:20},
  profile: {display:'flex',alignItems:'center',},
  profileBtn: {width:100,height:100,borderRadius:100,overflow:'hidden',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'},
  profileEdit: {width:100,height:26,backgroundColor:'#343434',position:'absolute',left:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center'},
  profileEditText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:20,color:'#fff'},
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

//export default Profile
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
)(Profile);