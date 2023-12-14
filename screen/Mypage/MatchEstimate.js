import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchEstimate = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [itemList, setItemList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [totalCnt, setTotalCnt] = useState(0);
	const [initLoading, setInitLoading] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!initLoading){
			getItemList();
			setInitLoading(true);
		}else if(params?.isSubmit){
			setNowPage(1);
			getItemList();
			delete params?.isSubmit
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	const getItemList = async () => {
		setIsLoading(false);
		await Api.send('GET', 'list_estimate_match', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log('list_estimate_match', responseJson);
				setItemList(responseJson.data);
				setTotalPage(responseJson.total_page);
				setTotalCnt(responseJson.total_count);
			}else{
				setItemList([]);
				setNowPage(1);
				console.log('결과 출력 실패!');
			}
		});

		setIsLoading(true);
	}
	const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_estimate_match', {is_api: 1, page:nowPage+1}, (args)=>{
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
		<View 
			style={[index!=0 ? styles.borderTop : null, index+1 != totalCnt ? styles.borderBot : null ]}
		>
			<>
      <TouchableOpacity 
        style={[styles.listLi, index==0 ? styles.listLiFst : null]}
        activeOpacity={opacityVal}
        onPress={() => {navigation.navigate('MatchView', {idx:item.mc_idx})}}
      >
				{item.mc_image ? (
				<View style={styles.pdImage}>
					<AutoHeightImage width={131} source={{uri: item.mc_image}}  style={styles.listImg} />				
				</View>
				) : null}
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
							{item.mc_name}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
						<Text style={styles.listInfoDescText}>{item.mc_loc} · {item.mc_date}</Text>
          </View>
          <View style={styles.listInfoCate}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoCateText}>{item.mc_summary}</Text>
          </View>
          <View style={styles.listInfoCnt}>
            <View style={styles.listInfoCntBox}>
              <AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
              <Text style={styles.listInfoCntBoxText}>{item.mb_score}</Text>
            </View>
            <View style={styles.listInfoCntBox}>
              <AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
              <Text style={styles.listInfoCntBoxText}>{item.mc_chat_cnt}</Text>
            </View>
            <View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
              <AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
              <Text style={styles.listInfoCntBoxText}>{item.mc_like_cnt}</Text>
            </View>
          </View>

          {item.mc_status_org == 1 ? (
					<View style={styles.listInfoState}>
						<Text style={styles.listInfoStateText}>{item.mc_status}</Text>
					</View>
					) : null}

					{item.mc_status_org == 2 ? (
					<View style={[styles.listInfoState, styles.listInfoState2]}>
						<Text style={[styles.listInfoStateText, styles.listInfoStateText2]}>{item.mc_status}</Text>
					</View>
					) : null}
        </View>
      </TouchableOpacity>
			<View style={styles.completeBox}>
				<Text style={styles.completeBoxText}>견적발송일 : {item.me_date_org}</Text>
			</View>
      <View style={styles.comparisonBtnBox}>
        <TouchableOpacity 
          style={[styles.comparisonBtn]}
          activeOpacity={opacityVal}
					onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
        >
          <Text style={[styles.comparisonBtnText]}>견적서 보기</Text>
        </TouchableOpacity>
      </View>
			</>
		</View>
	);

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'견적서 확인'} />
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
							<Text style={styles.notDataText}>등록된 견적 요청내역이 없습니다.</Text>
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
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  listLi: {display:'flex',flexDirection:'row',flexWrap:'wrap',padding:20,paddingTop:30,paddingBottom:0,},
  listLiFst: {paddingTop:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	pdImage: {width:131,height:131,borderRadius:8,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listImg: {borderRadius:8},
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
  listInfoState: {alignItems:'center',justifyContent:'center',marginTop:8,width:64,height:24,backgroundColor:'#797979',borderRadius:12,},
	listInfoState2: {backgroundColor:'#31B481'},
  listInfoStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:14,color:'#fff',paddingTop:2,},
  listInfoStateText2: {},
  completeBox: {width:innerWidth,marginTop:15,paddingTop:10,borderTopWidth:1,borderColor:'#E3E3E4',marginLeft:20,},
  completeBoxText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000',},
  comparisonBtnBox: {paddingHorizontal:20,paddingTop:10,paddingBottom:30,},
  comparisonBtn: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
  comparisonBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	comparisonBtn2: {backgroundColor:'#eaeaea'},
	comparisonBtn2Text: {color:'#bbb'},
  notData: {height:(widnowHeight-170),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

export default MatchEstimate