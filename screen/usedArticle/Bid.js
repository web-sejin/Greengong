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

const Bid = (props) => {
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bidPirce, setBidPrice] = useState('');
  const [bidUnit, setBidUnit] = useState(1);  
  const [itemInfo, setItemInfo] = useState({});
  const [myInfo, setMyInfo] = useState({});
  const [unitList, setUnitList] = useState({});
  const [unitText, setUnitText] = useState();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setBidPrice('');
        setBidUnit(1);
        setItemInfo({});
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

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'insert_bidding_product', {'is_api': 1, pd_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("bidding_product : ",responseJson);
				setItemInfo(responseJson);
        console.log("bidding_unit : ",responseJson.bidding_unit);
        setUnitList(responseJson.bidding_unit);
        if(responseJson.c1_name == '중고자재'){
          setBidUnit(responseJson.bidding_unit[0].val);
          setUnitText(responseJson.bidding_unit[0].txt);
        }else if(responseJson.c1_name == '스크랩' || responseJson.c1_name == '중고기계/장비'){
          setBidUnit(responseJson.bidding_unit.val);
          setUnitText(responseJson.bidding_unit.txt);
        }else{
          setBidUnit(responseJson.bidding_unit[0].val);
          setUnitText(responseJson.bidding_unit[0].txt);
        }
			}else{
				//setItemList([]);				
        ToastMessage(responseJson.result_text);
			}
		});
    setIsLoading(true);
  }

  const getMyData = async () => {
    await Api.send('GET', 'get_member_info', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_member_info : ",responseJson);
        setMyInfo(responseJson);
			}else{
				console.log(responseJson.result_text);
			}
		});  
  }

  useEffect(()=>{
    getData();
    getMyData();
  },[]);

  const _submit = async () => {
    if(itemInfo.c1_name == '폐기물'){
      if(bidUnit == ''){
        ToastMessage('가격 단위를 선택해 주세요.');
        return false;
      }
    }

    if(bidPirce == ''){
      ToastMessage('입찰 단가를 입력해 주세요.');
      return false;
    }
    
    let bid_price = (bidPirce).split(',').join('');

    const formData = {
			is_api:1,				
			pd_idx:idx,
			bd_price:bid_price,
			bd_unit:bidUnit,
		};

    Api.send('POST', 'save_bidding_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);				
				navigation.navigate('UsedView', {idx:idx});
			}else{
				console.log('결과 출력 실패!', resultItem.result_text);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  // if(isLoading){   
  //   console.log(unitList.length);
  //   // unitList.map((item, index)=>{
  //   //   console.log("item : ",item);
  //   // });
  // }else{
  //   console.log('b');
  // }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'입찰하기'} />
      {isLoading ? (
        <>
        <KeyboardAwareScrollView>
          <View style={[styles.listLi, styles.borderBot]}>
            
            <View style={styles.prdImage}>
              {itemInfo?.pd_image ? (
                <AutoHeightImage width={116} source={{uri: itemInfo?.pd_image}} style={styles.listImg} />
              ) : (
                <AutoHeightImage width={116} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
              )}
            </View>
            <View style={styles.listInfoBox}>
              <View style={styles.listInfoSort}>
                <Text style={styles.listInfoSortText}>[{itemInfo?.c1_name}]</Text>
              </View>
              <View style={styles.listInfoSeller}>
                <Text style={styles.listInfoSellerText}>{itemInfo?.pd_name}</Text>
              </View>
              <View style={styles.listInfoTitle}>
                <Text style={styles.listInfoTitleText}>{itemInfo?.pd_summary}</Text>
              </View>
              <View style={styles.listInfoDesc}>
                <Text style={styles.listInfoDescText}>{itemInfo?.pd_loc} · {itemInfo?.pd_date}</Text>
              </View>
              <View style={styles.listInfoUnit}>
                <Text style={styles.listInfoUnitText}>{unitText}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.registBox, styles.borderTop]}>
            <View style={styles.alertBox}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>입찰은 게시글당 1회만 할 수 있습니다.</Text>
              <Text style={[styles.alertBoxText, styles.alertBoxText2]}>합리적인 가격으로 입찰해 주세요.</Text>
            </View>

            {itemInfo.c1_name == '폐기물' ? (
            <View style={[styles.typingBox, styles.mgTop30]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>가격 단위</Text>
              </View>
              <View style={[styles.typingInputBox, styles.typingFlexBox]}>
                {unitList.map((item, index) => {
                  return(
                    <TouchableOpacity
                      key={index}
                      style={[styles.dealBtn, bidUnit == item.val ? styles.dealBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={() => {
                        if(bidUnit && bidUnit == item.val){
                          setBidUnit('');
                          setUnitText('');
                        }else{
                          setBidUnit(item.val);
                          setUnitText(item.txt);
                        }
                      }}
                    >
                      <Text style={[styles.dealBtnText, bidUnit == item.val ? styles.dealBtnTextOn : null]}>
                        {item.txt} 가격
                      </Text>
                    </TouchableOpacity>
                  )
                })}
                

                {/* <TouchableOpacity
                  style={[styles.dealBtn, bidUnit == 2 ? styles.dealBtnOn : null]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    if(bidUnit && bidUnit == 2){
                      setBidUnit('');
                    }else{
                      setBidUnit(2);
                    }
                  }}
                >
                  <Text style={[styles.dealBtnText, bidUnit == 2 ? styles.dealBtnTextOn : null]}>m³ ₩ 가격</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            ) : null}

            <View style={[styles.typingBox, styles.mgTop35]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>입찰 단가 입력</Text>
              </View>
              <View style={[styles.typingInputBox]}>
                <TextInput
                  value={bidPirce}
                  keyboardType = 'numeric'
                  onChangeText={(v) => {
                    let comma = (v).split(',').join('');
                    comma = String(comma).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
                    setBidPrice(comma);
                  }}
                  placeholder={"입찰 단가를 입력해 주세요."}
                  style={[styles.input]}
                  placeholderTextColor={"#8791A1"}
                />

                  <View style={styles.inputUnit}>
                   <Text style={styles.inputUnitText}>{unitText}</Text>
                  </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={styles.nextBtn}
            activeOpacity={opacityVal}
            onPress={() => {_submit();}}
          >
            <Text style={styles.nextBtnText}>입찰하기</Text>
          </TouchableOpacity>
        </View>
        </>
      ) : (
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" />
        </View>
      )}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  mgTop30: {marginTop:30,},
  mgTop35: {marginTop:35,},
  listLi: {display:'flex',flexDirection:'row',paddingHorizontal:20,paddingTop:25,paddingBottom:35},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
  prdImage: {width:116,height:116,borderRadius:8,overflow:'hidden'},
	listImg: {},
	listInfoBox: {width:(innerWidth - 116),paddingLeft:15,},
  listInfoSort: {},
  listInfoSortText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#000'},
  listInfoSeller: {},
  listInfoSellerText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoTitle: {marginTop:5},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},
	listInfoUnit: {marginTop:5},
	listInfoUnitText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#353636'},
  registBox: {padding:20,paddingTop:35,},	
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
  dealBtn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	dealBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	dealBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,color:'#8791A1'},
	dealBtnTextOn: {color:'#fff'},
  inputUnit: {position:'absolute',top:0,right:20,},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#000'},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
  indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

//export default Bid
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Bid);