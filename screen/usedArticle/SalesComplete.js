import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
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

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const SalesComplete = (props) => {
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const {params} = route;
  const idx = params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mbId, setMbId] = useState();
  const [score, setScore] = useState(3);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [endList, setEndList] = useState([]);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setMbId();
        setVisible(false);
        setVisible2(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(false);
    console.log("idx : ",idx);
    await Api.send('GET', 'insert_end_product', {'is_api': 1, pd_idx:idx, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("insert_end_product : ",responseJson);
        setEndList(responseJson.data);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!', responseJson);
			}
		});
    setIsLoading(true);
  }

  const getList = ({item, index}) => (
		<TouchableOpacity 
      style={[styles.compBtn]}
      activeOpacity={opacityVal}
      onPress={() => {
        if(mbId && mbId==item.mb_idx){
          setMbId();
        }else{
          setMbId(item.mb_idx);
        }
      }}
    >
      <View style={[styles.compWrap, index==0 ? styles.compWrapFst : null]}>
        <View style={[styles.compRadio, mbId==item.mb_idx ? styles.comRadioChk : null]}>
          <AutoHeightImage width={12} source={require("../../assets/img/icon_chk_on.png")} />
        </View>
        <View style={styles.compInfo}>
          <View style={styles.compInfoDate}>
            <Text style={styles.compInfoDateText}>{item.cr_lastdate}</Text>
          </View>
          <View style={styles.compInfoName}>
            <Text style={styles.compInfoNameText}>{item.mb_nick}</Text>
          </View>
          <View style={styles.compInfoLoc}>
            <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
            <Text style={styles.compInfoLocText}>{item.mb_loc}</Text>
          </View>
        </View>
        <View style={styles.compThumb}>
          <AutoHeightImage width={79} source={{uri: item.image}} />
        </View>
        {item.bd_price ? (
        <View style={styles.bidPriceBox}>
          <View style={styles.bidPriceLeft}>
            <Text style={styles.bidPriceLeftText}>가격</Text>
          </View>
          <View style={styles.bidPriceRight}>
            <Text style={styles.bidPriceRightUnit}>{item.bd_unit}</Text>
            <Text style={styles.bidPriceRightPrice}>{item.bd_price}원</Text>
          </View>
        </View>
        ) : null}
      </View>
    </TouchableOpacity>
	);

  function fnSubmitBefore(){
    if(!mbId){
      setVisible(true);
    }else{
      setVisible2(true);
    }
  }

  function submitEndProduct(v){    
    const formData = {
			is_api:1,				
			pd_idx:idx
		};

    if(v == 2){
      formData.recv_idx = mbId;
    }else if(v == 3){
      formData.recv_idx = mbId;
      formData.so_score = score;
    }

    Api.send('POST', 'save_end_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        setVisible(false);
        setVisible2(false);
        if(route.params.returnNavi){
					navigation.navigate(route.params.returnNavi, {isSubmit : true});
				}else{
					navigation.navigate('Home', {isSubmit: true});
				}
			}else{
				console.log('결과 출력 실패!', resultItem);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'판매완료 업체선정'} />
      <FlatList
        data={endList}
        renderItem={(getList)}
        keyExtractor={(item, index) => index.toString()}		
        onEndReachedThreshold={0.6}
        //onEndReached={moreData}
        ListHeaderComponent={
          <>						
          <View style={[styles.salesAlert, styles.borderBot]}>
            <View style={styles.alertBox}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>판매완료 업체를 선택할 수 있습니다.</Text>
              <Text style={[styles.alertBoxText, styles.alertBoxText2]}>업체를 선택하지 않아도 판매완료가 가능합니다.</Text>
            </View>
          </View>
          <View style={styles.borderTop}></View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.notData}>
            <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
            <Text style={styles.notDataText}>판매완료로 지정할 회원이 없습니다.</Text>
          </View>
        }
      />
      <View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => {fnSubmitBefore()}}
				>
					<Text style={styles.nextBtnText}>확인</Text>
				</TouchableOpacity>
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
				<View style={styles.modalCont}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>업체 선택</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>업체가 선택되지 않았습니다.</Text>
            <Text style={styles.avatarDescText}>판매 완료로 변경 할까요?</Text>
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
              onPress={() => {submitEndProduct(1)}}
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
				<View style={[styles.modalCont, styles.modalCont2]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>거래평가</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>판매 완료 할 회원에게 별점으로 판매를</Text>
            <Text style={styles.avatarDescText}>완료를 하여 주세요.</Text>
          </View>
          <View style={styles.starBox}>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(1)}}
            >
              {score > 0 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(2)}}
            >
              {score > 1 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(3)}}
            >
              {score > 2 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(4)}}
            >
              {score > 3 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(5)}}
            >
              {score > 4 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {submitEndProduct(2)}}
            >
              <Text style={styles.avatarBtnText}>평가 하지 않고 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {submitEndProduct(3)}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>

      {/* <View style={[styles.indicator]}>
				<ActivityIndicator size="large" />
			</View> */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  mgTop30: {marginTop:30,},
  mgTop35: {marginTop:35,},
  salesAlert: {padding:20,paddingTop:25,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
  compBtn: {paddingHorizontal:20,},
  compWrap: {paddingVertical:30,borderTopWidth:1,borderColor:'#E9EEF6',display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',position:'relative'},
  compWrapFst: {borderTopWidth:0,},
  compRadio: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,position:'absolute',top:30,left:0,display:'flex',alignItems:'center',justifyContent:'center'},
  comRadioChk: {backgroundColor:'#31B481',borderColor:'#31B481',},
  compInfo: {width:(innerWidth-79),paddingLeft:31},
  compInfoDate: {},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {marginVertical:8},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
  compThumb: {width:79,height:79,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
  bidPriceBox: {width:widnowWidth-40,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,paddingTop:11,paddingBottom:10,paddingHorizontal:15,backgroundColor:'#F3FAF8',borderRadius:8},
  bidPriceLeft: {},
  bidPriceLeftText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#353636'},
  bidPriceRight: {flexDirection:'row',alignItems:'center',},
  bidPriceRightUnit: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:14,color:'#111',marginRight:3,},
  bidPriceRightPrice: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#31B481'},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-140)},	
  modalCont2: {top:((widnowHeight/2)-166)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  starBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'center',marginTop:20},
  star: {marginHorizontal:4,},

  indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},

  notData: {height:(widnowHeight-270),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

//export default SalesComplete
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(SalesComplete);