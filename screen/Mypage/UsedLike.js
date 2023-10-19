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

const UsedLike = (props) => {
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;  
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
	const [tabState, setTabState] = useState(1);
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
				//setIsLoading(false);
        //setTabState(1);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage(1);
      setNowPage2(1);
      getData();
      //getData2();      
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_scrap_product', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log("list_scrap_product : ",responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);       
        setNowPage(1); 
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
      await Api.send('GET', 'list_scrap_product', {is_api: 1, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          console.log(responseJson.data);				
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
		<View style={styles.borderBot}>
			<>
      <View
        style={[styles.listLi]}        
      >    
        <TouchableOpacity
          style={styles.otherPeople2}
          activeOpacity={opacityVal}
          onPress={()=>{
            if(item.mb_idx != userInfo?.mb_idx){
              navigation.navigate('Other', {idx:item.mb_idx})
            }
          }}
        >
          {item.image ? (
            <AutoHeightImage width={73} source={{uri: item.image}} />
          ) : (
            <AutoHeightImage width={73} source={require("../../assets/img/not_profile.png")} />	
          )}
        </TouchableOpacity>        
        <TouchableOpacity 
          style={styles.listInfoBox}
          activeOpacity={opacityVal}
          onPress={() => {
            navigation.navigate('UsedView', {idx:item.pd_idx})
          }}
        >
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.pd_name}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{item.pd_summary}</Text>
          </View>
          <View style={styles.listInfoPriceBox}>
            <View style={[styles.listInfoPriceArea]}>
              <View style={styles.listInfoPrice}>
                <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
              </View>
            </View>					
          </View>
          {item.pd_status_org == 3 ? (
          <View style={styles.listInfoStateBox}>
            <Text style={styles.listInfoStateBoxText}>판매완료</Text>
          </View>
          ) : null}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.listLikeBtn}
        activeOpacity={opacityVal}
        onPress={() => {fnLike(item.pd_idx)}}
      >
        <AutoHeightImage width={22} source={require("../../assets/img/icon_heart.png")} />
      </TouchableOpacity>
			</>
		</View>
	);

  const getData2 = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_scrap_seller', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log('list_scrap_seller : ',responseJson);
				setItemList2(responseJson.data);
        setTotalPage2(responseJson.total_page);        
        setNowPage2(1);
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
      await Api.send('GET', 'list_scrap_seller', {is_api: 1, page:nowPage2+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          console.log(responseJson.data);				
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
		<View style={styles.borderBot}>
			<>
      <View style={[styles.listLi, styles.listLi2, styles.listLi3]}>   
        <TouchableOpacity
          style={styles.otherPeople}
          activeOpacity={opacityVal}
          onPress={()=>{
            if(item.mb_idx != userInfo?.mb_idx){
              navigation.navigate('Other', {idx:item.mb_idx})
            }
          }}
        >
          {item.mb_img1 != '' ? (
            <AutoHeightImage width={50} source={{uri: item.mb_img1}} style={styles.listImg} />
          ) : (
            <AutoHeightImage width={50} source={require("../../assets/img/not_profile.png")} style={styles.listImg} />
          )}
        </TouchableOpacity> 
        <TouchableOpacity 
          style={[styles.listInfoBox, styles.listInfoBox2]}
          activeOpacity={opacityVal}
          onPress={() => {
            navigation.navigate('UsedLikeView', {idx:item.mb_idx})
          }}
        >
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.mb_nick}
            </Text>
          </View>        
          <TouchableOpacity
            style={[styles.listLikeBtn, styles.listLikeBtn2]}
            activeOpacity={opacityVal}
            onPress={() => {fnScrap(item.mb_idx)}}
          >
            <AutoHeightImage width={22} source={require("../../assets/img/icon_heart.png")} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>      
			</>
		</View>
	);

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

  //관심판매자
  function fnScrap(mb_idx){
    const formData = {
			is_api:1,				
			mb_idx:mb_idx,
      sr_code:'product'
		};

    Api.send('POST', 'save_scrap', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);				
        getData2();
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //좋아요
  function fnLike(like_idx){
    const formData = {
			is_api:1,				
			pd_idx:like_idx,
		};

    Api.send('POST', 'save_like_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        getData();
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'관심목록'} />
      <View style={styles.tabBox}>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(1)}}
        > 
          {tabState == 1 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>중고상품</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>중고상품</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>판매자</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>판매자</Text>  
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
          disableVirtualization={false}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 관심 중고상품이 없습니다.</Text>
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
          disableVirtualization={false}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 관심 판매자가 없습니다.</Text>
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
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  listLi: {display:'flex',flexDirection:'row',padding:20,},
  listLi2: {alignItems:'stretch',paddingVertical:0,},
  listLi3: {alignItems:'center',},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
  otherPeople: {width:50,height:50,borderRadius:50,overflow:'hidden'},
  otherPeople2: {width:73,height:73,borderRadius:50,overflow:'hidden'},
	listImg: {borderRadius:50},
	listInfoBox: {width:(innerWidth - 65),paddingLeft:15,paddingRight:40,position:'relative',},
  listInfoBox2: {width:(innerWidth - 50),height:90,display:'flex',justifyContent:'center'},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:5,},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},	
	listInfoPriceBox: {marginTop:5},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},	
  listInfoStateBox: {width:78,height:23,backgroundColor:'#fff',borderWidth:1,borderColor:'#000',borderRadius:20,position:'absolute',right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',},
  listInfoStateBoxText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:21,color:'#353636',},
  listLikeBtn: {width:42,height:40,position:'absolute',top:10,right:10,display:'flex',alignItems:'center',justifyContent:'center',},
  listLikeBtn2: {top:25,right:0,},
	notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(UsedLike);