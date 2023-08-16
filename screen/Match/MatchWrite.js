import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';
import DocumentPicker from 'react-native-document-picker'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import {Avatar2} from '../../components/Avatar2';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;
let today = new Date();
let year = today.getFullYear();
let todayMonth = today.getMonth() + 1;
let todayDate = today.getDate();
if(todayMonth.toString().length < 2){ todayMonth = '0'+todayMonth; }
if(todayDate.toString().length < 2){ todayDate = '0'+todayDate; }
today = `${year}-${todayMonth}-${todayDate}`;

LocaleConfig.locales['kr'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['01','02','03','04','05','06','07','08','09','10','11','12'],
  dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  //today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'kr';

//스크랩 글쓰기
const MatchWrite = ({navigation, route}) => {
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
		{ label: '직접입력', value: '4' },
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
		{ label: '직접입력', value: '4' },
	]

	const contentMsg = '도면의 치수, 가공 용도, 상세 가공 요청을파트너에게 알려주세요. 요청 사항이 상세할수록, 업체로부터 정확한 답변을 받을 확률이 높아집니다.\n공차\n조립성\n도색\n표면처리\n도면의 치수\n가공용도\n상세 가공 요청';
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [fileCnt, setFileCnt] = useState(0);
	const [fileOrder, setFileOrder] = useState();
	const [fileConfirm, setFileConfirm] = useState(false);
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [fileList, setFileList] = useState(fileListData);
	const [subject, setSubject] = useState(''); //글제목
	const [cate, setCate] = useState(''); //카테고리
	const [sort, setSort] = useState(''); //분류
	const [matt1, setMatt1] = useState(''); //재료1
	const [matt2, setMatt2] = useState(''); //재료2
	const [matt2Direct, setMatt2Direct] = useState(''); //재료2-직접입력
	const [cnt, setCnt] = useState(''); //수량
	const [floorFile, setFloorFile] = useState(''); //도면 파일
	const [floorFileType, setFloorFileType] = useState(''); //도면 파일
	const [floorFileUri, setFloorFileUri] = useState(''); //도면 파일
	const [call, setCall] = useState(false); //설계요청
	const [security, setSecurity] = useState(''); //도면보안설정
	const [advice, setAdvice] = useState(''); //상담방식(견적서)
	const [projectName, setProjectName] = useState(''); //프로젝트명
	const [useInfo, setUseInfo] = useState(''); //제품용도
	const [indCate, setIndCate] = useState(''); //[산업] 카테고리
	const [indCateDirect, setIndCateDirect] = useState(''); //[산업] 카테고리-직접입력
	const [endDateMethod, setEndDateMethod] = useState(''); //납기일방식
	const [endDate, setEndDate] = useState(''); //납기일
	const [endDateObj, setEndDateObj] = useState(); //납기일
	const [price, setPrice] = useState(''); //추정예산범위(금액)
	const [content, setContent] = useState(contentMsg); //도면상세정보

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				useState();
				setFileConfirm(false);
				setFileList(fileListData);
				setSubject('');
				setCate('');
				setSort('');
				setMatt1('');
				setMatt2('');
				setMatt2Direct('');
				setCnt('');
				setFloorFile('');
				setFloorFileType('');
				setFloorFileUri('');
				setCall(false);
				setSecurity('');
				setAdvice('');
				setProjectName('');
				setUseInfo('');				
				setIndCate('');
				setIndCateDirect('');
				setEndDateMethod('');
				setEndDate('');
				setEndDateObj();
				setPrice('');
				setContent(contentMsg);
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

	const openPicker = async () => {
		console.log(DocumentPicker.types)
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			})
			setFloorFile(res[0].name);
			setFloorFileType(res[0].type);
			setFloorFileUri(res[0].uri);

			// console.log(
			// 	res.uri,
			// 	res.type, // mime type
			// 	res.name,
			// 	res.size
			// )
			// console.tron.debug('URI')
			// console.tron.debug(res)
			const name = decodeURIComponent(res.uri)
	
			if (name.startsWith(CONTENT_PREFIXES.RESILLIO_SYNC)) {
				const realPath = name.replace(CONTENT_PREFIXES.RESILLIO_SYNC, '')
				const content = await RNFetchBlob.fs.readFile(realPath, 'utf8')
				const stat = await RNFetchBlob.fs.stat(realPath, 'utf8')
				// console.tron.debug(stat)
				// console.tron.debug(content)
				await RNFetchBlob.fs.writeFile(realPath, content + '1')
			}
			return
		} catch (err) {}
	}

	function addDates(day) {
    let obj = {[day.dateString]: {selected: true},}
    setEndDate(day.dateString);
		setEndDateObj(obj);
		setCalendarVisible(false);
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'매칭 글쓰기'} />
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
								<Text style={styles.typingTitleText}>카테고리</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setCate(value)}
									placeholder={{
										label: '카테고리를 선택해 주세요.',
										inputLabel: '카테고리를 선택해 주세요.',
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
								<Text style={styles.typingTitleText}>재료1</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setMatt1(value)}
									placeholder={{
										label: '재료1을 선택해 주세요.',
										inputLabel: '재료1을 선택해 주세요.',
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
								<Text style={styles.typingTitleText}>재료2</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => {
										setMatt2(value);
										if(value == '4'){ setMatt2Direct(''); }
									}}
									placeholder={{
										label: '재료2를 선택해 주세요.',
										inputLabel: '재료2를 선택해 주세요.',
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
							{matt2 == '4' ? (
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={matt2Direct}
									onChangeText={(v) => {setMatt2Direct(v)}}
									placeholder={'재료2 직접 입력을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>수량</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={cnt}
									keyboardType = 'numeric'
									onChangeText={(v) => {
										setCnt(v);
									}}
									placeholder={'수량을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>도면 업로드</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={floorFile}
									editable = {false}
									placeholder={'도면을 업로드해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input, styles.input2]}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={openPicker}
								>
									<Text style={styles.certChkBtnText}>업로드</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.inputAlert}>
								<AutoHeightImage width={14} source={require("../../assets/img/icon_alert3.png")} />
								<Text style={styles.inputAlertText}>도면이 없으면 자세한 견적을 받을 수 없습니다.</Text>
							</View>
							<TouchableOpacity
								style={[styles.floorBtn, call ? styles.floorBtnOn : null]}
								activeOpacity={opacityVal}
								onPress={() => {setCall(!call)}}
							>
								<AutoHeightImage width={15} source={require("../../assets/img/icon_chk_on.png")} style={styles.floorBtnImg} />
								<Text style={styles.floorBtnText}>설계요청</Text>
							</TouchableOpacity>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>도면보안설정</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setSecurity(value)}
									placeholder={{
										label: '도면보안설정을 확인해 주세요.',
										inputLabel: '도면보안설정을 확인해 주세요.',
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
								<Text style={styles.typingTitleText}>상담방식(견적서)</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setAdvice(value)}
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
								<Text style={styles.typingTitleText}>프로젝트명</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={projectName}
									onChangeText={(v) => {
										setProjectName(v);
									}}
									placeholder={'프로젝트명을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>제품용도</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => setUseInfo(value)}
									placeholder={{
										label: '제품용도를 선택해 주세요.',
										inputLabel: '제품용도를 선택해 주세요.',
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
								<Text style={styles.typingTitleText}>[산업] 카테고리</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									onValueChange={(value) => {
										setIndCate(value);
										if(value != '4'){
											setIndCateDirect('');
										}
									}}
									placeholder={{
										label: '카테고리를 선택해 주세요.',
										inputLabel: '카테고리를 선택해 주세요.',
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
							{indCate == '4' ? (
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={indCateDirect}
									onChangeText={(v) => {
										setIndCateDirect(v);
									}}
									placeholder={'기타/미분류 직접입력을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>납기일</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TouchableOpacity
									style={[styles.dealBtn, endDateMethod == 1 ? styles.dealBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(endDateMethod && endDateMethod == 1){
											setEndDateMethod('');
										}else{
											setEndDateMethod(1);
											setEndDate('');
											setEndDateObj();
										}
									}}
								>
									<Text style={[styles.dealBtnText, endDateMethod == 1 ? styles.dealBtnTextOn : null]}>협의 후 결정</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.dealBtn, endDateMethod == 2 ? styles.dealBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(endDateMethod && endDateMethod == 2){
											setEndDateMethod('');
										}else{
											setEndDateMethod(2);
										}
									}}
								>
									<Text style={[styles.dealBtnText, endDateMethod == 2 ? styles.dealBtnTextOn : null]}>납기일 작성</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.dealBtn, endDateMethod == 3 ? styles.dealBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(endDateMethod && endDateMethod == 3){
											setEndDateMethod('');
										}else{
											setEndDateMethod(3);
											setEndDate('');
											setEndDateObj();
										}
									}}
								>
									<Text style={[styles.dealBtnText, endDateMethod == 3 ? styles.dealBtnTextOn : null]}>기한 없음</Text>
								</TouchableOpacity>
							</View>
							{endDateMethod == 2 ? (
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TouchableOpacity
									style={styles.calendarBtn}
									activeOpacity={opacityVal}
									onPress={()=>{setCalendarVisible(true)}}
								>									
									<AutoHeightImage width={17} source={require("../../assets/img/icon_calendar.png")} style={styles.icon_calendar}/>
									{endDate ? (
										<Text style={[styles.calendarBtnText, styles.calendarBtnTextOn]}>{endDate}</Text>
									) : (
										<Text style={styles.calendarBtnText}>납기일을 선택해 주세요.</Text>
									)}
									<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} style={styles.icon_calendar_arr}/>
								</TouchableOpacity>								
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>추정예산범위(금액)</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={price}
									onChangeText={(v) => {
										setPrice(v);
									}}
									placeholder={'추정예산범위를 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>도면상세정보</Text>
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

			<Modal
        visible={calendarVisible}
				transparent={true}
				onRequestClose={() => {setCalendarVisible(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setCalendarVisible(false)}}
				></Pressable>
				<View style={styles.calendarCont}>
					<Calendar
						style={styles.calendar}						
						theme={{ textSectionTitleColor: '#000', selectedDayBackgroundColor: '#31B481', selectedDayTextColor: 'white', todayTextColor: '#31B481', arrowColor: '#000', monthTextColor: '#000', }}
						markingType={'custom'}
						disableMonthChange={true}
						minDate={today}
						monthFormat={'yyyy. MM'}
						markedDates={endDateObj}
						onDayPress={day => {
							//console.log('selected day', day);
							//console.log(day.dateString);							
							addDates(day);
						}}
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
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	textarea: {height:275,borderRadius:8,textAlignVertical:"top",padding:12,},
	inputContainer: {},
	selectArr: {position:'absolute',top:25.5,right:20,},
	certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
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
	dealBtn: {width:((innerWidth/3)-7),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	dealBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	dealBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,color:'#8791A1'},
	dealBtnTextOn: {color:'#fff'},	
	inputUnit: {position:'absolute',top:0,right:20,},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#000'},
	inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlertText: {width:(innerWidth-14),paddingLeft:7,fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#ED0000'},
	floorBtn: {height:58,backgroundColor:'#D8D8D8',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',marginTop:20,},
	floorBtnOn: {backgroundColor:'#31B481'},
	floorBtnImg: {position:'absolute',left:20,top:23,},
	floorBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#fff'},
	calendarCont: {width:widnowWidth,height:widnowHeight,padding:20,position:'absolute',left:0,top:0,display:'flex',alignItems:'center',justifyContent:'center'},
	calendar: {width:innerWidth,borderRadius:12,paddingBottom:10,position:'relative',top:-25},
	calendarBtn: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:39,display:'flex',justifyContent:'center'},
	calendarBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#8791A1'},
	calendarBtnTextOn: {color:'#000'},
	icon_calendar: {position:'absolute',left:12,top:19,},
	icon_calendar_arr: {position:'absolute',right:12,top:20,},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default MatchWrite