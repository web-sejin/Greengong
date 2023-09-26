import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const QnaModify = (props) => {
	const {navigation, route} = props;
	const idx = route.params.bd_idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
	const [isLoading, setIsLoading] = useState(true); 
	const [visible, setVisible] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setSubject('');
        setContent('');
				setIsLoading(false);
				setVisible(false);
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

	const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'view_1to1', {is_api: 1, bd_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson);
				setSubject(responseJson.bd_title);
				setContent(responseJson.bd_contents);
        setIsLoading(true);
			}else{
				console.log(responseJson.result_text);
			}
		});
  }

  useEffect(() => {
    getData();
  }, []);

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
			bd_idx:idx,	
			bd_title:subject,
			bd_contents:content
		};

		Api.send('POST', 'modify_1to1', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);				
				//navigation.navigate('QnaView', {bd_idx:idx});
				navigation.navigate('QnaList', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				setIsLoading(false);
				ToastMessage(responseJson.result_text);
			}
		});
  }

	const fnDelete = async () => {
		let formData = {
			is_api:1,			
			bd_idx:idx,	
		};

		Api.send('POST', 'del_1to1', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				setVisible(false);
				navigation.navigate('QnaList', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				setIsLoading(false);
				ToastMessage(responseJson.result_text);
			}
		});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'1:1 문의'} />			
			<KeyboardAwareScrollView>
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
									placeholder={'내용을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									multiline={true}
									style={[styles.input, styles.textarea]}
								/>
							</View>
						</View>
            <View style={[styles.btnList, styles.mgTop35]}>              
              <TouchableOpacity
                style={[styles.btn, styles.btn2]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  _submit();
                }}
              >
                <Text style={styles.btnText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btn3]}
                activeOpacity={opacityVal}
                onPress={()=>{setVisible(true)}}
              >
                <Text style={styles.btnText}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={opacityVal}
                onPress={()=>{
                  //navigation.navigate('QnaList');
									navigation.goBack();
                }}
              >
                <Text style={styles.btnText}>리스트</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>			

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
              onPress={() => {setVisible(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {fnDelete();}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>

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
	typingTitle: {},
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
  btn: {display:'flex',alignItems:'center',justifyContent:'center',width:((innerWidth/3)-7),height:58,backgroundColor:'#656565',borderRadius:12,},
  btn2: {backgroundColor:'#31B481'},
  btn3: {backgroundColor:'#C5C5C6'},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:22,color:'#fff'},

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

export default QnaModify