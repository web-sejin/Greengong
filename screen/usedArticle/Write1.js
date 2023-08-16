import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import {Avatar2} from '../../components/Avatar2';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

//스크랩 글쓰기
const Write1 = ({navigation, route}) => {
	const fileListData = [
		{'idx': 1, 'txt': '파일1', 'path': ''},
		{'idx': 2, 'txt': '파일2', 'path': ''},
		{'idx': 3, 'txt': '파일3', 'path': ''},
		{'idx': 4, 'txt': '파일4', 'path': ''},
		{'idx': 5, 'txt': '파일5', 'path': ''},
		{'idx': 6, 'txt': '파일6', 'path': ''},
		{'idx': 7, 'txt': '파일7', 'path': ''},
		{'idx': 8, 'txt': '파일8', 'path': ''},
		{'idx': 9, 'txt': '파일9', 'path': ''},
		{'idx': 10, 'txt': '파일10', 'path': ''},
	];
	
	const chkMethodData = [
		{'idx': 1, 'txt': '수분', 'isChecked': false},
		{'idx': 2, 'txt': '통', 'isChecked': false},
		{'idx': 3, 'txt': '드럼', 'isChecked': false},
		{'idx': 4, 'txt': '마대', 'isChecked': false},
		{'idx': 5, 'txt': '파렛트', 'isChecked': false},
		{'idx': 6, 'txt': '상담필요', 'isChecked': false},
	];
	
	const sortAry = [
		{ label: '고철', value: '1' },
		{ label: '스테인레스 강', value: '2' },
		{ label: '특수강', value: '3' },
	]
	
	const ingreAry = [
		{ label: '생철', value: '1' },
		{ label: '중량', value: '2' },
		{ label: '경량', value: '3' },
	]

	const shapeAry = [
		{ label: '레이저', value: '1' },
		{ label: '뻔지', value: '2' },
		{ label: '금형', value: '3' },
	]

	const dealMethod2Ary = [
		{ label: '집게차 요청', value: '1' },
		{ label: '지게차 요청', value: '2' },
		{ label: '운반차량 요청', value: '3' },
		{ label: '상담필요', value: '4' },
	]

	const payMethodAry = [
		{ label: '계산서', value: '1' },
		{ label: '계좌이체', value: '2' },
		{ label: '현금', value: '3' },
		{ label: '협의가능', value: '4' },
	]


	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [fileCnt, setFileCnt] = useState(0);
	const [fileOrder, setFileOrder] = useState();
	const [fileConfirm, setFileConfirm] = useState(false);
	const [fileList, setFileList] = useState(fileListData);
	const [subject, setSubject] = useState(''); //글제목
	const [sort, setSort] = useState(''); //분류
	const [ingred, setIngred] = useState(''); //성분
	const [shape, setShape] = useState(''); //형태
	const [chkMethod, setChkMethod] = useState(chkMethodData); //검수
	const [dealMethod1, setDealMethod1] = useState(''); //거래방식1
	const [dealMethod2, setDealMethod2] = useState(''); //거래방식2
	const [priceUnit, setPriceUnit] = useState(''); //가격단위
	const [price, setPrice] = useState(''); //가격
	const [priceOpt, setPriceOpt] = useState(''); //가격옵션
	const [payMethod, setPayMethod] = useState(''); //결제방식
	const [content, setContent] = useState(''); //내용

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				useState();
				setFileConfirm(false);
				setFileList(fileListData);
				setSubject('');
				setSort('');
				setIngred('');
				setShape('');
				setChkMethod(chkMethodData);
				setDealMethod1('');
				setDealMethod2('');
				setPriceUnit('');
				setPrice('');
				setPriceOpt('');
				setPayMethod('');
				setContent('');
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

	function getFileCount(selectCon){
		let cnt = 0;
		selectCon.map((item) => {
			if(item.path != ''){
				cnt = cnt + 1;
			}
		});

		setFileCnt(cnt);
	}

	const onAvatarChange = (image: ImageOrVideo) => {
    //console.log(image);
		setFileConfirm(false);
		let selectCon = fileList.map((item) => {
			if(item.idx === fileOrder){
				return {...item, path: image.path};
			}else{
				return {...item, path: item.path};
			}
		});
		setFileList(selectCon);
    getFileCount(selectCon);
  };

	function deleteFile(v){
		let selectCon = fileList.map((item) => {
			if(item.idx === v){
				return {...item, path: ''};
			}else{
				return {...item, path: item.path};
			}
		});
		setFileList(selectCon);
		getFileCount(selectCon);
	}

	const handleChange = (idx) => {
		let temp = chkMethod.map((item) => {
			if(idx === item.idx){
				//console.log('idx : ', idx, ' con idx : ', item.idx);
				return { ...item, isChecked: !item.isChecked };
			}

			return item;
		});

		setChkMethod(temp);
	};

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'스크랩 글쓰기'} />
			<KeyboardAwareScrollView>
				<View style={styles.registArea}>
					<View style={[styles.registBox]}>
						<View style={[styles.typingBox, styles.typingBox2]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>사진첨부({fileCnt}/10)</Text>
							</View>
							<ScrollView
								horizontal={true}
								showsHorizontalScrollIndicator = {false}
								onMomentumScrollEnd ={() => {}}
							>
								{fileList.map((item, index) => {
									return(
										<View key={index} style={styles.photoBox}>							
											<TouchableOpacity												
												style={styles.photoBtn}
												activeOpacity={opacityVal}
												onPress={() => {
													//console.log(fileList[index])
													setFileOrder((index+1));
													setFileConfirm(true);
												}}
											>
												{item.path ? (
													<AutoHeightImage width={79} source={{uri: item.path}} />												
												) : (
													<AutoHeightImage width={79} source={require("../../assets/img/icon_plus3.png")} />
												)}
											</TouchableOpacity>
											{item.path ? (
												<TouchableOpacity
													style={styles.photoDel}
													activeOpacity={opacityVal}
													onPress={() => {deleteFile((index+1))}}
												>
													<AutoHeightImage width={21} source={require("../../assets/img/icon_delete.png")} />
												</TouchableOpacity>
											) : null}
										</View>
									)								
								})}
										{/* <AutoHeightImage width={79} source={{uri: picture}} /> */}
							
							</ScrollView>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>글 제목</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={subject}
									onChangeText={(v) => {setSubject(v)}}
									placeholder={'글 제목을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>분류</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setSort(value)}
									placeholder={{
										label: '분류를 선택해 주세요.',
										inputLabel: '분류를 선택해 주세요.',
										value: '',
										color: '#8791A1',
									}}
									items={sortAry}
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

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>성분</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setIngred(value)}
									placeholder={{
										label: '성분을 선택해 주세요.',
										inputLabel: '성분을 선택해 주세요.',
										value: '',
										color: '#8791A1',
									}}
									items={ingreAry}
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

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>형태</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setShape(value)}
									placeholder={{
										label: '형태를 선택해 주세요.',
										inputLabel: '형태를 선택해 주세요.',
										value: '',
										color: '#8791A1',
									}}
									items={shapeAry}
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

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>검수</Text>
							</View>
							<View style={[styles.filterBtnList]}>
								{chkMethod.map((item, index) => {
									return(
									<TouchableOpacity
										key = {index}
										style={[styles.filterChkBtn, item.isChecked ? styles.filterChkBtnOn : null]}
										activeOpacity={opacityVal}
										onPress={() => handleChange(item.idx)}
									>
										<Text style={[styles.filterChkBtnText, item.isChecked ? styles.filterChkBtnTextOn : null]}>{item.txt}</Text>
									</TouchableOpacity>
									)
								})}
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>거래방식1</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TouchableOpacity
									style={[styles.dealBtn, dealMethod1 == 1 ? styles.dealBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(dealMethod1 && dealMethod1 == 1){
											setDealMethod1('');
										}else{
											setDealMethod1(1);
										}
									}}
								>
									<Text style={[styles.dealBtnText, dealMethod1 == 1 ? styles.dealBtnTextOn : null]}>상차도(차량요청)</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.dealBtn, dealMethod1 == 2 ? styles.dealBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(dealMethod1 && dealMethod1 == 2){
											setDealMethod1('');
										}else{
											setDealMethod1(2);
										}
									}}
								>
									<Text style={[styles.dealBtnText, dealMethod1 == 2 ? styles.dealBtnTextOn : null]}>도착도(직접운반)</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>거래방식2</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setDealMethod2(value)}
									placeholder={{
										label: '거래방식2를 선택해 주세요.',
										inputLabel: '거래방식2를 선택해 주세요.',
										value: '',
										color: '#8791A1',
									}}
									items={dealMethod2Ary}
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
						
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>가격 단위</Text>
							</View>
							<View style={[styles.filterBtnList]}>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceUnit=='kg' ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceUnit){
											setPriceUnit('');
										}else{
											setPriceUnit('kg');
										}
									}}
								>
									<Text style={[styles.filterChkBtnText, priceUnit=='kg' ? styles.filterChkBtnTextOn : null]}>kg ₩</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>가격</Text>
							</View>							
							<View style={[styles.filterBtnList]}>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==1 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceOpt && priceOpt == 1){											
											setPriceOpt('');											
										}else{
											setPriceOpt(1);
											setPrice('0');
										}										
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==1 ? styles.filterChkBtnTextOn : null]}>나눔</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==2 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceOpt && priceOpt == 2){											
											setPriceOpt('');											
										}else{
											setPriceOpt(2);
										}										
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==2 ? styles.filterChkBtnTextOn : null]}>가격협상</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==3 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceOpt && priceOpt == 3){											
											setPriceOpt('');											
										}else{
											setPriceOpt(3);
										}										
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==3 ? styles.filterChkBtnTextOn : null]}>입찰받기</Text>
								</TouchableOpacity>
							</View>
							<View style={[styles.typingInputBox, styles.typingInputBox2, styles.typingFlexBox]}>
								<TextInput
									value={price}
									keyboardType = 'numeric'
									onChangeText={(v) => {
										let comma = (v).split(',').join('');
										comma = String(comma).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
										setPrice(comma);
										
										if(priceOpt == 1){											
											setPriceOpt('');											
										}
									}}
									placeholder={'가격을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
								<View style={styles.inputUnit}>
									<Text style={styles.inputUnitText}>원</Text>
								</View>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>결제방식</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setPayMethod(value)}
									placeholder={{
										label: '결제방식을 선택해 주세요.',
										inputLabel: '결제방식을 선택해 주세요.',
										value: '',
										color: '#8791A1',
									}}
									items={payMethodAry}
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
									placeholder={'물품에 대한 자세한 정보를 작성하면 판매확률이 올라갑니다.'}
									placeholderTextColor="#8791A1"
									multiline={true}
									style={[styles.input, styles.textarea]}
								/>
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
					<Text style={styles.nextBtnText}>확인</Text>
				</TouchableOpacity>
			</View>

			<Modal
        visible={fileConfirm}
				transparent={true}
				onRequestClose={() => {setFileConfirm(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setFileConfirm(false)}}
				></Pressable>
				<View style={styles.modalCont}>
					<Avatar2 
						onChange={onAvatarChange} 
					/>
				</View>
      </Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	registArea: {},
	registBox: {paddingVertical:20},
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
	textarea: {height:230,borderRadius:8,textAlignVertical:"top",padding:12,},
	inputContainer: {},
	selectArr: {position:'absolute',top:25.5,right:20,},
	certChkBtn: {width:80,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#353636'},
	certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:16,color:'#fff'},
	certChkBtn3: {width:110,height:58,backgroundColor:'#31B481',borderWidth:0,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText3: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	photoBox: {width:79,height:79,marginTop:10,marginRight:10,position:'relative'},
	photoBtn: {width:79,height:79,borderWidth:1,borderColor:'#E1E1E1',borderRadius:12,overflow:'hidden',
	display:'flex',alignItems:'center',justifyContent:'center',},
	photoDel: {position:'absolute',top:5,right:5,zIndex:10},
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
	filterBtnList: {display:'flex',flexDirection:'row',alignItems:'center',flexWrap:'wrap',paddingTop:5,},
	filterChkBtn: {height:34,paddingHorizontal:15,borderWidth:1,borderColor:'#E5EBF2',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,marginRight:10,},
	filterChkBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#8791A1'},
	filterChkBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	filterChkBtnTextOn: {color:'#fff'},
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

export default Write1