import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchDownCert = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
	const [tabState, setTabState] = useState(1);
	const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemList2, setItemList2] = useState([]);
  const [nowPage2, setNowPage2] = useState(1);
  const [totalPage2, setTotalPage2] = useState(1);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
			setNowPage(1);
      setNowPage2(1);
      getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  function fnTab(v){
    setTabState(v);
		setNowPage(1);
    setNowPage2(1);
		if(v == 1){
      getData();
      setTimeout(function(){
        setItemList2([]);
      },200);
    }else if(v == 2){
      getData2();
      setTimeout(function(){
        setItemList([]);
      },200);
    }
  }

	const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'wait_permit_dwg', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log("wait_permit_dwg : ",responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);
				setNowPage(1);  
			}else{
				setItemList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
  }
  const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'wait_permit_dwg', {is_api: 1, page:nowPage+1}, (args)=>{
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
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}
	const getList = ({item, index}) => (		
		<TouchableOpacity 
			style={[styles.listLi, index!=0 ? styles.borderTop : null, index==0 ? styles.listLiFst : null ]}
			activeOpacity={opacityVal}
			onPress={() => {navigation.navigate('MatchView', {idx:item.mc_idx})}}
		>
			<>
			{item.mc_image ? (
			<View style={styles.pdImage}>
				<AutoHeightImage width={131} source={{uri:item.mc_image}} style={styles.listImg} />
			</View>
			) : null}

			<View style={styles.listInfoBox}>
				<View style={styles.listInfoTitle}>
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
						{item.mc_name}
					</Text>
				</View>
				<View style={styles.listInfoDesc}>
					<Text style={styles.listInfoDescText}>{item.mc_date}</Text>
				</View>
				<View style={styles.listInfoCate}>
					<Text style={styles.listInfoCateText}>{item.mc_summary}</Text>
				</View>
			</View>
			</>
		</TouchableOpacity>
	);

	const getData2 = async () => {
		setIsLoading(false);
    await Api.send('GET', 'approval_permit_dwg', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log("approval_permit_dwg : ",responseJson);
				setItemList2(responseJson.data);
        setTotalPage2(responseJson.total_page);
				setNowPage2(1);
			}else{
				setItemList2([]);
				setNowPage2(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
	}
	const moreData2 = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'approval_permit_dwg', {is_api: 1, page:nowPage2+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = itemList2.concat(responseJson.data);				
          setItemList2(addItem);			
          setNowPage2(nowPage2+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}
	const getList2 = ({item, index}) => (		
		<TouchableOpacity 
			style={[styles.listLi, index!=0 ? styles.borderTop : null, index==0 ? styles.listLiFst : null ]}
			activeOpacity={opacityVal}
			onPress={() => {navigation.navigate('MatchView', {idx:item.mc_idx})}}
		>
			<>
			{item.mc_image ? (
			<View style={styles.pdImage}>
				<AutoHeightImage width={131} source={{uri:item.mc_image}} style={styles.listImg} />
			</View>
			) : null}

			<View style={styles.listInfoBox}>
				<View style={styles.listInfoTitle}>
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
						{item.mc_name}
					</Text>
				</View>
				<View style={styles.listInfoDesc}>
					<Text style={styles.listInfoDescText}>{item.mc_date}</Text>
				</View>
				<View style={styles.listInfoCate}>
					<Text style={styles.listInfoCateText}>{item.mc_summary}</Text>
				</View>
			</View>
			</>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'도면권한 신청내역'} />
      <View style={styles.tabBox}>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(1)}}
        > 
          {tabState == 1 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>대기</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>대기</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>승인</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>승인</Text>  
          )}
        </TouchableOpacity>
      </View>
						
			{tabState == 1 ? (
				<FlatList
					data={itemList}
					renderItem={(getList)}
					keyExtractor={(item, index) => index.toString()}
					onEndReachedThreshold={0.6}
					onEndReached={moreData}
					disableVirtualization={false}
					ListEmptyComponent={
						isLoading ? (
						<View style={styles.notData}>
							<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
							<Text style={styles.notDataText}>등록된 요청내역이 없습니다.</Text>
						</View>
						) : (
							<View style={[styles.indicator]}>
								<ActivityIndicator size="large" />
							</View>
						)
					}
				/>
			):(
				<FlatList
					data={itemList2}
					renderItem={(getList2)}
					keyExtractor={(item, index) => index.toString()}
					onEndReachedThreshold={0.6}
					onEndReached={moreData2}
					disableVirtualization={false}
					ListEmptyComponent={
						isLoading ? (
						<View style={styles.notData}>
							<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
							<Text style={styles.notDataText}>완료된 요청내역이 없습니다.</Text>
						</View>
						) : (
							<View style={[styles.indicator]}>
								<ActivityIndicator size="large" />
							</View>
						)
					}
				/>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
  listLi: {display:'flex',alignItems:'center',flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingVertical:30,},
  listLiFst: {paddingTop:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	pdImage: {width:131,height:131,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 131),paddingLeft:15,},
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
	listInfoPriceBox: {marginTop:10},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},
  listInfoState: {flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:8,width:114,height:24,backgroundColor:'#797979',borderRadius:12,position:'relative'},
	listInfoState2: {width:64,backgroundColor:'#31B481'},
  listInfoStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:14,color:'#fff',},
  listInfoStateText2: {},  
	listInfoStateCnt: {alignItems:'center',justifyContent:'center',width:20,height:20,backgroundColor:'#DF4339',borderRadius:50,position:'absolute',top:-8,right:-8,},
	listInfoStateCntText: {fontFamily:Font.NotoSansMedium,fontSize:9,lineHeight:14,color:'#fff',},
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default MatchDownCert