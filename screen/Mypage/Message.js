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

const Message = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

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
			<Header navigation={navigation} headertitle={'자주 쓰는 메세지'} />
			<ScrollView>
        <View style={styles.registArea}>					
          <View style={[styles.registBox, styles.pdTop20, styles.borderBot]}>
            <View style={styles.alertBox}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>채팅에서 자주 사용하는 메세지 등록 가능합니다.</Text>
              <Text style={[styles.alertBoxText, styles.alertBoxText2]}>100자 이내로 등록 가능합니다.</Text>              
            </View>
            <View style={styles.inputAlert}>
              <AutoHeightImage width={14} source={require("../../assets/img/icon_alert3.png")} />
              <Text style={styles.inputAlertText}>최대 5개까지 등록 가능합니다.</Text>
            </View>
            <TouchableOpacity 
              style={styles.certChkBtn2}
              activeOpacity={opacityVal}
              onPress={() => {
                navigation.navigate('MessageWrite');
              }}
            >
              <Text style={styles.certChkBtnText2}>등록</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.msgBox, styles.borderTop]}>
            <View style={styles.msgList}>
              <View style={[styles.msgLi, styles.msgLi2]}>
                <View style={styles.msgLiTit}>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.msgLiTitText}>3. 명함입니다.</Text>
                </View>
                <View style={styles.msgLiDate}>
                  <Text style={styles.msgLiDateText}>2023.07.12</Text>
                </View>
                <View style={styles.msgBtnBox}>
                  <TouchableOpacity
                    style={styles.msgBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>{}}
                  >
                    <Text style={styles.msgBtnText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.msgBtn, styles.msgBtn2]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      navigation.navigate('MessageModify', {});
                    }}
                  >
                    <Text style={styles.msgBtnText}>수정</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.msgLi}>
                <View style={styles.msgLiTit}>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.msgLiTitText}>2. 주소입니다.</Text>
                </View>
                <View style={styles.msgLiDate}>
                  <Text style={styles.msgLiDateText}>2023.07.12</Text>
                </View>
                <View style={styles.msgBtnBox}>
                  <TouchableOpacity
                    style={styles.msgBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>{}}
                  >
                    <Text style={styles.msgBtnText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.msgBtn, styles.msgBtn2]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      navigation.navigate('MessageModify', {});
                    }}
                  >
                    <Text style={styles.msgBtnText}>수정</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.msgLi}>
                <View style={styles.msgLiTit}>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.msgLiTitText}>1. 회사 소개를 합니다. 회사 소개를 합니다. 회사 소개를 합니다.</Text>
                </View>
                <View style={styles.msgLiDate}>
                  <Text style={styles.msgLiDateText}>2023.07.12</Text>
                </View>
                <View style={styles.msgBtnBox}>
                  <TouchableOpacity
                    style={styles.msgBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>{}}
                  >
                    <Text style={styles.msgBtnText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.msgBtn, styles.msgBtn2]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      navigation.navigate('MessageModify', {});
                    }}
                  >
                    <Text style={styles.msgBtnText}>수정</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* <View style={styles.notData}>
              <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
              <Text style={styles.notDataText}>자주 쓰는 메세지가 없습니다.</Text>
            </View> */}
          </View>
        </View>
      </ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlertText: {width:(innerWidth-14),paddingLeft:7,fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#ED0000'},
  certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
  certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
  msgBox: {paddingHorizontal:20,paddingBottom:30,},
  msgList : {},
  msgLi: {height:86,paddingVertical:20,paddingRight:140,position:'relative',borderTopWidth:1,borderColor:'#E9EEF6'},
  msgLi2: {borderTopWidth:0,},
  msgLiTit: {},
  msgLiTitText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:22,color:'#000'},
  msgLiDate: {marginTop:5,},
  msgLiDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#898989'},
  msgBtnBox: {display:'flex',flexDirection:'row',alignItems:'center',position:'absolute',right:0,top:30},
  msgBtn: {width:54,height:25,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
  msgBtn2: {backgroundColor:'#31B481',marginLeft:10,},
  msgBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#fff',},

  notData: {height:(widnowHeight-420),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  pdTop20: {paddingTop:20,},
})

export default Message