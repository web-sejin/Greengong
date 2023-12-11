import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';
import DocumentPicker from 'react-native-document-picker'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
//import {Avatar2} from '../../components/Avatar2';
import PushChk from "../../components/Push";
import ImageCropPicker from 'react-native-image-crop-picker';

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

//스크랩 글수정
const MatchModify = ({navigation, route}) => {
	const fileListData = [
		{'idx': 1, 'txt': '파일1', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 2, 'txt': '파일2', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 3, 'txt': '파일3', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 4, 'txt': '파일4', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 5, 'txt': '파일5', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 6, 'txt': '파일6', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 7, 'txt': '파일7', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 8, 'txt': '파일8', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 9, 'txt': '파일9', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
		{'idx': 10, 'txt': '파일10', 'path': '', 'mf_idx':'', 'del':0, 'del_idx':''},
	];

  const idx = route.params.idx;
	const scrollRef = useRef();
	const scrollViewRef = useRef(null);
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [fileCnt, setFileCnt] = useState(0);
	const [fileOrder, setFileOrder] = useState();
	const [fileConfirm, setFileConfirm] = useState(false);
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [fileList, setFileList] = useState([]);
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
	const [call, setCall] = useState(0); //설계요청
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
	const [content, setContent] = useState(''); //도면상세정보
	const [isLoading, setIsLoading] = useState(false);

	const [cateAry, setCateAry] = useState([]); //카테고리 리스트
	const [sortAry, setSortAry] = useState([]); //분류 리스트
	const [matt1Ary, setMatt1Ary] = useState([]); //재료1 리스트
	const [matt2Ary, setMatt2Ary] = useState([]); //재료2 리스트
	const [list1, setList1] = useState([]); //도면보안설정 리스트
	const [list2, setList2] = useState([]); //도면상담방식 리스트
	const [list3, setList3] = useState([]); //제품용도 리스트
	const [list4, setList4] = useState([]); //제품용도 세부 리스트

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
	const [state13, setState13] = useState(true);
	const [state14, setState14] = useState(true);
	const [state15, setState15] = useState(true);
	const [state16, setState16] = useState(true);
	
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
	const [layout13, setLayout13] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout14, setLayout14] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout15, setLayout15] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout16, setLayout16] = useState({ x: 0, y: 0, width: 0, height: 0 });

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
	const handleLayout12 = (event) => { const { x, y, width, height } = event.
	nativeEvent.layout; setLayout12({ x, y, width, height }); };
	const handleLayout13 = (event) => { const { x, y, width, height } = event.
		nativeEvent.layout; setLayout13({ x, y, width, height });
	};
	const handleLayout14 = (event) => { const { x, y, width, height } = event.
		nativeEvent.layout; setLayout14({ x, y, width, height });
	};
	const handleLayout15 = (event) => { const { x, y, width, height } = event.
		nativeEvent.layout; setLayout15({ x, y, width, height });
	};
	const handleLayout16 = (event) => { const { x, y, width, height } = event.
	nativeEvent.layout; setLayout16({ x, y, width, height }); };

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setFileConfirm(false);
				setFileList([]);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      select1();
      select5();
      select6();
      select7();
			getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	//카테고리
	const select1 = async () => {
		await Api.send('GET', 'match_cate1', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("카테고리 : ",responseJson);
				setCateAry(responseJson.data);
			}else{
				//console.log("카테고리 err : ",responseJson.result_text);
			}
		}); 
	}

	//분류
	const select2 = async () => {
		await Api.send('GET', 'match_cate2', {is_api:1, cate1:cate}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("분류 : ",responseJson);
				setSortAry(responseJson.data);
			}else{
				//console.log("분류 err : ",responseJson.result_text);
			}
		}); 
	}

	//분류 체크
	const sortChk = async () => {
		//setMatt1('');
		//setMatt1Ary([]);		
		if(sort){
			if(sort==40 || cate==6 || cate==7){
				console.log('재료1 X');
				setMatt1('');
				setMatt1Ary([]);
				setMatt2('');
				setMatt2Ary([]);
			}else{
				select3();
			}
		}
	}

	//재료1
	const select3 = async () => {		
		//setMatt2('');
		//setMatt2Ary([]);
		await Api.send('GET', 'match_cate3', {is_api:1, cate2:sort}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("재료1 : ",responseJson);
				setMatt1Ary(responseJson.data);
			}else{
				//console.log("재료1 err : ",responseJson.result_text);
			}
		});
	}

	//재료1 체크
	const matt1Chk = async () => {
		//console.log("matt1Chk : ",cate+"//"+matt1);
		if(matt1){
			if(matt1==10 || matt1==20 || matt1==30 || matt1==40 || matt1==50 || cate==2 || cate==4 || cate==5 || cate==6 || cate==7 || (cate==3 && matt1==73) || (cate==3 && matt1==76) || (cate==3 && matt1==79) || (cate==3 && matt1==83) || (cate==3 && matt1==162)){
				console.log('재료2 X');
				setMatt2('');
				setMatt2Ary([]);
			}else{
				select4();
			}
		}
	}

	//재료2
	const select4 = async () => {
		await Api.send('GET', 'match_cate4', {is_api:1, cate3:matt1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("재료2 : ",responseJson);
				setMatt2Ary(responseJson.data);
			}else{
				//console.log("재료2 err : ",responseJson.result_text);
			}
		});
	}

	//도면보안설정
	const select5 = async () => {
		await Api.send('GET', 'match_doc_permit', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("도면보안설정 : ",responseJson);
				setList1(responseJson.data);
			}else{
				//console.log("도면보안설정 err : ",responseJson.result_text);
			}
		}); 
	}

	//상담방식(견적서)
	const select6 = async () => {
		await Api.send('GET', 'match_chat_permit', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("상담방식(견적서) : ",responseJson);
				setList2(responseJson.data);
			}else{
				//console.log("상담방식(견적서) err : ",responseJson.result_text);
			}
		}); 
	}

	//제품용도
	const select7 = async () => {
		await Api.send('GET', 'match_use_type', {is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("제품용도 : ",responseJson);
				setList3(responseJson.data);
			}else{
				//console.log("상담방식(견적서) err : ",responseJson.result_text);
			}
		}); 
	}

	//제품용도 세부
	const select8 = async () => {
		await Api.send('GET', 'match_use_type2', {is_api:1, user_type:useInfo}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("제품용도 세부 : ",responseJson);
				setList4(responseJson.data);
			}else{
				//console.log("상담방식(견적서) err : ",responseJson.result_text);
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
		setState0(true);
  };

	function deleteFile(v){
		let selectCon = fileList.map((item) => {		
			if(item.idx === v){				
				return {...item, path: '', mf_idx:'', del:1, del_idx:item.mf_idx};
			}else{
				let val = ''
				if(item.mf_idx != ''){
					val = item.mf_idx;
				}
				return {...item, path: item.path, mf_idx:val, del:0, del_idx:item.mf_idx};
			}
		});
		console.log("delete selectCon : ",selectCon);
		setFileList(selectCon);
		getFileCount(selectCon, 'del');
	}

	const openPicker = async () => {
		console.log(DocumentPicker.types)
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			})
			//console.log('res :::::::::::::::: ',res[0]);
			setFloorFile(res[0].name);
			setFloorFileType(res[0].type);
			setFloorFileUri(res[0].uri);
			
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

	//도면업로드 삭제
	const floorfileDelete = () => {
		setFloorFile('');
		setFloorFileType('');
		setFloorFileUri('');
		//console.log('?');
	}

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
		
		let del1 = 0;
		let del2 = 0;
		let del3 = 0;
		let del4 = 0;
		let del5 = 0;
		let del6 = 0;
		let del7 = 0;
		let del8 = 0;
		let del9 = 0;
		let del10 = 0;

		let del1Idx = '';
		let del2Idx = '';
		let del3Idx = '';
		let del4Idx = '';
		let del5Idx = '';
		let del6Idx = '';
		let del7Idx = '';
		let del8Idx = '';
		let del9Idx = '';
		let del10Idx = '';		

		fileList.map((item, index)=>{
			if(item.idx == 1 && item.path != ''){ 
				img1Path = item.path;
				img1Idx = item.mf_idx;
				img1Chk = item.signature;
			}else if(item.idx == 2 && item.path != ''){ 
				img2Path = item.path;
				img2Idx = item.mf_idx;
				img2Chk = item.signature;
			}else if(item.idx == 3 && item.path != ''){ 
				img3Path = item.path;
				img3Idx = item.mf_idx;
				img3Chk = item.signature;
			}else if(item.idx == 4 && item.path != ''){ 
				img4Path = item.path;
				img4Idx = item.mf_idx;
				img4Chk = item.signature;
			}else if(item.idx == 5 && item.path != ''){ 
				img5Path = item.path;
				img5Idx = item.mf_idx;
				img5Chk = item.signature;
			}else if(item.idx == 6 && item.path != ''){ 
				img6Path = item.path;
				img6Idx = item.mf_idx;
				img6Chk = item.signature;
			}else if(item.idx == 7 && item.path != ''){ 
				img7Path = item.path;
				img7Idx = item.mf_idx;
				img7Chk = item.signature;
			}else if(item.idx == 8 && item.path != ''){ 
				img8Path = item.path;
				img8Idx = item.mf_idx;
				img8Chk = item.signature;
			}else if(item.idx == 9 && item.path != ''){ 
				img9Path = item.path;
				img9Idx = item.mf_idx;
				img9Chk = item.signature;
			}else if(item.idx == 10 && item.path != ''){ 
				img10Path = item.path;
				img10Idx = item.mf_idx;
				img10Chk = item.signature;
			}

			if(item.idx == 1 && item.del == 1){
				del1 = 1;
				del1Idx = item.del_idx
			}else if(item.idx == 2 && item.del == 1){
				del2 = 1;
				del2Idx = item.del_idx
			}else if(item.idx == 3 && item.del == 1){
				del3 = 1;
				del3Idx = item.del_idx
			}else if(item.idx == 4 && item.del == 1){
				del4 = 1;
				del4Idx = item.del_idx
			}else if(item.idx == 5 && item.del == 1){
				del5 = 1;
				del5Idx = item.del_idx
			}else if(item.idx == 6 && item.del == 1){
				del6 = 1;
				del6Idx = item.del_idx
			}else if(item.idx == 7 && item.del == 1){
				del7 = 1;
				del7Idx = item.del_idx
			}else if(item.idx == 8 && item.del == 1){
				del8 = 1;
				del8Idx = item.del_idx
			}else if(item.idx == 9 && item.del == 1){
				del9 = 1;
				del9Idx = item.del_idx
			}else if(item.idx == 10 && item.del == 1){
				del10 = 1;
				del10Idx = item.del_idx
			}
		});
	
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

		if (cate == "") {
			//ToastMessage('카테고리를 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout2.y, true);
			setState2(false);
			return false;
		}

		if (sort == "") {
			//ToastMessage('분류를 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout3.y, true);
			setState3(false);
			return false;
		}

		if(sort==40 || cate==6 || cate==7){
		}else{
			if (matt1 == "") {
				//ToastMessage('재료1을 선택해 주세요.');
				Keyboard.dismiss();
				scrollViewRef.current?.scrollToPosition(0, layout4.y, true);
				setState4(false);
				return false;
			}
		}

		if(matt1==10 || matt1==20 || matt1==30 || matt1==40 || matt1==50 || cate==2 || cate==4 || cate==5 || cate==6 || cate==7 || (cate==3 && matt1==73) || (cate==3 && matt1==76) || (cate==3 && matt1==79) || (cate==3 && matt1==83) || (cate==3 && matt1==162)){
		}else{
			if (matt2 == "") {
				//ToastMessage('재료2를 선택해 주세요.');
				Keyboard.dismiss();
				scrollViewRef.current?.scrollToPosition(0, layout5.y, true);
				setState5(false);
				return false;
			}
			if(matt2==12 || matt2==22 || matt2==32 || matt2==40 || matt2==47 || matt2==59 || matt2==62 || matt2==65 || matt2==70){
				if (matt2Direct == "") {
					//ToastMessage('재료2를 직접 입력해 주세요.');
					Keyboard.dismiss();
					scrollViewRef.current?.scrollToPosition(0, layout5.y, true);
					setState5(false);
					return false;
				}
			}
		}

		if (cnt == "") {
			//ToastMessage('수량을 입력해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout7.y, true);
			setState7(false);
			return false;
		}
		
		if((call != 1 || (call==1 && (cate==6 || cate==7))) && security == ""){ 
			//ToastMessage('도면보안설정을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout8.y, true);
			setState8(false);
			return false; 
		}

		if (advice == "") {
			//ToastMessage('상담방식(견적서)을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout9.y, true);
			setState9(false);
			return false;
		}

		if (projectName == "") {
			//ToastMessage('프로젝트명을 입력해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout10.y, true);
			setState10(false);
			return false;
		}

		if (useInfo == "") {
			//ToastMessage('제품용도를 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout11.y, true);
			setState11(false);
			return false;
		}

		if (indCate == "") {
			//ToastMessage('[산업] 카테고리를 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout12.y, true);
			setState12(false);
			return false;
		}		
		if (useInfo == 3 && indCate == 1 && indCateDirect == "") {
			//ToastMessage('[산업] 카테고리를 직접 입력해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout12.y, true);
			//setState13(false);
			setState12(false);
			return false;
		}

		if (endDateMethod == "") {
			//ToastMessage('납기일방식을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout14.y, true);
			setState14(false);
			return false;
		}
		if (endDateMethod == 2 && endDate == "") {
			//ToastMessage('납기일을 선택해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout14.y, true);
			setState14(false);
			return false;
		}

		if (content == "") {
			//ToastMessage('도면상세정보를 입력해 주세요.');
			Keyboard.dismiss();
			scrollViewRef.current?.scrollToPosition(0, layout16.y, true);
			setState16(false);
			return false;
		}

		let calcCnt = 0;
		if(cnt != ''){
			calcCnt = (cnt).split(',').join('');
		}

		setIsLoading(false);

		const formData = {
			is_api:1,				
			mc_idx:idx,
			mc_name:subject,
			mc_contents:content,
			c1_idx:cate,
			c2_idx:sort,
			c3_idx:matt1,
			c4_idx:matt2,
			c4_etc:matt2Direct,
			mc_total:calcCnt,
			mc_project_name:projectName,
			mc_dwg_secure:security,
			mc_chat_permit:advice,
			mc_use_type:useInfo,
			mc_use_type_etc:indCateDirect,
			mc_use_type2:indCate,
			mc_end_date:endDate,
			mc_option1:call,
			mc_option2:endDateMethod,
			mc_price: price,
			mf_img1_signature:img1Chk,
			mf_img2_signature:img2Chk,
			mf_img3_signature:img3Chk,
			mf_img4_signature:img4Chk,
			mf_img5_signature:img5Chk,
			mf_img6_signature:img6Chk,
			mf_img7_signature:img7Chk,
			mf_img8_signature:img8Chk,
			mf_img9_signature:img9Chk,
			mf_img10_signature:img10Chk,
		};

		//console.log(formData);

		if(floorFile != ''){ 
			formData.mc_file =  {'uri': floorFileUri, 'type': floorFileType, 'name': floorFile}; 
		}
		if(img1Path != ''){ 
			formData.mf_img1 =  {'uri': img1Path, 'type': 'image/png', 'name': 'mf_img1.png'}; 
			formData.mf_idx_0 = img1Idx;
		}
		if(img2Path != ''){ 
			formData.mf_img2 =  {'uri': img2Path, 'type': 'image/png', 'name': 'mf_img2.png'}; 
			formData.mf_idx_1 = img2Idx;
		}
		if(img3Path != ''){ 
			formData.mf_img3 =  {'uri': img3Path, 'type': 'image/png', 'name': 'mf_img3.png'}; 
			formData.mf_idx_2 = img3Idx;
		}
		if(img4Path != ''){ 
			formData.mf_img4 =  {'uri': img4Path, 'type': 'image/png', 'name': 'mf_img4.png'}; 
			formData.mf_idx_3 = img4Idx;
		}
		if(img5Path != ''){ 
			formData.mf_img5 =  {'uri': img5Path, 'type': 'image/png', 'name': 'mf_img5.png'}; 
			formData.mf_idx_4 = img5Idx;
		}
		if(img6Path != ''){ 
			formData.mf_img6 =  {'uri': img6Path, 'type': 'image/png', 'name': 'mf_img6.png'}; 
			formData.mf_idx_5 = img6Idx;
		}
		if(img7Path != ''){ 
			formData.mf_img7 =  {'uri': img7Path, 'type': 'image/png', 'name': 'mf_img7.png'}; 
			formData.mf_idx_6 = img7Idx;
		}
		if(img8Path != ''){ 
			formData.mf_img8 =  {'uri': img8Path, 'type': 'image/png', 'name': 'mf_img8.png'}; 
			formData.mf_idx_7 = img8Idx;
		}
		if(img9Path != ''){ 
			formData.mf_img9 =  {'uri': img9Path, 'type': 'image/png', 'name': 'mf_img9.png'}; 
			formData.mf_idx_8 = img9Idx;
		}
		if(img10Path != ''){ 
			formData.mf_img10 =  {'uri': img10Path, 'type': 'image/png', 'name': 'mf_img10.png'}; 
			formData.mf_idx_9 = img10Idx;
		}

		if(del1 == 1){ 
			formData.mf_file_del_0 = del1;
			formData.mf_file_del_0_idx = del1Idx;
		}
		if(del2 == 1){ 
			formData.mf_file_del_1 = del2;
			formData.mf_file_del_1_idx = del2Idx;
		}
		if(del3 == 1){ 
			formData.mf_file_del_2 = del3;
			formData.mf_file_del_2_idx = del3Idx;
		}
		if(del4 == 1){ 
			formData.mf_file_del_3 = del4;
			formData.mf_file_del_3_idx = del4Idx;
		}
		if(del5 == 1){ 
			formData.mf_file_del_4 = del5;
			formData.mf_file_del_4_idx = del5Idx;
		}
		if(del6 == 1){ 
			formData.mf_file_del_5 = del6;
			formData.mf_file_del_5_idx = del6Idx;
		}
		if(del7 == 1){ 
			formData.mf_file_del_6 = del7;
			formData.mf_file_del_6_idx = del7Idx;
		}
		if(del8 == 1){ 
			formData.mf_file_del_7 = del8;
			formData.mf_file_del_7_idx = del8Idx;
		}
		if(del9 == 1){ 
			formData.mf_file_del_8 = del9;
			formData.mf_file_del_8_idx = del9Idx;
		}
		if(del10 == 1){ 
			formData.mf_file_del_9 = del10;
			formData.mf_file_del_9_idx = del10Idx;
		}

		//console.log('useInfo : ',useInfo);
		//console.log("formData : ",formData);

		Api.send('POST', 'modify_match', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
				setIsLoading(true);
				navigation.navigate('Match', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', responseJson);
				setIsLoading(true);
				ToastMessage(responseJson.result_text);
			}
		});
	}

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'view_match', {'is_api': 1, mc_idx:idx}, (args)=>{     
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("modify : ",responseJson);
				const imgList = responseJson.mf_data;
				//console.log('imgList : ', imgList);
				if(imgList.length > 0){
					let selectCon = imgList.map((item,index) => {					
						if(imgList[index]){
							return {...item, idx: (index+1), path: imgList[index].mf_name, mf_idx:imgList[index].mf_idx, signature:imgList[index].mf_signature};
						}else{
							return {...item, idx: (index+1), path: item.path, mf_idx:'', signature:0};
						}
					});
					console.log('selectCon : ', selectCon);
					setFileList(selectCon);
					getFileCount(selectCon);
				}

        setSubject(responseJson.mc_name);
        
        const apiCate = responseJson.c1_idx;
				const apiSort = responseJson.c2_idx;
				const apiMatt1 = responseJson.c3_idx;
				const apiMatt2 = responseJson.c4_idx;
				setMatt1('');
				setMatt2('');
				setCate(parseInt(apiCate));
				setSort(apiSort.toString());			
				setMatt1(apiMatt1.toString());
				setMatt2(apiMatt2.toString());				
				if(apiMatt2==12 || apiMatt2==22 || apiMatt2==32 || apiMatt2==40 || apiMatt2==47 || apiMatt2==59 || apiMatt2==62 || apiMatt2==65 || apiMatt2==70){
					setMatt2Direct(responseJson.c4_etc);
				}				        
        
				let totalComma = String(responseJson.mc_total).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        setCnt(totalComma);
        console.log(responseJson.mc_file);
        if(responseJson.mc_file_org){					
          setFloorFile(responseJson.mc_file_org);
					setFloorFileType('application/zip');
					setFloorFileUri(responseJson.mc_file);
        }

        setCall(responseJson.mc_option1)
        setSecurity(parseInt(responseJson.mc_dwg_secure_org));
        setAdvice(parseInt(responseJson.mc_chat_permit));
        setProjectName(responseJson.mc_project_name);        
        setUseInfo(parseInt(responseJson.mc_use_type_org));
        select8();
        setIndCate(parseInt(responseJson.mc_use_type2_org))        
        setEndDateMethod(responseJson.mc_option2_org);
        if(responseJson.mc_option2_org == 2){
          const endDate = (responseJson.mc_end_date).split('.').join('-');
          setEndDate(endDate);
        }
        setPrice((responseJson.mc_price).toString());
				setContent(responseJson.mc_contents);

        setIsLoading(true);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!', responseJson);
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
			<Header navigation={navigation} headertitle={'매칭 글수정'} />
			<KeyboardAwareScrollView ref={scrollViewRef}>
				<View style={styles.registArea}>
					<View style={[styles.registBox]}>
						<View style={[styles.typingBox, styles.typingBox2]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>사진첨부({fileCnt}/10)</Text>
							</View>
							<View style={[styles.inputAlert, styles.inputAlert]}>
								<AutoHeightImage width={14} source={require("../../assets/img/icon_alert2.png")} />
								<Text style={styles.inputAlertText2}>대표이미지를 선택해 주세요.</Text>
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
								<Text style={styles.typingTitleText}>카테고리</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={cate}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setCate(value);
										select2();
										if(floorFile && (cate==6 || cate==7) && call==1){
											setCall(0);
										}
										if(value){setState2(true);}
									}}
									placeholder={{
										label: '카테고리를 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}
									placeholderTextColor="8791A1"
									items={cateAry.map(item => ({
										label: item.txt,
										value: item.val,
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
									<Text style={styles.typingAlertText}>카테고리를 선택해 주세요.</Text>
								</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout3}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>분류</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={sort}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setSort(value);
										sortChk();
										if(value){setState3(true);}
									}}
									placeholder={{
										label: '분류를 선택해 주세요.',
										value: '',
										color: '#8791A1'
									}}
									placeholderTextColor="8791A1"
									items={sortAry.map(item => ({
										label: item.c2_name,
										value: item.c2_idx,
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
							{!state3 ? (
								<View style={styles.typingAlert}>
									<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
									<Text style={styles.typingAlertText}>분류를 선택해 주세요.</Text>
								</View>
							) : null}
						</View>
						
						{cate!='' && sort!='' ? (
							(sort==40 || cate==6 || cate==7) ?
								null 
							: (
							<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout4}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>재료1</Text>
								</View>
								<View style={[styles.typingInputBox]}>									
									<RNPickerSelect
										value={matt1}
										onValueChange={(value) => {
											Keyboard.dismiss();
											setMatt1(value);
											matt1Chk();
											if(value){setState4(true);}
										}}
										placeholder={{
											label: '재료1을 선택해 주세요.',
											value: '',
											color: '#8791A1'
										}}										
										placeholderTextColor="8791A1"
										items={matt1Ary.map(item => ({
											label: item.c3_name,
											value: item.c3_idx,
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
									<Text style={styles.typingAlertText}>재료1을 선택해 주세요.</Text>
								</View>
							) : null}
							</View>
							)
						) : null}

						{cate!='' && matt1!='' ? (		
							matt1==10 || matt1==20 || matt1==30 || matt1==40 || matt1==50 || cate==2 || cate==4 || cate==5 || cate==6 || cate==7 || (cate==3 && matt1==73) || (cate==3 && matt1==76) || (cate==3 && matt1==79) || (cate==3 && matt1==83) || (cate==3 && matt1==162) ? (
								null
							) : (
								<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout5}>
									<View style={styles.typingTitle}>
										<Text style={styles.typingTitleText}>재료2</Text>
									</View>
									<View style={[styles.typingInputBox]}>
										<RNPickerSelect
											value={matt2}
											onValueChange={(value) => {
												Keyboard.dismiss();
												setMatt2(value);
												if(value==12 || value==22 || value==32 || value==40 || value==47 || value==59 || value==62 || value==65 || value==70){ 
													setMatt2Direct(''); 
												}else{
													//setMatt2Direct(''); 
												}
												if(value){setState5(true);}
											}}
											placeholder={{
												label: '재료2를 선택해 주세요.',
												//inputLabel: '재료2를 선택해 주세요.',
												value: null,
												color: '#8791A1'
											}}
											placeholderTextColor="8791A1"
											items={matt2Ary.map(item => ({
												label: item.c4_name,
												value: item.c4_idx,
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
										{!matt2 && !state5 ? (
											<View style={styles.typingAlert}>
												<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
												<Text style={styles.typingAlertText}>재료2를 선택해 주세요.</Text>
											</View>
										) : null}

									{matt2==12 || matt2==22 || matt2==32 || matt2==40 || matt2==47 || matt2==59 || matt2==62 || matt2==65 || matt2==70 ? (
									<View style={[styles.typingInputBox]}>
										<TextInput
											value={matt2Direct}
											onChangeText={(v) => {
												setMatt2Direct(v);
												if(v){setState5(true);}
											}}
											placeholder={'재료2를 직접 입력을 입력해 주세요.'}
											placeholderTextColor="#8791A1"
											style={[styles.input]}
										/>
										{!matt2Direct && !state5 ? (
										<View style={styles.typingAlert}>
											<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
											<Text style={styles.typingAlertText}>재료2를 입력해 주세요.</Text>
										</View>
										) : null}
									</View>
									) : null}

								</View>
							)
						) : null}

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout7}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>수량</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={cnt}
									keyboardType = 'numeric'
									onChangeText={(v) => {
										let comma = (v).split(',').join('');
										comma = String(comma).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
										setCnt(comma);
										if(v){setState7(true);}
									}}
									placeholder={'수량을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
							{!state7 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>수량을 입력해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								{cate == 6 || cate == 7 ? (
									<Text style={styles.typingTitleText}>자료첨부(도면,이미지,텍스트파일)</Text>
								):(
									<Text style={styles.typingTitleText}>도면 업로드</Text>
								)}
							</View>
							{call != 1 || (call==1 && (cate==6 || cate==7)) ? (
							<>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								{cate == 6 || cate == 7 ? (
									<TextInput
										value={floorFile}
										editable = {false}
										placeholder={'자료를 첨부해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input, styles.input2, floorFile!=""? styles.input4:null]}
									/>
								):(
									<TextInput
										value={floorFile}
										editable = {false}
										placeholder={'도면을 업로드해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input, styles.input2, floorFile!=""? styles.input4:null]}
									/>
								)}
								<TouchableOpacity 
									style={[styles.certChkBtn, floorFile!=""? styles.certChkBtn4:null]}
									activeOpacity={opacityVal}
									onPress={openPicker}
								>
									<Text style={styles.certChkBtnText}>업로드</Text>
								</TouchableOpacity>
								{floorFile != "" ? (
									<TouchableOpacity 
										style={[styles.certChkBtn4, styles.certChkBtnDelete]}
										activeOpacity={opacityVal}
										onPress={floorfileDelete}
									>
										<Text style={styles.certChkBtnText}>삭제</Text>
									</TouchableOpacity>
								) : null}
							</View>
							<View style={styles.inputAlert}>
								<AutoHeightImage width={14} source={require("../../assets/img/icon_alert3.png")} />
								<Text style={styles.inputAlertText}>도면이 없으면 자세한 견적을 받을 수 없습니다.</Text>
							</View>
							{cate == 6 || cate == 7 ? (
							<View style={[styles.inputAlert, styles.inputAlert2]}>
								<AutoHeightImage width={14} source={require("../../assets/img/icon_alert3.png")} />
								<Text style={styles.inputAlertText}>ZIP파일만 업로드 가능합니다.</Text>
							</View>
							):null}
							</>
							) : null}
							
							{floorFile=="" || (floorFile!="" && (cate==6 || cate==7)) ? (
							<TouchableOpacity
								style={[styles.floorBtn, call==1 ? styles.floorBtnOn : null]}
								activeOpacity={opacityVal}
								onPress={() => {
									if(call == 1){
										setCall(0)
									}else{
										setCall(1)
										setSecurity('');
									}	
								}}
							>
								<AutoHeightImage width={15} source={require("../../assets/img/icon_chk_on.png")} style={styles.floorBtnImg} />
								<Text style={styles.floorBtnText}>설계요청</Text>
							</TouchableOpacity>
							) : null}
						</View>
						
						{call != 1 || (call==1 && (cate==6 || cate==7)) ? (
						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout8}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>도면보안설정</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={security}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setSecurity(value);
										if(value){setState8(true);}
									}}
									placeholder={{
										label: '도면보안설정을 확인해 주세요.',
										//inputLabel: '도면보안설정을 확인해 주세요.',
										value: null,
										color: '#8791A1'
									}}
									placeholderTextColor="8791A1"
									items={list1.map(item => ({
										label: item.txt,
										value: item.val,
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
							{!state8 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>도면보안설정을 확인해 주세요.</Text>
							</View>
							) : null}
						</View>				
						) : null}		

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout9}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>상담방식(견적서)</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={advice}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setAdvice(value);
										if(value){setState9(true);}
									}}
									placeholder={{
										label: '상담방식을 선택해 주세요.',
										//inputLabel: '상담방식을 선택해 주세요.',
										value: null,
										color: '#8791A1'
									}}
									placeholderTextColor="8791A1"
									items={list2.map(item => ({
										label: item.txt,
										value: item.val,
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
							{!state9 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>상담방식을 선택해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout10}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>프로젝트명</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={projectName}
									onChangeText={(v) => {
										setProjectName(v);
										if(v){setState10(true);}
									}}
									placeholder={'프로젝트명을 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
							{!state10 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>프로젝트명을 입력해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout11}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>제품용도</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={useInfo}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setUseInfo(value);
										select8();
										if(value){setState11(true);}
									}}
									placeholder={{
										label: '제품용도를 선택해 주세요.',
										//inputLabel: '제품용도를 선택해 주세요.',
										value: null,
										color: '#8791A1'
									}}
									placeholderTextColor="8791A1"
									items={list3.map(item => ({
										label: item.txt,
										value: item.val,
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
								<Text style={styles.typingAlertText}>제품용도를 선택해 주세요.</Text>
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout12}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>[산업] 카테고리</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<RNPickerSelect
									value={indCate}
									onValueChange={(value) => {
										Keyboard.dismiss();
										setIndCate(value);
										setIndCateDirect('');
										if(value){setState12(true);}
									}}
									placeholder={{
										label: '카테고리를 선택해 주세요.',
										//inputLabel: '카테고리를 선택해 주세요.',
										value: null,
										color: '#8791A1'
									}}
									placeholderTextColor="8791A1"
									items={list4.map(item => ({
										label: item.txt,
										value: item.val,
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
							{!indCate && !state12 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>[산업] 카테고리를 선택해 주세요.</Text>
							</View>
							) : null}
							{useInfo==3 && indCate==1 ? (
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
								{!indCateDirect && !state12 ? (
								<View style={styles.typingAlert}>
									<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
									<Text style={styles.typingAlertText}>기타/미분류를 입력해 주세요.</Text>
								</View>
								) : null}
							</View>
							) : null}
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout14}>
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
										setState14(true);
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
											setEndDate('');
											setEndDateObj();
										}else{
											setEndDateMethod(2);
										}
										setState14(true);
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
										setState14(true);
									}}
								>
									<Text style={[styles.dealBtnText, endDateMethod == 3 ? styles.dealBtnTextOn : null]}>기한 없음</Text>
								</TouchableOpacity>
							</View>
							{!endDateMethod && !state14 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>납기일을 선택해 주세요.</Text>
							</View>
							) : null}
							{endDateMethod == 2 ? (
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TouchableOpacity
									style={styles.calendarBtn}
									activeOpacity={opacityVal}
										onPress={() => {
											setCalendarVisible(true);
											setState14(true);
										}}
								>									
									<AutoHeightImage width={17} source={require("../../assets/img/icon_calendar.png")} style={styles.icon_calendar}/>
									{endDate ? (
										<Text style={[styles.calendarBtnText, styles.calendarBtnTextOn]}>{endDate}</Text>
									) : (
										<Text style={styles.calendarBtnText}>납기일을 선택해 주세요.</Text>
									)}
									<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} style={styles.icon_calendar_arr}/>
								</TouchableOpacity>
								{!endDate && !state14 ? (
								<View style={styles.typingAlert}>
									<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
									<Text style={styles.typingAlertText}>납기일을 선택해 주세요.</Text>
								</View>
								) : null}				
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
									keyboardType = 'numeric'
									onChangeText={(v) => {
										let comma = (v).split(',').join('');
										comma = String(comma).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
										setPrice(comma);
									}}
									placeholder={'추정예산범위를 입력해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input]}
								/>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]} onLayout={handleLayout16}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>도면상세정보</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={content}
									onChangeText={(v) => {
										setContent(v);
										if (v) { setState16(true); }
									}}
									placeholder={'물품에 대한 자세한 정보를 작성하면 판매확률이 올라갑니다.'}
									placeholderTextColor="#8791A1"
									multiline={true}
									style={[styles.input, styles.textarea]}
								/>
							</View>
							{!state16 ? (
							<View style={styles.typingAlert}>
								<AutoHeightImage width={17} source={require("../../assets/img/icon_alert3.png")} style={styles.typingAlertImg} />
								<Text style={styles.typingAlertText}>도면상세정보를 입력해 주세요.</Text>
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
						<Text style={styles.avatarTitleText}>매칭상품 사진 업로드</Text>
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
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	input4: {width:(innerWidth - 124),},
	textarea: {height:275,borderRadius:8,textAlignVertical:"top",padding:12,},
	inputContainer: {},
	selectArr: {position:'absolute',top:25.5,right:20,},
	certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:16,color:'#fff'},
	certChkBtn3: {width:110,height:58,backgroundColor:'#31B481',borderWidth:0,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText3: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	certChkBtn4: {width:58,},
	certChkBtnDelete: {height:58,backgroundColor:'#666',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
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
	dealBtn: {width:((innerWidth/3)-7),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	dealBtnOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
	dealBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,color:'#8791A1'},
	dealBtnTextOn: {color:'#fff'},	
	inputUnit: {position:'absolute',top:0,right:20,},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#000'},
	inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlert2: {marginTop:5},
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
	indicator: { width: widnowWidth, height: widnowHeight, backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, },
	typingAlert: { flexDirection: 'row', marginTop: 10, position: 'relative', paddingLeft: 22, },
	typingAlert2: {paddingRight:20,},
	typingAlertImg: { position: 'absolute',left:0,top:2,},
	typingAlertText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 20, color: '#ED0000' },
	inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlert2: {marginTop:5},
	inputAlertText2: {width:(innerWidth-14),paddingLeft:5,fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:16,color:'#6C6C6C'},
})

export default MatchModify