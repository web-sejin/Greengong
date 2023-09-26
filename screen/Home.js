import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, BackHandler, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from "../assets/common/Font"
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const filterListData = [
	{'idx': 1, 'txt': '스크랩', 'isChecked': false},
	{'idx': 2, 'txt': '중고자재', 'isChecked': false},
	{'idx': 3, 'txt': '중고기계/장비', 'isChecked': false},
	{'idx': 4, 'txt': '폐기물', 'isChecked': false},
];

const Home = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const {params} = route	
	const [searchVal, setSearchVal] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [scrollEvent, setScrollEvent] = useState(new Animated.Value(1))	
	const [scrollEvent2, setScrollEvent2] = useState(new Animated.Value(0))
	const [scrollEvent3, setScrollEvent3] = useState(new Animated.Value(98))
  const [scroll, setScroll] = useState(1);
	const [scroll2, setScroll2] = useState(0);
	const [scroll3, setScroll3] = useState(98);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [visible3, setVisible3] = useState(false);
	const [filterList, setFilterList] = useState(filterListData); //개별선택
	const [filterList2, setFilterList2] = useState(filterListData); //개별선택
	const [filterAry, setFilterAry] = useState('');
	const [filterLen, setFilterLen] = useState(0);
	const [allFilter, setAllFilter] = useState(false); //모두 선택
	const [itemList, setItemList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [myInfo, setMyInfo] = useState({});
	const [myFac, setMyFac] = useState({});
	const [myFacOn, setMyFacOn] = useState('');
	const [initLoading, setInitLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const isFocused = useIsFocused();
	useEffect(()=>{
		getMyInfo();
		//console.log("initLoading : ",initLoading);
		//console.log("isSubmit : ",params?.isSubmit);
		if(!initLoading){
			getItemList();
			setInitLoading(true);
		}else if(params?.isSubmit){
			setNowPage(1);
			getItemList();
			delete params?.isSubmit
		}

		AsyncStorage.getItem('mainReload', (err, result) => {
			//console.log("result : ",result);
			if(result == 'on'){
				setNowPage(1);
				getItemList();
				delete params?.isSubmit;
				AsyncStorage.removeItem('mainReload');
			}
		});
	},[isFocused]);

	//회원 정보
	const getMyInfo = async () => {		
		await Api.send('GET', 'get_member_info', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson);
        setMyInfo(responseJson);
				setMyFac(responseJson.fac_info);
				
				if(responseJson.fac_info[0].fc_use == 1){
					setMyFacOn("공장1("+responseJson.fac_info[0].fc_dong+")");
				}else if(responseJson.fac_info[1].fc_use == 1){
					setMyFacOn("공장2("+responseJson.fac_info[0].fc_dong+")");
				}
				// const fcUse = (responseJson.fac_info).find(item=> item.fc_use==1);
				// const fcUseText = fcUse.fc_name+"("+fcUse.fc_dong+")";
				// setMyFacOn(fcUseText);
			}else{
				console.log(responseJson.result_text);
			}
		});  
	}

	//중고 리스트
	const getItemList = async () =>{
		setIsLoading(false);
		setRefreshing(true);
		await Api.send('GET', 'list_product', {'is_api': 1, c1_idx:filterAry, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log("list_product : ",responseJson);
				setItemList(responseJson.data);
				setTotalPage(responseJson.total_page);
				setNowPage(1);
			}else{
				setItemList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson);
			}
		});

		setIsLoading(true);
		setRefreshing(false);
	}

	//중고 리스트 무한 스크롤
	const moreData = async () => {
		//console.log("nowPage : ",nowPage);
		if(totalPage > nowPage){
			await Api.send('GET', 'list_product', {is_api: 1, c1_idx:filterAry, page:nowPage+1}, (args)=>{
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
					console.log(responseJson);
					console.log('결과 출력 실패!');
				}
			});
		}
	}	

	useEffect(()=>{
		if(initLoading){
			setNowPage(1);
			getItemList();			
		}
	}, [filterList2]);
	
	const getList = ({item, index}) => (
		<TouchableOpacity
			key = {item.pd_idx}
			style={[styles.listLi, index!=0 ? styles.listLiBorder : null ]}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('UsedView', {idx:item.pd_idx})
			}}
		>
			<>

			{item.pd_image ? (
			<View style={styles.pdImage}>
				<AutoHeightImage width={131} source={{uri: item.pd_image}}  style={styles.listImg} />
			</View>
			) : null}

			{/* <AutoHeightImage width={131} source={{uri: item.pd_image}}  style={styles.listImg} />			 */}
			<View style={[styles.listInfoBox, item.pd_image ? null : styles.listInfoBox2]}>
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
					:
					null
					}

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
					:
					null
					}

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
					:
					null
					}					
				</View>
			</View>
			</>
		</TouchableOpacity>
	);

	useEffect(() => {		
		Animated.timing(
			scrollEvent, {toValue: scroll, duration: 300, useNativeDriver: false,}
		).start();

		Animated.timing(
			scrollEvent2, {toValue: scroll2, duration: 300, useNativeDriver: false,}
		).start();

		Animated.timing(
			scrollEvent3, {toValue: scroll3, duration: 300, useNativeDriver: false,}
		).start();
	}, [scroll]);

	const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);
		if(contentOffset.y > 10){			
			setScroll(0);
			setScroll2(1);
			setScroll3(46);
		}else{
			setScroll(1);
			setScroll2(0);
			setScroll3(98);
		}
	};

	useEffect(() => {
		//console.log('allFilter : ', allFilter);
		let selectCon = filterList.map((item) => {
			if(item.isChecked === allFilter){
				return {...item, isChecked: allFilter};
			}else{
				return {...item, isChecked: item.isChecked};
			}
		});

		setFilterList(selectCon);
	}, [allFilter]);

	//개별 선택
	const handleChange = (idx) => {
		let temp = filterList.map((item) => {
			if(idx === item.idx){
				//console.log('idx : ', idx, ' con idx : ', item.idx);
				return { ...item, isChecked: !item.isChecked };
			}

			return item;
		});

		setFilterList(temp);

		let selectedTotal = temp.filter((item) => item.isChecked);
		//console.log('temp.length : ', temp.length, 'totalSelected : ', selectedTotal.length);
		if(temp.length === selectedTotal.length){
			setAllFilter(true);
			//console.log('setAllConvenients1', allFilter);
		}else{			
			setAllFilter(false);
			//console.log('setAllConvenients2', allFilter);
		}
		//console.log('allConvenients : ', allFilter);
		//console.log('temp : ', temp);
	};

	//전체 선택, 전체 선택 해제
	const changeAllChecked = (checked) => {
		let allCheckStatus = checked;
		//console.log('checked : ', checked);
		if(checked === true){
			allCheckStatus = false;
		}else{
			allCheckStatus = true;
		}
		//console.log('allCheckStatus btn : ', allCheckStatus);
		let selectCon = filterList.map((item) => {
			return {...item, isChecked: allCheckStatus};
		});

		setFilterList(selectCon);
		setAllFilter(allCheckStatus);
	}

	let selected = filterList.filter((item) => item.isChecked);
	const submitFilter = async () => {
		selected = filterList.filter((item) => item.isChecked).map(item => item.idx);
		setFilterLen(selected.length);
		
		let commaAry = "";
		
		let selectCon = filterList.map((item) => {
			if(item.isChecked === allFilter){
				return {...item, isChecked: allFilter};
			}else{
				if(commaAry != ''){commaAry+=',';}
				commaAry+=item.idx;
				
				setFilterAry(commaAry);
				return {...item, isChecked: item.isChecked};
			}
		});

		let cnt = 0;
		filterList.map((item) => {
			if(item.isChecked === allFilter){
				
			}else{
				cnt = cnt+1;
			}
		});
		if(cnt < 1){
			setFilterAry('');
		}
		setFilterList2(selectCon);

		//await listCenterInfoReceive(selected);
		await setVisible3(false);
	}

	//공장 변경
	const changeFac = async (idx) => {
		let formData = {
			is_api:1,				
			fc_idx:idx,
		};

		Api.send('POST', 'choice_fac', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){				
				setItemList([]);
				setNowPage(1);
				setVisible(false);
				setMyFac(responseJson.data);

				const fcUse = (responseJson.data).find(item=> item.fc_use==1);
				const fcUseText = fcUse.fc_name+"("+fcUse.fc_dong+")";
				setMyFacOn(fcUseText);				

				getItemList();				
			}else{
				console.log('결과 출력 실패!', resultItem);
			}
		});
	}

	const onRefresh = () => {
		if(!refreshing) {
			getItemList();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}
	
	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.headerBtn1}
					activeOpacity={opacityVal}
					onPress={() => {setVisible(true)}}
				>
					<Text style={styles.headerBtn1Text}>{myFacOn}</Text>
					<AutoHeightImage width={18} source={require("../assets/img/icon_arrow.png")} />
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.headerBtn2}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('AlimList');
					}}
				>
					<AutoHeightImage width={20} source={require("../assets/img/icon_alarm.png")} />
				</TouchableOpacity>
			</View>
			
			<FlatList
				data={itemList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				onScroll={onScroll}					
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				refreshing={refreshing}
				onRefresh={onRefresh}
				ListHeaderComponent={
					<>						
					<KeyboardAvoidingView style={[styles.schBox, styles.borderBot]}>
						<View style={styles.schIptBox}>
							<TouchableOpacity
							style={styles.goToSch}
							activeOpacity={opacityVal}
							onPress={() => {navigation.navigate('SearchList', {backPage:'Home', tab:1})}}
							>
								<Text style={styles.goToSchText}>무엇을 찾아드릴까요?</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.schFilterBox}>
							{filterLen > 0 ? (
								<ScrollView horizontal={true} style={styles.filterLabelBox}>
									{filterList2.map((item, index) => {
										if(item.isChecked){
											return(
											<TouchableOpacity 
												key={index} 
												style={styles.filterLabel}
												activeOpacity={opacityVal}
												onPress={()=>{setVisible3(true)}}
											>
												<Text style={styles.filterLabelText}>{item.txt}</Text>
											</TouchableOpacity>
											)
										}
									})}
								</ScrollView>
							) : (
								<TouchableOpacity 
									style={styles.schFilterBtn1} 
									activeOpacity={opacityVal}
									onPress={()=>{setVisible3(true)}}
								>
									<Text style={styles.schFilterBtnText}>필터를 선택해 주세요.</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity 
								style={styles.schFilterBtn2}
								activeOpacity={opacityVal}
								onPress={()=>{setVisible3(true)}}
							>
								<Text style={styles.schFilterBtn2Text}>상세필터</Text>
								<AutoHeightImage width={17} source={require("../assets/img/icon_filter.png")} />
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
					<View style={styles.borderTop}></View>
					</>
				}
				ListEmptyComponent={
					isLoading ? (
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 중고상품이 없습니다.</Text>
					</View>
					) : (
						<View style={[styles.indicator]}>
							<ActivityIndicator size="large" />
						</View>
					)
				}
			/>
			
			{!visible2 ? (
			<Animated.View 
				style={{
					...styles.writeBtnBase,
					width:scrollEvent3
				}}
			>
				<TouchableOpacity 
					activeOpacity={opacityVal}
					onPress={()=>{setVisible2(true)}}
				>
					<Animated.View
						style={{
							...styles.writeBtnBaseAni,
							opacity:scrollEvent
						}}
					>
						<AutoHeightImage 
							width={13} 
							source={require("../assets/img/icon_plus2.png")} 
						/>
						<Text style={styles.writeBtnBaseText}>글쓰기</Text>
					</Animated.View>
					<Animated.View
						style={{
							...styles.writeBtnImg,
							opacity:scrollEvent2
						}}
					>
						<AutoHeightImage width={46} source={require("../assets/img/write_btn.png")} />
					</Animated.View>
				</TouchableOpacity>
			</Animated.View>
			) : null}

			<View style={styles.gapBox}></View>

			<Modal
				visible={visible}
				transparent={true}
				animationType={"fade"}
				onRequestClose={() => {setVisible(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible(false)}}
				></Pressable>
				<View style={styles.modalCont}>
					{myFac.length > 0 ? (
						myFac.map((item, index)=>{
							return(
								<TouchableOpacity
									key = {index}
									style={styles.myfactoryBtn}
									activeOpacity={opacityVal}
									onPress={()=>{changeFac(item.fc_idx)}}
								>
									<Text style={[styles.myfactoryBtnText, item.fc_use == 1 ? styles.myfactoryBtnTextOn : null]}>
											{item.fc_name}({item.fc_dong})
									</Text>
								</TouchableOpacity>
							)
						})
					) : null}
					{/* <TouchableOpacity 
						style={[styles.myfactoryBtn, styles.myfactoryBtn2]}
						activeOpacity={opacityVal}
					>
						<Text style={styles.myfactoryBtnText}>공장2(상동)</Text>
					</TouchableOpacity> */}
					<TouchableOpacity 
						style={[styles.myfactoryBtn, styles.myfactoryBtn2]}
						activeOpacity={opacityVal}
						onPress={()=>{
							navigation.navigate('MyCompany');
						}}
					>
						<Text style={styles.myfactoryBtnText}>공장 관리하기</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				visible={visible2}
				transparent={true}
				animationType={"fade"}
				onRequestClose={() => {setVisible2(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible2(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
					<TouchableOpacity 
						style={styles.modalCont2Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible2(false)
							navigation.navigate('UsedWrite1')							
						}}
					>
						<Text style={styles.modalCont2BtnText}>스크랩</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[styles.modalCont2Btn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible2(false)
							navigation.navigate('UsedWrite2')							
						}}
					>
						<Text style={styles.modalCont2BtnText}>중고자재</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[styles.modalCont2Btn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible2(false)
							navigation.navigate('UsedWrite3')							
						}}
					>
						<Text style={styles.modalCont2BtnText}>중고기계/장비</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[styles.modalCont2Btn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible2(false)
							navigation.navigate('UsedWrite4')							
						}}
					>
						<Text style={styles.modalCont2BtnText}>폐기물</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity 
					style={styles.modalCont2Off}
					activeOpacity={opacityVal}
					onPress={() => {setVisible2(false)}}
				>
					<AutoHeightImage width={46} source={require("../assets/img/write_btn_off.png")} />
				</TouchableOpacity>
			</Modal>

			<Modal
				visible={visible3}
				transparent={true}
				animationType={"fade"}
				onRequestClose={() => {setVisible3(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible3(false)}}
				></Pressable>
				<View style={styles.modalCont3}>
					<ScrollView>
						<View style={styles.mainFilterBox}>
							<TouchableOpacity
								style={styles.modalCont3Off}
								activeOpacity={opacityVal}
								onPress={()=>{setVisible3(false);}}
							>
								<AutoHeightImage width={14} source={require("../assets/img/icon_close.png")} />
							</TouchableOpacity>
							<View style={styles.mainFilterBoxTitle}>
								<Text style={styles.mainFilterBoxTitleText}>검색 필터</Text>
							</View>
							<View style={styles.mainFilterBoxDesc}>
								<Text style={styles.mainFilterBoxDescText}>※개별 선택은 다중 선택이 가능합니다.</Text>
							</View>
							<View style={styles.mainFilterAll}>
								<View style={styles.mainFilterAllTitle}>
									<Text style={styles.mainFilterAllTitleText}>모두 선택</Text>
								</View>
								<View style={styles.filterBtnList}>
									<TouchableOpacity
										style={[styles.filterChkBtn, allFilter ? styles.filterChkBtnOn : null]}
										activeOpacity={opacityVal}
										onPress={() => changeAllChecked(allFilter)}
									>
										<Text style={[styles.filterChkBtnText, allFilter ? styles.filterChkBtnTextOn : null]}>모두 선택</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.mainFilterOther}>
								<View style={styles.mainFilterAllTitle}>
									<Text style={styles.mainFilterAllTitleText}>개별 선택</Text>
								</View>
								<View style={styles.filterBtnList}>
									{filterList.map((item, index) => {
										return(
										<TouchableOpacity
											key = {index}
											style={[styles.filterChkBtn, item.isChecked ? styles.filterChkBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={() => handleChange(item.idx)}
										>
											<Text style={[styles.filterChkBtnText, item.isChecked ? styles.filterChkBtnTextOn : null]}>{item.txt}</Text>
										</TouchableOpacity>
										)
									})}
								</View>
							</View>
						</View>
					</ScrollView>
					<View style={styles.nextFix}>
						<TouchableOpacity 
							style={styles.nextBtn}
							activeOpacity={opacityVal}
							onPress={() => {submitFilter()}}
						>
							<Text style={styles.nextBtnText}>선택</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	header: {padding:20,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	headerBtn1: {display:'flex',flexDirection:'row',alignItems:'center',},
	headerBtn1Text: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:21,color:'#000',marginRight:5,},
	schBox: {padding:20,paddingTop:0,},
	schIptBox: {position:'relative',},
	goToSch: {width:'100%',height:48,borderWidth:1,borderColor:'#000000',borderRadius:12,paddingLeft:20,display:'flex',justifyContent:'center'},
	goToSchText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#000',},
	schInput: {width:'100%',height:48,borderWidth:1,borderColor:'#000000',borderRadius:12,fontSize:14,color:'#000',paddingLeft:20,paddingRight:65,},
	schBtn: {width:50,height:48,display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',top:0,right:0,},
	schFilterBox: {display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:5},
	schFilterBtn1: {height:33,paddingLeft:20,paddingRight:20,backgroundColor:'#F5F5F5',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	schFilterBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#888888'},
	schFilterBtn2: {width:85,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end',paddingTop:7,marginTop:10,},
	schFilterBtn2Text: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#000',marginRight:5,},
	filterLabelBox: {width:(innerWidth-85),display:'flex',flexWrap:'wrap',flexDirection:'row'},
	filterLabel: {height:33,paddingLeft:12,paddingRight:12,backgroundColor:'#31B481',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',marginRight:8,marginTop:10,},
	filterLabelText: {fontSize:13,lineHeight:17,color:'#fff'},
	listLi: {display:'flex',flexDirection:'row',padding:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	pdImage: {width:131,height:131,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listImg: {borderRadius:12,},
	listInfoBox: {width:(innerWidth - 131),paddingLeft:15,},
	listInfoBox2: {width:innerWidth,paddingLeft:0,},
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
	gapBox: {height:80,},
	notData: {display:'flex',alignItems:'center',justifyContent:'center',height:widnowHeight-320},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
	writeBtn: {position:'absolute',right:20,bottom:100},
	writeBtnBase: {height:46,backgroundColor:'#31B481',borderRadius:30,position:'absolute',right:20,bottom:100},
	writeBtnBaseAni: {width:98,height:46,display:'flex',flexDirection:'row',
	alignItems:'center',justifyContent:'center',},
	writeBtnBaseText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:46,color:'#fff',marginLeft:5},
	writeBtnImg: {position:'absolute',left:0,top:0,opacity:0,},

	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {minWidth:190,paddingVertical:10,backgroundColor:'#fff',borderRadius:12,position:'absolute',left:20,top:50,},
	myfactoryBtn: {paddingVertical:10,paddingHorizontal:15,},
	myfactoryBtn2: {marginTop:5,},
	myfactoryBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#C5C5C6',},
	myfactoryBtnTextOn: {color:'#353636'},
	modalCont2: {minWidth:150,paddingVertical:15,paddingHorizontal:30,backgroundColor:'#fff',borderRadius:12,position:'absolute',right:20,bottom:166,},
	modalCont2Btn: {paddingVertical:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#353636'},
	modalCont2Off: {position:'absolute',right:20,bottom:100},
	modalCont3: {flex:1,width:(widnowWidth-60),height:'100%',backgroundColor:'#fff',position:'absolute',top:0,right:0,},
	mainFilterBox: {paddingVertical:20},
	modalCont3Off: {width:40,height:40,position:'absolute',top:7,right:7,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,},
	mainFilterBoxTitle: {paddingHorizontal:20,},
	mainFilterBoxTitleText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:20,color:'#000'},
	mainFilterBoxDesc: {paddingHorizontal:20,marginTop:5,},
	mainFilterBoxDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#6F6F6F'},
	mainFilterAll: {paddingVertical:30,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6',},
	mainFilterAllTitle: {},
	mainFilterAllTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000'},
	mainFilterOther: {paddingHorizontal:20,paddingTop:30,},
	filterBtnList: {display:'flex',flexDirection:'row',alignItems:'center',flexWrap:'wrap',paddingTop:5,},
	filterChkBtn: {height:31,paddingHorizontal:15,borderWidth:1,borderColor:'#C5C5C6',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,marginRight:10,},
	filterChkBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#C5C5C6'},
	filterChkBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	filterChkBtnTextOn: {color:'#fff'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},

	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

export default Home