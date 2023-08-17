import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchReq = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

  const DATA = [
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
      state:1,
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
      state:2,
		},
	];

  const dataLen = DATA.length;
	
	const getList = ({item, index}) => (
		<TouchableOpacity 
			style={[styles.listLi, index!=0 ? styles.borderTop : null, index+1 != dataLen ? styles.borderBot : null, index==0 ? styles.listLiFst : null ]}
			activeOpacity={opacityVal}
			onPress={() => {
				navigation.navigate('MatchView', {category:item.category})
			}}
		>
			<>
			<AutoHeightImage width={131} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
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
						<AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
						<Text style={styles.listInfoCntBoxText}>{item.score}</Text>
					</View>
					<View style={styles.listInfoCntBox}>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
						<Text style={styles.listInfoCntBoxText}>{item.review}</Text>
					</View>
					<View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
						<AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
						<Text style={styles.listInfoCntBoxText}>{item.like}</Text>
					</View>
				</View>

        {item.state == 1 ? (
        <View style={styles.listInfoState}>
          <Text style={styles.listInfoStateText}>견적요청중</Text>
        </View>
        ) : null}

        {item.state == 2 ? (
        <View style={styles.listInfoState}>
          <Text style={[styles.listInfoStateText, styles.listInfoStateText2]}>발주완료</Text>
        </View>
        ) : null}
			</View>
      <View style={styles.completeBox}>
        {item.state == 1 ? (
        <Text style={styles.completeBoxText}>발주업체  : 2곳</Text>
        ) : null}

        {item.state == 2 ? (
        <Text style={styles.completeBoxText}>발주완료업체 : 넥센타이어</Text>
        ) : null}
      </View>
			</>
		</TouchableOpacity>
	);

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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'견적 요청내역'} />
			<FlatList
				data={DATA}
				renderItem={(getList)}
				keyExtractor={item => item.id}	
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 견적 요청내역이 없습니다.</Text>
					</View>
				}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  listLi: {display:'flex',flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingVertical:30,},
  listLiFst: {paddingTop:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
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
  listInfoState: {display:'flex',flexDirection:'row',marginTop:8,},
  listInfoStateText: {display:'flex',alignItems:'center',justifyContent:'center',height:24,paddingHorizontal:10,backgroundColor:'#797979',
  borderRadius:12,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:29,color:'#fff',},
  listInfoStateText2: {backgroundColor:'#31B481'},
  completeBox: {width:innerWidth,marginTop:15,paddingTop:10,borderTopWidth:1,borderColor:'#E3E3E4'},
  completeBoxText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000',},
  notData: {height:(widnowHeight-170),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default MatchReq