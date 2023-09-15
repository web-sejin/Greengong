import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const SaleList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
  const {params} = route;
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [tabState, setTabState] = useState(1);
  const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemList2, setItemList2] = useState([]);
  const [nowPage2, setNowPage2] = useState(1);
  const [totalPage2, setTotalPage2] = useState(1);
  const [initLoading, setInitLoading] = useState(false); 
  
  const [tab1Cnt, setTab1Cnt] = useState(0);
  const [tab2Cnt, setTab2Cnt] = useState(0);

  const [modiNav, setModiNav] = useState();
  const [idxVal, setIdxVal] = useState();
  const [itemState, setItemState] = useState();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setIsLoading(false);
        setTabState(1);
        setVisible(false);
        setVisible2(false);        
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);

      if(params?.isSubmit){
        setModiNav();
        setIdxVal();
        setItemState();
        setNowPage(1);
        setNowPage2(1);
        getData();
        //getData2();
        delete params?.isSubmit
      }
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  useEffect(()=>{
    getData();
    //getData2();
  },[]);

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_sale', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log("list_sale : ",responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);        
        setTab1Cnt(responseJson.total_count);
        setTab2Cnt(responseJson.end_total);
			}else{
				setItemList([]);
				setNowPage(1);
        setTab1Cnt(0);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
  }
  const moreData = async () => {
		if(totalPage > nowPage){
			await Api.send('GET', 'list_sale', {is_api: 1, page:nowPage+1}, (args)=>{
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
  const getList = ({item, index}) => (    
    <View style={styles.saleListBox}>
      <TouchableOpacity 
        style={styles.modalOpenBtn}
        activeOpacity={opacityVal}
        onPress={()=>{
          if(item.c1_idx == 1){
            setModiNav('UsedModify1');
          }else if(item.c1_idx == 2){
            setModiNav('UsedModify2');
          }else if(item.c1_idx == 3){
            setModiNav('UsedModify3');
          }else if(item.c1_idx == 4){
            setModiNav('UsedModify4');
          }
          setIdxVal(item.pd_idx);
          setItemState(item.pd_status_org);
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
        <Text style={styles.listInfoCateText}>{'['}{item.c1_name}{']'}</Text>
      </View>
      <View style={styles.listLi}>
      {item.pd_image ? (    
        <TouchableOpacity 
          style={styles.listImgBox}
          activeOpacity={opacityVal}
          onPress={() => {
            navigation.navigate('UsedView', {idx:item.pd_idx})
          }}
        >          
          <AutoHeightImage width={63} source={{uri: item.pd_image}} style={styles.listImg} />          
        </TouchableOpacity>			
        ) : null}
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.pd_name}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{item.pd_loc}</Text>
            <View style={styles.listInfoDescBar}></View>
            <Text style={styles.listInfoDescText}>{item.pd_date}</Text>
          </View>         
        </View>                 
      </View>
      <View style={styles.listInfoPriceBox}>
        <View style={styles.listInfoPriceWrap}>
          <View style={styles.listInfoPrice}>
            <Text style={styles.listInfoPriceState}>{item.pd_status}</Text>
            <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
          </View>
          {/* <View style={styles.listInfoDate}>
            <Text style={styles.listInfoDateText}>{item.date}</Text>
          </View> */}
        </View>
      </View>
    </View>
	);

  const getData2 = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_end', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log("list_end : ",responseJson);
				setItemList2(responseJson.data);
        setTotalPage2(responseJson.total_page);
        setTab1Cnt(responseJson.ing_total);
        setTab2Cnt(responseJson.total_count);
			}else{
				setItemList2([]);
				setNowPage2(1);
        setTab2Cnt(0);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
  }
  const getList2 = ({item, index}) => ( 
    <View style={styles.saleListBox}>
      <TouchableOpacity 
        style={styles.modalOpenBtn}
        activeOpacity={opacityVal}
        onPress={()=>{
          if(item.c1_idx == 1){
            setModiNav('UsedModify1');
          }else if(item.c1_idx == 2){
            setModiNav('UsedModify2');
          }else if(item.c1_idx == 3){
            setModiNav('UsedModify3');
          }else if(item.c1_idx == 4){
            setModiNav('UsedModify4');
          }
          setIdxVal(item.pd_idx);
          setItemState(item.pd_status_org);
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
        <Text style={styles.listInfoCateText}>{'['}{item.c1_name}{']'}</Text>
      </View>
      <View style={styles.listLi}>        
        {item.pd_image ? (
        <TouchableOpacity 
          style={styles.listImgBox}
          activeOpacity={opacityVal}
          onPress={() => {
            navigation.navigate('UsedView', {idx:item.pd_idx})
          }}
        >                  
          <AutoHeightImage width={63} source={{uri: item.pd_image}} style={styles.listImg} />          
        </TouchableOpacity>			
        ) : null}
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.pd_name}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{item.pd_loc}</Text>
            <View style={styles.listInfoDescBar}></View>
            <Text style={styles.listInfoDescText}>{item.pd_date}</Text>

            <View style={styles.listInfoCnt}>
              <View style={styles.listInfoCntBox}>
                <AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
                <Text style={styles.listInfoCntBoxText}>{item.mb_score}</Text>
              </View>
              <View style={styles.listInfoCntBox}>
                <AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
                <Text style={styles.listInfoCntBoxText}>{item.pd_chat_cnt}</Text>
              </View>
              <View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
                <AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
                <Text style={styles.listInfoCntBoxText}>{item.pd_like_cnt}</Text>
              </View>
            </View>
          </View>         
        </View>                 
      </View>
      <View style={styles.listInfoPriceBox}>
        <View style={styles.listInfoPriceWrap}>
          <View style={styles.listInfoPrice}>
            <Text style={styles.listInfoPriceState}>판매완료</Text>
            <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
          </View>
          {/* <View style={styles.listInfoDate}>
            <Text style={styles.listInfoDateText}>{item.date}</Text>
          </View> */}
        </View>
      </View>
    </View>
	);
  const moreData2 = async () => {
		if(totalPage2 > nowPage2){
			await Api.send('GET', 'list_end', {is_api: 1, page:nowPage2+1}, (args)=>{
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
					console.log(responseJson);
					console.log('결과 출력 실패!');
				}
			});
		}
	}

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

  //삭제하기
  function fnDelete(){
    const formData = {
			is_api:1,				
			pd_idx:idxVal,
		};

    Api.send('POST', 'del_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);				
				setVisible(false);
        setVisible2(false);
        setModiNav();
        setIdxVal();        
        setItemState();
        if(tabState==1){
          getData();
        }else{
          getData2();
        }
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //상태 변경 - 예약중
  const chgStateRes = async () => {
    const formData = {
			is_api:1,
      pd_idx:idxVal,
		};

    Api.send('POST', 'reserve_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        setVisible(false);
        setModiNav();
        setIdxVal();        
        setItemState();
        getData();
			}else{
				console.log('결과 출력 실패!', responseJson);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  //상태 변경 - 판매중
  const chgStateSell = async () => {
    const formData = {
			is_api:1,
      pd_idx:idxVal,
		};

    Api.send('POST', 'selling_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);
        setVisible(false);
        setModiNav();        
        setIdxVal();
        setItemState();
        getData2();
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //판매완료
  const dealEnd = async () => {
    setVisible(false);
    navigation.navigate('SalesComplete', {idx:idxVal, returnNavi:'UsedSaleList'});
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
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>판매중 ({tab1Cnt})</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>판매중 ({tab1Cnt})</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>판매완료 ({tab2Cnt})</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>판매완료 ({tab2Cnt})</Text>  
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
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>판매중인 상품이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
      ) : (
        <>        
        <FlatList
          data={itemList2}
          renderItem={(getList2)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData2}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>판매완료된 상품이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
        </>
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
                setVisible(false);
                navigation.navigate(modiNav, {idx:idxVal, returnNavi:'UsedSaleList'});
						  }}
						>
							<Text style={styles.modalCont2BtnText}>수정하기</Text>
						</TouchableOpacity>
            
            {itemState == 1 ? (
            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {chgStateRes()}}
						>
							<Text style={styles.modalCont2BtnText}>예약중</Text>
						</TouchableOpacity>
            ) : null}

            {itemState == 2 || itemState == 3 ? (
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {chgStateSell()}}
						>
							<Text style={styles.modalCont2BtnText}>판매중</Text>
						</TouchableOpacity>
            ) : null }

            {itemState == 1 || itemState == 2 ? (
            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {dealEnd()}}
						>
							<Text style={styles.modalCont2BtnText}>판매완료</Text>
						</TouchableOpacity>						        
            ) : null }                        

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {setVisible2(true)}}
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
              onPress={() => {fnDelete()}}
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
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
  saleListBox: {position:'relative'},
  modalOpenBtn: {display:'flex',alignItems:'center',justifyContent:'center',width:40,height:40,position:'absolute',top:16,right:5,},
  listInfoCate: {width:innerWidth,paddingHorizontal:20,paddingTop:30,marginBottom:10,},
	listInfoCateText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:15,color:'#353636'},
  listLi: {display:'flex',flexDirection:'row',flexWrap:'wrap',alignItems:'center',paddingHorizontal:20,position:'relative'},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E1E8F0'},
  listLiBorder2: {width:innerWidth,height:5,backgroundColor:'red'},  
  listImgBox: {width:63,height:63,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},  
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 63),paddingLeft:15,},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:8,position:'relative'},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#737373'},	
  listInfoDescBar: {width:1,height:10,backgroundColor:'#737373',marginHorizontal:8,position:'relative',top:-1},
  listInfoCnt: {display:'flex',flexDirection:'row',alignItems:'center',position:'absolute',top:-2,right:0,},
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
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
})

export default SaleList