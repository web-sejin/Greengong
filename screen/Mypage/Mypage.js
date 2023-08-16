import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import Font from "../../assets/common/Font"
import ToastMessage from "../../components/ToastMessage"

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Mypage = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				
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
					onPress={() => {}}			
				>
					<AutoHeightImage width={21} source={require("../../assets/img/icon_gear.png")} />
				</TouchableOpacity>
			</View>
			<ScrollView>
				<View style={styles.notApproval}>
					<AutoHeightImage width={20} source={require("../../assets/img/icon_alert4.png")} />
					<Text style={styles.notApprovalText}>미승인된 공장이 있습니다.</Text>
				</View>
				<View style={styles.mypageWrap}>
					<View style={[styles.mypage1, styles.paddTop30, styles.paddBot30, styles.borderBot]}>
						<View style={styles.mypage1InfoBox}>
							<View style={styles.mypage1InfoBox2}>
								<View style={styles.mypage1InfoProfile}>
									<AutoHeightImage width={69} source={require("../../assets/img/sample1.jpg")} />
								</View>
								<View style={styles.mypage1Info}>
									<View style={styles.mypage1InfoEmail}>
										<Text style={styles.mypage1InfoEmailText}>hong@gmail.com</Text>
									</View>
									<View style={styles.mypage1InfoKakaoSt}>
										<AutoHeightImage width={13} source={require("../../assets/img/kakao_login2.png")} />
										<Text style={styles.mypage1InfoKakaoStText}>카카오 로그인</Text>
									</View>
								</View>
							</View>
							<TouchableOpacity 
								style={styles.mypage1InfoBtn}
								activeOpacity={1}
								onPress={()=>{}}
							>
								<Text style={styles.mypage1InfoBtnText}>프로필 설정</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.myDealResultBox}>
							<Text style={styles.myDealResultBoxText}>거래평가점수</Text>
							<Text style={styles.myDealResultBoxText2}>4점</Text>
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

					<View style={[styles.mypage4, styles.paddTop30, styles.paddBot15, styles.borderBot]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>기타</Text>
						</View>
						<View style={styles.mypageLinkList}>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>키워드 등록</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>자주 쓰는 메세지</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>차단 사용자 관리</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>관심 사용자 관리</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.mypage4, styles.paddTop30, styles.paddBot15]}>
						<View style={styles.mypageTit}>
							<Text style={styles.mypageTitText}>고객센터</Text>
						</View>
						<View style={styles.mypageLinkList}>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>고객센터</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>공지사항</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>서비스 이용약관</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>개인정보 처리방침</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>위치기반서비스</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>로그아웃</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.mypageLinkListBtn}
								activeOpacity={opacityVal}
								onPress={() => {}}			
							>
								<Text style={styles.mypageLinkListBtnText}>회원탈퇴</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={{height:80}}></View>
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
	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},
	notApproval: {display:'flex',flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:13,backgroundColor:'#404040',},
	notApprovalText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#fff',marginLeft:12,},
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
	mypage1InfoKakaoStText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:31,color:'#3C1E1E',marginLeft:7,},
	mypage1InfoBtn: {width:75,height:26,backgroundColor:'#F2F2F2',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center'},
	mypage1InfoBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#737373'},
	myDealResultBox: {paddingVertical:11,paddingHorizontal:30,backgroundColor:'#F3FAF8',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,},
	myDealResultBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#323232',},
	myDealResultBoxText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#31B481',},
	mypageLinkBox: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:20,},
	mypageLinkBoxBtn: {width:(innerWidth/4),display:'flex',alignItems:'center',},
	mypageLinkBoxBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#000',marginTop:10,},
	mypageLinkList: {marginTop:5},
	mypageLinkListBtn: {paddingVertical:15,},
	mypageLinkListBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#000',},
})

export default Mypage