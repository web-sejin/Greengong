import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Distance = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [dst, setDst] = useState();

  const dstAry = [
		{ label: '5km', value: '5' },
		{ label: '8km', value: '8' },
		{ label: '10km', value: '10' },
    { label: '15km', value: '15' },
	]

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setDst();
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

  function submitRegist(){}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'반경설정'} />
			<ScrollView>
        <View style={styles.registArea}>
          <View style={[styles.registBox, styles.registBox3]}>
            <View style={[styles.typingBox]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>반경</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setDst(value)}
									placeholder={{
										label: '반경을 선택해 주세요.',
										inputLabel: '반경을 선택해 주세요.',
										value: '',
										color: '#8791A1',
									}}
									items={dstAry}
									fixAndroidTouchableBug={true}
									useNativeAndroidPickerStyle={false}
									style={{
										placeholder: {color: '#8791A1'},
										inputAndroid: styles.input,
										inputAndroidContainer: styles.inputContainer,
										inputIOS: styles.input,
										inputIOSContainer: styles.inputContainer,
									}}
								/>
								<AutoHeightImage width={12} source={require("../../assets/img/icon_arrow3.png")} style={styles.selectArr} />
							</View>
						</View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.nextFix}>
        <TouchableOpacity 
          style={styles.nextBtn}
          activeOpacity={opacityVal}
          onPress={() => submitRegist()}
        >
          <Text style={styles.nextBtnText}>수정</Text>
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
  registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:0,marginTop:-5},
	registBox3: {paddingTop:20,},
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
  selectArr: {position:'absolute',top:25.5,right:20,},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default Distance