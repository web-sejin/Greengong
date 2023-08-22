import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import Header from '../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const SearchList = ({navigation, route}) => {
	const backPage = route.params.backPage;
	const tabNumber = route.params.tab;
	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
  const [schText, setSchText] = useState('');	
	const [tabState, setTabState] = useState(tabNumber);

	const DATA = [
		// {
		// 	id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
		// 	title: '거의 사용하지 않은 스크랩 거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '스크랩',
		// 	naviPage: 'UsedWrite1',
		// 	stateVal: '',
		// },
		// {
		// 	id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
		// 	title: '거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '중고자재',
		// 	naviPage: 'UsedWrite2',
		// 	stateVal: '나눔',
		// },
		// {
		// 	id: '58694a0f-3da1-471f-bd96-145571e29d72',
		// 	title: '거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '중고기계/장비',
		// 	naviPage: 'UsedWrite3',
		// 	stateVal: '입찰',
		// },
		// {
		// 	id: '68694a0f-3da1-471f-bd96-145571e29d72',
		// 	title: '거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '폐기물',
		// 	naviPage: 'UsedWrite4',
		// 	stateVal: '',
		// },
		// {
		// 	id: '78694a0f-3da1-471f-bd96-145571e29d72',
		// 	title: '거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '스크랩',
		// 	naviPage: 'UsedWrite1',
		// 	stateVal: '',
		// },
		// {
		// 	id: '88694a0f-3da1-471f-bd96-145571e29d72',
		// 	title: '거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '스크랩',
		// 	naviPage: 'UsedWrite1',
		// 	stateVal: '',
		// },
		// {
		// 	id: '98694a0f-3da1-471f-bd96-145571e29d72',
		// 	title: '거의 사용하지 않은 스크랩',
		// 	desc: '김포시 고촌읍 · 3일전',
		// 	cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
		// 	score: 2,
		// 	review: 8,
		// 	like: 5,
		// 	price: '20,000',
		// 	category: '스크랩',
		// 	naviPage: 'UsedWrite1',
		// 	stateVal: '',
		// },
	];
	
	const getList = ({item, index}) => (
		<TouchableOpacity 
			style={[styles.listLi]}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('UsedView', {category:item.category, naviPage:item.naviPage, stateVal:item.stateVal})
			}}
		>
			<>
			<View style={[styles.listLiBorder, index==0 ? styles.listLiBorderNot : null]}>
				<AutoHeightImage width={131} source={require("../assets/img/sample1.jpg")} style={styles.listImg} />
				<View style={styles.listInfoBox}>
					<View style={styles.listInfoTitle}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
							{item.title}
						</Text>
					</View>
					<View style={styles.listInfoDesc}>
						<Text style={styles.listInfoDescText}>{item.desc}</Text>
					</View>
					<View style={styles.listInfoCate}>
						<Text style={styles.listInfoCateText}>{item.cate}</Text>
					</View>
					<View style={styles.listInfoCnt}>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={15} source={require("../assets/img/icon_star.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.score}</Text>
						</View>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={14} source={require("../assets/img/icon_review.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.review}</Text>
						</View>
						<View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
							<AutoHeightImage width={16} source={require("../assets/img/icon_heart.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.like}</Text>
						</View>
					</View>
					<View style={styles.listInfoPriceBox}>
						{index == 0 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={[styles.listInfoPriceState, styles.listInfoPriceState1]}>
								<Text style={styles.listInfoPriceStateText}>예약중</Text>
							</View>
							<View style={styles.listInfoPrice}>
								<Text style={styles.listInfoPriceText}>200,000,000원</Text>
							</View>
						</View>
						)
						:
						null
						}

						{index == 1 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={[styles.listInfoPriceState, styles.listInfoPriceState2]}>
								<Text style={styles.listInfoPriceStateText}>나눔</Text>
							</View>
						</View>
						)
						:
						null
						}

						{index >= 2 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={styles.listInfoPrice}>
								<Text style={styles.listInfoPriceText}>200,000,000원</Text>
							</View>
						</View>
						)
						:
						null
						}
					</View>
				</View>
			</View>
			</>
		</TouchableOpacity>
	);

	const DATA2 = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: '거의 사용하지 않은 스크랩 거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
		{
			id: '68694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
		{
			id: '78694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
		{
			id: '88694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
		{
			id: '98694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: 'CNC가공',
		},
	];
	
	const getList2 = ({item, index}) => (
		<TouchableOpacity 
			style={[styles.listLi]}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('MatchView', {category:item.category})
			}}
		>
			<>
			<View style={[styles.listLiBorder, index==0 ? styles.listLiBorderNot : null]}>
				<AutoHeightImage width={99} source={require("../assets/img/sample1.jpg")} style={styles.listImg} />
				<View style={[styles.listInfoBox, styles.listInfoBox2]}>
					<View style={styles.listInfoTitle}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
							{item.title}
						</Text>
					</View>
					<View style={styles.listInfoDesc}>
						<Text style={styles.listInfoDescText}>{item.desc}</Text>
					</View>
					<View style={styles.listInfoCate}>
						<Text style={styles.listInfoCateText}>{item.cate}</Text>
					</View>
					<View style={styles.listInfoCnt}>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={15} source={require("../assets/img/icon_star.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.score}</Text>
						</View>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={14} source={require("../assets/img/icon_review.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.review}</Text>
						</View>
						<View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
							<AutoHeightImage width={16} source={require("../assets/img/icon_heart.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.like}</Text>
						</View>
					</View>
				</View>
			</View>
			</>
		</TouchableOpacity>
	);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        //setIsLoading(false);
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

  function _submit(){
    console.log("search!");
  }

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
			<Header navigation={navigation} headertitle={'검색'} />
			<View style={styles.faqList}>
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
							<AutoHeightImage width={16} source={require("../assets/img/icon_search.png")} />
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={styles.faqSchCancel}
						activeOpacity={opacityVal}
						onPress={() => {
							navigation.navigate(backPage);
						}}
					>
						<Text style={styles.faqSchCancelText}>취소</Text>
					</TouchableOpacity>
				</View>
			</View>				
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
						<Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>매칭</Text>
						<View style={styles.tabLine}></View>
						</>
					) : (
						<Text style={styles.tabBtnText}>매칭</Text>  
					)}
				</TouchableOpacity>
			</View>
			
			<ScrollView>
				<View style={styles.recentBox}>
					<View style={styles.recentTit}>
						<Text style={styles.recentTitText}>최근 검색어</Text>
						<TouchableOpacity
							style={styles.recentTitReset}
							activeOpacity={opacityVal}
							onPress={()=>{}}
						>
							<Text style={styles.recentTitResetText}>전체삭제</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.recentList}>
						<View style={styles.recentLi}>
							<TouchableOpacity
								style={styles.recentSchBtn}
								activeOpacity={opacityVal}
								onPress={()=>{setSchText('익선동')}}
							>
								<Text style={styles.recentSchBtnText}>익선동</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.recentSchDel}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<AutoHeightImage width={11} source={require("../assets/img/icon_close.png")} />
							</TouchableOpacity>
						</View>

						<View style={[styles.recentLi, styles.recentLi2]}>
							<TouchableOpacity
								style={styles.recentSchBtn}
								activeOpacity={opacityVal}
								onPress={()=>{setSchText('우주선')}}
							>
								<Text style={styles.recentSchBtnText}>우주선</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.recentSchDel}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<AutoHeightImage width={11} source={require("../assets/img/icon_close.png")} />
							</TouchableOpacity>
						</View>

						<View style={[styles.recentLi, styles.recentLi2]}>
							<TouchableOpacity
								style={styles.recentSchBtn}
								activeOpacity={opacityVal}
								onPress={()=>{setSchText('자동차')}}
							>
								<Text style={styles.recentSchBtnText}>자동차</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.recentSchDel}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<AutoHeightImage width={11} source={require("../assets/img/icon_close.png")} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* <View style={styles.notData}>
				<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
				<Text style={styles.notDataText}>최근에 검색한 내용이 없습니다.</Text>
			</View> */}

						  
			{/* {isLoading ? (
				tabState == 1 ? (
					<FlatList
						data={DATA}
						renderItem={(getList)}
						keyExtractor={item => item.id}
						ListEmptyComponent={
							<View style={styles.notData}>
								<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
								<Text style={styles.notDataText}>검색어와 일치하는 상품이 없습니다.</Text>
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
								<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
								<Text style={styles.notDataText}>검색어와 일치하는 매칭이 없습니다.</Text>
							</View>
						}
					/>
				)
			) : (
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" />
        </View>
      )} */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
	faqList: {padding:20,paddingVertical:10,},
	faqSch: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  faqSchBox: {width:(innerWidth-45),display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#C5C5C6',borderRadius:12,paddingLeft:15,paddingRight:5,},
  input: {width:(innerWidth-101),height:48,fontSize:15,color:'#000'},
  faqSchBtn: {display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,},
  faqSchCancel: {display:'flex',alignItems:'flex-end',justifyContent:'center',width:35,height:48,},
	faqSchCancelText: {fontFamily:Font.NotoSansRegular,fontSize:14,color:'#000'},  
	tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},

	listLi: {paddingHorizontal:20,},
	listLiBorder: {flexDirection:'row',paddingVertical:20,borderTopWidth:1,borderTopColor:'#E9EEF6'},
	listLiBorderNot: {borderTopWidth:0,},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 131),paddingLeft:15,},
	listInfoBox2: {width:(innerWidth - 99)},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},
	listInfoCate: {marginTop:5},
	listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#353636'},
	listInfoCnt: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	listInfoCntBox: {display:'flex',flexDirection:'row',alignItems:'center',marginRight:15,},
	listInfoCntBox2: {marginRight:0},
	listInfoCntBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#000',marginLeft:4,},
	listInfoPriceBox: {marginTop:8},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},

	notData: {height:(widnowHeight-350),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},

	recentBox: {padding:20,},
	recentTit: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	recentTitText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:19,color:'#818181',},
	recentTitReset: {},
	recentTitResetText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#818181',},
	recentList: {marginTop:15,},
	recentLi: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	recentLi2: {marginTop:9,},
	recentSchBtn: {width:(innerWidth-41),paddingVertical:8,},
	recentSchBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#000'},
	recentSchDel: {width:31,paddingVertical:10,alignItems:'flex-end',},
})

export default SearchList