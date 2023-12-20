import React, {useState, useEffect, useCallback, useRef} from 'react';
import { ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableNativeFeedback, BackHandler, findNodeHandle, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import {Select} from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
//import {Avatar2} from '../../components/Avatar2';
import PushChk from "../../components/Push";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';

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
	const scrollViewRef = useRef(null);
	const [routeLoad, setRouteLoad] = useState(false);
	const navigationUse = useNavigation();
	const [preventBack, setPreventBack] = useState(true);
	const [pageSt, setPageSt] = useState(false);
	const [fileCnt, setFileCnt] = useState(0);
	const [fileOrder, setFileOrder] = useState();
	const [fileConfirm, setFileConfirm] = useState(false);
	//const [fileList, setFileList] = useState(fileListData);
	const [fileList, setFileList] = useState([]);
	const [subject, setSubject] = useState(''); //글제목
	const [sort, setSort] = useState(''); //분류
	const [ingred, setIngred] = useState(''); //성분
	const [shape, setShape] = useState(''); //형태
	const [chkMethod, setChkMethod] = useState([]); //검수
	const [dealMethod1, setDealMethod1] = useState(''); //거래방식1
	const [dealMethod2, setDealMethod2] = useState(''); //거래방식2
	const [priceUnit, setPriceUnit] = useState(1); //가격단위
	const [price, setPrice] = useState(''); //가격
	const [priceOpt, setPriceOpt] = useState(1); //가격옵션
	const [payMethod, setPayMethod] = useState(''); //결제방식
	const [content, setContent] = useState(''); //내용
	const [period, setPeriod] = useState(''); //입찰기간
	const [isLoading, setIsLoading] = useState(true);
	const [confirm, setConfirm] = useState(false);

	const [sortAry, setSortAry] = useState([]); //분류 리스트
	const [ingreAry, setIngreAry] = useState([]); //성분 리스트
	const [shapeAry, setShapeAry] = useState([]); //형태 리스트
	const [dealMethod2Ary, setDealMethod2Ary] = useState([]); //거래방식2 리스트
	const [payMethodAry, setPayMethodAry] = useState([]); //결제방식 리스트

	const [saveState, setSaveState] = useState(false);
	const [saveModal, setSaveModal] = useState(false);

	const [state0, setState0] = useState(true);
	const [state1, setState1] = useState(true);
	const [state2, setState2] = useState(true);
	const [state3, setState3] = useState(true);
	const [state4, setState4] = useState(true);
	const [state5, setState5] = useState(true);
	const [state6, setState6] = useState(true);
	const [state7, setState7] = useState(true);
	const [state8, setState8] = useState(true);
	const [state9, setState9] = useState(true);
	const [state10, setState10] = useState(true);
	const [state11, setState11] = useState(true);
	const [state12, setState12] = useState(true);
	
	const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout2, setLayout2] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout3, setLayout3] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout4, setLayout4] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout5, setLayout5] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout6, setLayout6] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout7, setLayout7] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout8, setLayout8] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout9, setLayout9] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout10, setLayout10] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout11, setLayout11] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout12, setLayout12] = useState({ x: 0, y: 0, width: 0, height: 0 });

	const handleLayout = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout({ x, y, width, height }); };
	const handleLayout2 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout2({ x, y, width, height }); };
	const handleLayout3 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout3({ x, y, width, height }); };
	const handleLayout4 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout4({ x, y, width, height }); };
	const handleLayout5 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout5({ x, y, width, height }); };
	const handleLayout6 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout6({ x, y, width, height }); };
	const handleLayout7 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout7({ x, y, width, height }); };
	const handleLayout8 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout8({ x, y, width, height }); };
	const handleLayout9 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout9({ x, y, width, height }); };
	const handleLayout10 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout10({ x, y, width, height }); };
	const handleLayout11 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout11({ x, y, width, height }); };
	const handleLayout12 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout12({ x, y, width, height }); };

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setFileConfirm(false);
				//setFileList(fileListData);
				setFileList([]);
				setSubject('');
				setSort('');
				setIngred('');
				setShape('');
				setChkMethod([]);
				setDealMethod1('');
				setDealMethod2('');
				setPriceUnit(1);
				setPrice('');
				setPriceOpt(1);
				setPayMethod('');
				setContent('');
				setPeriod('');
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
			select1();
			select5();
			check1();
			getSaveState();
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	useEffect(() => {
    const unsubscribe = navigationUse.addListener('beforeRemove', (e) => {
      // 뒤로 가기 이벤트가 발생했을 때 실행할 로직을 작성합니다.
      // 여기에 원하는 동작을 추가하세요.
			// e.preventDefault();를 사용하면 뒤로 가기를 막을 수 있습니다.
			console.log('preventBack22 ::: ',preventBack);
			if (preventBack) {
				e.preventDefault();
				setConfirm(true);
				console.log('??????????????????????????????');
			} else {				
				console.log('뒤로 가기 이벤트 발생!');				
      }
    });

    return unsubscribe;
	}, [navigationUse, preventBack]);

	const eventBack = (v) => {
		setConfirm(false);
		if (v == 'save') {
			//임시 저장 프로세스
			saveUpdate();

		} else if (v == 'cancel') {			
			setPreventBack(false);
			setIsLoading(false);
			setTimeout(function () {
				setIsLoading(true);
				navigation.goBack();
			}, 200);	
		}		
	}

	const getSaveState = async () => {
		await Api.send('GET', 'get_temp_product', {'is_api': 1, c1_idx:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_temp_product : ", responseJson);
				if (responseJson.is_data == 1) {					
					setSaveState(1);
					setSaveModal(true);
				}
			}else{	
				console.log('결과 출력 실패!');
			}
		});
	}

	const getSaveState2 = async () => {
		setIsLoading(false);
		await Api.send('GET', 'get_temp_product', {'is_api': 1, c1_idx:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_temp_product2 : ", responseJson);
				const imgList = responseJson.pf_data;
				if(imgList.length > 0){
					//let selectCon = fileList.map((item,index) => {					
					let selectCon = imgList.map((item,index) => {					
						if(imgList[index]){
							return {...item, idx: (index+1), path: imgList[index].pf_name, pf_idx:imgList[index].pf_idx, signature:imgList[index].pf_signature};
						}else{
							return {...item, idx: (index+1), path: item.path, pf_idx:'', signature:0};
						}
					});
					setFileList(selectCon);
					getFileCount(selectCon);
				}

				if(responseJson.pd_name) { setSubject(responseJson.pd_name); }
				select1();
				if(responseJson.c2_idx && responseJson.c2_idx != 0){
					setSort((responseJson.c2_idx).toString());
				}	
				if(responseJson.c2_idx && responseJson.c2_idx != 0 && responseJson.c3_idx && responseJson.c3_idx != 0){
					select2(responseJson.c2_idx, (responseJson.c3_idx).toString());
				}
				if(responseJson.c3_idx && responseJson.c3_idx != 0 && responseJson.c4_idx && responseJson.c4_idx != 0) {
					select3(responseJson.c3_idx, (responseJson.c4_idx).toString());
				}
				
				const testList = responseJson.pd_test;
				check1(testList);
				
				if(responseJson.pd_trade1 && responseJson.pd_trade1 != 0){ setDealMethod1(responseJson.pd_trade1); }
				if(responseJson.pd_trade1 == 1){
					select4(1);
					setDealMethod2(responseJson.pd_trade2*1);
				}
				setPriceUnit(responseJson.pd_unit_org);
				if(responseJson.pd_option1 == 1){
					setPriceOpt(4);				
				}else{
					setPriceOpt(responseJson.pd_sell_type);				
				}
				if(responseJson.pd_price && responseJson.pd_price != 0){ setPrice(responseJson.pd_price); }
				select5();
				if(responseJson.pd_method && responseJson.pd_method != 0){ setPayMethod(responseJson.pd_method*1); }	
				if(responseJson.pd_contents){ setContent(responseJson.pd_contents); }
				if(responseJson.pd_bidding_day){ setPeriod((responseJson.pd_bidding_day).toString()); }
				
				setIsLoading(true);
			}else{	
				console.log('결과 출력 실패!');
			}
		});
	}

	const saveUpdate = async (type='') => {
		setIsLoading(false);
		setConfirm(false);
		setTimeout(function () {
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

			let img1Chk = 0;
			let img2Chk = 0;
			let img3Chk = 0;
			let img4Chk = 0;
			let img5Chk = 0;
			let img6Chk = 0;
			let img7Chk = 0;
			let img8Chk = 0;
			let img9Chk = 0;
			let img10Chk = 0;
			
			fileList.map((item, index) => {
				if (item.idx == 1 && item.path != '') {
					img1Path = item.path;
					img1Chk = item.signature;
				} else if (item.idx == 2 && item.path != '') {
					img2Path = item.path;
					img2Chk = item.signature;
				} else if (item.idx == 3 && item.path != '') {
					img3Path = item.path;
					img3Chk = item.signature;
				} else if (item.idx == 4 && item.path != '') {
					img4Path = item.path;
					img4Chk = item.signature;
				} else if (item.idx == 5 && item.path != '') {
					img5Path = item.path;
					img5Chk = item.signature;
				} else if (item.idx == 6 && item.path != '') {
					img6Path = item.path;
					img6Chk = item.signature;
				} else if (item.idx == 7 && item.path != '') {
					img7Path = item.path;
					img7Chk = item.signature;
				} else if (item.idx == 8 && item.path != '') {
					img8Path = item.path;
					img8Chk = item.signature;
				} else if (item.idx == 9 && item.path != '') {
					img9Path = item.path;
					img9Chk = item.signature;
				} else if (item.idx == 10 && item.path != '') {
					img10Path = item.path;
					img10Chk = item.signature;
				}
			});

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
				pd_name:subject,
				pd_contents:content,
				c1_idx:1,
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
				pd_bidding_day:period,
				pf_img1_signature:img1Chk,
				pf_img2_signature:img2Chk,
				pf_img3_signature:img3Chk,
				pf_img4_signature:img4Chk,
				pf_img5_signature:img5Chk,
				pf_img6_signature:img6Chk,
				pf_img7_signature:img7Chk,
				pf_img8_signature:img8Chk,
				pf_img9_signature:img9Chk,
				pf_img10_signature:img10Chk,
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

			console.log("save formData : ",formData);

			Api.send('POST', 'save_temp_product', formData, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;

				if(responseJson.result === 'success'){
					//console.log('성공 : ',responseJson);										
					if (type != 'stay') { setPreventBack(false); }
					setIsLoading(false);
					ToastMessage('임시저장이 완료되었습니다.');
					setTimeout(function () {
						setIsLoading(true);
						Toast.hide();
						if(type != 'stay'){
							navigation.goBack();
						}
					}, 1000);	
				}else{
					console.log('결과 출력 실패!', resultItem);
					setIsLoading(true);
					ToastMessage(responseJson.result_text);
				}
			});
		}, 200);	
	}

	//분류
	const select1 = async (mo_idx) => {
		await Api.send('GET', 'product_cate2', {is_api:1, cate1:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("분류 : ",responseJson);				
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
		if(v == 7 || v == 8){
			setShape('');
			setShapeAry([]);
		}

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
				//console.log("성분 err :",responseJson.result_text);
			}
		}); 
	}

	//형태
	const select3 = async (v, z) => {		
		if((sort!=7 && sort!=8) && (v!=32 && v!=33 )){
			await Api.send('GET', 'product_cate4', {is_api:1, cate3:v}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
				let arrItems = args.arrItems;
				//console.log('args ', responseJson);
				if(responseJson.result === 'success' && responseJson){
					//console.log(responseJson);
					setShapeAry(responseJson.data);
					if(z){ setShape(z); }
				}else{
					//console.log("형태 err : ",responseJson.result_text);
				}
			}); 
		}
	}

	//검수
	const check1 = async (testList) => {
		await Api.send('GET', 'product_cate5', {is_api:1, cate1:1}, (args)=>{
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
				
				if(testList && testList.length > 0){
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

	const onAvatarChange = (image: ImageOrVideo) => {
    console.log(image);
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
		setState0(true);
  };	

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

		let img1Chk = 0;
		let img2Chk = 0;
		let img3Chk = 0;
		let img4Chk = 0;
		let img5Chk = 0;
		let img6Chk = 0;
		let img7Chk = 0;
		let img8Chk = 0;
		let img9Chk = 0;
		let img10Chk = 0;
		
		fileList.map((item, index)=>{
			if(item.idx == 1 && item.path != ''){ 
				img1Path = item.path;
				img1Chk = item.signature;
			}else if(item.idx == 2 && item.path != ''){ 
				img2Path = item.path;
				img2Chk = item.signature;
			}else if(item.idx == 3 && item.path != ''){ 
				img3Path = item.path;
				img3Chk = item.signature;
			}else if(item.idx == 4 && item.path != ''){ 
				img4Path = item.path;
				img4Chk = item.signature;
			}else if(item.idx == 5 && item.path != ''){ 
				img5Path = item.path;
				img5Chk = item.signature;
			}else if(item.idx == 6 && item.path != ''){ 
				img6Path = item.path;
				img6Chk = item.signature;
			}else if(item.idx == 7 && item.path != ''){ 
				img7Path = item.path;
				img7Chk = item.signature;
			}else if(item.idx == 8 && item.path != ''){ 
				img8Path = item.path;
				img8Chk = item.signature;
			}else if(item.idx == 9 && item.path != ''){ 
				img9Path = item.path;
				img9Chk = item.signature;
			}else if(item.idx == 10 && item.path != ''){ 
				img10Path = item.path;
				img10Chk = item.signature;
			}
		})
	
		if (img1Path == "") {
			//ToastMessage('사진 첨부 목록 중 첫번째 영역에 사진을 첨부해 주세요.');									
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, 0, true);		
			setState0(false);
			return false;			
		}

		if (subject == "") {
			//ToastMessage('글 제목을 입력해 주세요.');			
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout.y, true);
			setState1(false);
			return false;
		}

		if (sort == "") {
			//ToastMessage('분류를 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout2.y, true);
			setState2(false);
			return false;
		}

		if (ingred == "") {
			//ToastMessage('성분을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout3.y, true);
			setState3(false);
			return false;
		}

		if((sort!=7 && sort!=8) && (ingred!=32 && ingred!=33)){
			if (shape == "") {
				//ToastMessage('형태를 선택해 주세요.');
				Keyboard.dismiss();
				scrollViewRef.current?.scrollToPosition(0, layout4.y, true);
				setState4(false);
				return false;
			}
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
		if (selectedList == '') {
			//ToastMessage('검수를 1개 이상 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout5.y, true);
			setState5(false);
			return false;
		}

		if (dealMethod1 == "") {
			//ToastMessage('거래방식1을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout6.y, true);
			setState6(false);
			return false;
		}
		
		if(dealMethod1 == 1){
			if (dealMethod2 == "") {
				//ToastMessage('거래방식2를 선택해 주세요.');
				Keyboard.dismiss();
				scrollViewRef.current?.scrollToPosition(0, layout7.y, true);
				setState7(false);
				return false;
			}
		}

		if (priceOpt == 1 && price == "") {
			//ToastMessage('가격을 입력해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout9.y, true);
			setState9(false);
			return false;
		}
		

		if (priceOpt != 2 && payMethod == "") {
			//ToastMessage('결제방식을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout11.y, true);
			setState11(false);
			return false;
		}

		if (content == "") {
			//ToastMessage('내용을 입력해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout12.y, true);
			setState12(false);
			return false;
		}

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

		setIsLoading(false);

		const formData = {
			is_api:1,				
			pd_name:subject,
			pd_contents:content,
			c1_idx:1,
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
			pd_bidding_day:period,
			pf_img1_signature:img1Chk,
			pf_img2_signature:img2Chk,
			pf_img3_signature:img3Chk,
			pf_img4_signature:img4Chk,
			pf_img5_signature:img5Chk,
			pf_img6_signature:img6Chk,
			pf_img7_signature:img7Chk,
			pf_img8_signature:img8Chk,
			pf_img9_signature:img9Chk,
			pf_img10_signature:img10Chk,
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

	const imgSelectHandler = () => {
		ImageCropPicker.openPicker({
			// width: deviceSize.deviceWidth,
			// height: deviceSize.deviceWidth,
			// cropping: true,
			// compressImageMaxWidth: deviceSize.deviceWidth * 1.5,
			// compressImageMaxHeight: deviceSize.deviceWidth * 1.5,
			// compressImageQuality: 0.7,
			multiple: true,
		})
		.then(image => {
			//console.log('이미지 선택....', image);
			let selectPhoto = [...fileList];			
			//{'idx': 1, 'txt': '파일1', 'path': ''},
			image.map((item, index) => {
				let addCnt = fileCnt + index;
				let chk = 0;
				//console.log('addCnt ::: ', addCnt);
				if (addCnt == 0) {
					addCnt = index;
					chk = 1;
				}
				if (selectPhoto.length < 11) {
					return selectPhoto.push({
						idx: addCnt + 1,
						txt: '파일'+(addCnt + 1),
						path: item.path,
						signature: chk,
						//type: item.mime,
						//data: item.data,
						//name: 'spotImage.png',
					});
				} else {
					ToastMessage('이미지는 10개까지 등록가능합니다.');
				}
			});
			
			setFileCnt(selectPhoto.length);
			setFileConfirm(false);
			console.log(selectPhoto);
			setFileList(selectPhoto);
			setState0(true);
		})
		.catch(e => {
			ToastMessage('갤러리 선택을 취소하셨습니다.');
		});
	};

	const openCamera = () => {
    ImageCropPicker.openCamera({
      // width: 300,
      // height: 400,
      // cropping: true,
    })
		.then(image => {
			//console.log(image.path);
			//setUri(image.path);
			//props.onChange?.(image);

			const len = fileList.length;
			if (len >= 10) {
				setFileConfirm(false);
				ToastMessage('이미지는 10개까지 등록가능합니다.');
			} else {
				let selectPhoto = [...fileList];		
				let chk = 0;
				if (len == 0) {
					chk = 1;
				}
				selectPhoto.push({
					idx: len + 1,
					txt: '파일'+(len + 1),
					path: image.path,
					signature: chk,
				});

				setFileCnt(selectPhoto.length);
				setFileConfirm(false);
				setFileList(selectPhoto);
				setState0(true);
			}
		})
		.catch(e => {
			ToastMessage('카메라 촬영을 취소하셨습니다.');
		});
		//.finally(close);
	};
	
	function deleteFile(v) {
		//console.log('signature :::: ',fileList[v].signature);
		let firstChk = 0;
		if (fileList[v].signature == 1) {
			firstChk = 1;
		}
		fileList.splice(v, 1);		

		let selectCon = fileList.map((item, i) => {
			if (i == 0) {				
				if(firstChk == 1){
					return { ...item, idx: i + 1, txt: '파일' + (i + 1), path: item.path, signature: 1, };
				} else {
					return { ...item, idx: i + 1, txt: '파일' + (i + 1), path: item.path, signature: 0, };	
				}
			}else{
				return { ...item, idx: i + 1, txt: '파일' + (i + 1), path: item.path, signature: 0, };
			}	
		});
		setFileList(selectCon);
		getFileCount(selectCon, 'del');	
	}

	const chkSignature = (idx) => {
		//console.log(idx);
		let selectCon = fileList.map((item) => {
			if(item.idx === idx){
				return {...item, signature: 1};
			}else{
				return {...item, signature: 0};
			}
		});	
		setFileList(selectCon);
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'스크랩 글쓰기'} />
			<TouchableOpacity
				style={styles.transitStorage}
				activeOpacity={opacityVal}
				onPress={() => saveUpdate('stay')}
			>
				<Text style={styles.transitStorageText}>임시저장</Text>
			</TouchableOpacity>
			<KeyboardAwareScrollView ref={scrollViewRef}>
				<View style={styles.registArea}>
					<View style={[styles.registBox]}>
						<View style={[styles.typingBox, styles.typingBox2]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>사진첨부({fileCnt}/10)</Text>
							</View>
							<View style={[styles.inputAlert, styles.inputAlert]}>
								<AutoHeightImage width={14} source={require("../../assets/img/icon_alert2.png")} />
								<Text style={styles.inputAlertText}>대표이미지를 선택해 주세요.</Text>
							</View>

							<View style={styles.photoFlexBox}>
								<View style={[styles.photoBox, styles.photoBox2]}>							
									<TouchableOpacity												
										style={styles.photoBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											setFileConfirm(true);
										}}
									>
										<View style={styles.photoImg}>
											<AutoHeightImage width={79} source={require("../../assets/img/icon_plus3.png")} />
										</View>
									</TouchableOpacity>
								</View>
								<View style={styles.photoBoxScroll}>
									<ScrollView
										ref={scrollRef}
										horizontal={true}
										showsHorizontalScrollIndicator = {false}
										onMomentumScrollEnd ={() => {}}
									>
										{fileList.map((item, index) => {
											return(
												<View key={index} style={[styles.photoBox, index==0 ? styles.photoBox2 : null]}>							
													<TouchableOpacity												
														style={styles.photoBtn}
														activeOpacity={opacityVal}
														onPress={() => {chkSignature(item.idx)}}
													>
														{item.path ? (
															<>
															<View style={styles.photoImg}>
																<AutoHeightImage width={79} source={{ uri: item.path }} />
															</View>
															<View style={[styles.photoRadio, item.signature == 1 ? styles.photoRadioOn : null]}>
																{item.signature == 1 ? (																																	
																	<AutoHeightImage width={12} source={require("../../assets/img/icon_chk_on.png")} />
																) : null}		
															</View>
															</>
														) : (
															<AutoHeightImage width={79} source={require("../../assets/img/icon_plus3.png")} />
														)}														
													</TouchableOpacity>
													{item.path ? (
														<TouchableOpacity
															style={styles.photoDel}
															activeOpacity={opacityVal}
															onPress={() => {deleteFile(index)}}
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
							</View>
							{!state0 ? (
							<View style={[styles.typingAlert, styles.typingAlert2]}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>사진 첨부 목록 중 첫번째 영역에 사진을 첨부해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>글 제목</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={subject}
									onChangeText={(v) => {
										setSubject(v);
										if(v){setState1(true);}
									}}
									placeholder={'글 제목을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}									
								/>
							</View>
							{!state1 ? (
								<View style={styles.typingAlert}>
									<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
									<Text style={styles.typingAlertText}>글 제목을 입력해 주세요.</Text>
								</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout2}>
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
										if(value){setState2(true);}
									}}									
									placeholder={{
										label: '분류를 선택해 주세요.',										
										value: '',
										color: '#8791A1'
									}}									
									items={sortAry.map(item => ({
										label: item.label,
										value: item.value,
										color: '#000',
								 	}))}
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
							{!state2 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>분류를 선택해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout3}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>성분</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={ingred}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setIngred(value);
										select3(value);
										if(value){setState3(true);}
									}}
									placeholder={{
										label: '성분을 선택해 주세요.',
										//inputLabel: '성분을 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}
									items={ingreAry.map(item => ({
										label: item.label,
										value: item.value,
										color: '#000',
								 	}))}
									fixAndroidTouchableBug={true}
									useNativeAndroidPickerStyle={false}
									onOpen={()=>{console.log('1')}}
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
							{!state3 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>성분을 선택해 주세요.</Text>
							</View>
							) : null}
						</View>
												
						{(sort!=7 && sort!=8) && (ingred!=32 && ingred!=33) ? (
						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout4}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>형태</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={shape}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setShape(value);
										if(value){setState4(true);}
									}}
									placeholder={{
										label: '형태를 선택해 주세요.',
										//inputLabel: '형태를 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}
									items={shapeAry.map(item => ({
										label: item.label,
										value: item.value,
										color: '#000',
								 	}))}
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
							{!state4 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>형태를 선택해 주세요.</Text>
							</View>
							) : null}
						</View>
						) : null}

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout5}>
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
										onPress={() => {
											handleChange(item.idx);
											setState5(true);
										}}
									>
										<Text style={[styles.filterChkBtnText, item.isChecked ? styles.filterChkBtnTextOn : null]}>{item.txt}</Text>
									</TouchableOpacity>
									)
								})}
							</View>
							{!state5 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>검수를 선택해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout6}>
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
										setState6(true);
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
										setState6(true);
									}}
								>
									<Text style={[styles.dealBtnText, dealMethod1 == 2 ? styles.dealBtnTextOn : null]}>도착도(직접운반)</Text>
								</TouchableOpacity>
							</View>
							{!state6 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>거래방식1을 선택해 주세요.</Text>
							</View>
							) : null}
						</View>

						{dealMethod1 == 1 ? (
						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout7}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>거래방식2</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={dealMethod2}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setDealMethod2(value);
										if(value){setState7(true);}
									}}
									placeholder={{
										label: '거래방식2를 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}									
									items={dealMethod2Ary.map(item => ({
										label: item.label,
										value: item.value,
										color: '#000',
								 	}))}
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
							{!state7 ? (				
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>거래방식2를 선택해 주세요.</Text>
							</View>
							) : null}
						</View>
						) : null}			
						
						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout8}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>가격 단위</Text>
							</View>
							<View style={[styles.filterBtnList]}>
								<TouchableOpacity
									style={[styles.filterChkBtn, styles.filterChkBtnOn]}
									activeOpacity={opacityVal}
								>
									<Text style={[styles.filterChkBtnText, styles.filterChkBtnTextOn]}>kg ₩</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout9}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>가격</Text>
							</View>							
							<View style={[styles.filterBtnList]}>
								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==2 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										setPeriod('');
										if(priceOpt && priceOpt == 2){											
											setPriceOpt(1);											
										}else{
											setPriceOpt(2);
											setPrice('');
										}
										setState9(true);
									}}
								>
									<Text style={[styles.filterChkBtnText, priceOpt==2 ? styles.filterChkBtnTextOn : null]}>나눔</Text>
								</TouchableOpacity>
								
								<TouchableOpacity
									style={[styles.filterChkBtn, priceOpt==4 ? styles.filterChkBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={() => {
										setPeriod('');
										if(priceOpt && priceOpt == 4){											
											setPriceOpt(1);											
										}else{
											setPriceOpt(4);
										}
										setState9(true);
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
										setState9(true);
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
										//if(v){setState9(true);}
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
							{!state9 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>가격을 선택 또는 입력해 주세요.</Text>
							</View>
							) : null}
						</View>

						{priceOpt == 3 ? (
						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout10}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>입찰 기간</Text>
							</View>
							
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={period}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setPeriod(value);
										if(value){setState10(true);}
									}}
									placeholder={{
										label: '입찰 기간을 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}
									items={periodAry.map(item => ({
										label: item.label,
										value: item.value,
										color: '#000',
								 	}))}
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

						{priceOpt != 2 ? (
						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout11}>
							<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>결제방식</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={payMethod}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setPayMethod(value);
										console.log('!!!');
										if(value){setState11(true);}
									}}
									placeholder={{
										label: '결제방식을 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}
									items={payMethodAry.map(item => ({
										label: item.label,
										value: item.value,
										color: '#000',
								 	}))}
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
							{!state11 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>결제방식을 선택해 주세요.</Text>
							</View>
							) : null}
						</View>
						) : null}

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout12}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>내용</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={content}
									onChangeText={(v) => {
										setContent(v);
										if(v){setState12(true);}
									}}
									placeholder={'물품에 대한 자세한 정보를 작성하면 판매확률이 올라갑니다.'}
									placeholderTextColor="#8791A1"
									multiline={true}
									style={[styles.input, styles.textarea]}
								/>
							</View>
							{!state12 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />					
								<Text style={styles.typingAlertText}>내용을 입력해 주세요.</Text>
							</View>
							) : null}
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
					<View style={styles.avatarTitle}>
						<Text style={styles.avatarTitleText}>중고상품 사진 업로드</Text>
					</View>
					<View style={[styles.avatarBtnBox, styles.avatarBtnBox2]}>
						<TouchableOpacity 
							style={styles.avatarBtn}
							activeOpacity={opacityVal}
							onPress={openCamera}
						>
							<Text style={styles.avatarBtnText}>카메라</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.avatarBtn, styles.avatarBtn2]}
							activeOpacity={opacityVal}
							onPress={imgSelectHandler}
						>
							<Text style={[styles.avatarBtnText, styles.avatarBtnText2]}>앨범</Text>
						</TouchableOpacity>
					</View> 
					{/* <Avatar2 
						onChange={onAvatarChange} 
					/> */}
				</View>
			</Modal>
			
			<Modal
        visible={confirm}
				transparent={true}
				onRequestClose={() => {setConfirm(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setConfirm(false)}}
				></Pressable>
				<View style={styles.modalCont3}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>임시저장</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>작성한 내용을 </Text>
            <Text style={styles.avatarDescText}>임시저장 하시겠습니까?</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {eventBack('cancel');}}
            >
              <Text style={styles.avatarBtnText}>아니오</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {eventBack('save');}}
            >
              <Text style={styles.avatarBtnText}>예</Text>
            </TouchableOpacity>
          </View>
				</View>
			</Modal>
			
			<Modal
        visible={saveModal}
				transparent={true}
				onRequestClose={() => {setSaveModal(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setSaveModal(false)}}
				></Pressable>
				<View style={styles.modalCont3}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>임시저장</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>기존에 작성한 페이지가 있습니다.</Text>
            <Text style={styles.avatarDescText}>이어서 하시겠습니까?</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setSaveModal(false);}}
            >
              <Text style={styles.avatarBtnText}>아니오</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
							onPress={() => {
								setSaveModal(false);
								getSaveState2();
							}}
            >
              <Text style={styles.avatarBtnText}>예</Text>
            </TouchableOpacity>
          </View>
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
	typingInputBox2: {marginTop:5},
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
	certChkBtnText3: { fontFamily: Font.NotoSansBold, fontSize: 15, color: '#fff' },
	photoFlexBox: { flexDirection: 'row' },
	photoBoxScroll: {width:innerWidth-89,marginLeft:10,},
	photoBox: { width: 79, marginTop: 10, marginLeft: 10, position: 'relative', },
	photoBox2: { marginLeft: 0, },
	photoBtn: {alignItems:'center'},
	photoImg: {width:79,height:79,borderWidth:1,borderColor:'#E1E1E1',borderRadius:12,overflow:'hidden',display: 'flex', alignItems: 'center', justifyContent: 'center',},
	photoRadio: { alignItems:'center', justifyContent:'center', width: 20, height: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E1E1E1', borderRadius:12, marginTop: 10, },
	photoRadioOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	photoDel: {position:'absolute',top:5,right:5,zIndex:10},
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: { width: innerWidth, height: 154, padding: 30, paddingLeft: 20, paddingRight: 20, backgroundColor: '#fff', borderRadius: 10, position: 'absolute', left: 20, top: ((widnowHeight / 2) - 88) },
	modalCont3: { width: innerWidth, padding: 20, paddingBottom: 30, backgroundColor: '#fff', borderRadius: 10, position: 'absolute', left: 20, top: ((widnowHeight / 2) - 160) },
	avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, },
	avatarBtnBox2: {marginTop:15,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
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
	indicator: { width: widnowWidth, height: widnowHeight, backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, },
	typingAlert: {flexDirection:'row',marginTop:10,position:'relative',paddingLeft:22,},
	typingAlert2: {paddingRight:20,},
	typingAlertImg: {position:'absolute',left:0,top:2,},
	typingAlertText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#ED0000'},
	transitStorage: {position:'absolute',top:7,right:10,alignItems:'center',justifyContent:'center',width:70,height:35,backgroundColor:'#fff',borderWidth:1,borderColor:'#e5ebf2',borderRadius:5,},
	transitStorageText: { fontFamily: Font.NotoSansMedium, fontSize: 13, lineHeight: 17, },
	inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlert2: {marginTop:5},
	inputAlertText: {width:(innerWidth-14),paddingLeft:5,fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:16,color:'#6C6C6C'},
})

export default Write1