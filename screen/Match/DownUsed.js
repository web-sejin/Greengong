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
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const DownUsed = ({navigation, route}) => {  
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabState, setTabState] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemList2, setItemList2] = useState([]);
  const [nowPage2, setNowPage2] = useState(1);
  const [totalPage2, setTotalPage2] = useState(1);
  const [allChk, setAllChk] = useState(false); //모두 선택	

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setVisible(false);
        setVisible2(false);
        setIsLoading(false);
				setTabState(1);
			}
		}else{  
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage(1);
      setNowPage2(1);
      getData();
      setAllChk(false);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_request_dwg', {'is_api': 1, mc_idx: idx, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log("list_request_dwg : ",responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);
        setTotalCnt(responseJson.total_count);
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
      await Api.send('GET', 'list_request_dwg', {is_api: 1, mc_idx: idx, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log('list_chat more : ',responseJson.data);				
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
      style={styles.memberBoxBtn}
      activeOpacity={opacityVal}
      onPress={() => {handleChange(item.dp_idx)}}
    >
      <View style={[styles.memberBoxBtnWrap, index==0?styles.memberBoxNotLine:null,]}>
        <View style={[styles.chkShape, styles.chkShapeAbs, item.is_checked==1 ? styles.chkShapeOn : null]}>
          <AutoHeightImage width={13} source={require("../../assets/img/icon_chk_on.png")} />
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.memberDate}>
            <Text style={styles.memberDateText}>{item.dp_regdate}</Text>
          </View>
          <View style={styles.memberNick}>
            <Text style={styles.memberNickText}>{item.mb_nick}</Text>
          </View>
          <View style={styles.memberLoc}>
            <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
            <Text style={styles.memberLocText}>{item.mb_loc}</Text>
          </View>
        </View>
        <View style={styles.memberThumb}>
          {item.mb_img ? (
            <AutoHeightImage width={79} source={{uri: item.mb_img}} />
          ) : (
            <AutoHeightImage width={79} source={require("../../assets/img/not_profile.png")} />
          )}          
        </View>
      </View>
    </TouchableOpacity>
	);

  const getData2 = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_end_dwg', {'is_api': 1, mc_idx: idx, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log("list_end_dwg : ",responseJson);
				setItemList2(responseJson.data);
        setTotalPage2(responseJson.total_page);        
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
    if(totalPage2 > nowPage2){
      await Api.send('GET', 'list_end_dwg', {is_api: 1, mc_idx: idx, page:nowPage2+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log('list_chat more : ',responseJson.data);				
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
      style={styles.memberBoxBtn}
      activeOpacity={1}
    >
      <View style={[styles.memberBoxBtnWrap, index==0?styles.memberBoxNotLine:null, styles.memberBoxComplete]}>
        <View style={styles.memberInfo}>
          <View style={styles.memberDate}>
            <Text style={styles.memberDateText}>{item.dp_regdate}</Text>
          </View>
          <View style={styles.memberNick}>
            <Text style={styles.memberNickText}>{item.mb_nick}</Text>
          </View>
          <View style={styles.memberLoc}>
            <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
            <Text style={styles.memberLocText}>{item.mb_loc}</Text>
          </View>
        </View>
        <View style={styles.memberThumb}>
          {item.mb_img ? (
            <AutoHeightImage width={79} source={{uri: item.mb_img}} />
          ) : (
            <AutoHeightImage width={79} source={require("../../assets/img/not_profile.png")} />
          )}          
        </View>
      </View>
    </TouchableOpacity>
	);

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

  useEffect(() => {
		//console.log('allChk : ', allChk);
    let chkVal = 0;
    if(allChk){
      chkVal = 1;
    }else{
      chkVal = 0;
    }
		let selectCon = itemList.map((item) => {
			if(item.is_checked === chkVal){
				return {...item, is_checked: chkVal};
			}else{
				return {...item, is_checked: item.is_checked};
			}
		});

		setItemList(selectCon);
	}, [allChk]);

  //개별 선택
  const handleChange = (idx) => {  
    let temp = itemList.map((item) => {
			if(idx === item.dp_idx){
				//console.log('idx : ', idx, ' con idx : ', item.dp_idx);
        //console.log(item.is_checked);
        if(item.is_checked == 0){
          return { ...item, is_checked:1 };
        }else{
          return { ...item, is_checked:0 };
        }				
			}

			return item;
		}); 
    //console.log("temp : ",temp);   
		setItemList(temp);

    let selectedTotal = temp.filter((item) => item.is_checked);
		//console.log('temp.length : ', temp.length, 'totalSelected : ', selectedTotal.length);
		if(temp.length === selectedTotal.length){
			setAllChk(true);
		}else{			
			setAllChk(false);
		}
	};

  //전체 선택, 전체 선택 해제
	const changeAllChecked = (checked) => {
		let allCheckStatus = checked;
    let allCheckStatus2 = 0;
		//console.log('checked : ', checked);
		if(checked === true){
      allCheckStatus = false;
			allCheckStatus2 = 0;
		}else{
      allCheckStatus = true;
			allCheckStatus2 = 1;
		}
		let selectCon = itemList.map((item) => {
			return {...item, is_checked: allCheckStatus2};
		});

		setItemList(selectCon);
		setAllChk(allCheckStatus);
	}

  //선택된 회원 권한 허용
  const checkedPermit = async () => {
    let permitList = '';
    itemList.map((item, index) => {
      if(item.is_checked == 1){
        if(permitList != ''){ permitList += ","; }        
        permitList += item.dp_idx;
      }
    })

    if(permitList == ''){
      ToastMessage('허용할 회원을 1명 이상 선택해 주세요.');
    }else{
      const formData = {
        is_api:1,
        mc_idx:idx,
        permit:permitList
      };
  
      Api.send('POST', 'ok_permit_dwg', formData, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
  
        if(responseJson.result === 'success'){
          console.log('성공 : ',responseJson);
          setNowPage(1);
          setTotalPage(1);
          getData();
          setAllChk(false);
          ToastMessage('선택한 회원의 다운로드 권한을 허용했습니다.');
        }else{
          console.log('결과 출력 실패!', responseJson);
          //ToastMessage(responseJson.result_text);
        }
      });
    }
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'도면다운로드 허용'} />
      <View style={styles.tabBox}>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(1)}}
        > 
          {tabState == 1 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>요청</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>요청</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>완료</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>완료</Text>  
          )}
        </TouchableOpacity>
      </View>

      {tabState == 1 ? (
      <>
        <View style={styles.allChkBox}>
          <TouchableOpacity
            style={styles.allChkBtn}
            activeOpacity={opacityVal}
            onPress={() => changeAllChecked(allChk)}
          >
            <View style={[styles.chkShape, allChk ? styles.chkShapeOn : null]}>
              <AutoHeightImage width={13} source={require("../../assets/img/icon_chk_on.png")} />
            </View>
            <View style={styles.chkTextBox}>
              <Text style={styles.chkText}>전체</Text>
              <Text style={[styles.chkText, styles.chkTextBold]}>{totalCnt}개</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={opacityVal}
            onPress={()=>{checkedPermit()}}
          >
            <Text style={styles.submitBtnText}>선택 허용</Text>
          </TouchableOpacity>
        </View>
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
                <Text style={styles.notDataText}>권한 요청한 회원이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
      </>
      ) : (
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
                <Text style={styles.notDataText}>완료된 회원이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
      )}
      

      {/* {isLoading ? (
      <ScrollView>
        {memberList.map((item, index) => {
          return(
          <TouchableOpacity
            key={item.idx}
            style={styles.memberBoxBtn}
            activeOpacity={opacityVal}
            onPress={() => {
              {tabState == 1 ? ( handleChange(item.idx) ) : null}
            }}
          >
            <View style={[styles.memberBoxBtnWrap, index==0?styles.memberBoxNotLine:null, tabState!=1?styles.memberBoxComplete:null]}>
              {tabState == 1 ? (
              <View style={[styles.chkShape, styles.chkShapeAbs, item.is_checked ? styles.chkShapeOn : null]}>
                <AutoHeightImage width={13} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              ) : null}
              <View style={styles.memberInfo}>
                <View style={styles.memberDate}>
                  <Text style={styles.memberDateText}>{item.date}</Text>
                </View>
                <View style={styles.memberNick}>
                  <Text style={styles.memberNickText}>{item.name}</Text>
                </View>
                <View style={styles.memberLoc}>
                  <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
                  <Text style={styles.memberLocText}>{item.loc}</Text>
                </View>
              </View>
              <View style={styles.memberThumb}>
                <AutoHeightImage width={79} source={require("../../assets/img/sample1.jpg")} />
              </View>
            </View>
          </TouchableOpacity>
          )
        })}
      </ScrollView>
      ) : (
      <View style={[styles.indicator, tabState==2?styles.indicator2:null]}>
        <ActivityIndicator size="large" />
      </View>
      )} */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  allChkBox: {height:62,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  allChkBtn: {display:'flex',flexDirection:'row',alignItems:'center',},
  chkShape: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center'},
  chkShapeAbs: {position:'absolute',left:0,top:37,},
  chkShapeOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
  chkTextBox: {display:'flex',flexDirection:'row',alignItems:'center',marginLeft:10,},
  chkText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#000'},
  chkTextBold: {fontFamily:Font.NotoSansBold,marginLeft:2,},
  submitBtn: {width:70,height:40,alignItems:'flex-end',justifyContent:'center',},
  submitBtnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:19,color:'#000'},
  memberList: {paddingHorizontal:20,},
  memberBoxBtn: {paddingHorizontal:20,},
  memberBoxBtnWrap: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingVertical:30,paddingLeft:31,borderTopWidth:1,borderColor:'#E9EEF6',},
  memberBoxNotLine: {borderTopWidth:0},
  memberBoxComplete: {paddingLeft:0,},
  memberInfo: {width:(innerWidth-139)},
  memberDate: {},
  memberDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#7E93A8'},
  memberNick: {marginTop:8,},
  memberNickText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:21,color:'#353636'},
  memberLoc: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:6,},
  memberLocText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:21,color:'#000',marginLeft:5,},
  memberThumb: {width:79,height:79,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
  notData: {height:widnowHeight-220,display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default DownUsed