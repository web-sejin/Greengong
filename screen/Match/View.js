import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Swiper from 'react-native-swiper'
import BitSwiper from 'react-native-bit-swiper';
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from "rn-fetch-blob";

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/HeaderView';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchView = (props) => {
  const scrollRef = useRef();
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;  
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [indicatorSt, setIndCatorSt] = useState(false);
  const [zzim, setZzim] = useState(0);
  const [like, setLike] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visible6, setVisible6] = useState(false);
  const [visible7, setVisible7] = useState(false);
  const [floorFile, setFloorFile] = useState(''); //도면 파일
	const [floorFileType, setFloorFileType] = useState(''); //도면 파일
	const [floorFileUri, setFloorFileUri] = useState(''); //도면 파일
  const [toastModal, setToastModal] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [swp, setSwp] = useState({});
  const [myInfo, setMyInfo] = useState({});
  const [mcMbIdx, setMcMbIdx] = useState();
  const [crIdx, setCrIdx] = useState();
  const [radio, setRadio] = useState(1);
  const [radioList, setRadioList] = useState([]);
  const [dwgPmSt, setDwgPmSt] = useState(0);
  const [swpCurr, setSwpCurr] = useState(0);
  const [popImgUrl, setPopImgUrl] = useState('');
  const [downReq, setDownReq] = useState(false); //도면 다운 권한 요청 여부 - false : 요청하지 않은 상태 / true : 요청한 상태
  const [onlyView, setOnlyView] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setIndCatorSt(false);
				setVisible(false);
        setVisible2(false);
        setVisible3(false);
        setVisible4(false);
        setVisible5(false);
        setVisible6(false);
        setVisible7(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);      
      getData();
      getMyData();
      getRadioList();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  useEffect(()=>{
    // getData();
    // getMyData();
    // getRadioList();
  },[])

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'view_match', {'is_api': 1, mc_idx:idx, page_name:'view'}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("view_match : ",responseJson);
				setItemInfo(responseJson);
        setSwp(responseJson.mf_data);
        setZzim(responseJson.is_scrap);
        setMcMbIdx(responseJson.mc_mb_idx);
        console.log('is_dwg_permit : ',responseJson.is_dwg_permit);
        console.log('is_request_dwg : ',responseJson.is_request_dwg);
        setDwgPmSt(responseJson.is_dwg_permit);

        if(itemInfo.is_request_dwg == 1){
          setDownReq(true);
        }else{
          setDownReq(false);
        }

        if(responseJson.is_match_like == 1){
          setLike(1);
        }else{
          setLike(0);
        }
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!', responseJson);
        navigation.navigate('Match', {isSubmit: true});
			}
		});

    setTimeout(function(){
      setIsLoading(true);
    }, 100);
  }

  const getMyData = async () => {
    await Api.send('GET', 'get_member_info', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_member_info : ",responseJson);
        setMyInfo(responseJson);
			}else{
				ToastMessage(responseJson.result_text);
			}
		});  
  }

  const getRadioList = async () => {
    await Api.send('GET', 'insert_report', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("getRadioList : ",responseJson);
        setRadioList(responseJson.data);
			}else{
				console.log(responseJson.result_text);
			}
		}); 
  }

  const ModalOn = () => {
    if(myInfo.mb_idx == itemInfo.mc_mb_idx){
      setVisible(true);
    }else{
      setVisible5(true);
    }
  }

  //삭제
  function deleteItem(){
    //console.log(idx);
    const formData = {
			is_api:1,				
			mc_idx:idx,
		};

    Api.send('POST', 'del_match', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);				
				navigation.navigate('Match', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //관심요청자
  function fnScrap(){
    const formData = {
			is_api:1,				
			mb_idx:mcMbIdx,
      sr_code:'match'
		};

    Api.send('POST', 'save_scrap', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);				
        if(responseJson.scrap_type == 'save'){
          setZzim(1);
          ToastMessage('관심요청자에 추가되었습니다.');
        }else{
          setZzim(0);
          ToastMessage('관심요청자에서 삭제되었습니다.');
        }
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //좋아요
  function fnLike(){
    const formData = {
			is_api:1,				
			mc_idx:idx,
		};

    Api.send('POST', 'save_like_match', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        if(responseJson.is_like == 1){
          setLike(1);
        }else{
          setLike(0);
        }
			}else{
				console.log('결과 출력 실패!', responseJson);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  //신고하기
  function fnSingo(){
    const formData = {
			is_api:1,				
			reason_idx:radio,
      page_code:'match',
      article_idx:idx
		};

    Api.send('POST', 'save_report', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('신고 성공 : ',responseJson);
        setVisible(false);
        navigation.navigate('Match', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //차단하기
  function fnBlock(){
    const formData = {
			is_api:1,				
			recv_idx:mcMbIdx
		};

    Api.send('POST', 'save_block', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('차단 성공 : ',responseJson);
        setVisible(false);
        navigation.navigate('Match', {isSubmit: true});
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  function fnSendEmail(){
    setVisible2(false);
    setIndCatorSt(true);

    const formData = {
			is_api:1,				
			mc_idx:idx,
		};

    Api.send('POST', 'down_dwg', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);
        fileDown({url:itemInfo.mc_file, name:itemInfo.mc_file_org});
        setIndCatorSt(false);        
        ToastMessage('도면이 메일로 전송되었습니다.');
			}else{
				console.log('메일 결과 출력 실패!!!', responseJson);
        setIndCatorSt(false);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  const openPicker = async () => {
		console.log(DocumentPicker.types)
		try {
			const res = await DocumentPicker.pick({
				type: [
          DocumentPicker.types.pdf, 
          DocumentPicker.types.zip, 
          DocumentPicker.types.ppt, 
          DocumentPicker.types.pptx
        ],
			})
      console.log(res);
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

  function fnFileUpload(){
    console.log(floorFile);
    if(floorFile == ''){
      setToastText('파일을 업로드 해주세요.');      
      setToastModal(true);
      setTimeout(()=>{ setToastModal(false) },2000);
      return false;
    }

    const formData = {
			is_api:1,
      mc_idx:idx,
      md_file: {'uri': floorFileUri, 'type': floorFileType, 'name': floorFile}
		};

    Api.send('POST', 'upload_doc', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        setVisible3(false);
        if(onlyView){
          ToastMessage("회사소개서 제출이 완료되었습니다.");
          setOnlyView(false);
          getData();
        }else{
          chatDeal();
        }
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //견적요청중
  function chgStateSell(){
    const formData = {
			is_api:1,
      mc_idx:idx,
		};

    Api.send('POST', 'requesting_match', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);
        setVisible(false);
        getData();
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //권한요청
  function downPermitReq(){
    const formData = {
			is_api:1,
      mc_idx:idx,
		};

    Api.send('POST', 'request_permit_dwg', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        ToastMessage('도면권한이 요청되었습니다.');
        setDownReq(true);
			}else{
				console.log('결과 출력 실패!', responseJson);
        ToastMessage('이미 요청한 상태입니다.');
			}
		});
  }

  function chatCheck(){    
    if(myInfo.mb_idx == itemInfo.mc_mb_idx){
      navigation.navigate('MachChat', {idx:idx});
    }else{
      chatDeal();
    }
  }

  const chatDeal = async () => {    
    await Api.send('GET', 'in_chat', {'is_api': 1, recv_idx:mcMbIdx, page_code:'match', page_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("in_chat : ",responseJson);        
        const roomName = 'match_'+responseJson.cr_idx;
        navigation.navigate('ChatRoom', {pd_idx:idx, page_code:'match', recv_idx:mcMbIdx, roomName:roomName});
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패! : ', resultItem.result_text);
			}
		});
  }

  const fileDown = async (file: File) => {
    await RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${file.name}`,
      },
    }).fetch('GET', file.url);
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header 
        navigation={navigation} 
        headertitle={itemInfo.c1_name} 
        ModalEvent={ModalOn} 
      />

      {isLoading ? (
        <>
          <ScrollView ref={scrollRef}>
            {swp.length > 0 ? (
            <BitSwiper
              items={swp}
              paginateStyle={{marginTop: -20,}}
              paginateDotStyle={styles.swiperDot}
              paginateActiveDotStyle={[styles.swiperDot, styles.swiperActiveDot]}
              onItemIndexChanging={(curr) => {console.log(curr)}}
              onItemRender={(item, index) => (
                <TouchableOpacity
                  key={index} 
                  style={styles.swiperSlider}
                  activeOpacity={1}
                  onPress={()=> {
                    setVisible7(true);
                    setPopImgUrl(item.mf_name);
                  }}
                >
                  <AutoHeightImage width={widnowWidth} source={{uri: item.mf_name}} />
                </TouchableOpacity>
              )}
            />
            
            ) : null}

            <View style={[styles.viewBox1]}>
              <View style={styles.profileBox}>
                <TouchableOpacity
                  style={styles.otherProfile}
                  activeOpacity={opacityVal}
                  onPress={()=>{
                    if(itemInfo.mc_mb_idx != userInfo?.mb_idx){
                      navigation.navigate('Other', {idx:itemInfo.mc_mb_idx});
                    }
                  }}
                >
                  {itemInfo.mb_img ? (
                    <AutoHeightImage width={58} source={{uri: itemInfo.mb_img}} />
                  ) : (
                    <AutoHeightImage width={58} source={require("../../assets/img/not_profile.png")} />	
                  )}
                </TouchableOpacity>
                <View style={styles.profileBoxInfo}>
                  <View style={styles.profileName}>
                    <Text style={styles.profileNameText}>{itemInfo.mb_nick}</Text>
                  </View>
                  <View style={styles.profileLocal}>
                    <AutoHeightImage width={10} source={require("../../assets/img/icon_local2.png")} />
                    <Text style={styles.profileLocalText}>{itemInfo.mc_loc}</Text>
                  </View>
                  <View style={styles.profileResult}>
                    <Text style={styles.profileResultText}>거래평가 : {itemInfo.mb_score}</Text>
                  </View>
                </View>
                {myInfo.mb_idx != itemInfo.mc_mb_idx ? (
                <TouchableOpacity
                  style={[styles.profileZzim, zzim==1 ? styles.profileZzimOn : null]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    fnScrap();                  
                  }}
                >
                  <Text style={[styles.profileZzimText, zzim==1 ? styles.profileZzimTextOn : null]}>관심요청자</Text>
                </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.viewSubjectBox}>
                <View style={styles.viewSubject}>
                  <View style={styles.viewState}>                
                    <Text style={styles.viewStateText}>{itemInfo.mc_status}</Text>
                  </View>
                  <View style={styles.viewSubjectPart}>
                    <Text style={styles.viewSubjectText}>{itemInfo.mc_name}</Text>
                  </View>
                </View>
                <View style={styles.viewOpt}>
                  <View style={styles.viewOptLabel}>
                    <Text style={styles.viewOptLabelText}>{itemInfo.mc_date} 등록</Text>
                  </View>
                </View>
              </View>
              <View style={styles.viewSumm}>
                <Text  style={styles.viewSummText}>{itemInfo.mc_summary}</Text>
              </View>
              <View style={styles.viewContent}>
                <View>
                  <Text style={styles.viewContentText}>
                    프로젝트명 : {itemInfo.mc_project_name}
                  </Text>
                  <Text style={styles.viewContentText}>
                    제품 용도 : {itemInfo.mc_use_type}
                  </Text>
                  {itemInfo.mc_option2_org == 2 ? (
                    <Text style={styles.viewContentText}>
                      납기일 : {itemInfo.mc_end_date}
                    </Text>
                  ) : (
                    <Text style={styles.viewContentText}>
                      납기일 : {itemInfo.mc_option2}
                    </Text>
                  )}
                  <Text style={styles.viewContentText}>
                    추정예산 : {itemInfo.mc_price}
                  </Text>
                </View>
                <View style={styles.mgTop20}>
                  <Text style={styles.viewContentText}>{itemInfo.mc_contents}</Text>
                </View>
              </View>
              <View style={styles.viewSubInfoBox}>
                <View style={styles.viewSubInfo}>
                  <Text style={styles.viewSubInfoText}>채팅 : {itemInfo.mc_chat_cnt}</Text>
                </View>
                <View style={styles.viewSubInfoLine}></View>
                <View style={styles.viewSubInfo}>
                  <Text style={styles.viewSubInfoText}>찜 : {itemInfo.mc_like_cnt}</Text>
                </View>
                <View style={styles.viewSubInfoLine}></View>
                <View style={styles.viewSubInfo}>
                  <Text style={styles.viewSubInfoText}>조회 : {itemInfo.mc_view_cnt}</Text>
                </View>
                {myInfo.mb_idx != itemInfo.mc_mb_idx ? (
                <TouchableOpacity
                  style={styles.likeBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {fnLike()}}
                >
                  {like == 1 ? (
                    <AutoHeightImage width={20} source={require("../../assets/img/icon_heart.png")} />
                  ) : (
                    <AutoHeightImage width={20} source={require("../../assets/img/icon_heart_off.png")} />
                  )}
                </TouchableOpacity>
                ) : null }
              </View>
            </View>
          </ScrollView>
          
          <View style={[styles.nextFix]}>
            <View style={styles.nextFixFlex}>
              {itemInfo.mc_file ? (

                myInfo.mb_idx == itemInfo.mc_mb_idx ? (
                  <TouchableOpacity 
                    style={[styles.nextBtn]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      navigation.navigate('DownUsed', {idx:idx}); //도면 다운로드 허용
                    }}
                  >
                    <Text style={styles.nextBtnText}>도면 권한 요청 확인</Text>
                  </TouchableOpacity>
                ):(
                  <>
                  <TouchableOpacity 
                    style={[styles.nextBtn, dwgPmSt == 0 && (downReq == 1 || itemInfo.is_request_dwg==1) ? styles.nextBtnGray : null]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      if(itemInfo.mc_dwg_secure_org == 1){
                        setVisible2(true); //도면받기
                      }else{
                        if(dwgPmSt == 0){
                          downPermitReq(); //권한요청
                        }else{
                          setVisible2(true); //도면받기
                        }
                      }
                    }}
                  >
                    {itemInfo.mc_dwg_secure_org == 1 ? (
                      <>
                      <Text style={styles.nextBtnText}>도면</Text>
                      <Text style={styles.nextBtnText}>다운로드</Text>
                      </>
                    ) : (
                      dwgPmSt == 0 ? (
                        <>
                        <Text style={[styles.nextBtnText, downReq || itemInfo.is_request_dwg==1 ? styles.nextBtnGrayText : null]}>
                          도면 권한
                        </Text>
                        <Text style={[styles.nextBtnText, downReq || itemInfo.is_request_dwg==1 ? styles.nextBtnGrayText : null]}>
                          요청
                        </Text>
                        </>
                      ) : (
                        <>
                        <Text style={styles.nextBtnText}>도면</Text>
                        <Text style={styles.nextBtnText}>다운로드</Text>
                        </>
                      )
                    )}
                  </TouchableOpacity>
                  
                  {itemInfo.is_doc == 0 ? (
                  <TouchableOpacity 
                    style={[styles.nextBtn]}
                    activeOpacity={opacityVal}
                    onPress={() => { 
                      setOnlyView(true);
                      setVisible3(true);
                    }}
                  >
                    <Text style={styles.nextBtnText}>회사소개서</Text>
                    <Text style={styles.nextBtnText}>제출</Text>
                  </TouchableOpacity>
                  ) : null}
                  
                  {itemInfo.is_estimate == 0 ? (
                  <TouchableOpacity 
                    style={[styles.nextBtn]}
                    activeOpacity={opacityVal}
                    onPress={() => { navigation.navigate('Estimate', {idx:idx, mcMbIdx:mcMbIdx, backPage:'view'}); }}
                  >
                    <Text style={styles.nextBtnText}>견적서</Text>
                    <Text style={styles.nextBtnText}>제출</Text>
                  </TouchableOpacity>
                  ) : null}
                  </>
                )
                
              ) : null}              

              <TouchableOpacity 
                style={[styles.nextBtn, styles.nextBtn2, itemInfo.mc_file ? null : styles.nextBtn3, styles.chatBtn]}
                activeOpacity={opacityVal}
                onPress={() => {
                  setOnlyView(false);
                  if(myInfo.mb_idx == itemInfo.mc_mb_idx){
                    navigation.navigate('MachChat', {idx:idx});
                  }else{
                    if(itemInfo.mc_chat_permit == 1){
                      if(itemInfo.is_estimate == 0){
                        navigation.navigate('Estimate', {idx:idx, mcMbIdx:mcMbIdx}); //견적서만 업로드 페이지
                      }else{
                        chatCheck();
                      }                    
                    }else if(itemInfo.mc_chat_permit == 2){
                      if(itemInfo.is_doc == 0){
                        setVisible3(true); //회사소개서만 업로드 팝업
                      }else{
                        chatCheck();
                      }
                    }else if(itemInfo.mc_chat_permit == 3){
                      if(itemInfo.is_doc == 0 || itemInfo.is_estimate == 0){
                        navigation.navigate('Estimate', {idx:idx, mcMbIdx:mcMbIdx}); //회사소개서 && 견적서 업로드 페이지
                      }else{
                        chatCheck();
                      }                    
                    }else if(itemInfo.mc_chat_permit == 4){
                      chatCheck();
                    }
                  }
                }}
              >
                {myInfo.mb_idx == itemInfo.mc_mb_idx ? (
                  <Text style={styles.nextBtnText}>대화 중인 채팅방</Text>
                ) : (
                  <Text style={styles.nextBtnText}>채팅하기</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={visible}
            transparent={true}
            onRequestClose={() => {setVisible(false)}}
          >
            <Pressable 
              style={styles.modalBack}
              onPress={() => {setVisible(false)}}
            ></Pressable>
            <View style={styles.modalCont2}>
              <View style={styles.modalCont2Box}>
                <TouchableOpacity 
                  style={[styles.modalCont2Btn, styles.choice]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate('MatchModify', {idx:idx});
                }}
                >
                  <Text style={styles.modalCont2BtnText}>수정하기</Text>
                </TouchableOpacity>
                
                {itemInfo.mc_status_org == 2 ? (
                <TouchableOpacity 
                  style={[styles.modalCont2Btn, styles.modify]}
                  activeOpacity={opacityVal}
                  onPress={() => {chgStateSell()}}
                >
                  <Text style={styles.modalCont2BtnText}>견적요청중</Text>
                </TouchableOpacity>
                ) : null}

                {itemInfo.mc_status_org == 1 ? (
                <TouchableOpacity 
                  style={[styles.modalCont2Btn, styles.modify]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate('MatchCompelte', {idx:idx});
                  }}
                >
                  <Text style={styles.modalCont2BtnText}>발주완료</Text>
                </TouchableOpacity>
                ) : null}

                <TouchableOpacity 
                  style={[styles.modalCont2Btn, styles.delete]}
                  activeOpacity={opacityVal}
                  onPress={() => {setVisible4(true)}}
                >
                  <Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제하기</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={[styles.modalCont2Btn, styles.cancel]}
                activeOpacity={opacityVal}
                onPress={() => {
                  setVisible(false)
                }}
              >
                <Text style={styles.modalCont2BtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            visible={visible2}
            transparent={true}
            onRequestClose={() => {setVisible2(false)}}
          >
            <Pressable 
              style={styles.modalBack}
              onPress={() => {setVisible2(false)}}
            ></Pressable>
            <View style={styles.modalCont3}>
              <View style={styles.avatarTitle}>
                <Text style={styles.avatarTitleText}>도면받기</Text>
              </View>
              <View style={styles.avatarDesc}>
                <Text style={styles.avatarDescText}>도면을 받아서 검토후</Text>
                <Text style={styles.avatarDescText}>견적서를 발송하시겠습니까?</Text>
                <Text style={styles.avatarDescText}>도면은 회원님의 메일로 발송이 됩니다.</Text>
              </View>
              <View style={styles.avatarBtnBox}>
                <TouchableOpacity 
                  style={styles.avatarBtn}
                  onPress={() => {setVisible2(false)}}
                >
                  <Text style={styles.avatarBtnText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.avatarBtn, styles.avatarBtn2]}
                  onPress={() => {fnSendEmail()}}
                >
                  <Text style={styles.avatarBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={visible3}
            transparent={true}
            onRequestClose={() => {setVisible3(false)}}
          >
            <Pressable 
              style={styles.modalBack}
              onPress={() => {setVisible3(false)}}
            ></Pressable>
            <View style={[styles.modalCont3, styles.modalCont4]}>
              <View style={styles.avatarTitle}>
                <Text style={styles.avatarTitleText}>회사소개서 업로드</Text>
              </View>
              <View style={styles.avatarDesc}>
                <Text style={styles.avatarDescText}>회사소개서를 업로드하시면</Text>
                <Text style={styles.avatarDescText}>채팅이 가능합니다.</Text>
                <Text style={styles.avatarDescText}>PDF, PPT, ZIP 파일을 업로드해 주세요.</Text>
              </View>
              <View style={[styles.typingInputBox, styles.typingFlexBox]}>
                    <TextInput
                      value={floorFile}
                      editable = {false}
                      placeholder={'파일을 업로드해 주세요.'}
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
              <View style={styles.avatarBtnBox}>
                <TouchableOpacity 
                  style={styles.avatarBtn}
                  onPress={() => {
                    setVisible3(false);
                    setFloorFile('');
                    setFloorFileType('');
                    setFloorFileUri('');
                  }}
                >
                  <Text style={styles.avatarBtnText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.avatarBtn, styles.avatarBtn2]}
                  onPress={() => {fnFileUpload();}}
                >
                  <Text style={styles.avatarBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={visible4}
            transparent={true}
            onRequestClose={() => {setVisible4(false)}}
          >
            <Pressable 
              style={styles.modalBack}
              onPress={() => {setVisible4(false)}}
            ></Pressable>
            <View style={styles.modalCont3}>
              <View style={styles.avatarTitle}>
                <Text style={styles.avatarTitleText}>삭제</Text>
              </View>
              <View style={styles.avatarDesc}>
                <Text style={styles.avatarDescText}>삭제를 하면 다시 복구되지 않습니다.</Text>
                <Text style={styles.avatarDescText}>채팅도 불가능하게 됩니다.</Text>
              </View>
              <View style={styles.avatarBtnBox}>
                <TouchableOpacity 
                  style={styles.avatarBtn}
                  onPress={() => {setVisible4(false)}}
                >
                  <Text style={styles.avatarBtnText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.avatarBtn, styles.avatarBtn2]}
                  onPress={() => {deleteItem();}}
                >
                  <Text style={styles.avatarBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={visible5}
            transparent={true}
            onRequestClose={() => {setVisible5(false)}}
          >
            <Pressable 
              style={styles.modalBack}
              onPress={() => {setVisible5(false)}}
            ></Pressable>
            <View style={styles.modalCont2}>
              <View style={styles.modalCont2Box}>
                <TouchableOpacity 
                  style={[styles.modalCont2Btn, styles.choice]}
                  activeOpacity={opacityVal}
                  onPress={() => {fnBlock()}}
                >
                  <Text style={styles.modalCont2BtnText}>차단하기</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalCont2Btn, styles.delete]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setVisible5(false);
                    setVisible6(true);
                  }}
                >
                  <Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>신고하기</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={[styles.modalCont2Btn, styles.cancel]}
                activeOpacity={opacityVal}
                onPress={() => {
                  setVisible5(false)
                }}
              >
                <Text style={styles.modalCont2BtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            visible={visible6}
            animationType={"slide"}
            onRequestClose={() => {setVisible6(false)}}
          >
            <View style={styles.header}>
              <>
              <TouchableOpacity
                style={styles.headerCloseBtn}
                activeOpacity={opacityVal}
                onPress={() => {setVisible6(false)}} 						
              >
                <AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>신고하기</Text>
              </>
            </View>
            <ScrollView>
              <View	View style={[styles.alertWrap]}>
                <View style={styles.alertBox}>
                  <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
                  <Text style={styles.alertBoxText}>비매너 메세지 건에 대해서 신고해 주세요.</Text>
                </View>
              </View>

              <View style={styles.radioList}>
                <View style={styles.borderTop2}></View>
                {radioList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.radioBtn]}
                      activeOpacity={opacityVal}
                      onPress={()=>{setRadio(item.val)}}
                    >
                      <View style={[styles.circle, radio==item.val ? styles.circleOn : null]}>              
                        <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
                      </View>
                      <Text style={styles.radioBtnText}>{item.txt}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>								
            <View style={styles.nextFix}>
              <TouchableOpacity 
                style={[styles.nextBtn, styles.nextBtn3]}
                activeOpacity={opacityVal}
                onPress={() => {fnSingo()}}
              >
                <Text style={styles.nextBtnText}>신고하기</Text>
              </TouchableOpacity>
            </View>						
          </Modal>
          
          {indicatorSt ? (
          <View style={[styles.indicator, styles.indicator2]}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
          ) : null}
        </>
      ):(
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <Modal
        visible={visible7}
				transparent={true}
				onRequestClose={() => {setVisible7(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible7(false)}}
				></Pressable>
        <TouchableOpacity
          style={styles.swiperOff}
          activeOpacity={opacityVal}
          onPress={() => setVisible7(false)}
        >
          <AutoHeightImage width={30} source={require("../../assets/img/icon_delete2.png")} />
        </TouchableOpacity>
				<View style={styles.swiperModal}>
          <View style={styles.swiperModal}>
          <AutoHeightImage width={innerWidth} source={{uri: popImgUrl}} style={styles.swiperModalImg} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={toastModal}
				animationType={"slide"}
				transparent={true}
      >
				<View style={styles.toastModal}>
					<View
						style={{
							backgroundColor: '#000',
							borderRadius: 10,
							paddingVertical: 10,
							paddingHorizontal: 20,
							opacity: 0.7,
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								color: '#FFFFFF',
								fontSize: 15,
								lineHeight: 22,
								fontFamily: Font.NotoSansRegular,
								letterSpacing: -0.38,
							}}
						>
							{toastText}
						</Text>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  swiper: {height:220,},
  swiperSlider: {height:220,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',},
  nextFix: {height:105,paddingHorizontal:20,paddingTop:15,backgroundColor:'#F3FAF8'},
  nextFixFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	nextBtn: {flex:1,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',
  justifyContent:'center',marginRight:5,},
  nextBtn2: {backgroundColor:'#353636',},
  nextBtn3: {width:innerWidth},
  chatBtn: {marginRight:0,},
  nextBtnGray: {backgroundColor:'#eaeaea'},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:20,color:'#fff'},
  nextBtnGrayText: {color:'#bbb'},
  swiperDotBox: {bottom:15},
  swiperDot: {width:7,height:7,backgroundColor:'#fff',borderRadius:50,opacity:0.5,marginHorizontal:5,},
  swiperActiveDot: {opacity:1,},
  swiperNavi: {marginTop:-5},
  viewBox1: {paddingHorizontal:20,},
  profileBox: {paddingTop:25,paddingBottom:30,borderBottomWidth:1,borderBottomColor:'#E9EEF6',display:'flex',flexDirection:'row',position:'relative',},
  otherProfile: {width:58,height:58,borderRadius:50,overflow:'hidden',alignItems:'center',justifyContent:'center'},
  profileBoxInfo: {width:(innerWidth-58),paddingLeft:10,},
  profileName: {},
  profileNameText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#000'},
  profileLocal: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:4,},
  profileLocalText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#000',marginLeft:5,},
  profileResult: {marginTop:7,},
  profileResultText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#6A6A6A'},
  profileZzim: {width:75,height:24,backgroundColor:'#eaeaea',borderRadius:12,position:'absolute',top:25,right:0,display:'flex',alignItems:'center',justifyContent:'center',},
  profileZzimOn: {backgroundColor:'#F58C40'},
  profileZzimText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#bbb'},
  profileZzimTextOn: {color:'#fff'},
  viewSubjectBox: {paddingVertical:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  viewSubject: {},
  viewState: {},
  viewStateText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#F58C40',},
  viewSubjectPart: {marginTop:10},
  viewSubjectText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#000',},
  viewOpt: {marginTop:5,display:'flex',flexDirection:'row',flexWrap:'wrap',},
  viewOptLabel: {height:24,paddingHorizontal:10,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,marginTop:10,marginRight:10,display:'flex',alignItems:'center',justifyContent:'center'},
  viewOptLabel2: {marginRight:0,},
  viewOptLabelText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#353636'},
  viewSumm: {paddingTop:15,paddingBottom:13,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  viewSummText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#000'},
  viewContent: {paddingTop:20,paddingBottom:15,},
  viewContentText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#000'},
  viewSubInfoBox: {display:'flex',flexDirection:'row',alignItems:'center',paddingBottom:20,position:'relative'},
  viewSubInfoLine: {width:1,height:10,backgroundColor:'#ADADAD',marginHorizontal:8,},
  viewSubInfo: {},
  viewSubInfoText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#6A6A6A'},  
  likeBtn: {position:'absolute',right:0,top:0,},
  otherItemTit: {},
  otherItemTitText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#000'},
  otherItemList: {},
  listLi: {display:'flex',flexDirection:'row',paddingVertical:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	listImg: {borderRadius:8},
	listInfoBox: {width:(widnowWidth - 171),paddingLeft:15,},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},
	listInfoCate: {marginTop:5},
	listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#353636'},
	listInfoCnt: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	listInfoCntBox: {display:'flex',flexDirection:'row',alignItems:'center',marginRight:15,},
	listInfoCntBox2: {marginRight:0},
	listInfoCntBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#000',marginLeft:4,},
	listInfoPriceBox: {marginTop:10},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},
  
  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
  modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
  modalCont4: {top:((widnowHeight/2)-160)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  typingInputBox: {marginTop:20,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:(innerWidth-130),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
  certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
  indicator: {width:widnowWidth,height:widnowHeight, display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,zIndex:10},
  indicator2: {backgroundColor:'rgba(0,0,0,0.5)'},
  toastModal: {width:widnowWidth,height:(widnowHeight - 125),display:'flex',alignItems:'center',justifyContent:'flex-end'},

  header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
  headerCloseBtn: {width:34,height:50,position:'absolute',right:10,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},

  alertWrap: {padding:20,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},

  radioList: {paddingHorizontal:20,paddingBottom:30,},
  radioBtn: {paddingVertical:20,flexDirection:'row',alignItems:'center'},  
  radioBtnText: {width:(innerWidth-21),fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:21,color:'#000',paddingLeft:15},
  circle: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,alignItems:'center',justifyContent:'center'},
  circleOn: {backgroundColor:'#31B481',borderColor:'#31B481'},

  borderTop2: {borderTopWidth:1,borderTopColor:'#E3E3E4'},

  mgTop20: {marginTop:20},

  swiperModal: {width:widnowWidth,height:widnowHeight,padding:20,position:'absolute',left:0,top:0,alignItems:'center',justifyContent:'center'},
  swiperModalImg: {position:'relative',top:-10},
  swiperOff: {position:'absolute',top:10,right:10,zIndex:10,},
})

//export default MatchView
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
		member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
		member_out: (user) => dispatch(UserAction.member_out(user)), //회원탈퇴
	})
)(MatchView);