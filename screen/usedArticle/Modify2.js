import React, {useState, useEffect, useCallback} from 'react';
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

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

//중고자재 글쓰기
const Modify2 = ({navigation, route}) => {
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
  const idx = route.params.idx;
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
  const [size1, setSize1] = useState(''); //중량
  const [size2, setSize2] = useState(''); //두께
  const [size3, setSize3] = useState(''); //외경
  const [size4, setSize4] = useState(''); //폭
  const [size5, setSize5] = useState(''); //길이
	const [dealMethod1, setDealMethod1] = useState(''); //거래방식1
	const [dealMethod2, setDealMethod2] = useState(''); //거래방식2
	const [priceUnit, setPriceUnit] = useState(1); //가격단위
	const [price, setPrice] = useState(''); //가격
	const [priceOpt, setPriceOpt] = useState(1); //가격옵션
	const [payMethod, setPayMethod] = useState(''); //결제방식
	const [content, setContent] = useState(''); //내용
	const [isLoading, setIsLoading] = useState(false);

	const [sortAry, setSortAry] = useState([]); //분류 리스트
	const [ingreAry, setIngreAry] = useState([]); //성분 리스트
	const [shapeAry, setShapeAry] = useState([]); //형태 리스트
	const [dealMethod2Ary, setDealMethod2Ary] = useState([]); //거래방식2 리스트
	const [payMethodAry, setPayMethodAry] = useState([]); //결제방식 리스트

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setFileConfirm(false);
				setFileList(fileListData);
				setSubject('');
				setSort('');
				setIngred('');
				setShape('');
				setChkMethod([]);
        setSize1('');
        setSize2('');
        setSize3('');
        setSize4('');
        setSize5('');
				setDealMethod1('');
				setDealMethod2('');
				setPriceUnit(1);
				setPrice('');
				setPriceOpt(1);
				setPayMethod('');
				setContent('');
        setIsLoading(false);
				setSortAry([]);
				setIngreAry([]);
				setShapeAry([]);
				setDealMethod2Ary([]);
				setPayMethodAry([]);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	//분류
	const select1 = async () => {
		await Api.send('GET', 'product_cate2', {is_api:1, cate1:2}, (args)=>{
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
	const select2 = async (v, z) => {
		if(!z || z==''){ setIngred(''); }
		setIngreAry([]);

		await Api.send('GET', 'product_cate3', {is_api:1, cate2:v}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("성분 : ",responseJson);
				setIngreAry(responseJson.data);
        if(z){ setIngred(z); }
			}else{
				console.log("성분 err :",responseJson.result_text);
			}
		}); 
	}

	//등급(형태)
	const select3 = async (v, z) => {
		await Api.send('GET', 'product_cate4', {is_api:1, cate3:v}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("형태 : ",responseJson);
				setShapeAry(responseJson.data);
        if(z){ setShape(z); }
			}else{
				//console.log("형태 err : ",responseJson.result_text);
			}
		}); 
	}

	//검수
	const check1 = async (testList) => {
		await Api.send('GET', 'product_cate5', {is_api:1, cate1:2}, (args)=>{
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

        if(testList.length > 0){
					//console.log("testList : ",testList);
					testList.map((item) => {
						const id = (item.val)-1;
						chkMetAry[id].isChecked=true;
					});
				}
				setChkMethod(chkMetAry);
			}else{
				console.log("검수 err : ",responseJson.result_text);
			}
		}); 
	}

	//거래방식2
	const select4 = async (v) => {
		await Api.send('GET', 'product_cate7', {is_api:1, cate1:2, cate6:v}, (args)=>{
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

    let img1Idx = '';
		let img2Idx = '';
		let img3Idx = '';
		let img4Idx = '';
		let img5Idx = '';
		let img6Idx = '';
		let img7Idx = '';
		let img8Idx = '';
		let img9Idx = '';
		let img10Idx = '';		

		fileList.map((item, index)=>{
			if(item.idx == 1 && item.path != ''){ 
				img1Path = item.path;
				img1Idx = item.pf_idx;
			}else if(item.idx == 2 && item.path != ''){ 
				img2Path = item.path;
				img2Idx = item.pf_idx;
			}else if(item.idx == 3 && item.path != ''){ 
				img3Path = item.path;
				img3Idx = item.pf_idx;
			}else if(item.idx == 4 && item.path != ''){ 
				img4Path = item.path;
				img4Idx = item.pf_idx;
			}else if(item.idx == 5 && item.path != ''){ 
				img5Path = item.path;
				img5Idx = item.pf_idx;
			}else if(item.idx == 6 && item.path != ''){ 
				img6Path = item.path;
				img6Idx = item.pf_idx;
			}else if(item.idx == 7 && item.path != ''){ 
				img7Path = item.path;
				img7Idx = item.pf_idx;
			}else if(item.idx == 8 && item.path != ''){ 
				img8Path = item.path;
				img8Idx = item.pf_idx;
			}else if(item.idx == 9 && item.path != ''){ 
				img9Path = item.path;
				img9Idx = item.pf_idx;
			}else if(item.idx == 10 && item.path != ''){ 
				img10Path = item.path;
				img10Idx = item.pf_idx;
			}
		});
	
		if(img1Path == ""){ ToastMessage('사진 첨부 목록 중 첫번째 영역에 사진을 첨부해 주세요.'); return false; }

		if(subject == ""){ ToastMessage('글 제목을 입력해 주세요.'); return false; }

		if(sort == ""){ ToastMessage('분류를 선택해 주세요.'); return false; }

		if(sort != 9){
			if(ingred == ""){ ToastMessage('성분을 선택해 주세요.'); return false; }
		}

		if(shape == ""){ ToastMessage('형태를 선택해 주세요.'); return false; }

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
		if(selectedList == ''){ ToastMessage('검수를 선택해 주세요.'); return false; }

		if(size1 == ""){ ToastMessage('중량을 입력해 주세요.'); return false; }
		if(size2 == ""){ ToastMessage('두께를 입력해 주세요.'); return false; }
		if(size3 == ""){ ToastMessage('외경을 입력해 주세요.'); return false; }
		if(size4 == ""){ ToastMessage('폭을 입력해 주세요.'); return false; }
		if(size5 == ""){ ToastMessage('길이를 입력해 주세요.'); return false; }
		
		if(!priceUnit || priceUnit == ""){ ToastMessage('가격 단위를 선택해 주세요.'); return false; }		

		if(dealMethod1 == ""){ ToastMessage('거래방식1을 선택해 주세요.'); return false; }
		
		if(dealMethod1 == 1){
			if(dealMethod2 == ""){ ToastMessage('거래방식2를 선택해 주세요.'); return false; }
		}

		if(priceOpt==1 && price == ""){ ToastMessage('가격을 입력해 주세요.'); return false; }

		if(payMethod == ""){ ToastMessage('결제방식을 선택해 주세요.'); return false; }

		if(content == ""){ ToastMessage('내용을 입력해 주세요.'); return false; }

		let sellType = 1;
		let option1 = 0;
		if(priceOpt == 1 || priceOpt == 2 || priceOpt == 3){
			sellType = priceOpt;
			option1 = 0;
		}else{
			sellType = 1;
			option1 = 1;
		}

		let resPrice = (price).split(',').join('');

		const formData = {
			is_api:1,
      pd_idx:idx,
			pd_name:subject,
			pd_contents:content,
			c1_idx:2,
			c2_idx:sort,
			c3_idx:ingred,
			c4_idx:shape,
			pd_price:resPrice,
			pd_unit:priceUnit, 
			pd_sell_type:sellType, 
			pd_option1:option1, 
			pd_trade1:dealMethod1, 
			pd_trade2:dealMethod2, 
			pd_method:payMethod, 			
			pd_test:selectedList,
			pd_weight:size1,
			pd_thickness:size2,
			pd_outside:size3,
			pd_width:size4,
			pd_length:size5,
		};

		if(img1Path != ''){ formData.pf_img1 =  {'uri': img1Path, 'type': 'image/png', 'name': 'pf_img1.png', 'pf_idx':img1Idx}; }
		if(img2Path != ''){ formData.pf_img2 =  {'uri': img2Path, 'type': 'image/png', 'name': 'pf_img2.png', 'pf_idx':img2Idx}; }
		if(img3Path != ''){ formData.pf_img3 =  {'uri': img3Path, 'type': 'image/png', 'name': 'pf_img3.png', 'pf_idx':img3Idx}; }
		if(img4Path != ''){ formData.pf_img4 =  {'uri': img4Path, 'type': 'image/png', 'name': 'pf_img4.png', 'pf_idx':img4Idx}; }
		if(img5Path != ''){ formData.pf_img5 =  {'uri': img5Path, 'type': 'image/png', 'name': 'pf_img5.png', 'pf_idx':img5Idx}; }
		if(img6Path != ''){ formData.pf_img6 =  {'uri': img6Path, 'type': 'image/png', 'name': 'pf_img6.png', 'pf_idx':img6Idx}; }
		if(img7Path != ''){ formData.pf_img7 =  {'uri': img7Path, 'type': 'image/png', 'name': 'pf_img7.png', 'pf_idx':img7Idx}; }
		if(img8Path != ''){ formData.pf_img8 =  {'uri': img8Path, 'type': 'image/png', 'name': 'pf_img8.png', 'pf_idx':img8Idx}; }
		if(img9Path != ''){ formData.pf_img9 =  {'uri': img9Path, 'type': 'image/png', 'name': 'pf_img9.png', 'pf_idx':img9Idx}; }
		if(img10Path != ''){ formData.pf_img10 =  {'uri': img10Path, 'type': 'image/png', 'name': 'pf_img10.png', 'pf_idx':img10Idx}; }

		//console.log("formData : ",formData);

		Api.send('POST', 'modify_product', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);				
				navigation.navigate('Home', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
	}

  const getData = async () => {
    setIsLoading(true);
    await Api.send('GET', 'view_product', {'is_api': 1, pd_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("modify : ",responseJson);
				const imgList = responseJson.pf_data;				
				if(imgList.length > 0){
					let selectCon = fileList.map((item,index) => {
						//console.log(item);
						if(imgList[index]){
							return {...item, path: imgList[index].pf_name_org, pf_idx:imgList[index].pf_idx};
						}else{
							return {...item, path: item.path, pf_idx:''};
						}
					});
					setFileList(selectCon);
					getFileCount(selectCon);
				}

        setSubject(responseJson.pd_name);                        								
				select1();
				setSort((responseJson.c2_idx).toString());
				select2(responseJson.c2_idx, (responseJson.c3_idx).toString());				
				select3(responseJson.c3_idx, (responseJson.c4_idx).toString());
				
				const testList = responseJson.pd_test;
				check1(testList);
				
				setDealMethod1(responseJson.pd_trade1);
				if(responseJson.pd_trade1 == 1){
					select4(1);          
					setDealMethod2(responseJson.pd_trade2);
				}
				setPriceUnit(responseJson.pd_unit_org);
				if(responseJson.pd_option1 == 1){
					setPriceOpt(4);				
				}else{
					setPriceOpt(responseJson.pd_sell_type);				
				}
				setPrice(responseJson.pd_price);
				select5();
				setPayMethod(responseJson.pd_method);
				setContent(responseJson.pd_contents);
        setSize1(responseJson.pd_weight);
        setSize2(responseJson.pd_thickness);
        setSize3(responseJson.pd_outside);
        setSize4(responseJson.pd_width);
        setSize5(responseJson.pd_length);

        setIsLoading(false);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!');
			}
		});
  }

  useEffect(() => {
    getData();
  }, []);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'중고자재 글수정'} />
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
									value={sort}
									onValueChange={(value) => {
										setSort(value);
										if(value == 9){
											setIngred('');
											setIngreAry([]);
											select3(value);
										}else{
											setIngred('');
											select2(value);
										}										
									}}
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
						
						{sort != 9 ? (
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>성분</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={ingred}
									onValueChange={(value) => {
										setIngred(value);
										select3(value);
									}}
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
						) : null}

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>형태</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={shape}
									onValueChange={(value) => {
										setShape(value);										
									}}
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
							<View style={[styles.typingFlexBox]}>
                <View style={[styles.typingInputBox50]}>
                  <View style={styles.typingTitle}>
                    <Text style={styles.typingTitleText}>중량</Text>
                  </View>
                  <View style={[styles.typingInputBox]}>
                    <TextInput
                      value={size1}
                      keyboardType = 'numeric'
                      onChangeText={(v) => {setSize1(v);}}
                      placeholder={''}
                      placeholderTextColor="#8791A1"
                      style={[styles.input, styles.input4]}
                    />
                    <View style={styles.inputUnit}>
                      <Text style={styles.inputUnitText}>kg</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.typingInputBox50]}>
                  <View style={styles.typingTitle}>
                    <Text style={styles.typingTitleText}>두께</Text>
                  </View>
                  <View style={[styles.typingInputBox]}>
                    <TextInput
                      value={size2}
                      keyboardType = 'numeric'
                      onChangeText={(v) => {setSize2(v);}}
                      placeholder={''}
                      placeholderTextColor="#8791A1"
                      style={[styles.input, styles.input4]}
                    />
                    <View style={styles.inputUnit}>
                      <Text style={styles.inputUnitText}>t</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.typingInputBox50, styles.mgTop20]}>
                  <View style={styles.typingTitle}>
                    <Text style={styles.typingTitleText}>외경</Text>
                  </View>
                  <View style={[styles.typingInputBox]}>
                    <TextInput
                      value={size3}
                      keyboardType = 'numeric'
                      onChangeText={(v) => {setSize3(v);}}
                      placeholder={''}
                      placeholderTextColor="#8791A1"
                      style={[styles.input, styles.input4]}
                    />
                    <View style={styles.inputUnit}>
                      <Text style={styles.inputUnitText}>∅</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.typingInputBox50, styles.mgTop20]}>
                  <View style={styles.typingTitle}>
                    <Text style={styles.typingTitleText}>폭</Text>
                  </View>
                  <View style={[styles.typingInputBox]}>
                    <TextInput
                      value={size4}
                      keyboardType = 'numeric'
                      onChangeText={(v) => {setSize4(v);}}
                      placeholder={''}
                      placeholderTextColor="#8791A1"
                      style={[styles.input, styles.input4]}
                    />
                    <View style={styles.inputUnit}>
                      <Text style={styles.inputUnitText}>cm</Text>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.typingInputBox50, styles.mgTop20]}>
                  <View style={styles.typingTitle}>
                    <Text style={styles.typingTitleText}>길이</Text>
                  </View>
                  <View style={[styles.typingInputBox]}>
                    <TextInput
                      value={size5}
                      keyboardType = 'numeric'
                      onChangeText={(v) => {setSize5(v);}}
                      placeholder={''}
                      placeholderTextColor="#8791A1"
                      style={[styles.input, styles.input4]}
                    />
                    <View style={styles.inputUnit}>
                      <Text style={styles.inputUnitText}>cm</Text>
                    </View>
                  </View>
                </View>
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
						) : null}
						
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>가격 단위</Text>
							</View>
							<View style={[styles.filterBtnList]}>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceUnit==1 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceUnit && priceUnit ==1){
											setPriceUnit();
										}else{
											setPriceUnit(1);
										}
									}}
								>
									<Text style={[styles.filterChkBtnText, priceUnit==1 ? styles.filterChkBtnTextOn : null]}>kg ₩</Text>
								</TouchableOpacity>
								
                <TouchableOpacity
									style={[styles.filterChkBtn, priceUnit==2 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceUnit && priceUnit ==2){
											setPriceUnit();
										}else{
											setPriceUnit(2);
										}
									}}
								>
									<Text style={[styles.filterChkBtnText, priceUnit==2 ? styles.filterChkBtnTextOn : null]}>m ₩</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>가격</Text>
							</View>							
							<View style={[styles.filterBtnList]}>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==2 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceOpt && priceOpt == 2){											
											setPriceOpt(1);											
										}else{
											setPriceOpt(2);
											setPrice('');
										}										
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==2 ? styles.filterChkBtnTextOn : null]}>나눔</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==4 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceOpt && priceOpt == 4){											
											setPriceOpt(1);											
										}else{
											setPriceOpt(4);
										}										
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==4 ? styles.filterChkBtnTextOn : null]}>가격협상</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==3 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										if(priceOpt && priceOpt == 3){											
											setPriceOpt(1);											
										}else{
											setPriceOpt(3);
											setPrice('');
										}										
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==3 ? styles.filterChkBtnTextOn : null]}>입찰받기</Text>
								</TouchableOpacity>
							</View>
							{priceOpt == 1 || priceOpt == 4 ? (
							<View style={[styles.typingInputBox, styles.typingInputBox2, styles.typingFlexBox]}>
								<TextInput
									value={price}
									keyboardType = 'numeric'
									onChangeText={(v) => {
										let comma = (v).split(',').join('');
										comma = String(comma).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
										setPrice(comma);

										if(priceOpt == 2){											
											setPriceOpt(1);											
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
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>결제방식</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
                  value={payMethod}
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
  mgTop20: {marginTop:20},
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
	typingInputBox2: {marginTop:5,},
  typingInputBox50: {width:((innerWidth/2)-5)},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90)},
	input3: {width:(innerWidth - 120)},
  input4: {width:((innerWidth/2)-5)},
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
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
	inputUnit: {position:'absolute',top:0,right:20,},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#000'},
  indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

export default Modify2