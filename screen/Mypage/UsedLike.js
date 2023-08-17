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

const UsedLike = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
	const [tabState, setTabState] = useState(1);

  const DATA = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: '거의 사용하지 않은 스크랩 거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '100,000',
			category: '스크랩',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '120,000',
			category: '중고자재',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '110,000',
			category: '중고기계/장비',
		},
		{
			id: '68694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '90,000',
			category: '폐기물',
		},
		{
			id: '78694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '120,000',
			category: '스크랩',
		},
		{
			id: '88694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '70,000',
			category: '스크랩',
		},
		{
			id: '98694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			like: 5,
			price: '20,000',
			category: '스크랩',
		},
	];  

  const getList = ({item, index}) => (
		<View style={styles.borderBot}>
			<>
      <TouchableOpacity
        style={[styles.listLi]}
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('UsedView', {category:item.category, naviPage:item.naviPage, stateVal:item.stateVal})
        }}
      >    
        <AutoHeightImage width={73} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.title}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{item.desc}</Text>
          </View>
          <View style={styles.listInfoPriceBox}>
            <View style={[styles.listInfoPriceArea]}>
              <View style={styles.listInfoPrice}>
                <Text style={styles.listInfoPriceText}>{item.price}원</Text>
              </View>
            </View>					
          </View>        
          <View style={styles.listInfoStateBox}>
            <Text style={styles.listInfoStateBoxText}>판매완료</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listLikeBtn}
        activeOpacity={opacityVal}
        onPress={()=>{}}
      >
        <AutoHeightImage width={22} source={require("../../assets/img/icon_heart.png")} />
      </TouchableOpacity>
			</>
		</View>
	);

  const DATA2 = [
		{
			id: '1',
			title: '참좋은공장',
		},
		{
			id: '2',
			title: '참좋은공장2',
		},
		{
			id: '3',
			title: '참좋은공장3',
		},
	];

  const getList2 = ({item, index}) => (
		<View style={styles.borderBot}>
			<>
      <View style={[styles.listLi, styles.listLi2]}>   
        <TouchableOpacity
          style={styles.otherPeople}
          activeOpacity={opacityVal}
        >
          <AutoHeightImage width={50} source={require("../../assets/img/profile_img.png")} style={styles.listImg} />
        </TouchableOpacity> 
        <TouchableOpacity 
          style={[styles.listInfoBox, styles.listInfoBox2]}
          activeOpacity={opacityVal}
          onPress={() => {
            navigation.navigate('UsedLikeView', {category:item.category, naviPage:item.naviPage, stateVal:item.stateVal})
          }}
        >
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.title}
            </Text>
          </View>
          <View style={[styles.listLikeBtn, styles.listLikeBtn2]}>
            <AutoHeightImage width={22} source={require("../../assets/img/icon_heart.png")} />
          </View>
        </TouchableOpacity>
      </View>      
			</>
		</View>
	);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setIsLoading(false);
        setTabState(1);
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
      {isLoading ? (
        tabState == 1 ? (
          <FlatList
            data={DATA}
            renderItem={(getList)}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 관심 중고상품이 없습니다.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={DATA2}
            renderItem={(getList2)}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 관심 판매자가 없습니다.</Text>
              </View>
            }
          />
        )
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
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  listLi: {display:'flex',flexDirection:'row',alignItems:'center',padding:20,},
  listLi2: {alignItems:'stretch',paddingVertical:0,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
  otherPeople: {paddingVertical:20,},
	listImg: {borderRadius:50},
	listInfoBox: {width:(innerWidth - 73),paddingLeft:15,paddingRight:40,position:'relative',},
  listInfoBox2: {width:(innerWidth - 50),height:90,display:'flex',justifyContent:'center'},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:5},
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

export default UsedLike