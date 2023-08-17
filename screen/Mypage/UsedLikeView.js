import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import UsedLike from './UsedLike';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const UsedLikeView = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

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
			</>
		</View>
	);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
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
			<Header navigation={navigation} headertitle={'관심목록'} />    
      <FlatList
        data={DATA}
        renderItem={(getList)}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={[styles.listLi, styles.listLi2, styles.borderBot]}>
            <>
            <TouchableOpacity
              style={styles.otherPeople}
              activeOpacity={opacityVal}
            >
              <AutoHeightImage width={50} source={require("../../assets/img/profile_img.png")} style={styles.listImg} />
            </TouchableOpacity>
            <View style={[styles.listInfoBox, styles.listInfoBox2]}>
              <View style={styles.listInfoTitle}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>참좋은공장</Text>
              </View>
              <View style={[styles.listLikeBtn, styles.listLikeBtn2]}>
                <AutoHeightImage width={22} source={require("../../assets/img/icon_heart.png")} />
              </View>
            </View>            
            </>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.notData}>
            <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
            <Text style={styles.notDataText}>등록된 관심 중고상품이 없습니다.</Text>
          </View>
        }
      />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  listLi: {display:'flex',flexDirection:'row',alignItems:'center',padding:20,},
  listLi2: {alignItems:'stretch',paddingVertical:0,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
  otherPeople: {paddingVertical:20,},
	listImg: {borderRadius:50},
	listInfoBox: {width:(innerWidth - 73),paddingLeft:15,position:'relative'},
  listInfoBox2: {width:(innerWidth - 50),height:90,display:'flex',justifyContent:'center'},
  listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
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
})

export default UsedLikeView