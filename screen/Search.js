import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import Header from '../components/Header';

import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

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
	const [recKeyCnt, setRecKeyCnt] = useState(0);
	const [keyList, setKeyList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [itemList, setItemList] = useState([]);
	const [itemChk, setItemChk] = useState(false);	

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
			getRecKeyword();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	//최근검색어
	const getRecKeyword = async () => {
		setIsLoading(false);
		await Api.send('GET', 'list_recently_keyword', {'is_api': 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log('list_recently_keyword', responseJson);
				setKeyList(responseJson.data);
				setRecKeyCnt(responseJson.total_count);
			}else{
				console.log('결과 출력 실패!', responseJson);
			}
		});

		setIsLoading(true);
	}

	//검색 결과
	const getData = async (sch, tab) => {
		setIsLoading(false);
		let apiName = '';
		
		if(tab){
			if(tab == 1){
				apiName = 'list_search_product';
			}else{
				apiName = 'list_search_match';
			}
		}else{
			if(tabState == 1){
				apiName = 'list_search_product';
			}else{
				apiName = 'list_search_match';
			}
		}

		let keyTxt = schText;
		if(sch){
			keyTxt = sch;
		}

		setNowPage(1);
		await Api.send('GET', apiName, {is_api:1, keyword:keyTxt, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', arrItems);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson);
				setItemList(responseJson.data);
			}else{
				setItemList([]);
				console.log('결과 출력 실패!', responseJson);
			}
		});
		setItemChk(true);
		setIsLoading(true);
	}

	const getList = ({item, index}) => (
		<TouchableOpacity 
			style={[styles.listLi]}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('UsedView', {})
			}}
		>
			<>
			<View style={[styles.listLiBorder, index==0 ? styles.listLiBorderNot : null]}>
				{item.pd_image ? (
				<View style={styles.pdImage}>
					<AutoHeightImage width={131} source={{uri: item.pd_image}}  style={styles.listImg} />
				</View>
				):null}

				<View style={[styles.listInfoBox, item.pd_image ? null : styles.listInfoBox3]}>
					<View style={styles.listInfoTitle}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{item.pd_name}</Text>
					</View>
					<View style={styles.listInfoDesc}>
						<Text style={styles.listInfoDescText}>{item.pd_loc} · {item.pd_date}</Text>
					</View>
					<View style={styles.listInfoCate}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoCateText}>{item.pd_summary}</Text>
					</View>
					<View style={styles.listInfoCnt}>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={15} source={require("../assets/img/icon_star.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.mb_score}</Text>
						</View>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={14} source={require("../assets/img/icon_review.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.pd_chat_cnt}</Text>
						</View>
						<View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
							<AutoHeightImage width={16} source={require("../assets/img/icon_heart.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.pd_like_cnt}</Text>
						</View>
					</View>
					<View style={styles.listInfoPriceBox}>
						{item.is_free != 1 && item.pd_status_org == 1 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={styles.listInfoPrice}>
								<Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
							</View>
						</View>
						)
						:
						null
						}

						{item.is_free == 1 && item.pd_status_org == 1 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={[styles.listInfoPriceState, styles.listInfoPriceState2]}>
								<Text style={styles.listInfoPriceStateText}>나눔</Text>
							</View>
						</View>
						)
						: null}

						{item.pd_status_org == 2 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={[styles.listInfoPriceState, styles.listInfoPriceState1]}>
								<Text style={styles.listInfoPriceStateText}>예약중</Text>
							</View>
							{item.is_free != 1 ? (
							<View style={styles.listInfoPrice}>
								<Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
							</View>
							) : null }
						</View>
						)
						: null}

						{item.pd_status_org == 3 ? (
						<View style={[styles.listInfoPriceArea]}>
							<View style={[styles.listInfoPriceState, styles.listInfoPriceState3]}>
								<Text style={styles.listInfoPriceStateText}>판매완료</Text>
							</View>
							{item.is_free != 1 ? (
							<View style={styles.listInfoPrice}>
								<Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
							</View>
							) : null }
						</View>
						)
						: null}
					</View>
				</View>
			</View>
			</>
		</TouchableOpacity>
	);
	
	const getList2 = ({item, index}) => (
		<TouchableOpacity 
			style={[styles.listLi]}
			activeOpacity={opacityVal}
			onPress={() => {navigation.navigate('MatchView', {idx:item.mc_idx})}}
		>
			<>
			<View style={[styles.listLiBorder, index==0 ? styles.listLiBorderNot : null]}>
				{item.mc_image ? (
				<View style={[styles.pdImage, styles.pdImage2]}>
					<AutoHeightImage width={131} source={{uri: item.mc_image}}  style={styles.listImg} />
				</View>
				):null}
				<View style={[styles.listInfoBox, styles.listInfoBox2]}>
					<View style={styles.listInfoTitle}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{item.mc_name}</Text>
					</View>
					<View style={styles.listInfoDesc}>
						<Text style={styles.listInfoDescText}>{item.mc_loc} · {item.mc_date}</Text>
					</View>
					<View style={styles.listInfoCate}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoCateText}>{item.mc_summary}</Text>
					</View>
					<View style={styles.listInfoCnt}>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={15} source={require("../assets/img/icon_star.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.mb_score}</Text>
						</View>
						<View style={styles.listInfoCntBox}>
							<AutoHeightImage width={14} source={require("../assets/img/icon_review.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.mc_chat_cnt}</Text>
						</View>
						<View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
							<AutoHeightImage width={16} source={require("../assets/img/icon_heart.png")}/>
							<Text style={styles.listInfoCntBoxText}>{item.mb_scrap_cnt}</Text>
						</View>
					</View>
				</View>
			</View>
			</>
		</TouchableOpacity>
	);

  function _submit(){
		if(schText == ''){
			ToastMessage('검색어를 입력해 주세요.');
			return false;
		}else{
			getData();
		}
  }

  function fnTab(v){
		setTabState(v);
		if(schText != ''){
			getData(schText, v);
		}else{
			setItemChk(false);
		}
  }

	//키워드 전체 삭제
	const deleteAll = async () => {
		Api.send('POST', 'alldel_recently_keyword', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);
				getRecKeyword();
			}else{
				console.log('결과 출력 실패!', resultItem);
			}
		});
	}

	//키워드 단일 삭제
	const deleteOne = async (rc_idx) => {
		const formData = {
			is_api:1,				
			rc_idx:rc_idx,
		};

		Api.send('POST', 'del_recently_keyword', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);
				getRecKeyword();
			}else{
				console.log('결과 출력 실패!', resultItem);
			}
		});
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
							placeholder={'상품명 또는 내용을 검색해 주세요.'}
							placeholderTextColor="#8791A1"
							style={[styles.input]}
							returnKyeType='done'
							onSubmitEditing={_submit}
						/>
						<TouchableOpacity 
							style={styles.faqSchBtn}
							activeOpacity={opacityVal}
							onPress={() => {_submit()}}
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
			
			{!itemChk && recKeyCnt>0 ? (
			<ScrollView>
				<View style={styles.recentBox}>
					<View style={styles.recentTit}>
						<Text style={styles.recentTitText}>최근 검색어</Text>
						<TouchableOpacity
							style={styles.recentTitReset}
							activeOpacity={opacityVal}
							onPress={()=>{deleteAll()}}
						>
							<Text style={styles.recentTitResetText}>전체삭제</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.recentList}>
						{keyList.map((item, index) => {
							return(
							<View 
								key={item.rc_idx} 
								style={[styles.recentLi, index!=0 ? styles.recentLi2 : null]}
							>
								<TouchableOpacity
									style={styles.recentSchBtn}
									activeOpacity={opacityVal}
									onPress={()=>{
										setSchText(item.rc_keyword);
										getData(item.rc_keyword, '');
									}}
								>
									<Text style={styles.recentSchBtnText}>{item.rc_keyword}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.recentSchDel}
									activeOpacity={opacityVal}
									onPress={()=>{deleteOne(item.rc_idx)}}
								>
									<AutoHeightImage width={11} source={require("../assets/img/icon_close.png")} />
								</TouchableOpacity>
							</View>
							)
						})}
					</View>
				</View>
			</ScrollView>
			) : null}
			
			{!itemChk && recKeyCnt<1 ? (
			<View style={styles.notData}>
				<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
				<Text style={styles.notDataText}>최근에 검색한 내용이 없습니다.</Text>
			</View>
			) : null}

			{isLoading ? (
				itemChk ? (
					tabState == 1 ? (
					<FlatList
						data={itemList}
						renderItem={(getList)}
						keyExtractor={(item, index) => index.toString()}
						ListEmptyComponent={
							<View style={styles.notData}>
								<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
								<Text style={styles.notDataText}>검색어와 일치하는 상품이 없습니다.</Text>
							</View>
						}
					/>
					) : (
						<FlatList
							data={itemList}
							renderItem={(getList2)}
							keyExtractor={(item, index) => index.toString()}
							ListEmptyComponent={
								<View style={styles.notData}>
									<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
									<Text style={styles.notDataText}>검색어와 일치하는 매칭이 없습니다.</Text>
								</View>
							}
						/>
					)
				) : null
			):(
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
	pdImage: {width:131,height:131,borderRadius:12,overflow:'hidden'},
	pdImage2: {width:99,height:99},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 131),paddingLeft:15,},
	listInfoBox2: {width:(innerWidth - 99)},
	listInfoBox3 : {width:innerWidth,paddingLeft:0,},
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
	listInfoPriceState3: {width:64,backgroundColor:'#353636'},
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