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

const SaleList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [tabState, setTabState] = useState(1);
  const [idxVal, setIdxVal] = useState('');

  const DATA = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: '스크랩 싸게 팝니다.1',
			loc: '중2동',
			period: '2주전',
			state: 1,
			date: '2023.07.03',
      cate: '스크랩',
      price: '100,000',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: '스크랩 싸게 팝니다.2',
			loc: '중2동',
			period: '2주전',
			state: 1,
			date: '2023.07.03',
      cate: '스크랩',
      price: '100,000',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			title: '스크랩 싸게 팝니다.3',
			loc: '중2동',
			period: '2주전',
			state: 2,
			date: '2023.07.03',
      cate: '스크랩',
      price: '100,000',
      score: 2,
			review: 8,
			like: 5,
		},
		{
			id: '68694a0f-3da1-471f-bd96-145571e29d72',
			title: '스크랩 싸게 팝니다.4',
			loc: '중2동',
			period: '2주전',
			state: 1,
			date: '2023.07.03',
      cate: '스크랩',
      price: '100,000',
		},
	];

  const getList = ({item, index}) => (    
    item.state == tabState ? (
		<View style={styles.saleListBox}>
      <TouchableOpacity 
        style={styles.modalOpenBtn}
        activeOpacity={opacityVal}
        onPress={()=>{
          setIdxVal(item.id);
          setVisible(true);
        }}
      >
        <AutoHeightImage width={3} source={require("../../assets/img/icon_dot.png")} />
      </TouchableOpacity>
      {index != 0 ? (
      <>
      <View style={styles.borderBot}></View>
      <View style={styles.borderTop}></View>
      </>
      ) : null}
      <View style={[styles.listInfoCate]}>
        <Text style={styles.listInfoCateText}>{'['}{item.cate}{']'}</Text>
      </View>
      <View style={styles.listLi}>        
        <View style={styles.listImgBox}>        
          <AutoHeightImage width={63} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
        </View>			
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.title}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{item.loc}</Text>
            <View style={styles.listInfoDescBar}></View>
            <Text style={styles.listInfoDescText}>{item.period}</Text>

            {item.state == 2 ? (
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
            ) : null}
          </View>         
        </View>                 
      </View>
      <View style={styles.listInfoPriceBox}>
        <View style={styles.listInfoPriceWrap}>
          <View style={styles.listInfoPrice}>
            <Text style={styles.listInfoPriceState}>예약중</Text>
            <Text style={styles.listInfoPriceText}>{item.price}원</Text>
          </View>
          <View style={styles.listInfoDate}>
            <Text style={styles.listInfoDateText}>{item.date}</Text>
          </View>
        </View>
      </View>
		</View>
    ) : null
	);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setIsLoading(false);
        setTabState(1);
        setIdxVal('');
        setVisible(false);
        setVisible2(false);
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

  function fnDelete(){
    console.log(idxVal);
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'판매내역'} />
      <View style={styles.tabBox}>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(1)}}
        > 
          {tabState == 1 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>판매중 (3)</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>판매중 (3)</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>거래완료 (27)</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>거래완료 (27)</Text>  
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <FlatList
				data={DATA}
				renderItem={(getList)}
				keyExtractor={item => item.id}		
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 판매글이 없습니다.</Text>
					</View>
				}
			/>
      ) : (
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" />
        </View>
      )}			

      <Modal
				visible={visible}
				transparent={true}
				onRequestClose={() => {setVisible(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
					<View style={styles.modalCont2Box}>
            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.choice]}
							activeOpacity={opacityVal}
							onPress={() => {
								setVisible(false)
						}}
						>
							<Text style={styles.modalCont2BtnText}>예약중</Text>
						</TouchableOpacity>

            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible(false);
						}}
						>
							<Text style={styles.modalCont2BtnText}>거래완료</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible(false);
								navigation.navigate('UsedWrite1', {});
						}}
						>
							<Text style={styles.modalCont2BtnText}>상품 수정</Text>
						</TouchableOpacity>            

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible(false);
							}}
						>
							<Text style={styles.modalCont2BtnText}>판매중</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible2(true)
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제하기</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible(false)
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>

      <Modal
        visible={visible2}
				transparent={true}
				onRequestClose={() => {setVisible2(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible2(false)}}
				></Pressable>
				<View style={styles.modalCont3}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>삭제</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>삭제를 하면 다시 복구되지 않습니다.</Text>
            <Text style={styles.avatarDescText}>채팅도 불가능하게 됩니다.</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setVisible2(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {fnDelete();}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
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
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  saleListBox: {position:'relative'},
  modalOpenBtn: {display:'flex',alignItems:'center',justifyContent:'center',width:40,height:40,position:'absolute',top:16,right:5,},
  listInfoCate: {width:innerWidth,paddingHorizontal:20,paddingTop:30,marginBottom:10,},
	listInfoCateText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:15,color:'#353636'},
  listLi: {display:'flex',flexDirection:'row',flexWrap:'wrap',alignItems:'center',paddingHorizontal:20,position:'relative'},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E1E8F0'},
  listLiBorder2: {width:innerWidth,height:5,backgroundColor:'red'},  
  listImgBox: {width:63,},  
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 63),paddingLeft:15,},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:8,position:'relative'},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#737373'},	
  listInfoDescBar: {width:1,height:10,backgroundColor:'#737373',marginHorizontal:8,position:'relative',top:-1},
  listInfoCnt: {display:'flex',flexDirection:'row',alignItems:'center',position:'absolute',top:0,right:0,},
	listInfoCntBox: {display:'flex',flexDirection:'row',alignItems:'center',marginRight:15,},
  listInfoCntBox2: {marginRight:0},
	listInfoCntBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#000',marginLeft:4,},
	listInfoPriceBox: {marginTop:15,paddingHorizontal:20,},
  listInfoPriceWrap: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:10,paddingBottom:30,borderTopWidth:1,
  borderColor:'#E3E3E4',},
  listInfoPrice: {display:'flex',flexDirection:'row',alignItems:'center',},
  listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:53,height:24,backgroundColor:'#F58C40',borderRadius:12,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:29,color:'#fff',textAlign:'center',position:'relative',top:-1,marginRight:10,},
  listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#323232'},
  listInfoDate: {},
  listInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#B5B5B5'},
	notData: {height:widnowHeight-220,display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
  modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919'},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
})

export default SaleList