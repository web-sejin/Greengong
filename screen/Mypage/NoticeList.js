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

const NoticeList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(true);  
	const [itemList, setItemList] = useState([]);
	const [nowPage, setNowPage] = useState(1);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setIsLoading(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	const getItemList = async () =>{
		setIsLoading(false);

		await Api.send('GET', 'list_notice', {is_api: 1, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson.data);
				setItemList(responseJson.data);
			}else{
				setItemList([]);
				setNowPage(1);
				console.log('결과 출력 실패!');
			}
		});

		setIsLoading(true);
	}

	useState(()=>{
		getItemList();
	},[]);

  const getList = ({item, index}) => (    
    <TouchableOpacity
      style={styles.noticeBtn}
      activeOpacity={opacityVal}
      onPress={()=>{
        navigation.navigate('NoticeView', {bd_idx:item.bd_idx})
      }}
    >
      <View style={[styles.noticeWrap]}>
        <View style={styles.noticeListCont}>
          <View style={styles.noticeTit}>
            {/* <Text style={styles.noticeTitSort}>[공지]</Text> */}
            <Text style={styles.noticeTitText} numberOfLines={1} ellipsizeMode='tail'>{item.bd_title}</Text>
          </View>
          <View style={styles.noticeDate}>
            <Text style={styles.noticeDateText}>{item.date}</Text>
          </View>
        </View>
        <AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
      </View>
    </TouchableOpacity>
	);

	const moreData = async () => {
		console.log('moreData');
		await Api.send('GET', 'list_notice', {'is_api': 1, page:nowPage+1}, (args)=>{
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
				console.log('결과 출력 실패!');
			}
		});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'공지사항'} />
			{isLoading ? (
			<FlatList
				data={itemList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}	
				onEndReachedThreshold={0.6}
				onEndReached={moreData}
				disableVirtualization={false}
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 공지사항이 없습니다.</Text>
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
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  noticeBtn: {paddingHorizontal:20,},
  noticeWrap: {paddingVertical:20,borderBottomWidth:1,borderColor:'#EDEDED',display:'flex',flexDirection:'row',alignItems:'center'},
  noticeListCont: {width:(innerWidth-7),paddingRight:15,},
  noticeTit: {display:'flex',flexDirection:'row',alignItems:'center'},
  noticeTitSort: {width:45,fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:22,color:'#000'},
  noticeTitText: {/*width:(innerWidth-62),*/fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:22,color:'#000'},
  noticeDate: {marginTop:12,},
  noticeDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#9C9C9C'},
})

export default NoticeList