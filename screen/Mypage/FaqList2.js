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

const FaqList2 = ({navigation, route}) => {
  const sct = route.params.filter;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [schText, setSchText] = useState(sct);
	const [isLoading, setIsLoading] = useState(true);  
	const [itemList, setItemList] = useState([]);
	const [nowPage, setNowPage] = useState(1);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        //setSchText('');
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

	const getItemList = async () =>{
		setIsLoading(false);

		await Api.send('GET', 'list_faq', {is_api: 1, page:1, keyword:schText}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson.data);
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
			style={styles.faqContBtn}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('FaqView', {pageLoc:'FaqList2', bd_idx:item.bd_idx});
			}}
		>
			<View style={styles.faqContBtnWrap}>
				<Text style={styles.faqContBtnText}>{item.bd_title}</Text>
				<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
			</View>
		</TouchableOpacity>
	);

	const moreData = async () => {
		await Api.send('GET', 'list_faq', {'is_api': 1, page:nowPage+1, keyword:schText}, (args)=>{
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

  function _submit(){
		if(schText == ''){
			ToastMessage('검색어를 입력해 주세요.');
			return false;
		}
    getItemList();
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'고객센터'} />			

			{isLoading ? (
			<FlatList
				data={itemList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}	
				onEndReachedThreshold={0.6}
				onEndReached={moreData}
				ListHeaderComponent={
					<>
					<View style={styles.faqList}>
						<View style={styles.faqListWrap}>
							<View style={styles.faqSch}>
								<View style={styles.faqSchBox}>
									<TextInput
										value={schText}
										onChangeText={(v) => {setSchText(v)}}
										//placeholder={''}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
									<TouchableOpacity 
										style={styles.faqSchBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											_submit();
										}}
									>                
										<AutoHeightImage width={16} source={require("../../assets/img/icon_search.png")} />
									</TouchableOpacity>
								</View>
								<TouchableOpacity 
									style={styles.faqSchCancel}
									activeOpacity={opacityVal}
									onPress={() => {
										//navigation.navigate('FaqList');
										navigation.goBack()
									}}
								>
									<Text style={styles.faqSchCancelText}>취소</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					</>
				}
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 FAQ가 없습니다.</Text>
					</View>
				}
			/>
			) : (
			<View style={[styles.indicator]}>
				<ActivityIndicator size="large" />
			</View>
			)}
			
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('QnaList');
					}}
				>
					<Text style={styles.nextBtnText}>1:1문의</Text>
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
	faqList: {padding:20,paddingTop:10,paddingBottom:0,},
	faqListWrap: {paddingBottom:20,borderBottomWidth:2,borderColor:'#191919',},
	faqSch: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  faqSchBox: {width:(innerWidth-45),display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#C5C5C6',borderRadius:12,paddingLeft:15,paddingRight:5,},
  input: {width:(innerWidth-101),height:48,fontSize:15,color:'#000'},
  faqSchBtn: {display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,},
  faqSchCancel: {display:'flex',alignItems:'flex-end',justifyContent:'center',width:35,height:48,},
	faqSchCancelText: {fontFamily:Font.NotoSansRegular,fontSize:14,color:'#000'},
  faqCont: {borderTopWidth:2,borderColor:'#191919',marginTop:20,},
	faqContBtn: {paddingHorizontal:20,},
	faqContBtnWrap: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:25,borderBottomWidth:1,borderColor:'#E2E2E2'},
	faqContBtnText: {width:(innerWidth-22),fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#000'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},

	notData: {height:(widnowHeight-320),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default FaqList2