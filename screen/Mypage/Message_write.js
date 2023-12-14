import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MessageWrite = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
	const [contLen, setContLen] = useState(0);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setSubject('');
        setContent('');
				setIsLoading(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  function _submit(){
    if(subject == ''){
      ToastMessage('제목을 입력해 주세요.');
      return false;
    }
    
    if(content == ''){
      ToastMessage('내용을 입력해 주세요.');
      return false;
    }

		setIsLoading(true);

		let formData = {
			is_api:1,				
			subject:subject,
			content:content
		};

		Api.send('POST', 'save_text', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				navigation.navigate('Message');
			}else{
				console.log('결과 출력 실패!', resultItem);
				setIsLoading(false);
				ToastMessage(responseJson.result_text);
			}
		});
  }

	useEffect(()=>{
		setContLen(content.length);
	},[content])

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'자주 쓰는 메세지'} />			
			<KeyboardAwareScrollView keyboardShouldPersistTaps="always">
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.registArea}>
						<View style={[styles.registBox]}>
							<View style={[styles.typingBox]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>제목</Text>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={subject}
										onChangeText={(v) => {setSubject(v)}}
										placeholder={'제목을 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>
							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>내용</Text>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={content}
										onChangeText={(v) => {
											setContent(v);
										}}
										maxLength={100}
										placeholder={'내용을 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										multiline={true}
										style={[styles.input, styles.textarea]}
									/>	
									<View style={styles.textCnt}>
										<Text style={styles.textCntText}>{contLen}/100</Text>
									</View>							
								</View>							
							</View>
							<View style={[styles.btnList, styles.mgTop35]}>
								<TouchableOpacity
									style={styles.btn}
									activeOpacity={opacityVal}
									onPress={()=>{
										navigation.navigate('Message');
									}}
								>
									<Text style={styles.btnText}>리스트</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.btn, styles.btn2]}
									activeOpacity={opacityVal}
									onPress={()=>{
										_submit();
									}}
								>
									<Text style={styles.btnText}>확인</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

			{isLoading ? (
			<View style={[styles.indicator]}>
				<ActivityIndicator size="large" />
			</View>
			) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
  mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
  registArea: {},
	registBox: {paddingTop:20,paddingBottom:30,},
	typingBox: {paddingHorizontal:20,},
	typingBox2: {paddingRight:0,},
	typingTitle: {paddingLeft:9},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingInputBox2: {marginTop:5},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	textarea: {height:230,borderRadius:12,textAlignVertical:"top",padding:12,},
  btnList: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,},
  btn: {display:'flex',alignItems:'center',justifyContent:'center',width:120,height:58,backgroundColor:'#656565',borderRadius:12,},
  btn2: {width:innerWidth-130,backgroundColor:'#31B481'},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:22,color:'#fff'},
	textCnt: {position:'absolute',right:10,bottom:10},
	textCntText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,},
})

export default MessageWrite