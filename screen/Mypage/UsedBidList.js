import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const UsedBidList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  const [tabState, setTabState] = useState(1);
  const [idxVal, setIdxVal] = useState('');

  const DATA = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      nick: '참좋은공장',
			title: '[스크랩] 스크랩 싸게 팝니다.1',	
			state: 1,
      sate2: 0,
			period: ' ~2023.07.30',
      price: '100,000',
      price2: '90,000',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			nick: '참좋은공장',
			title: '[스크랩] 스크랩 싸게 팝니다.2',		
			state: 1,
      sate2: 0,
			period: ' ~2023.07.30',
      price: '100,000',
      price2: '90,000',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			nick: '참좋은공장',
			title: '[스크랩] 스크랩 싸게 팝니다.3',
			state: 2,
      state2: 1,
			period: ' ~2023.07.30',
      price: '100,000',
      price2: '90,000',
		},
		{
			id: '68694a0f-3da1-471f-bd96-145571e29d72',
			nick: '참좋은공장',
			title: '[스크랩] 스크랩 싸게 팝니다.4',
			state: 2,
      state2: 2,
			period: ' ~2023.07.30',
      price: '100,000',
      price2: '90,000',
		},
    {
			id: '68694a0f-3da1-471f-bd96-145571e29d72',
			nick: '참좋은공장',
			title: '[스크랩] 스크랩 싸게 팝니다.5',
			state: 2,
      state2: 3,
			period: ' ~2023.07.30',
      price: '100,000',
      price2: '90,000',
		},
	];

  const dataLen = DATA.length;

  const getList = ({item, index}) => (    
    item.state == tabState ? (
    <View style={[styles.matchCompleteMb, index == 0 ? styles.matchCompleteMbFst : null, index != dataLen ? styles.borderBot : null, index != 0 ? styles.borderTop : null]}>
      <View style={[styles.compBtn]}>
        <View style={[styles.compWrap, styles.compWrapFst]}>
          <View style={styles.compInfo}>
            <View style={styles.compInfoDate}>
              {tabState == 1 ? (
              <Text style={styles.compInfoDateText}>판매자 공장 : {item.nick}</Text>
              ) : null}

              {tabState == 2 ? (
              <Text style={styles.compInfoDateText}>구매자 공장 : {item.nick}</Text>
              ) : null}
            </View>
            <View style={styles.compInfoName}>
              <Text style={styles.compInfoNameText}>{item.title}</Text>
            </View>
            <View style={styles.compInfoLoc}>
              <AutoHeightImage width={12} source={require("../../assets/img/icon_calendar2.png")}  style={styles.compInfoLocImg}/>
              <Text style={styles.compInfoLocText}>입찰기간 : {item.period}</Text>
            </View>
          </View>
          <View style={styles.compThumb}>
            <AutoHeightImage width={63} source={require("../../assets/img/sample1.jpg")} />
          </View>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>판매가</Text>
          <Text style={styles.matchPriceText2}>{item.price}원</Text>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>제안가</Text>
          <Text style={styles.matchPriceText2}>{item.price2}원</Text>
        </View>
      </View>
      
      <View style={styles.btnBox}>
        {tabState == 1 ? (
        <>
          <TouchableOpacity
            style={[styles.btn]}
            activeOpacity={opacityVal}
            onPress={()=>{
              
            }}
          >
            <Text style={styles.btnText}>거절</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btn2]}
            activeOpacity={opacityVal}
            onPress={()=>{
              
            }}
          >
            <Text style={styles.btnText}>승인</Text>
          </TouchableOpacity>
        </>
        ) : null }

        {tabState == 2 ? (
        <>
          {item.state2 == 1 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{
              
            }}
          >
            <Text style={styles.btnText}>취소</Text>
          </TouchableOpacity>
          ) : null }

          {item.state2 == 2 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3, styles.btn4]}
            activeOpacity={opacityVal}
            onPress={()=>{
              
            }}
          >
            <Text style={[styles.btnText, styles.btnText2]}>가격 입찰 제안이 거절되었습니다.</Text>
          </TouchableOpacity>
          ) : null }

          {item.state2 == 3 ? (
          <>
          <View style={styles.btn3TextBox}>
            <Text style={styles.btn3TextBoxText}>가격 입찰 제안이 수락되었습니다.</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{
              navigation.navigate('ChatRoom', {});
            }}
          >
            <Text style={styles.btnText}>채팅하기</Text>
          </TouchableOpacity>
          </>
          ) : null }
        </>
        ) : null }
      </View>  
    </View>
    ) : null
	);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setIsLoading(false);
        setTabState(1);
        setIdxVal('');
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

  useEffect(() => {
    setTimeout(function(){
      setIsLoading(true);
    }, 1000);
  }, []);

  function fnTab(v){
    setIsLoading(false);
    setTabState(v);
    setTimeout(function(){
      setIsLoading(true);
    }, 1000);
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
			{isLoading ? (
        <FlatList
				data={DATA}
				renderItem={(getList)}
				keyExtractor={item => item.id}		
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 입찰내역이 없습니다.</Text>
					</View>
				}
			/>
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
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},  
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
  btn3TextBox: {},
})

export default UsedBidList