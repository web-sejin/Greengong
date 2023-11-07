import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Font from "../../assets/common/Font"
import ToastMessage from "../../components/ToastMessage"
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Mypage = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
	const [memberData, setMemberData] = useState([]); //회원 정보	
	const [profileImg, setProfileImg] = useState(userInfo?.mb_img1);
	const [recentNotice, setRecentNotice] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setVisible(false);
				setVisible2(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
			member_info_handle();
			if(userInfo){
				if(userInfo.mb_img1){
					setProfileImg(userInfo.mb_img1);
				}
			}
		}

		return () => isSubscribed = false;		
	}, [isFocused]);

	//회원정보 조회
	const member_info_handle = async () => {
		const payload = {'is_api': 1, 'id': userInfo?.mb_id}
		const member_info_list = await member_info(payload);
		//console.log('member_info_list >>', member_info_list);
		if(member_info_list.recently_notice != ''){
			setRecentNotice(member_info_list.recently_notice);
		}
	};

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
		
		ToastMessage('탈퇴처리 되었습니다.');
		navigation.reset({
			routes: [{ name: 'Intro'}],
		});

	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{/* <TouchableOpacity
				onPress={() => {
					setPageSt(true);
					navigation.navigate('Login')
				}}
			>
				<Text style={{color:'#000',padding:30}}>로그인</Text>
			</TouchableOpacity> */}
			<View style={styles.header}>		
				<Text style={styles.headerTitle}>마이페이지</Text>
				<TouchableOpacity
					style={styles.headerGear}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('Setting');
					}}			
				>
					<AutoHeightImage width={21} source={require("../../assets/img/icon_gear.png")} />
				</TouchableOpacity>
			</View>
			<ScrollView>
				<TouchableOpacity 
					style={styles.notApproval}
					activeOpacity={opacityVal}
					onPress={() => { navigation.navigate('NoticeList'); }}
				>
					<AutoHeightImage width={20} source={require("../../assets/img/icon_alert4.png")} />
					{recentNotice != '' ? (
						<Text 
							style={styles.notApprovalText}
							numberOfLines={1}
							ellipsizeMode='tail'
						>
							{recentNotice}
						</Text>
					) : (
						<Text style={styles.notApprovalText}>등록된 공지사항이 없습니다.</Text>
					)}
				</TouchableOpacity>
				<View style={styles.mypageWrap}>
					<View style={[styles.mypage1, styles.paddTop30, styles.paddBot30, styles.borderBot]}>
						<View style={styles.mypage1InfoBox}>
							<View style={styles.mypage1InfoBox2}>
								<View style={styles.mypage1InfoProfile}>
									{profileImg ? (
										<AutoHeightImage width={69} source={{uri: profileImg}} />
									) : (
										<AutoHeightImage width={69} source={require("../../assets/img/not_profile.png")} />	
									)}
								</View>
								<View style={styles.mypage1Info}>
									<View style={styles.mypage1InfoEmail}>
										<Text style={styles.mypage1InfoEmailText}>{userInfo?.mb_id}</Text>
									</View>
									{userInfo?.mb_is_sso == 1 ? (
									<View style={styles.mypage1InfoKakaoSt}>
										<AutoHeightImage width={13} source={require("../../assets/img/kakao_login2.png")} />
										<Text style={styles.mypage1InfoKakaoStText}>카카오 로그인</Text>
									</View>
									// <View style={[styles.mypage1InfoAppleSt]}>
									// 	<AutoHeightImage width={9} source={require("../../assets/img/apple_logo.png")} />
									// 	<Text style={styles.mypage1InfoAppleStText}>애플 로그인</Text>
									// </View>
									) : null}
								</View>
							</View>
							<TouchableOpacity 
								style={styles.mypage1InfoBtn}
								activeOpacity={1}
								onPress={()=>{
									navigation.navigate('Profile', {});
								}}
							>
								<Text style={styles.mypage1InfoBtnText}>프로필 설정</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.myDealResultBox}>
							<Text style={styles.myDealResultBoxText}>거래평가점수</Text>
							<Text style={styles.myDealResultBoxText2}>{userInfo?.mb_score}점</Text>
						</View>
					</View>

					<View style={[styles.mypage2, styles.paddTop30, styles.paddBot30, styles.borderBot]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>거래내역</Text>
						</View>
						<View style={styles.mypageLinkBox}>
							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('UsedSaleList', {});
								}}			
							>
								<AutoHeightImage width={27} source={require("../../assets/img/icon_mypage1.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>판매내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('UsedBuyList', {});
								}}
							>
								<AutoHeightImage width={29} source={require("../../assets/img/icon_mypage2.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>구매내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('UsedBidList', {});
								}}			
							>
								<AutoHeightImage width={27} source={require("../../assets/img/icon_mypage3.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>입찰내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('UsedLike', {});
								}}			
							>
								<AutoHeightImage width={27} source={require("../../assets/img/icon_mypage4.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>관심목록</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.mypage3, styles.paddTop30, styles.paddBot30, styles.borderBot]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>매칭내역</Text>
						</View>
						<View style={styles.mypageLinkBox}>
							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('MatchReq', {});
								}}			
							>
								<AutoHeightImage width={25} source={require("../../assets/img/icon_mypage5.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>요청내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('MatchComparison', {});
								}}				
							>
								<AutoHeightImage width={31} source={require("../../assets/img/icon_mypage6.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>비교내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('MatchOrder', {});
								}}			
							>
								<AutoHeightImage width={22} source={require("../../assets/img/icon_mypage7.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>발주내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {									
									navigation.navigate('MatchDownUsed', {});
								}}			
							>
								<AutoHeightImage width={29} source={require("../../assets/img/icon_mypage8.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>도면권한</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.mypage3, styles.paddTop30, styles.paddBot30, styles.borderBot]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>신청내역</Text>
						</View>
						<View style={styles.mypageLinkBox}>
							<TouchableOpacity
								style={styles.mypageLinkBoxBtn}
								activeOpacity={opacityVal}
								onPress={() => {									
									navigation.navigate('MatchDownCert', {});
								}}			
							>
								<AutoHeightImage width={27} source={require("../../assets/img/icon_mypage10.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>도면요청내역</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.mypageLinkBoxBtn]}
								activeOpacity={opacityVal}
								onPress={() => {									
									navigation.navigate('MatchEstimate', {});
								}}			
							>
								<AutoHeightImage width={27} source={require("../../assets/img/icon_mypage9.png")} />
								<Text style={styles.mypageLinkBoxBtnText}>견적서 확인</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.mypage4, styles.paddTop30, styles.paddBot15, styles.borderBot]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>기타</Text>
						</View>
						<View style={styles.mypageLinkList}>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {									
									navigation.navigate('Keyword', {});
								}}
							>
								<Text style={styles.mypageLinkListBtnText}>키워드 등록</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('Message', {});
								}}			
							>
								<Text style={styles.mypageLinkListBtnText}>자주 쓰는 메세지</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('BlockList', {});
								}}			
							>
								<Text style={styles.mypageLinkListBtnText}>차단 사용자 관리</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('LikeList', {});
								}}		
							>
								<Text style={styles.mypageLinkListBtnText}>관심 사용자 관리</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.mypage5, styles.paddTop30, styles.paddBot15]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>고객센터</Text>
						</View>
						<View style={styles.mypageLinkList}>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('FaqList', {});
								}}	
							>
								<Text style={styles.mypageLinkListBtnText}>고객센터</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('QnaList');
								}}	
							>
								<Text style={styles.mypageLinkListBtnText}>1:1문의</Text>
							</TouchableOpacity>
							
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('NoticeList');
								}}	
							>
								<Text style={styles.mypageLinkListBtnText}>공지사항</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('Privacy', {tit:'서비스 이용약관', para:1});
								}}			
							>
								<Text style={styles.mypageLinkListBtnText}>서비스 이용약관</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('Privacy', {tit:'개인정보 처리방침', para:2});
								}}			
							>
								<Text style={styles.mypageLinkListBtnText}>개인정보 처리방침</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('Privacy', {tit:'위치기반 서비스', para:3});
								}}			
							>
								<Text style={styles.mypageLinkListBtnText}>위치기반 서비스</Text>
							</TouchableOpacity>

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
			</ScrollView>
			<View style={{height:80}}></View>

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
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	paddTop20: {paddingTop:20},
	paddTop30: {paddingTop:30},
	paddBot15: {paddingBottom:15},
	paddBot30: {paddingBottom:30},
	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:20,paddingRight:5,},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},
	headerGear: {width:51,height:50,display:'flex',alignItems:'center',justifyContent:'center'},
	notApproval: {display:'flex',flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:13,backgroundColor:'#404040',},
	notApprovalText: {width:innerWidth-32,fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#fff',marginLeft:12,},
	mypageWrap: {paddingHorizontal:20},
	mypageTit: {},
	mypageTitText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000',},
	mypage1: {},
	mypage1InfoBox: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	mypage1InfoBox2: {display:'flex',flexDirection:'row',alignItems:'center',},
	mypage1InfoProfile: {width:69,height:69,overflow:'hidden',borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center'},
	mypage1Info: {width:(innerWidth-154),paddingLeft:10,},
	mypage1InfoEmail: {},
	mypage1InfoEmailText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#323232'},
	mypage1InfoKakaoSt: {width:120,height:24,backgroundColor:'#FFE812',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:10,},
	mypage1InfoKakaoStText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:16,color:'#3C1E1E',marginLeft:7,},
	mypage1InfoAppleSt: {width:120,height:24,backgroundColor:'#000',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:10,},
	mypage1InfoAppleStText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:16,color:'#fff',marginLeft:7,},
	mypage1InfoBtn: {width:75,height:26,backgroundColor:'#F2F2F2',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center'},
	mypage1InfoBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#737373'},
	myDealResultBox: {paddingVertical:11,paddingHorizontal:30,backgroundColor:'#F3FAF8',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,},
	myDealResultBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#323232',},
	myDealResultBoxText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#31B481',},
	mypageLinkBox: {display:'flex',flexDirection:'row',flexWrap:'wrap',marginTop:20},
	mypageLinkBoxBtn: {width:(innerWidth/4),display:'flex',alignItems:'center'},
	mypageLinkBoxBtn2: {marginTop:30,},
	mypageLinkBoxBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#000',marginTop:10,},
	mypageLinkList: {marginTop:5},
	mypageLinkListBtn: {paddingVertical:15,},
	mypageLinkListBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#000',},

	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
  modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
	modalCont4:{top:((widnowHeight/2)-120)},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
})

//export default Mypage
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
)(Mypage);