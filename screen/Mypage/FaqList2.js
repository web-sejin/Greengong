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

const FaqList2 = ({navigation, route}) => {
  const sct = route.params.filter;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [schText, setSchText] = useState(sct);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        //setSchText('');
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

  function _submit(){
    console.log("search!");
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'고객센터'} />
			<KeyboardAwareScrollView>
				<View style={styles.faqList}>
					<View style={styles.faqSch}>
            <View style={styles.faqSchBox}>
              <TextInput
                value={schText}
                onChangeText={(v) => {setSchText(v)}}
                //placeholder={''}
                placeholderTextColor="#8791A1"
                style={[styles.input]}
              />
              <TouchableOpacity 
                style={styles.faqSchBtn}
                activeOpacity={opacityVal}
                onPress={() => {
                  _submit();
                }}
              >                
                <AutoHeightImage width={16} source={require("../../assets/img/icon_search.png")} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.faqSchCancel}
              activeOpacity={opacityVal}
              onPress={() => {
                navigation.navigate('FaqList');
              }}
            >
              <Text style={styles.faqSchCancelText}>취소</Text>
            </TouchableOpacity>
          </View>

					<View style={styles.faqCont}>
						<TouchableOpacity
							style={styles.faqContBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								navigation.navigate('FaqView', {pageLoc:'FaqList2'});
							}}
						>
							<Text style={styles.faqContBtnText}>중고 상품 등록은 어떻게 하나요?</Text>
							<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.faqContBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								navigation.navigate('FaqView', {pageLoc:'FaqList2'});
							}}
						>
							<Text style={styles.faqContBtnText}>중고 상품 등록은 어떻게 하나요?</Text>
							<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.faqContBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								navigation.navigate('FaqView', {pageLoc:'FaqList2'});
							}}
						>
							<Text style={styles.faqContBtnText}>중고 상품 등록은 어떻게 하나요?</Text>
							<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} />
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('QnaList');
					}}
				>
					<Text style={styles.nextBtnText}>1:1문의</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
	faqList: {padding:20,paddingBottom:30,},
	faqSch: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  faqSchBox: {width:(innerWidth-45),display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#C5C5C6',borderRadius:12,paddingLeft:15,paddingRight:5,},
  input: {width:(innerWidth-101),height:48,fontSize:15,color:'#000'},
  faqSchBtn: {display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,},
  faqSchCancel: {display:'flex',alignItems:'flex-end',justifyContent:'center',width:35,height:48,},
  faqCont: {borderTopWidth:2,borderColor:'#191919',marginTop:20,},
	faqContBtn: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:25,borderBottomWidth:1,borderColor:'#E2E2E2'},
	faqContBtnText: {width:(innerWidth-22),fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#000'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default FaqList2