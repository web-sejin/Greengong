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

const FaqList = ({navigation, route}) => {
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
	
	const getItemList = async () =>{
		setIsLoading(false);

		await Api.send('GET', 'list_faq', {is_api: 1, page:1}, (args)=>{
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
			style={styles.faqContBtn}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('FaqView', {pageLoc:'FaqList', bd_idx:item.bd_idx});
			}}
		>
			<View style={styles.faqContBtnWrap}>
				<Text style={styles.faqContBtnText}>{item.bd_title}</Text>
				<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
			</View>
		</TouchableOpacity>
	);

	const moreData = async () => {
		await Api.send('GET', 'list_faq', {'is_api': 1, page:nowPage+1}, (args)=>{
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
									<View style={styles.faqListTextBox}>
										<Text style={styles.faqListText}>검색 기능을 사용하면 빠르게 답을 얻을 수 있습니다.</Text>
									</View>

									<TouchableOpacity
										style={styles.schBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											navigation.navigate('FaqList2', {filter:''});
										}}
									>
										<AutoHeightImage width={14} source={require("../../assets/img/icon_sch.png")} />
										<Text style={styles.schBtnText}>검색어를 입력해 주세요.</Text>
									</TouchableOpacity>

									<View style={styles.tabBox}>
										<TouchableOpacity
											style={styles.tabBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {
												navigation.navigate('FaqList2', {filter:'운영'});
											}}
										>
											<Text style={styles.tabBoxBtnText}>운영</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.tabBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {
												navigation.navigate('FaqList2', {filter:'계정'});
											}}
										>
											<Text style={styles.tabBoxBtnText}>계정</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.tabBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {
												navigation.navigate('FaqList2', {filter:'거래'});
											}}
										>
											<Text style={styles.tabBoxBtnText}>거래</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.tabBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {
												navigation.navigate('FaqList2', {filter:'견적'});
											}}
										>
											<Text style={styles.tabBoxBtnText}>견적</Text>
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
	faqList: {padding:20,paddingBottom:0,},
	faqListWrap: {paddingBottom:20,borderBottomWidth:2,borderColor:'#191919',},
	faqListTextBox: {},
	faqListText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:21,color:'#000'},
	schBtn: {display:'flex',flexDirection:'row',alignItems:'center',padding:15,borderRadius:12,backgroundColor:'#F2F2F2',marginTop:15,},
	schBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#C5C5C6',marginLeft:10,},
	tabBox: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:5,},
	tabBoxBtn: {display:'flex',alignItems:'center',justifyContent:'center',height:32,paddingHorizontal:15,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:30,marginTop:10,marginRight:10,},	
	tabBoxBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:20,color:'#C5C5C6',},

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

export default FaqList