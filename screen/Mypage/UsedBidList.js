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
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const UsedBidList = ({navigation, route}) => {
  const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  const [tabState, setTabState] = useState(1);
  const [idxVal, setIdxVal] = useState('');
  const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemList2, setItemList2] = useState([]);
  const [nowPage2, setNowPage2] = useState(1);
  const [totalPage2, setTotalPage2] = useState(1);
  
	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage(1);
      setNowPage2(1);
      getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  function fnTab(v){
    setTabState(v);
    setNowPage(1);
    setNowPage2(1);
    if(v == 1){
      getData();
      setTimeout(function(){
        setItemList2([]);
      },200);
    }else if(v == 2){
      getData2();
      setTimeout(function(){
        setItemList([]);
      },200);
    }
  }

  //판매자가 입찰 승인
  const bidOk = async (idx) => {
    const formData = {
			is_api:1,
      bd_idx:idx,
		};

    Api.send('POST', 'ok_bidding', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        getData();
			}else{
				console.log('결과 출력 실패!', responseJson);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  //판매자가 입찰 거절
  const bidReject = async (idx) => {
    const formData = {
			is_api:1,
      bd_idx:idx,
		};

    Api.send('POST', 'reject_bidding', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        getData();
			}else{
				console.log('결과 출력 실패!', responseJson);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  //구매자가 입찰 취소
  const deleteBidding = async (idx) => {
    const formData = {
			is_api:1,
      pd_idx:idx,
		};

    Api.send('POST', 'del_bidding_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        getData2();
			}else{
				console.log('결과 출력 실패!', responseJson);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_sale_bid_product', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log("list_sale_bid_product : ",responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);        
			}else{
				setItemList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
  }
  const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_sale_bid_product', {is_api: 1, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = itemList.concat(responseJson.data);				
          setItemList(addItem);			
          setNowPage(nowPage+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}
  const getList = ({item, index}) => (
    <View style={[styles.matchCompleteMb, index == 0 ? styles.matchCompleteMbFst : null, index != itemList.length ? styles.borderBot : null, index != 0 ? styles.borderTop : null]}>
      <View style={[styles.compBtn]}>
        <View style={[styles.compWrap, styles.compWrapFst]}>
          <View style={styles.compInfo}>
            <View style={styles.compInfoDate}>
              <Text style={styles.compInfoDateText}>판매자 공장 : {item.mb_nick}</Text>
            </View>
            <View style={styles.compInfoName}>
              <Text style={styles.compInfoNameText}>{item.pd_name}</Text>
            </View>
            <View style={styles.compInfoLoc}>
              <AutoHeightImage width={12} source={require("../../assets/img/icon_calendar2.png")}  style={styles.compInfoLocImg}/>
              <Text style={styles.compInfoLocText}>입찰기간 : {item.pd_bidding_enday}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.compThumb}
            activeOpacity={1}
            //onPress={()=>{navigation.navigate('Other', {idx:item.bd_mb_idx})}}
          >
            {item.pd_image ? (
              <AutoHeightImage width={63} source={{uri: item.pd_image}} />
            ) : (
              <AutoHeightImage width={63} source={require("../../assets/img/sample1.jpg")} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>판매가</Text>
          <Text style={styles.matchPriceText2}>{item.pd_price}원</Text>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>제안가</Text>
          <Text style={styles.matchPriceText2}>{item.bd_price}원</Text>
        </View>
      </View>

      <View style={styles.btnBox}>
        <>
          {item.bd_status_org == 1 ? (
          <>
          <TouchableOpacity
            style={[styles.btn]}
            activeOpacity={opacityVal}
            onPress={()=>{bidReject(item.bd_idx)}}
          >
            <Text style={styles.btnText}>거절</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btn2]}
            activeOpacity={opacityVal}
            onPress={()=>{bidOk(item.bd_idx)}}
          >
            <Text style={styles.btnText}>승인</Text>
          </TouchableOpacity>
          </>
          ) : null }

          {item.bd_status_org == 2 ? (
          <>
          {/* <View style={styles.btn3TextBox}>
            <Text style={styles.btn3TextBoxText}>가격 입찰 제안이 수락되었습니다.</Text>
          </View> */}
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3]}
            activeOpacity={1}
          >
            <Text style={styles.btnText}>가격 입찰 제안을 수락했습니다.</Text>
          </TouchableOpacity>
          </>
          ) : null }

          {item.bd_status_org == 3 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3, styles.btn4]}
            activeOpacity={1}
          >
            <Text style={[styles.btnText, styles.btnText2]}>입찰을 거절했습니다.</Text>
          </TouchableOpacity>
          ) : null }

          {item.bd_status_org == 4 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3, styles.btn4]}
            activeOpacity={1}
          >
            <Text style={[styles.btnText, styles.btnText2]}>입찰자가 입찰을 취소했습니다.</Text>
          </TouchableOpacity>
          ) : null }       
        </>
        
      </View>  
    </View>
	);
  
  const getData2 = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_buy_bid_product', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log("list_buy_bid_product : ",responseJson);
				setItemList2(responseJson.data);
        setTotalPage2(responseJson.total_page);        
			}else{
				setItemList2([]);
				setNowPage2(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
  }
  const moreData2 = async () => {
    if(totalPage2 > nowPage2){
      await Api.send('GET', 'list_buy_bid_product', {is_api: 1, page:nowPage2+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = itemList2.concat(responseJson.data);				
          setItemList2(addItem);			
          setNowPage2(nowPage2+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}
  const getList2 = ({item, index}) => (
    <View style={[styles.matchCompleteMb, index == 0 ? styles.matchCompleteMbFst : null, index != itemList2.length ? styles.borderBot : null, index != 0 ? styles.borderTop : null]}>
      <View style={[styles.compBtn]}>
        <View style={[styles.compWrap, styles.compWrapFst]}>
          <View style={styles.compInfo}>
            <View style={styles.compInfoDate}>
              <Text style={styles.compInfoDateText}>구매자 공장 : {item.mb_nick}</Text>
            </View>
            <View style={styles.compInfoName}>
              <Text style={styles.compInfoNameText}>{item.pd_name}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.compThumb}
            activeOpacity={1}
            //onPress={()=>{navigation.navigate('Other', {idx:item.bd_mb_idx})}}
          >
            {item.pd_image ? (
              <AutoHeightImage width={63} source={{uri: item.pd_image}} />
            ) : (
              <AutoHeightImage width={63} source={require("../../assets/img/sample1.jpg")} />
            )}            
          </TouchableOpacity>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>판매가</Text>
          <Text style={styles.matchPriceText2}>{item.pd_price}원</Text>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>제안가</Text>
          <Text style={styles.matchPriceText2}>{item.bd_price}원</Text>
        </View>
      </View>
      
      <View style={styles.btnBox}>
        <>
          {item.bd_status == 1 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{deleteBidding(item.pd_idx)}}
          >
            <Text style={styles.btnText}>취소</Text>
          </TouchableOpacity>
          ) : null }

          {item.bd_status == 2 ? (
          <>
          <View style={styles.btn3TextBox}>
            <Text style={styles.btn3TextBoxText}>가격 입찰 제안이 수락되었습니다.</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{chatDeal(item.pd_idx, item.pd_mb_idx)}}
          >
            <Text style={styles.btnText}>채팅하기</Text>
          </TouchableOpacity>
          </>
          ) : null }

          {item.bd_status == 3 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3, styles.btn4]}
            activeOpacity={1}
          >
            <Text style={[styles.btnText, styles.btnText2]}>가격 입찰 제안이 거절되었습니다.</Text>
          </TouchableOpacity>
          ) : null }

          {item.bd_status == 4 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3, styles.btn4]}
            activeOpacity={1}
          >
            <Text style={[styles.btnText, styles.btnText2]}>입찰을 취소했습니다.</Text>
          </TouchableOpacity>
          ) : null }       
        </>
      </View>  
    </View>
	)

  const chatDeal = async (pdIdx, pdMbIdx) => {    
    await Api.send('GET', 'in_chat', {'is_api': 1, recv_idx:pdMbIdx, page_code:'product', page_idx:pdIdx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("in_chat : ",responseJson);				
        const roomName = 'product_'+responseJson.cr_idx;
        navigation.navigate('ChatRoom', {pd_idx:pdIdx, page_code:'product', recv_idx:pdMbIdx, roomName:roomName});
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패! : ', responseJson.result_text);
			}
		});
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'입찰내역'} />
      <View style={styles.tabBox}>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(1)}}
        > 
          {tabState == 1 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>판매자</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>판매자</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>구매자</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>구매자</Text>  
          )}
        </TouchableOpacity>
      </View>
		
      {tabState == 1 ? (
        <FlatList
          data={itemList}
          renderItem={(getList)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 판매내역이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={itemList2}
          renderItem={(getList2)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData2}	
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 구매내역이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )              
          }
        />
      )}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
  matchCompleteMb: {paddingVertical:30},
  matchCompleteMbFst: {paddingTop:20,},
  compBtn: {paddingHorizontal:20},
  compWrap: {display:'flex',flexDirection:'row',justifyContent:'space-between',position:'relative',paddingBottom:10,},
  compRadio: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,position:'absolute',top:30,left:0,display:'flex',alignItems:'center',justifyContent:'center'},
  comRadioChk: {backgroundColor:'#31B481',borderColor:'#31B481',},
  compInfo: {width:(innerWidth-63)},
  compInfoDate: {},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {marginVertical:8},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocImg: {position:'relative',top:-1,},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
  compThumb: {width:63,height:63,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
  matchPrice: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',backgroundColor:'#F3FAF8',borderRadius:12,paddingVertical:10,paddingHorizontal:15,marginTop:10,},
  matchPriceText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#353636'} ,
  matchPriceText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#31B481'},
  btnBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',flexWrap:'wrap',paddingHorizontal:20,marginTop:10,},
  btn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:"center",justifyContent:'center'},
  btn2: {backgroundColor:'#31B481',},
  btn3: {width:innerWidth},
  btn4: {backgroundColor:'#fff',borderWidth:1,borderColor:'#000',},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:20,color:'#fff'},
  btnText2: {color:'#353636',},
  btn3TextBox: {marginTop:25,marginBottom:5,},
  btn3TextBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#353636',},
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default UsedBidList