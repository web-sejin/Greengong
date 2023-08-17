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

const QnaList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

  const DATA = [
		{
			id: '1',
      title: '시스템 점검 안내',
			date: '2023.02.02',
			state: 1,
		},
		{
			id: '2',
      title: '시스템 점검 안내2',
			date: '2023.02.02',
			state: 2,
		},
		{
			id: '3',
      title: '시스템 점검 안내2',
			date: '2023.02.02',
			state: 2,
		},
	];

  const dataLen = DATA.length;

  const getList = ({item, index}) => (    
    <TouchableOpacity
      style={styles.noticeBtn}
      activeOpacity={opacityVal}
      onPress={()=>{
        navigation.navigate('QnaView', {idx:item.id, state:item.state})
      }}
    >
      <View style={[styles.noticeWrap]}>
        <View style={styles.noticeListCont}>
          <View style={styles.noticeTit}>
            <Text style={styles.noticeTitText}>문의합니다.</Text>
          </View>
          <View style={styles.noticeDate}>
						{item.state == 1 ? (
						<Text style={styles.noticeState1}>[답변대기]</Text>
						) : null}

						{item.state == 2 ? (
						<Text style={styles.noticeState2}>[답변완료]</Text>
						) : null}
            <Text style={styles.noticeDateText}>2023.02.02</Text>
          </View>
        </View>
        <AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
      </View>
    </TouchableOpacity>
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
			<Header navigation={navigation} headertitle={'1:1문의'} />
			<FlatList
				data={DATA}
				renderItem={(getList)}
				keyExtractor={item => item.id}		
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 문의가 없습니다.</Text>
					</View>
				}
      />
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('QnaWrite');
					}}
				>
					<Text style={styles.nextBtnText}>문의하기</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  noticeBtn: {paddingHorizontal:20,},
  noticeWrap: {paddingVertical:20,borderBottomWidth:1,borderColor:'#EDEDED',display:'flex',flexDirection:'row',alignItems:'center'},
  noticeListCont: {width:(innerWidth-17),},
  noticeTit: {},
  noticeTitText: {fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:22,color:'#000'},
  noticeDate: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:12,},
	noticeState1: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#ED5F5F'},
	noticeState2: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#31B481'},
  noticeDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#9C9C9C',marginLeft:8,},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default QnaList