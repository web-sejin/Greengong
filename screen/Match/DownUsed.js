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

const DownUsed = ({navigation, route}) => {
  const DATA = [
		{
			idx: '1',
			name: '참좋은공장',
			loc: '중1동',
			date: '2023.07.06 · 2일전',
      isChecked:false,
		},
		{
			idx: '2',
			name: '참좋은공장2',
			loc: '중2동',
			date: '2023.07.06 · 2일전',
      isChecked:false,
		},
    {
			idx: '3',
			name: '참좋은공장3',
			loc: '중3동',
			date: '2023.07.06 · 2일전',
      isChecked:false,
		},
    {
			idx: '4',
			name: '참좋은공장4',
			loc: '중4동',
			date: '2023.07.06 · 2일전',
      isChecked:false,
		},
    {
			idx: '5',
			name: '참좋은공장5',
			loc: '중5동',
			date: '2023.07.06 · 2일전',
      isChecked:false,
		},
	];

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabState, setTabState] = useState(1);
  const [memberList, setMemberList] = useState(DATA);
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
        setMemberList(DATA);
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
    }, 2000);
  }, []);

  function fnTab(v){
    setIsLoading(false);
    setTabState(v);
    setTimeout(function(){
      setIsLoading(true);
    }, 2000);
  }

  useEffect(() => {
		//console.log('allChk : ', allChk);
		let selectCon = memberList.map((item) => {
			if(item.isChecked === allChk){
				return {...item, isChecked: allChk};
			}else{
				return {...item, isChecked: item.isChecked};
			}
		});

		setMemberList(selectCon);
	}, [allChk]);

  //개별 선택
  const handleChange = (idx) => {
		let temp = memberList.map((item) => {
			if(idx === item.idx){
				//console.log('idx : ', idx, ' con idx : ', item.idx);
				return { ...item, isChecked: !item.isChecked };
			}

			return item;
		});

		setMemberList(temp);

    let selectedTotal = temp.filter((item) => item.isChecked);
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
		//console.log('checked : ', checked);
		if(checked === true){
			allCheckStatus = false;
		}else{
			allCheckStatus = true;
		}
		//console.log('allCheckStatus btn : ', allCheckStatus);
		let selectCon = memberList.map((item) => {
			return {...item, isChecked: allCheckStatus};
		});

		setMemberList(selectCon);
		setAllChk(allCheckStatus);
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
            <Text style={[styles.chkText, styles.chkTextBold]}>{memberList.length}개</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={opacityVal}
          onPress={()=>{}}
        >
          <Text style={styles.submitBtnText}>선택 허용</Text>
        </TouchableOpacity>
      </View>
      ) : null}
      {isLoading ? (
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
              <View style={[styles.chkShape, styles.chkShapeAbs, item.isChecked ? styles.chkShapeOn : null]}>
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
      )}
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
  chkShapeAbs: {position:'absolute',left:0,top:32,},
  chkShapeOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
  chkTextBox: {display:'flex',flexDirection:'row',alignItems:'center',marginLeft:10,},
  chkText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#000'},
  chkTextBold: {fontFamily:Font.NotoSansBold,marginLeft:2,},
  submitBtn: {},
  submitBtnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:19,color:'#000'},
  memberList: {paddingHorizontal:20,},
  memberBoxBtn: {paddingHorizontal:20,},
  memberBoxBtnWrap: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingVertical:30,paddingLeft:31,borderTopWidth:1,borderColor:'#E9EEF6',},
  memberBoxNotLine: {borderTopWidth:0},
  memberBoxComplete: {paddingLeft:0,},
  memberInfo: {width:(innerWidth-89)},
  memberDate: {},
  memberDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#7E93A8'},
  memberNick: {marginTop:8,},
  memberNickText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:21,color:'#353636'},
  memberLoc: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:6,},
  memberLocText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:21,color:'#000',marginLeft:5,},
  memberThumb: {borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
})

export default DownUsed