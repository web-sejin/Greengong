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

const Message = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [msgList, setMsgList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [idx, setIdx] = useState();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setIsLoading(false);
				setIdx();
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(true);
    await Api.send('GET', 'list_text', {'is_api': 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson);
        setMsgList(responseJson.data);
        setTotalCnt(responseJson.total_count);
			}else{
        setMsgList([]);
				setTotalCnt(0);
				//console.log('결과 출력 실패!', responseJson.result_text);
        ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(false);
  }

  function msgWriteGo(){
    if(totalCnt < 5){
      navigation.navigate('MessageWrite');
    }else{
      ToastMessage('자주 쓰는 메세지는 최대 5개까지 등록할 수 있습니다.\n메세지를 삭제 후 등록해 주세요.');
    }
  }

  function _delete(){
		let formData = {
			is_api:1,			
			bs_idx:idx,	
		};

		Api.send('POST', 'del_text', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				setVisible(false);
				getData();
			}else{
				console.log('결과 출력 실패!', resultItem);
				setIsLoading(false);
				ToastMessage(responseJson.result_text);
			}
		});
	}

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
              onPress={() => {msgWriteGo()}}
            >
              <Text style={styles.certChkBtnText2}>등록</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.msgBox, styles.borderTop]}>
            {totalCnt > 0 ? (
            <View style={styles.msgList}>
              {msgList.map((item, index) => {
                return(
                  <View 
                    key={item.bs_idx}
                    style={[styles.msgLi, index==0 ? styles.msgLi2 : null]}
                  >
                    <View style={styles.msgLiTit}>
                      <Text numberOfLines={1} ellipsizeMode='tail' style={styles.msgLiTitText}>{totalCnt-index}. {item.bs_subject}</Text>
                    </View>
                    <View style={styles.msgLiDate}>
                      <Text style={styles.msgLiDateText}>{item.date}</Text>
                    </View>
                    <View style={styles.msgBtnBox}>
                      <TouchableOpacity
                        style={styles.msgBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>{
                          setIdx(item.bs_idx);
                          setVisible(true);
                        }}
                      >
                        <Text style={styles.msgBtnText}>삭제</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.msgBtn, styles.msgBtn2]}
                        activeOpacity={opacityVal}
                        onPress={() => {
                          navigation.navigate('MessageModify', {idx:item.bs_idx});
                        }}
                      >
                        <Text style={styles.msgBtnText}>수정</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}
            </View>
            ) : (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>자주 쓰는 메세지가 없습니다.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={visible}
				transparent={true}
				onRequestClose={() => {setVisible(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible(false)}}
				></Pressable>
				<View style={styles.modalCont3}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>삭제</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>삭제를 하면 다시 복구되지 않습니다.</Text>
            <Text style={styles.avatarDescText}>삭제를 진행하시겠습니까?</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {
                setIdx();
                setVisible(false);
              }}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {_delete();}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>

      {/* {!isLoading ? null : (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" />
      </View>
      )} */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},	
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
  indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},

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

export default Message