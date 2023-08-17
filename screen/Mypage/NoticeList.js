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

const NoticeList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

  const DATA = [
		{
			id: '1',
      title: '시스템 점검 안내',
			date: '2023.02.02',
		},
		{
			id: '2',
      title: '시스템 점검 안내2',
			date: '2023.02.02',
		},
		{
			id: '3',
      title: '시스템 점검 안내2',
			date: '2023.02.02',
		},
	];

  const dataLen = DATA.length;

  const getList = ({item, index}) => (    
    <TouchableOpacity
      style={styles.noticeBtn}
      activeOpacity={opacityVal}
      onPress={()=>{
        navigation.navigate('NoticeView', {idx:item.id})
      }}
    >
      <View style={[styles.noticeWrap]}>
        <View style={styles.noticeListCont}>
          <View style={styles.noticeTit}>
            <Text style={styles.noticeTitSort}>[공지]</Text>
            <Text style={styles.noticeTitText}>시스템 점검 안내</Text>
          </View>
          <View style={styles.noticeDate}>
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
			<Header navigation={navigation} headertitle={'공지사항'} />
			<FlatList
				data={DATA}
				renderItem={(getList)}
				keyExtractor={item => item.id}		
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 공지사항이 없습니다.</Text>
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
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  noticeBtn: {paddingHorizontal:20,},
  noticeWrap: {paddingVertical:20,borderBottomWidth:1,borderColor:'#EDEDED',display:'flex',flexDirection:'row',alignItems:'center'},
  noticeListCont: {width:(innerWidth-17),},
  noticeTit: {display:'flex',flexDirection:'row',alignItems:'center'},
  noticeTitSort: {width:45,fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:22,color:'#000'},
  noticeTitText: {width:(innerWidth-62),fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:22,color:'#000'},
  noticeDate: {marginTop:12,},
  noticeDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#9C9C9C'},
})

export default NoticeList