import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, BackHandler, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, Linking} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {initializeApp} from "@react-native-firebase/app";
import firestore, { doc, deleteDoc } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/HeaderView';

import Api from '../../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Room = (props) => {
	let scrollViewRef = useRef(null);
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const page_idx = route.params.pd_idx;
	const page_code = route.params.page_code;
	const recv_idx = route.params.recv_idx;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [visible3, setVisible3] = useState(false);
	const [visible4, setVisible4] = useState(false);
	const [visible5, setVisible5] = useState(false);
	const [visible6, setVisible6] = useState(false);
	const [visible7, setVisible7] = useState(false);
	const [toastModal, setToastModal] = useState(false);
	const [toastText, setToastText] = useState('');
	const [img, setImg] = useState({});
	const [msgText, setMsgText] = useState('');
	const [optionBox, setOptionBox] = useState(false);
	const [radio, setRadio] = useState(1);
	const [msgList, setMsgList] = useState([]);
	const [dbList, setDbList] = useState([]);
	const [fireList, setFireList] = useState([]);
	const [itemInfo, setItemInfo] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [roomInfo, setRoomInfo] = useState({});
	const [phone, setPhone] = useState();
	const [popImg, setPopImg] = useState('');
	const [iptHolder, setIptHolder] = useState('');
	
	let roomName = route.params.roomName;
	if(!roomName || roomName==''){
		roomName = 'test';
	}
	const ref = firestore().collection('chat').doc('chatList').collection(roomName);
	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			setVisible(false);
			setVisible2(false);
			setVisible3(false);
			setVisible4(false);
			setVisible5(false);
			setVisible6(false);
			setVisible7(false);
			setToastModal(false);
			setToastText('');
			setRadio(1);	
			AsyncStorage.removeItem('roomPage');
			AsyncStorage.removeItem('roomIdx');			
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);			
			getMsg();			
			if(page_code == 'product'){
				getItemData();
			}else{
				getItemData2();
			}
			getRoomData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	const currentTimer = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const date = ('0' + today.getDate()).slice(-2);
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");
    return (`${year}-${month}-${date} ${hours}:${minutes}:${seconds}`)
  }

	const getTime = (d) => {
		const splt = d.split(' ');
		const splt2 = splt[1].split(':');
		 return splt2[0]+':'+splt2[1];
	}

	async function addTodo(v) {		
		//console.log(ref._collectionPath._parts[0]);
		const currentTime = currentTimer();

		if(v == 'text'){
			if(msgText == ""){
				ToastMessage("메세지를 입력해주세요.");
				return false;
			}

			Keyboard.dismiss();
			await ref.add({
				content: msgText,
				complete: false,
				datetime: currentTime,
				mb_idx:userInfo?.mb_idx,
				imgUrl: '',
			});
			setMsgText('');
		}else{
			setIsLoading(false);
			await ref.add({
				content: '',
				complete: false,
				datetime: currentTime,
				mb_idx:userInfo?.mb_idx,				
				imgUrl: v,
			});
			setOptionBox(false);
		}    
  }

  useEffect(() => {
		let TestArrayList = [];

    return ref.orderBy('datetime', 'desc').limit(1).onSnapshot(querySnapshot => {
      const list = [];
      //console.log("querySnapshot : ",querySnapshot)
      querySnapshot.forEach((doc, index) => {
        const {content, complete, datetime, mb_idx, imgUrl} = doc.data();							
				const dateSplit = datetime.split(' ')[0];			
				//console.log("doc id : ",doc.id);
				//console.log(page_idx);

				const formData = {
					is_api:1,				
					recv_idx:recv_idx,
					page_code:page_code,
					page_idx:page_idx,
					msg_key:doc.id,
				};

				if(content != ''){ formData.ch_msg = content; }
				if(imgUrl != ''){ formData.ch_file = {'uri': imgUrl, 'type': 'image/png', 'name': 'chatFile.png'}; }
				
				if(userInfo?.mb_idx !== recv_idx){
					Api.send('POST', 'send_chat', formData, (args)=>{
						let resultItem = args.resultItem;
						let responseJson = args.responseJson;
			
						if(responseJson.result === 'success'){
							//console.log('send_chat : ',responseJson);
							getRoomData();
							fireRemove(doc.id);
							setImg({});
						}else{
							console.log('send_chat 실패!!!', responseJson);
							//ToastMessage(responseJson.result_text);
						}
					});				
				}else{
					getRoomData();
					setImg({});
				}

        list.push({
          id: doc.id,
          content,
          complete,
          datetime,
					mb_idx,
					imgUrl,
        });
				setIsLoading(true);
      });

			//console.log("list : ",list);
			let tmp = "";
			let j = -1;
			for(var i=0; i<list.length; i++){
				let dateVal = list[i]['datetime'].split(' ')[0];
				if(dateVal != tmp) {
					j++;
					TestArrayList[j] = { 'date':dateVal, 'list':[] };
					TestArrayList[j].list.push(list[i]);
					tmp = dateVal;
				} else {
					TestArrayList[j].list.push(list[i]);
				}
			}
			//console.log("::::",TestArrayList[0].list);
      setFireList(list);
      // if (!loading) {
      //   setLoading(true);
      // }
    });
	}, []);

	//파이어스토어 데이터 삭제
	const fireRemove = async (doc_id) => {
		try {
			//console.log(doc_id);
			await ref.doc(doc_id).delete();
			//alert("삭제완료")                
		} catch (error) {
			console.log("error : ",error)
			//alert("삭제실패")
		}
	}

	//앨범
	const chooseImage = () => {
		Keyboard.dismiss();
    ImagePicker.openPicker({
      //width: widnowWidth,
      //height: 400,
      //cropping: true,
    })
		.then(image => {
			//console.log(image.path);
			setImg(image);
			imageUpload(image.path);
		})
		.finally(()=>{
			console.log('chooseImage finally');
		});
  };

	//카메라
  const openCamera = () => {
		Keyboard.dismiss();
    ImagePicker.openCamera({
      //width: widnowWidth,
      //height: 400,
      //cropping: true,
    })
		.then(image => {
			//console.log(image);
			setImg(image);
			imageUpload(image.path);
		})
		.finally(()=>{
			console.log('openCamera finally');
		});
  };

	//이미지 업로드
	const imageUpload = async (path) => {			
    addTodo(path);
  }

	const ModalOn = () => {
    setVisible(true);
  }

	//자주 쓰는 메세지
	const getMsg = async () => {
    await Api.send('GET', 'list_text', {'is_api': 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson);
        setMsgList(responseJson.data);
			}else{
        setMsgList([]);
				//console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
  }

	//판매 상품 정보
	const getItemData = async () => {
		await Api.send('GET', 'get_chat_room_product', {'is_api': 1, pd_idx:page_idx, cr_idx:route.params.cr_idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_chat_room_product : ",responseJson);
				setItemInfo(responseJson);
				setPhone(responseJson.mb_hp050);
			}else{
				//setItemList([]);				
				//console.log('결과 출력 실패! : ', resultItem.result_text);
			}
		});
	}
	const getItemData2 = async () => {
		await Api.send('GET', 'get_chat_room_match', {'is_api': 1, mc_idx:page_idx, cr_idx:route.params.cr_idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_chat_room_match : ",responseJson);
				setItemInfo(responseJson);
				setPhone(responseJson.mb_hp050);
			}else{		
				console.log('결과 출력 실패! : ', responseJson);
			}
		});
	}

	//방 정보
	const getRoomData = async () => {
		console.log('recv_idx : ',recv_idx);
		console.log('page_code : ',page_code);
		console.log('page_idx : ',page_idx);
		await Api.send('GET', 'in_chat', {is_api: 1, recv_idx:recv_idx, page_code:page_code, page_idx:page_idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("in_chat : ",responseJson);
				setRoomInfo(responseJson);

				AsyncStorage.setItem("roomPage", 'on');
				AsyncStorage.setItem("roomIdx", (responseJson.cr_idx).toString());

				const dbList = responseJson.data;
				let TestDbList = [];
				let tmp = "";
				let j = -1;
				for(var i=0; i<dbList.length; i++){
					let dateVal = dbList[i]['ch_regdate_org'].split(' ')[0];
					if(dateVal != tmp) {
						j++;
						TestDbList[j] = { 'date':dateVal, 'list':[] };
						TestDbList[j].list.push(dbList[i]);
						tmp = dateVal;
					} else {
						TestDbList[j].list.push(dbList[i]);
					}
				}
				setDbList(TestDbList);

				if(responseJson.is_my_block == 1 || responseJson.is_you_block == 1){
					setIptHolder('차단하거나 차단 받아서 채팅이 불가능합니다.');
				}else if(responseJson.is_my_report == 1 || responseJson.is_you_report == 1){
					setIptHolder('신고하거나 신고 받아서 채팅이 불가능합니다.');											
				}else{
					setIptHolder('');
				}
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패! : ', responseJson);
				ToastMessage(responseJson.result_text);
			}
		});
	}

	function blockEvent(){
		setVisible(false);
		if(roomInfo.is_my_block == 0){
			setVisible2(true);			
		}else{
			fnBlock();
		}
	}

	//차단하기
  const fnBlock = async () => {
    const formData = {
			is_api:1,				
			recv_idx:recv_idx
		};

    Api.send('POST', 'save_block', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('차단 성공 : ',responseJson);				
			}else{
				//console.log('결과 출력 실패!', resultItem.result_text);
			}
		});

		setVisible2(false);
		getRoomData();
  }

	function reportEvent(){		
		if(roomInfo.is_my_report == 0){
			setVisible(false);
			setVisible3(true);			
		}else{
			setToastText('이미 신고한 채팅입니다.');      
      setToastModal(true);
      setTimeout(()=>{ setToastModal(false) },2000);
		}
	}

	//신고하기
	const fnSingo = async () => {
    const formData = {
			is_api:1,				
			reason_idx:radio,
      page_code:'chat',
      article_idx:route.params.cr_idx
		};

    Api.send('POST', 'save_report', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('신고 성공 : ',responseJson);
			}else{
				console.log('결과 출력 실패!', resultItem);
				//ToastMessage(responseJson.result_text);
			}
		});

		setVisible3(false);
		getRoomData();
  }

	//나가기
	const getOut = async () => {
		const formData = {
			is_api:1,				
      cr_idx:route.params.cr_idx
		};

    Api.send('POST', 'out_chat', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('나가기 성공 : ',responseJson);
				setVisible7(false);
				navigation.navigate('Chat', {reload:'on'});
			}else{
				setVisible7(false);
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});		
	}

	//자주 쓰는 메세지 선택
	function fnMsgSelect(v){
		setMsgText(v);
		setVisible5(false);
		scrollToBottom();
	}

	//전화걸기
	function fnCall(){
		Linking.openURL(`tel:${phone}`)
	}	

	const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트된 후 ScrollView를 참조합니다.
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, []);

	//이미지 팝업
	function ImageCropPicker(url){		
		//console.log(url);
		setPopImg(url);
		setVisible6(true);
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header 
        navigation={navigation} 
        headertitle={itemInfo.mb_nick} 
        ModalEvent={ModalOn} 
      />
			<View	style={[styles.chatItemBox]}>    
				<View style={styles.chatItemImg}>
					{itemInfo.image ? (
						<AutoHeightImage width={66} source={{uri: itemInfo.image}} />
					) : (
						<AutoHeightImage width={66} source={require("../../assets/img/not_profile.png")} />
					)}
				</View>
				<View style={styles.listInfoBox}>
					<View style={styles.listInfoCate}>
						{page_code == "product" ? (
							<Text	Text style={styles.listInfoCateText}>중고거래</Text>
						) : (
							<Text	Text style={styles.listInfoCateText}>매칭</Text>
						)}
					</View>
					<View style={styles.listInfoTitle}>
						{page_code == "product" ? (
							<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
								[{itemInfo.pd_status}] [{itemInfo.c1_name}] {itemInfo.pd_name}
							</Text>
						) : (
							<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
								[{itemInfo.mc_status}] [{itemInfo.c1_name}] {itemInfo.mc_name}
							</Text>
						)}
					</View>
					{page_code == "product" ? (
					<View style={styles.listInfoDesc}>
						<Text style={styles.listInfoDescText}>{itemInfo.pd_price}원</Text>
					</View>
					) : null}
					{/* <TouchableOpacity 
						style={styles.listInfoState}
						activeOpacity={opacityVal}
						onPress={()=>{}}
					>
						<Text style={[styles.listInfoStateText]}>거래평가 작성</Text>
					</TouchableOpacity> */}
				</View>          
			</View>

			<ScrollView
				style={{backgroundColor:'#F7F7F7'}}
				ref={scrollViewRef}
				onContentSizeChange={() => {
					scrollToBottom();
          // 여기다가 어떤 경우에 스크롤을 하면 될지에 대한 조건문을 추가하면 된다.
        }}
			>
				<View style={styles.scrView}>
					<View style={styles.alertBox}>
						<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
						<Text style={styles.alertBoxText}>카카오톡이나 플랫폼 외의 거래는 피해가 발생할 확률이 높습니다.</Text>
						<Text style={styles.alertBoxText}>본 플랫폼은 기능 범주를 벗어난 사기 피해를 책임지지 않습니다.</Text>
					</View>
					
					{dbList.map((item, index) => {
						const date = (item.date).split('-');						
						const innerList = item.list;
						return (
							<View 
								key={index}
								style={styles.ChatDateBox}
							>
								<View style={styles.dateArea}>
									<Text style={styles.dateAreaText}>{date[0]}년 {date[1]}월 {date[2]}일</Text>
								</View>

								<View style={styles.chatMsgArea}>
									{innerList.map((item2, index2) => {
										const content = item2.ch_msg;
										let prevContinue = styles.mgtop20;
										if(index2 != 0){		
											if(innerList[index2-1].recv_idx == innerList[index2].recv_idx){
												prevContinue = styles.mgtop5;
											}
										}
										return(
											item2.recv_idx==userInfo?.mb_idx ? (
												<View 
													key={item2.ch_idx}
													style={[styles.myMessage, prevContinue]}
												>													
													<View style={styles.myMessageTextDate}>
														<Text style={styles.myMessageDate}>{item2.ch_date}</Text>
													</View>
													{item2.ch_type==1 ? (
													<View style={styles.myMessageTextBox}>
														<Text style={styles.myMessageText}>{content}</Text>
													</View>
													) : (
														<TouchableOpacity 
															style={[styles.myMessageTextBox, styles.myMessageTextBoxImg]}
															activeOpacity={opacityVal}
															onPress={()=>{ImageCropPicker(item2.ch_file)}}
														>
															<AutoHeightImage width={112} source={{uri: item2.ch_file}} />
														</TouchableOpacity>
													)}																			
												</View>			
											) : (
												<View 
													key={item2.ch_idx}
													style={[styles.otMessage, prevContinue]}
												>
													<View style={styles.otMessageWrap}>
														<View style={styles.otImg}>														
															{item2.mb_image ? (
																<AutoHeightImage width={35} source={{uri: item2.mb_image}} />
															) : (
																<AutoHeightImage width={35} source={require("../../assets/img/not_profile.png")} />
															)}
														</View>
														{item2.ch_type==1 ? (	
															<View style={styles.otMessageTextBox}>
																<Text style={styles.otMessageText}>{content}</Text>
															</View>
														) : (
															<TouchableOpacity 
																style={[styles.otMessageTextBox, styles.myMessageTextBoxImg]}
																activeOpacity={opacityVal}
																onPress={()=>{ImageCropPicker(item2.ch_file)}}
															>
																<AutoHeightImage width={112} source={{uri: item2.ch_file}} />
															</TouchableOpacity>
														)}
													</View>
													<View style={styles.otMessageTextDate}>
														<Text style={styles.myMessageDate}>{item2.ch_date}</Text>
													</View>
												</View>
											)
										)
									})}
								</View>
							</View>
						)
					})}					
				</View>
			</ScrollView>		
				
			<KeyboardAvoidingView>
				<View style={styles.msgArea}>
					<View style={styles.msgAreaTop}>
						{roomInfo.is_my_report == 0 && roomInfo.is_my_block == 0 && roomInfo.is_you_report == 0 && roomInfo.is_you_block == 0 ? (
							<>
							<TouchableOpacity
								style={styles.msgPlusBtn}
								activeOpacity={opacityVal}
								onPress={()=>{
									setOptionBox(!optionBox);
									Keyboard.dismiss();
								}}
							>
								{optionBox ? (
									<AutoHeightImage width={17} source={require("../../assets/img/icon_close.png")} />
								):(
									<AutoHeightImage width={17} source={require("../../assets/img/icon_plus.png")} />
								)}
							</TouchableOpacity>
							<View style={styles.msgInputArea}>
								<TextInput
									value={msgText}
									onChangeText={(v) => {setMsgText(v)}}
									multiline={true}
									placeholder={"메세지를 입력해 주세요."}
									//신고하거나 신고 받아서 채팅이 불가능합니다.
									style={[styles.msgInput]}
									placeholderTextColor="#8791A1"
								/>							
								<TouchableOpacity 
									style={styles.msgBtn}
									activeOpacity={opacityVal}
									onPress={()=>{addTodo('text');}}
								>
									<AutoHeightImage width={35} source={require("../../assets/img/icon_enter.png")} />
								</TouchableOpacity>
							</View>
							</>
						):(
							<View style={[styles.msgInputArea, styles.msgInputArea2]}>
								<TextInput
									placeholder={iptHolder}
									style={[styles.msgInput, styles.msgInput2]}
									placeholderTextColor="#8791A1"
									editable={false}
								/>
							</View>
						)}
					</View>
					{optionBox ? (
					<View style={styles.msgAreaBot}>
						<TouchableOpacity
							style={styles.msgOptBtn}
							activeOpacity={opacityVal}
							onPress={openCamera}
						>
							<AutoHeightImage width={50} source={require("../../assets/img/chat_btn1.png")} />
							<Text style={styles.msgOptBtnText}>카메라</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.msgOptBtn}
							activeOpacity={opacityVal}
							onPress={chooseImage}
						>
							<AutoHeightImage width={50} source={require("../../assets/img/chat_btn2.png")} />
							<Text style={styles.msgOptBtnText}>앨범</Text>
						</TouchableOpacity>
						{userInfo.mb_idx != itemInfo.pd_mb_idx ? (
						<TouchableOpacity
							style={styles.msgOptBtn}
							activeOpacity={opacityVal}
							onPress={()=>{setVisible4(true)}}
						>
							<AutoHeightImage width={50} source={require("../../assets/img/chat_btn3.png")} />
							<Text style={styles.msgOptBtnText}>전화</Text>
						</TouchableOpacity>
						) : null}
						<TouchableOpacity
							style={styles.msgOptBtn}
							activeOpacity={opacityVal}
							onPress={()=>{setVisible5(true)}}
						>
							<AutoHeightImage width={50} source={require("../../assets/img/chat_btn4.png")} />
							<Text style={styles.msgOptBtnText}>자주쓰는 메세지</Text>
						</TouchableOpacity>
					</View>
					) : null}
				</View>
			</KeyboardAvoidingView>

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
							onPress={() => {blockEvent()}}
						>
							{roomInfo.is_my_block == 0 ? (
								<Text style={styles.modalCont2BtnText}>차단하기</Text>
							) : (
								<Text style={styles.modalCont2BtnText}>차단해제</Text>
							)}
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {reportEvent()}}
						>
							<Text style={[styles.modalCont2BtnText]}>신고하기</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {setVisible7(true)}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>나가기</Text>
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
				<View style={[styles.modalCont3]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>상대방 차단</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>상대방을 차단하면 상대방의 글과 채팅 메세지를 보낼 수 없습니다.</Text>
						<Text style={[styles.avatarDescText, styles.avatarDescText2]}>차단하시겠습니까?</Text>
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
              onPress={() => {fnBlock()}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>

			<Modal
        visible={visible3}
				animationType={"slide"}
				onRequestClose={() => {setVisible3(false)}}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity
						style={styles.headerCloseBtn}
						activeOpacity={opacityVal}
						onPress={() => {setVisible3(false)}} 						
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
            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(1)}}
            >
              <View style={[styles.circle, radio==1 ? styles.circleOn : null]}>              
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>음란성 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(2)}}
            >
              <View style={[styles.circle, radio==2 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>욕설 및 영업 방해 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(3)}}
            >
              <View style={[styles.circle, radio==3 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>개인정보나 저작권 침해 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(4)}}
            >
              <View style={[styles.circle, radio==4 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>허위정보 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(5)}}
            >
              <View style={[styles.circle, radio==5 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>기타 부적절한 내용</Text>
            </TouchableOpacity>
          </View>
				</ScrollView>								
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {fnSingo()}}
					>
						<Text style={styles.nextBtnText}>신고하기</Text>
					</TouchableOpacity>
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
				<View style={[styles.modalCont3]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>전화걸기</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>상품에 대해서 자세한 문의는</Text>
						<Text style={styles.avatarDescText}>전화를 통해서 하실수 있습니다.</Text>
						<Text style={[styles.avatarDescText, styles.avatarDescText2, styles.avatarDescText3]}>{phone}</Text>
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
              onPress={() => {fnCall()}}
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
				<View style={[styles.modalCont4]}>
					<View style={styles.modalCont4Top}>
						<View style={styles.modalCont4TopBar}></View>
					</View>
					<View style={styles.modalCont4Tit}>
            <Text style={styles.modalCont4TitText}>자주 쓰는 메세지</Text>
						<TouchableOpacity
							style={styles.modalCont4Off}
							activeOpacity={opacityVal}
							onPress={()=>{setVisible5(false)}}
						>
							<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
						</TouchableOpacity>
          </View>
					{msgList.length > 0 ? (
						<View style={styles.freUseList}>
							{msgList.map((item, index) => {
								return(
								<TouchableOpacity
									key={item.bs_idx}
									style={[styles.freUseBtn, styles.freUseBtn2]}
									activeOpacity={opacityVal}
									onPress={()=>{fnMsgSelect(item.bs_content)}}
								>
									<Text style={styles.freUseBtnText}>{item.bs_subject}</Text>
									{/* <AutoHeightImage width={3} source={require("../../assets/img/icon_dot.png")} /> */}
								</TouchableOpacity>
								)
							})}
						</View>
					) : (
						<View style={styles.notMsgData}>
							<Text style={styles.notMsgDataText}>자주 쓰는 메세지가 없습니다.</Text>
						</View>
					)}
				</View>
      </Modal>

			<Modal
        visible={visible6}
				transparent={true}
				onRequestClose={() => {setVisible6(false)}}
      >				
				<View style={styles.imgPopBox}>
					<TouchableOpacity 
						style={styles.modalX}
						activeOpacity={opacityVal}
						onPress={() => {setVisible6(false)}}
					>
						<AutoHeightImage width={35} source={require("../../assets/img/write_btn_off2.png")} />
					</TouchableOpacity>
					<AutoHeightImage width={widnowWidth-20} source={{uri: popImg}} />
				</View>				
			</Modal>

			<Modal
        visible={visible7}
				transparent={true}
				onRequestClose={() => {setVisible7(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible7(false)}}
				></Pressable>
				<View style={[styles.modalCont3]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>채팅방 나가기</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>채팅방을 나가면 채팅 정보가</Text>
						<Text style={styles.avatarDescText}>삭제되어 복구가 안됩니다.</Text>
						<Text style={[styles.avatarDescText, styles.avatarDescText2]}>나가시겠습니까?</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setVisible7(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {getOut()}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
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
	chatItemBox: {display:'flex',flexDirection:'row',alignItems:'center',padding:20,borderTopWidth:1,borderColor:'#E9EEF6'},	
	chatItemImg: {width:66,height:66,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listInfoBox: {width:(innerWidth - 66),paddingHorizontal:15,/*paddingRight:90,*/position:'relative'},
  listInfoCate: {},
  listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#000'},
	listInfoTitle: {marginTop:5},
	listInfoTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'},		
  listInfoState: {display:'flex',flexDirection:'row',position:'absolute',top:-5,right:0,},
  listInfoStateText: {display:'flex',alignItems:'center',justifyContent:'center',height:24,paddingHorizontal:10,backgroundColor:'#31B481',
  borderRadius:12,fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:29,color:'#fff',},

	scrView: {backgroundColor:'#F7F7F7',padding:20,},
	alertWrap: {padding:20,},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	ChatDateBox: {marginTop:40,},
	dateArea: {marginBottom:0,},
	dateAreaText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#727272'},
	chatMsgArea: {},
	myMessage: {flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'},
	myMessageTextDate: {marginRight:10,},
	myMessageDate: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:12,color:'#727272'},
	myMessageTextBox: {maxWidth:widnowWidth-150,paddingVertical:10,paddingHorizontal:15,backgroundColor:'#31B481',borderRadius:12,},
	myMessageTextBoxImg: {paddingVertical:0,paddingHorizontal:0,backgroundColor:'transparent',borderRadius:12,overflow:'hidden'},
	myMessageText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#fff'},
	otMessage: {flexDirection:'row',alignItems:'flex-end',},
	otMessageWrap: {flexDirection:'row',},
	otImg: {width:35,height:35,borderRadius:50,overflow:'hidden',alignItems:'center',justifyContent:'center',},
	otMessageTextBox: {maxWidth:widnowWidth-195,paddingVertical:10,paddingHorizontal:15,backgroundColor:'#fff',borderRadius:12,marginHorizontal:10,},
	otMessageText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#000',},
	otMessageTextDate: {},
	otMessageDate: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:12,color:'#727272'},

	msgArea: {paddingHorizontal:15,borderTopWidth:1,borderColor:'#E1E1E1'},	
	msgAreaTop: {flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',paddingVertical:15,},
	msgPlusBtn: {width:30,height:52,alignItems:'center',justifyContent:'center',},
	msgInputArea: {width:widnowWidth-72,position:'relative'},
	msgInput: {width:widnowWidth-72,maxHeight:60,backgroundColor:'#fff',borderWidth:1,borderColor:'#E1E1E1',borderRadius:20,paddingLeft:15,paddingRight:50,fontSize:14,color:'#000'},
	msgInputArea2: {width:widnowWidth-30},
	msgInput2: {width:widnowWidth-30,backgroundColor:'#fafafa'},
	msgBtn: {position:'absolute',right:5,top:7,},
	msgAreaBot: {flexDirection:'row',justifyContent:'center',paddingTop:10,paddingBottom:20,},
	msgOptBtn: {width:'25%',alignItems:'center'},
	msgOptBtnText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#353636',marginTop:10,},

	mgtop5: {marginTop:5,},
	mgtop20: {marginTop:20,},
	mgtop80: {marginTop:80,},
	mgtop0: {marginTop:0,},

	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
  modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',
	modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-155)},justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-160)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarDescText2: {marginTop:20,},
	avatarDescText3: {fontFamily:Font.NotoSansBold,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  
  toastModal: {width:widnowWidth,height:(widnowHeight - 125),display:'flex',alignItems:'center',justifyContent:'flex-end'},
	modalCont4: {width:widnowWidth,backgroundColor:'#fff',position:'absolute',left:0,bottom:0,borderTopLeftRadius:12,borderTopRightRadius:12,},
	modalCont4Top: {alignItems:'center',paddingTop:16,},
	modalCont4TopBar: {width:36,height:4,backgroundColor:'#E5E5E5',borderRadius:12,},
	modalCont4Tit: {padding:20,paddingBottom:15,borderBottomWidth:1,borderColor:'#E9EEF6',position:'relative'},
	modalCont4TitText: {fontFamily:Font.NotoSansMedium,fontSize:20,lineHeight:22,color:'#000'},
	modalCont4Off: {position:'absolute',right:20,top:22,},
	freUseList: {paddingHorizontal:20,},
	freUseBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:15,borderTopWidth:1,borderColor:'#E9EEF6'},
	freUseBtn2: {borderTopWidth:0,},
	freUseBtnText: {width:widnowWidth-50,fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:24,color:'#000'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
	
	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
  headerCloseBtn: {width:34,height:50,position:'absolute',right:10,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},

	radioList: {paddingHorizontal:20,paddingBottom:30,},
  radioBtn: {paddingVertical:20,flexDirection:'row',alignItems:'center'},  
  radioBtnText: {width:(innerWidth-21),fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:21,color:'#000',paddingLeft:15},
  circle: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,alignItems:'center',justifyContent:'center'},
  circleOn: {backgroundColor:'#31B481',borderColor:'#31B481'},

	notMsgData: {paddingVertical:40,},
	notMsgDataText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#999',textAlign:'center'},

	imgPopBox: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(0,0,0,0.9)',overflow:'hidden',position:'absolute',left:0,top:0,alignItems:'center',justifyContent:'center'},
	modalX: {position:'absolute',top:10,right:10,},

	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

//export default Room
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Room);