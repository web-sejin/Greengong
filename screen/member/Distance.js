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

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Distance = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
  const [dst, setDst] = useState();
	const [dstList, setDstList] = useState([]);

	const getDistance = async () => {
    setIsLoading(false);
    await Api.send('GET', 'insert_radius', {'is_api': 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("insert_radius : ",responseJson);
				setDstList(responseJson.data);
				setDst(responseJson.mb_radius);
			}else{	
        ToastMessage(responseJson.result_text);
			}
		});
    setIsLoading(true);
  }

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setIsLoading(false);
			}
		}else{			
			setRouteLoad(true);
			setPageSt(!pageSt);
			getDistance();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  function submitRegist(){
		if(!dst){
			ToastMessage('반경을 선택해 주세요.');
			return false;
		}

		const formData = {
			is_api:1,				
			mb_radius:dst,
		};

    Api.send('POST', 'save_radius', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				ToastMessage('반경이 수정되었습니다.');
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'반경 설정'} />
			{isLoading ? (
				<>
				<ScrollView>
					<View style={styles.registArea}>
						<View style={[styles.registBox, styles.registBox3]}>
							<View style={styles.alertBox}>
								<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
								<Text style={styles.alertBoxText}>설정된 반경은 중고상품, 매칭을 보는데 사용합니다.</Text>
							</View>
							<View style={[styles.typingBox, styles.mgTop30]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>반경</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<RNPickerSelect
										value={dst}
										onValueChange={(value) => setDst(value)}
										placeholder={{
											label: '반경을 선택해 주세요.',
											inputLabel: '반경을 선택해 주세요.',
											value: '',
											color: '#8791A1',
										}}
										items={dstList}
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
				</>
			) : (
				<View style={[styles.indicator]}>
					<ActivityIndicator size="large" />
				</View>
			)}			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
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

//export default Distance
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Distance);