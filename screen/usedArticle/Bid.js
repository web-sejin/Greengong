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

const Bid = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [bidPirce, setBidPrice] = useState();
  const [bidUnit, setBidUnit] = useState(1);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setBidPrice();
        setBidUnit(1);
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
			<Header navigation={navigation} headertitle={'입찰하기'} />
			<KeyboardAwareScrollView>
        <View style={[styles.listLi, styles.borderBot]}>
          <AutoHeightImage width={116} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
          <View style={styles.listInfoBox}>
            <View style={styles.listInfoSort}>
              <Text style={styles.listInfoSortText}>[스크랩]</Text>
            </View>
            <View style={styles.listInfoSeller}>
              <Text style={styles.listInfoSellerText}>참좋은공장</Text>
            </View>
            <View style={styles.listInfoTitle}>
              <Text style={styles.listInfoTitleText}>우주선 중고자재 팝니다.</Text>
            </View>
            <View style={styles.listInfoDesc}>
              <Text style={styles.listInfoDescText}>신중동 · 3일전</Text>
            </View>
            <View style={styles.listInfoUnit}>
              <Text style={styles.listInfoUnitText}>kg ₩</Text>
            </View>
          </View>
        </View>
        <View style={[styles.registBox, styles.borderTop]}>
          <View style={styles.alertBox}>
            <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
            <Text style={styles.alertBoxText}>입찰은 게시글당 1회만 할 수 있습니다.</Text>
            <Text style={[styles.alertBoxText, styles.alertBoxText2]}>합리적인 가격으로 입찰해 주세요.</Text>
          </View>

          <View style={[styles.typingBox, styles.mgTop30]}>
            <View style={styles.typingTitle}>
              <Text style={styles.typingTitleText}>가격 단위</Text>
            </View>
            <View style={[styles.typingInputBox, styles.typingFlexBox]}>
              <TouchableOpacity
                style={[styles.dealBtn, bidUnit == 1 ? styles.dealBtnOn : null]}
                activeOpacity={opacityVal}
                onPress={() => {
                  if(bidUnit && bidUnit == 1){
                    setBidUnit('');
                  }else{
                    setBidUnit(1);
                  }
                }}
              >
                <Text style={[styles.dealBtnText, bidUnit == 1 ? styles.dealBtnTextOn : null]}>kg ₩ 가격</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dealBtn, bidUnit == 2 ? styles.dealBtnOn : null]}
                activeOpacity={opacityVal}
                onPress={() => {
                  if(bidUnit && bidUnit == 2){
                    setBidUnit('');
                  }else{
                    setBidUnit(2);
                  }
                }}
              >
                <Text style={[styles.dealBtnText, bidUnit == 2 ? styles.dealBtnTextOn : null]}>m³ ₩ 가격</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.typingBox, styles.mgTop35]}>
            <View style={styles.typingTitle}>
              <Text style={styles.typingTitleText}>입찰 단가 입력</Text>
            </View>
            <View style={[styles.typingInputBox]}>
              <TextInput
                value={bidPirce}
                keyboardType = 'numeric'
                onChangeText={(v) => {setBidPrice(v)
                  const comma = v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");										
                  setBidPrice(comma);
                }}
                placeholder={"입찰 단가를 입력해 주세요."}
                style={[styles.input]}
                placeholderTextColor={"#8791A1"}
              />
              <View style={styles.inputUnit}>
                <Text style={styles.inputUnitText}>kg ₩</Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => {}}
				>
					<Text style={styles.nextBtnText}>입찰하기</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  mgTop30: {marginTop:30,},
  mgTop35: {marginTop:35,},
  listLi: {display:'flex',flexDirection:'row',paddingHorizontal:20,paddingTop:25,paddingBottom:35},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	listImg: {borderRadius:8},
	listInfoBox: {width:(innerWidth - 116),paddingLeft:15,},
  listInfoSort: {},
  listInfoSortText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#000'},
  listInfoSeller: {},
  listInfoSellerText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoTitle: {marginTop:5},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},
	listInfoUnit: {marginTop:5},
	listInfoUnitText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#353636'},
  registBox: {padding:20,paddingTop:35,},	
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	typingBox: {},
	typingTitle: {},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
  dealBtn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	dealBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	dealBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,color:'#8791A1'},
	dealBtnTextOn: {color:'#fff'},
  inputUnit: {position:'absolute',top:0,right:20,},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#000'},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default Bid