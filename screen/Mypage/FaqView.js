import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const FaqView = ({navigation, route}) => {
  const backPage = route.params.pageLoc;
	const idx = route.params.bd_idx;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(true); 
  const [itemInfo, setItemInfo] = useState({});

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setPageSt(false);
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
    await Api.send('GET', 'view_faq', {is_api: 1, bd_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson);
				setItemInfo(responseJson);
        setIsLoading(true);
			}else{		
				console.log(responseJson.result_text);
				//console.log('결과 출력 실패!');
			}
		});
  }

  useEffect(() => {
    getData();
  }, []);

  const sampleText = '시스템 점검 안내입니다.\n\n내용글입니다.';

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'고객센터'} />
			{isLoading ? (
			<ScrollView>
        <View style={styles.boView}>
          <View style={styles.boViewTit}>
            <Text style={styles.boViewTitText}>{itemInfo.bd_title}</Text>
          </View>
          <View style={styles.boViewCont}>
            <Text style={styles.boViewContText}>{itemInfo.bd_contents}</Text>
          </View>
          <TouchableOpacity 
            style={styles.boBackBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              //navigation.navigate(backPage);
							navigation.goBack()
            }}
          >
            <Text style={styles.boBackBtnText}>목록으로</Text>
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
  boViewTit: {},
  boViewTitText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#191919',},
  boViewCont: {padding:20,paddingBottom:30,backgroundColor:'#fdfdfd',borderTopWidth:2,borderTopColor:'#191919',borderBottomWidth:1,borderBottomColor:'#ECECEC',marginTop:20,},
  boViewContText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:23,color:'#000'},
  boBackBtn: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#000',borderRadius:12,display:'flex', alignItems:'center', justifyContent:'center',marginTop:35,},
  boBackBtnText:{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:22,color:'#000'},
})

export default FaqView