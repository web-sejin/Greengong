import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
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

const MatchComparisonView = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

  const DATA = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: '홍길동',
			desc: '2023.07.06 · 2일전',
			loc: '중3동',
			price: '100,000',
			state: 1,
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: '홍길동',
			desc: '2023.07.06 · 2일전',
			loc: '중3동',
			price: '100,000',
			state: 2,
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			title: '홍길동',
			desc: '2023.07.06 · 2일전',
			loc: '중3동',
			price: '100,000',
			state: 3,
		},
	];  

  const getList = ({item, index}) => (
    <View style={[styles.matchCompleteMb]}> 
      <View style={[styles.matchCompleteMbWrap, styles.matchCompleteMbFst]}>              
        <View style={[styles.compBtn]}>
          <View style={[styles.compWrap, styles.compWrapFst]}>
            <View style={styles.compInfo}>
              <View style={styles.compInfoDate}>
                <Text style={styles.compInfoDateText}>{item.desc}</Text>
              </View>
              <View style={styles.compInfoName}>
                <Text style={styles.compInfoNameText}>{item.title}</Text>
              </View>
              <View style={styles.compInfoLoc}>
                <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
                <Text style={styles.compInfoLocText}>{item.loc}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.compThumb}
              activeOpacity={opacityVal}
              onPress={()=>{
                navigation.navigate('Other', {});
              }}
            >
              <AutoHeightImage width={79} source={require("../../assets/img/sample1.jpg")} />
            </TouchableOpacity>
          </View>
          <View style={styles.matchPrice}>
            <Text style={styles.matchPriceText}>가격</Text>
            <Text style={styles.matchPriceText2}>{item.price}원</Text>
          </View>            
        </View>
      </View>

      {item.state == 3 ? (
        <View style={styles.btnBox}>
          <TouchableOpacity
            style={[styles.btn, styles.btn5]}
            activeOpacity={opacityVal}
            onPress={()=>{}}
          >
            <Text style={styles.btnText}>회사소개서</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn5]}
            activeOpacity={opacityVal}
            onPress={()=>{
              navigation.navigate('EstimateResult', {});
            }}
          >
            <Text style={styles.btnText}>견적서 보기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.btnBox}>
          {item.state == 1 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{}}
          >
            <Text style={styles.btnText}>업체선정</Text>
          </TouchableOpacity>
          ) : null}

          {item.state == 2 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn4]}
            activeOpacity={opacityVal}
            onPress={()=>{}}
          >
            <Text style={[styles.btnText, styles.btnText2]}>선정됨</Text>
          </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.btn}
            activeOpacity={opacityVal}
            onPress={()=>{}}
          >
            <Text style={styles.btnText}>회사소개서</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btn2]}
            activeOpacity={opacityVal}
            onPress={()=>{
              navigation.navigate('EstimateResult', {});
            }}
          >
            <Text style={styles.btnText}>견적서 보기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
			<Header navigation={navigation} headertitle={'발주업체 비교내역'} />			
      <View style={styles.borderBot}>
        <View
          style={[styles.listLi]}
          activeOpacity={opacityVal}
          onPress={() => {
            navigation.navigate('UsedView', {category:item.category, naviPage:item.naviPage, stateVal:item.stateVal})
          }}
        >    
          <AutoHeightImage width={68} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
          <View style={styles.listInfoBox}>
            <View style={styles.listInfoCate}>
              <Text style={styles.listInfoCateText}>[CNC가공]</Text>
            </View>
            <View style={styles.listInfoTitle}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>우주선 견적 요청합니다.</Text>
            </View>
            <View style={styles.listInfoDesc}>
              <Text style={styles.listInfoDescText}>우주선 프로젝트 경험있습니다.</Text>
            </View>
            <View style={styles.listInfoState}>
              <Text style={[styles.listInfoStateText]}>견적요청중</Text>
              {/* <Text style={[styles.listInfoStateText, styles.listInfoStateText2]}>발주완료</Text> */}
            </View>
          </View>          
        </View>
      </View>
      <FlatList
        data={DATA}
        renderItem={(getList)}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>          
          <View style={styles.borderTop}></View>
          <View style={[styles.salesAlert]}>
            <View style={styles.alertBox}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>업체를 확인해서 업체를 선택해 주세요.</Text>
            </View>
          </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.notData}>
            <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
            <Text style={styles.notDataText}>발주업체가 없습니다.</Text>
          </View>
        }
      />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  listLi: {display:'flex',flexDirection:'row',alignItems:'center',padding:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 68),paddingLeft:15,paddingRight:80,position:'relative'},
  listInfoCate: {},
  listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#000'},
	listInfoTitle: {marginTop:3},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:2},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},		
  listInfoState: {display:'flex',flexDirection:'row',position:'absolute',top:-5,right:0,},
  listInfoStateText: {display:'flex',alignItems:'center',justifyContent:'center',height:24,paddingHorizontal:10,backgroundColor:'#797979',
  borderRadius:12,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:29,color:'#fff',},
  listInfoStateText2: {backgroundColor:'#31B481'},
  salesAlert: {paddingHorizontal:20,paddingTop:15,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	notData: {display:'flex',alignItems:'center',paddingTop:90,},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  matchCompleteMb: {paddingHorizontal:20,},
  matchCompleteMbWrap: {paddingVertical:30,paddingBottom:0,borderTopWidth:1,borderColor:'#E9EEF6',},
  matchCompleteMbFst: {borderTopWidth:0,},
  compBtn: {},
  compWrap: {display:'flex',flexDirection:'row',justifyContent:'space-between',position:'relative'},
  compRadio: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,position:'absolute',top:0,left:0,display:'flex',alignItems:'center',justifyContent:'center'},
  comRadioChk: {backgroundColor:'#31B481',borderColor:'#31B481',},
  compInfo: {width:(innerWidth-99)},
  compInfoDate: {},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {marginVertical:8},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
  compThumb: {width:79,height:79,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},  
  matchPrice: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',backgroundColor:'#F3FAF8',borderRadius:12,paddingVertical:10,paddingHorizontal:15,marginTop:15,},
  matchPriceText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#353636'} ,
  matchPriceText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#31B481'},
  btnBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',marginTop:10,paddingBottom:30,},
  btn: {width:((innerWidth/3)-7),height:58,backgroundColor:'#353636',borderRadius:12,display:'flex',alignItems:"center",justifyContent:'center'},
  btn2: {backgroundColor:'#31B481',},
  btn3: {backgroundColor:'#C5C5C6',},
  btn4: {backgroundColor:'#fff',borderWidth:1,borderColor:'#31B481'},
  btn5: {width:((innerWidth/2)-5)},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:20,color:'#fff'},
  btnText2: {color:'#31B481'}
})

export default MatchComparisonView