import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import {Avatar2} from '../../components/Avatar2';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

//스크랩 글쓰기
const Write4 = ({navigation, route}) => {
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

  const periodAry = [
		{ label: '3일', value: '3' },
		{ label: '4일', value: '4' },
		{ label: '5일', value: '5' },
		{ label: '6일', value: '6' },
    { label: '7일', value: '7' },
    { label: '8일', value: '8' },
    { label: '9일', value: '9' },
    { label: '10일', value: '10' },
	]

	const scrollRef = useRef();
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
	const [chkMethod, setChkMethod] = useState([]); //검수
	const [dealMethod1, setDealMethod1] = useState(''); //거래방식1
	const [dealMethod2, setDealMethod2] = useState(''); //거래방식2
  const [period, setPeriod] = useState(''); //입찰기간
  const [payMethod, setPayMethod] = useState(''); //결제방식
	const [content, setContent] = useState(''); //내용
	const [isLoading, setIsLoading] = useState(true);

	const [sortAry, setSortAry] = useState([]); //분류 리스트
	const [ingreAry, setIngreAry] = useState([]); //성분 리스트
	const [dealMethod2Ary, setDealMethod2Ary] = useState([]); //거래방식2 리스트
	const [payMethodAry, setPayMethodAry] = useState([]); //결제방식 리스트

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				// setFileConfirm(false);
				// setFileList(fileListData);
				// setSubject('');
				// setSort('');
				// setIngred('');
				// setShape('');
				// setChkMethod([]);
				// setDealMethod1('');
				// setDealMethod2('');
        // setPeriod('');
				// setPayMethod('');
				// setContent('');
				// setIsLoading(false);
				// setSortAry([]);
				// setIngreAry([]);
				// setDealMethod2Ary([]);
				// setPayMethodAry([]);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
			select1();
			select5();
			check1();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	function getFileCount(selectCon, type){
		let cnt = 0;
		selectCon.map((item) => {
			if(item.path != ''){
				cnt = cnt + 1;
			}
		});

		setFileCnt(cnt);
		
		if(type == 'add'){
			if(cnt >= 3){
				scrollRef.current.scrollTo({ x: (cnt-1)*89, y: 0, animated: true })
			}
		}
	}

	//분류
	const select1 = async () => {
		await Api.send('GET', 'product_cate2', {is_api:1, cate1:4}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				setSortAry(responseJson.data);
			}else{
				console.log("분류 err : ",responseJson.result_text);
			}
		}); 
	}

	//성분
	const select2 = async (v) => {
		setIngred('');
		setIngreAry([]);
		if(v == 27){
			await Api.send('GET', 'product_cate3', {is_api:1, cate2:v}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
				let arrItems = args.arrItems;
				//console.log('args ', responseJson);
				if(responseJson.result === 'success' && responseJson){
					//console.log("성분 : ",responseJson);
					setIngreAry(responseJson.data);
				}else{
					//console.log("성분 err :",responseJson.result_text);
				}
			});
		}
	}

	//검수
	const check1 = async () => {
		await Api.send('GET', 'product_cate5', {is_api:1, cate1:4}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("검수 : ",responseJson);
				//setChkMethod(responseJson.data);
				let chkMetAry = [];
				(responseJson.data).map((item, index)=>{
					const subAry = {
						'idx': item.val, 
						'txt': item.txt, 
						'isChecked': false
					}
					chkMetAry.push(subAry);
				});
				setChkMethod(chkMetAry);
			}else{
				console.log("검수 err : ",responseJson.result_text);
			}
		}); 
	}

	//거래방식2
	const select4 = async (v) => {
		await Api.send('GET', 'product_cate7', {is_api:1, cate1:1, cate6:v}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson);
				setDealMethod2Ary(responseJson.data);
			}else{
				console.log(responseJson.result_text);
			}
		}); 
	}

	//결제방식
	const select5 = async () => {
		await Api.send('GET', 'product_cate8', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("결제방식 : ",responseJson);
				setPayMethodAry(responseJson.data);
			}else{
				console.log(responseJson.result_text);
			}
		}); 
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
    getFileCount(selectCon, 'add');
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
		getFileCount(selectCon, 'del');
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

	function writeUpdate(){
		let img1Path = '';
		let img2Path = '';
		let img3Path = '';
		let img4Path = '';
		let img5Path = '';
		let img6Path = '';
		let img7Path = '';
		let img8Path = '';
		let img9Path = '';
		let img10Path = '';
		

		fileList.map((item, index)=>{
			if(item.idx == 1 && item.path != ''){ 
				img1Path = item.path;
			}else if(item.idx == 2 && item.path != ''){ 
				img2Path = item.path;
			}else if(item.idx == 3 && item.path != ''){ 
				img3Path = item.path;
			}else if(item.idx == 4 && item.path != ''){ 
				img4Path = item.path;
			}else if(item.idx == 5 && item.path != ''){ 
				img5Path = item.path;
			}else if(item.idx == 6 && item.path != ''){ 
				img6Path = item.path;
			}else if(item.idx == 7 && item.path != ''){ 
				img7Path = item.path;
			}else if(item.idx == 8 && item.path != ''){ 
				img8Path = item.path;
			}else if(item.idx == 9 && item.path != ''){ 
				img9Path = item.path;
			}else if(item.idx == 10 && item.path != ''){ 
				img10Path = item.path;
			}
		})
	
		if(img1Path == ""){ ToastMessage('사진 첨부 목록 중 첫번째 영역에 사진을 첨부해 주세요.'); return false; }

		if(subject == ""){ ToastMessage('글 제목을 입력해 주세요.'); return false; }

		if(sort == ""){ ToastMessage('분류를 선택해 주세요.'); return false; }

		if(sort==27){
			if(ingred == ""){ ToastMessage('성분을 선택해 주세요.'); return false; }
		}

		let selectedList = '';
		let selectedTotal = chkMethod.filter((item) => item.isChecked);
		if(selectedTotal){
			selectedTotal.map((item)=>{
				if(selectedList != ''){
					selectedList += ',';
				}
				selectedList += item.idx;			
			});
		}
		if(selectedList == ''){ ToastMessage('검수를 1개 이상 선택해 주세요.'); return false; }

		if(dealMethod1 == ""){ ToastMessage('거래방식1을 선택해 주세요.'); return false; }
		
		if(dealMethod1 == 1){
			if(dealMethod2 == ""){ ToastMessage('거래방식2를 선택해 주세요.'); return false; }
		}		

		if(period == ""){ ToastMessage('입찰 기간을 선택해 주세요.'); return false; }
		
		if(payMethod == ""){ ToastMessage('결제방식을 선택해 주세요.'); return false; }

		if(content == ""){ ToastMessage('내용을 입력해 주세요.'); return false; }

		setIsLoading(false);

		const formData = {
			is_api:1,				
			pd_name:subject,
			pd_contents:content,
			c1_idx:4,
			c2_idx:sort,
			c3_idx:ingred,
			c4_idx:shape,
			pd_trade1:dealMethod1, 
			pd_trade2:dealMethod2,
			pd_bidding_day:period,
			pd_method:payMethod, 			
			pd_test:selectedList,
		};

		if(img1Path != ''){ formData.pf_img1 =  {'uri': img1Path, 'type': 'image/png', 'name': 'pf_img1.png'}; }
		if(img2Path != ''){ formData.pf_img2 =  {'uri': img2Path, 'type': 'image/png', 'name': 'pf_img2.png'}; }
		if(img3Path != ''){ formData.pf_img3 =  {'uri': img3Path, 'type': 'image/png', 'name': 'pf_img3.png'}; }
		if(img4Path != ''){ formData.pf_img4 =  {'uri': img4Path, 'type': 'image/png', 'name': 'pf_img4.png'}; }
		if(img5Path != ''){ formData.pf_img5 =  {'uri': img5Path, 'type': 'image/png', 'name': 'pf_img5.png'}; }
		if(img6Path != ''){ formData.pf_img6 =  {'uri': img6Path, 'type': 'image/png', 'name': 'pf_img6.png'}; }
		if(img7Path != ''){ formData.pf_img7 =  {'uri': img7Path, 'type': 'image/png', 'name': 'pf_img7.png'}; }
		if(img8Path != ''){ formData.pf_img8 =  {'uri': img8Path, 'type': 'image/png', 'name': 'pf_img8.png'}; }
		if(img9Path != ''){ formData.pf_img9 =  {'uri': img9Path, 'type': 'image/png', 'name': 'pf_img9.png'}; }
		if(img10Path != ''){ formData.pf_img10 =  {'uri': img10Path, 'type': 'image/png', 'name': 'pf_img10.png'}; }

		//console.log("formData : ",formData);

		Api.send('POST', 'save_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				setIsLoading(true);
				navigation.navigate('Home', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				setIsLoading(true);
				ToastMessage(responseJson.result_text);
			}
		});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'폐기물 글쓰기'} />
			<KeyboardAwareScrollView>
				<View style={styles.registArea}>
					<View style={[styles.registBox]}>
						<View style={[styles.typingBox, styles.typingBox2]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>사진첨부({fileCnt}/10)</Text>
							</View>
							<ScrollView
								ref={scrollRef}
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
									value={sort}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setSort(value);
										select2(value);
									}}
									placeholder={{
										label: '분류를 선택해 주세요.',
										inputLabel: '분류를 선택해 주세요.',
										value: '',
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
						
						{sort == 27 ? (
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>성분</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={ingred}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setIngred(value);
									}}
									placeholder={{
										label: '성분을 선택해 주세요.',
										inputLabel: '성분을 선택해 주세요.',
										value: '',
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
						) : null}

						{/* <View style={[styles.typingBox, styles.mgTop35]}>
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
						</View> */}

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
											select4(1);
										}
										setDealMethod2('');
										setDealMethod2Ary([]);
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
										setDealMethod2('');
										setDealMethod2Ary([]);
									}}
								>
									<Text style={[styles.dealBtnText, dealMethod1 == 2 ? styles.dealBtnTextOn : null]}>도착도(직접운반)</Text>
								</TouchableOpacity>
							</View>
						</View>
						
						{dealMethod1 == 1 ? (
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>거래방식2</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={dealMethod2}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setDealMethod2(value);
									}}
									placeholder={{
										label: '거래방식2를 선택해 주세요.',
										inputLabel: '거래방식2를 선택해 주세요.',
										value: '',
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
						) : null}

            <View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>입찰 기간</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={period}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setPeriod(value);
									}}
									placeholder={{
										label: '결제방식을 선택해 주세요.',
										inputLabel: '결제방식을 선택해 주세요.',
										value: '',
									}}
									items={periodAry}
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
								<Text style={styles.typingTitleText}>결제방식</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={payMethod}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setPayMethod(value);
									}}
									placeholder={{
										label: '결제방식을 선택해 주세요.',
										inputLabel: '결제방식을 선택해 주세요.',
										value: '',
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
					onPress={() => {writeUpdate();}}
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

			{!isLoading ? (
			<View style={[styles.indicator]}>
				<ActivityIndicator size="large" />
			</View>
			) : null}
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
	typingTitle: {paddingLeft:9},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	textarea: {height:230,borderRadius:12,textAlignVertical:"top",padding:12,},
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
	modalCont: {width:innerWidth,height:154,paddingVertical:30,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
	filterBtnList: {display:'flex',flexDirection:'row',alignItems:'center',flexWrap:'wrap',paddingTop:5,},
	filterChkBtn: {height:34,paddingHorizontal:15,borderWidth:1,borderColor:'#E5EBF2',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,marginRight:10,},
	filterChkBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#8791A1'},
	filterChkBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	filterChkBtnTextOn: {color:'#fff'},
	dealBtn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	dealBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	dealBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,color:'#8791A1'},
	dealBtnTextOn: {color:'#fff'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
	inputUnit: {position:'absolute',top:0,right:20,},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#000'},
	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

export default Write4