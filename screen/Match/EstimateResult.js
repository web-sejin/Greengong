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

const EstimateResult = ({navigation, route}) => {
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
			<Header navigation={navigation} headertitle={'예상견적서'} backType={'close'} />
			<ScrollView>
        <View style={styles.estResult}>
          <View style={[styles.registBox, styles.borderBot]}>
              <View style={{marginBottom:10,}}>
                <Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>발행정보</Text>
              </View>
              <View style={styles.alertBox}>
                <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
                <Text style={styles.alertBoxText}>참좋은공장</Text>
                <Text style={[styles.alertBoxText, styles.alertBoxText2]}>아직 밝혀지지 않은 달 뒤를 가보고 남은 장비 프로젝트</Text>
              </View>
              <View style={[styles.tableCust, styles.mgTop10]}>
                <Text style={styles.tableCustText}>유효기간</Text>
                <Text style={[styles.tableCustText, styles.tableCustText2, styles.tableCustTextBold]}>발행일로부터 2일</Text>
              </View>
          </View>

          <View style={[styles.registBox, styles.borderBot]}>
              <View>
                <Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>공급자정보</Text>
              </View>
              <View style={[styles.tableCust, styles.mgTop15]}>
                <Text style={styles.tableCustText}>상호명</Text>
                <Text style={[styles.tableCustText, styles.tableCustText2]}>넥센타이어</Text>
              </View>
              <View style={[styles.tableCust, styles.mgTop15]}>
                <Text style={styles.tableCustText}>등록번호</Text>
                <Text style={[styles.tableCustText, styles.tableCustText2]}>1112-2222-3333</Text>
              </View>
              <View style={[styles.tableCust, styles.mgTop15]}>
                <Text style={styles.tableCustText}>담당자명</Text>
                <Text style={[styles.tableCustText, styles.tableCustText2]}>홍길동</Text>
              </View>
              <View style={[styles.tableCust, styles.mgTop15]}>
                <Text style={styles.tableCustText}>담당자 연락처</Text>
                <Text style={[styles.tableCustText, styles.tableCustText2]}>010-1234-5678</Text>
              </View>
              <View style={[styles.tableCust, styles.mgTop15]}>
                <Text style={styles.tableCustText}>담당자 이메일</Text>
                <Text style={[styles.tableCustText, styles.tableCustText2]}>nexen@google.com</Text>
              </View>
          </View>

          <View style={[styles.registBox, styles.borderBot]}>
            <View>
              <Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>납품정보</Text>
            </View>
            <View style={[styles.tableCust, styles.mgTop15]}>
              <Text style={styles.tableCustText}>납품가능일</Text>
              <Text style={[styles.tableCustText, styles.tableCustText2]}>발주일로부터 5일</Text>
            </View>
          </View>

          <View style={[styles.registBox, styles.borderBot]}>
            <View>
              <Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>견적정보 (2개)</Text>
            </View>
            <View style={styles.mgTop15}>
              <View style={[styles.tableCust, styles.tableCustFlex, styles.borderBot, styles.paddBot30]}>
                <View>
                  <Text style={styles.tableCustText3}>저장된품명1</Text>
                  <Text style={styles.tableCustText}>저장된재질1</Text>
                </View>
                <View>
                  <Text style={[styles.tableCustText, styles.tableCustText2]}>(1개) 3,000원</Text>
                </View>
              </View>
              <View style={[styles.tableCust, styles.tableCustFlex, styles.paddTop30]}>
                <View>
                  <Text style={styles.tableCustText3}>저장된품명2</Text>
                  <Text style={styles.tableCustText}>저장된재질2</Text>
                </View>
                <View>
                  <Text style={[styles.tableCustText, styles.tableCustText2]}>(1개) 3,000원</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.registBox, styles.borderBot]}>
            <View>
              <Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>디자인/설계 정보 (2개)</Text>
            </View>
            <View style={styles.mgTop15}>
              <View style={[styles.tableCust, styles.tableCustFlex, styles.borderBot, styles.paddBot30]}>
                <View>
                  <Text style={[styles.tableCustText3, styles.tableCustText4]}>품명1</Text>
                </View>
                <View>
                  <Text style={[styles.tableCustText, styles.tableCustText2]}>3,000원</Text>
                </View>
              </View>
              <View style={[styles.tableCust, styles.tableCustFlex, styles.paddTop30]}>
                <View>
                <Text style={[styles.tableCustText3, styles.tableCustText4]}>품명2</Text>
                </View>
                <View>
                  <Text style={[styles.tableCustText, styles.tableCustText2]}>3,000원</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.registBox]}>
						<View>
							<Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>소계</Text>
						</View>
						<View style={styles.table}>
							<Text style={styles.tableth}>공급가액</Text>
							<View style={styles.tabletd}>
								<Text style={[styles.tabletdText]}>1,230,000</Text>
								<Text style={styles.tabletdText}>원</Text>
							</View>
						</View>
						<View style={styles.table}>
							<Text style={styles.tableth}>부가세(10%)</Text>
							<View style={styles.tabletd}>
								<Text style={[styles.tabletdText]}>123,000</Text>
								<Text style={styles.tabletdText}>원</Text>
							</View>
						</View>
            <View style={styles.table}>
							<Text style={styles.tableth}>배송비</Text>
							<View style={styles.tabletd}>
								<Text style={[styles.tabletdText]}>1,000</Text>
								<Text style={styles.tabletdText}>원</Text>
							</View>
						</View>
						<View style={[styles.table, styles.table2]}>
							<Text style={[styles.tableth, styles.tablethBold]}>총 견적금액</Text>
							<View style={[styles.tabletd]}>
								<Text style={[styles.tabletdText, styles.tabletdTextBold, styles.tabletdTextGreen]}>30,000</Text>
								<Text style={[styles.tabletdText, styles.tabletdTextGreen]}>원</Text>
							</View>
						</View>
					</View>
        </View>
      </ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	  
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  mgTop10: {marginTop:15,},
  mgTop15: {marginTop:15,},
  mgTop30: {marginTop:30,},
  mgTop35: {marginTop:35,},
  paddTop30: {paddingTop:30},
  paddBot30: {paddingBottom:30},
  estResult: {},
  registBox: {padding:20,paddingVertical:30,},
  salesAlert: {padding:20,paddingTop:25,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  tableCust: {display:'flex',flexDirection:'row',justifyContent:'space-between'},
  tableCustFlex: {alignItems:'center',},
  tableCustText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#4B5064'},
  tableCustText2: {fontFamily:Font.NotoSansRegular,color:'#000'},
  tableCustText3: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#000',marginBottom:3,},
  tableCustText4: {marginBottom:0},
  tableCustTextBold: {fontFamily:Font.NotoSansBold},
  table: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,},
	table_2: {marginTop:12},
	table2: {marginTop:20,paddingTop:20,borderTopWidth:1,borderTopColor:'#000'},
	tableth: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000'},
	tablethBold: {fontFamily:Font.NotoSansBold},
	tabletd: {display:'flex',flexDirection:'row',alignItems:'center'},
	tabletdText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000'},
	tabletdTextBold: {fontFamily:Font.NotoSansBold},
	tabletdTextGreen: {color:'#31B481'},
})

export default EstimateResult