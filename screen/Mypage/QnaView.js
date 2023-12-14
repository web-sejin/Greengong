import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const QnaView = ({navigation, route}) => {
  const idx = route.params.bd_idx;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [itemInfo, setItemInfo] = useState({});

	const isFocused = useIsFocused();

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'view_1to1', {is_api: 1, bd_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson);
				setItemInfo(responseJson);
        setIsLoading(true);
			}else{
				console.log(responseJson.result_text);
			}
		});
  }

	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setIsLoading(false);
			}
		}else{
			//console.log("isFocused");
			if(route.params){
				//console.log("route on!!");
			}else{
				//console.log("route off!!");
			}
      getData();
			setRouteLoad(true);
			setPageSt(!pageSt);
		}
    Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  const sampleText = '시스템 점검 안내입니다.\n\n내용글입니다.';

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'1:1문의'} />
      {isLoading ? (
			<ScrollView>
        <View style={styles.boView}>
          <View style={styles.boViewTit}>
            {itemInfo.is_answer != 1 ? (
						<Text style={styles.noticeState1}>[답변대기]</Text>
						) : null}

						{itemInfo.is_answer == 1 ? (
						<Text style={styles.noticeState2}>[답변완료]</Text>
						) : null}
            <Text style={styles.boViewTitText}>{itemInfo.bd_title}</Text>
          </View>
          <View style={styles.boViewDesc}>
            <Text style={styles.boViewDescText}>{itemInfo.date}</Text>
          </View>
          <View style={styles.boViewCont}>
            <Text style={styles.boViewContText}>{itemInfo.bd_contents}</Text>
          </View>

          {itemInfo.is_answer == 1 ? (
						<View style={[styles.boViewCont, styles.boViewCont2]}>
              <View style={styles.boViewCont2Box}>
                <Text style={styles.boViewCont2BoxText}>[관리자 답변]</Text>
                <Text style={styles.boViewCont2BoxText2}>{itemInfo.answer_date}</Text>
              </View>
              <Text style={styles.boViewContText}>{itemInfo.bd_answer}</Text>
            </View>
					) : null}

          {itemInfo.is_answer != 1 ? (
          <TouchableOpacity 
            style={styles.boBackBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              navigation.navigate('QnaModify', {bd_idx:idx});
            }}
          >
            <Text style={styles.boBackBtnText}>수정하기</Text>
          </TouchableOpacity>
          ) : null}

          <TouchableOpacity 
            style={[styles.boBackBtn, styles.boBackBtn2]}
            activeOpacity={opacityVal}
            onPress={()=>{
              //navigation.navigate('QnaList');
              navigation.goBack();
            }}
          >
            <Text style={[styles.boBackBtnText, styles.boBackBtn2Text]}>목록으로</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  boView: {padding:20,paddingBottom:20,},
  boViewTit: {display:'flex',flexDirection:'row',alignItems:'center'},
  noticeState1: {width:87,fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#ED5F5F',},
	noticeState2: {width:87,fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#31B481'},
  boViewTitText: {width:(innerWidth-87),fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#191919',},
  boViewDesc: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,},
  boViewDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#191919'},
  boViewCont: {padding:20,paddingBottom:30,backgroundColor:'#fdfdfd',borderTopWidth:2,borderTopColor:'#191919',borderBottomWidth:1,borderBottomColor:'#ECECEC',marginTop:20,},
  boViewCont2: {borderTopWidth:1,marginTop:0,paddingTop:30,},
  boViewCont2Box: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10,},
  boViewCont2BoxText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:23,color:'#000'},
  boViewCont2BoxText2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:23,color:'#191919'},
  boViewContText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:23,color:'#000'},
  boBackBtn: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex', alignItems:'center', justifyContent:'center',marginTop:35,},  
  boBackBtnText:{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:22,color:'#fff'},
  boBackBtn2: {backgroundColor:'#fff',borderWidth:1,borderColor:'#000',marginTop:10,},
  boBackBtn2Text:{color:'#000'},
})

export default QnaView