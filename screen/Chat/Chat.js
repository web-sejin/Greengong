import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, BackHandler, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from "../../assets/common/Font"
import {initializeApp} from "@react-native-firebase/app";
import firestore, { doc, deleteDoc } from '@react-native-firebase/firestore';

import Api from '../../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Chat = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;	
	const {params} = route;	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [inputText, setInputText] = useState('');
	const [tabState, setTabState] = useState(1);
	const [prdList, setPrdList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
	const [matchList, setMatchList] = useState([]);
	const [nowPage2, setNowPage2] = useState(1);
  const [totalPage2, setTotalPage2] = useState(1);
	const [initLoading, setInitLoading] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setIsLoading(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);

			if(!initLoading){
				if(tabState==1){
					getProductList();
				}else{
					getMatchList();
				}
			}else if(params?.reload == 'on'){
				if(tabState==1){
					getProductList();
					setNowPage(1);
				}else{      
					getMatchList();
					setNowPage2(1);
				}
				delete params?.reload
			}
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	const getProductList = async () => {
		//setIsLoading(false);
		console.log("inputText : ",inputText);
		await Api.send('GET', 'list_chat_product_room', {is_api: 1, page: 1, keyword: inputText}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log('list_chat_product_room : ',responseJson);
				setPrdList(responseJson.data);
				setTotalPage(responseJson.total_page);
			}else{
				setPrdList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
		setIsLoading(true);
	}
	const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_chat_product_room', {is_api: 1, page:nowPage+1, keyword: inputText}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = prdList.concat(responseJson.data);				
          setPrdList(addItem);			
          setNowPage(nowPage+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}
	const getList = ({item, index}) => (    
    <TouchableOpacity
			style={[styles.chatLi, index == 0 ? styles.chatLi2 : null]}
			activeOpacity={opacityVal}
			onPress={() => {
				const roomName = 'product_'+item.cr_idx;
				console.log(item.cr_idx);
        navigation.navigate('ChatRoom', {pd_idx:item.page_idx, page_code:'product', recv_idx:item.recv_idx, roomName:roomName, cr_idx:item.cr_idx});
			}}
		>
			<View style={styles.chatBoxLeft}>
				<View style={styles.chatBoxProfile}>
					<View style={styles.chatBoxProfileImg}>
						{item.mb_img ? (
							<AutoHeightImage width={69} source={{uri: item.mb_img}} />
						) : (
							<AutoHeightImage width={69} source={require("../../assets/img/not_profile.png")} />
						)}
					</View>
					<View style={styles.readCnt}>
						<Text style={styles.readCntText}>{item.cr_unread}</Text>
					</View>
				</View>
				<View style={styles.chatBoxInfo}>
					<View style={styles.chatBoxName}>
						<Text style={styles.chatBoxNameText}>{item.mb_nick}/{item.cr_idx}</Text>
					</View>
					<View style={styles.chatBoxLoc}>					
						<AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
						<Text style={styles.chatBoxLocText}>{item.pd_loc}</Text>
					</View>
					<View style={styles.chatBoxCont}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.chatBoxContText}>{item.cr_last_msg}</Text>
					</View>
				</View>
			</View>
			<View style={styles.chatBoxRight}>
				<View style={styles.chatBoxDate}>
					<Text style={styles.chatBoxDateText}>{item.cr_lastdate}</Text>
				</View>
				<View style={styles.chatItemBox}>
					{item.pd_image ? (
						<AutoHeightImage width={47} source={{uri: item.pd_image}} />
					) : null}
				</View>
			</View>			
		</TouchableOpacity>
	);

	const getMatchList = async () => {
		//setIsLoading(false);
		await Api.send('GET', 'list_chat_match_room', {is_api: 1, page: 1, keyword: inputText}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log('list_chat_match_room : ',responseJson);
				setMatchList(responseJson.data);
				setTotalPage2(responseJson.total_page);
			}else{
				setMatchList([]);
				setNowPage2(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		});
		//setIsLoading(true);
	}
	const moreData2 = async () => {    
    if(totalPage2 > nowPage2){
      await Api.send('GET', 'list_chat_match_room', {is_api: 1, page:nowPage2+1, keyword: inputText}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = matchList.concat(responseJson.data);				
          setMatchList(addItem);			
          setNowPage(nowPage2+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}
	const getList2 = ({item, index}) => (    
    <TouchableOpacity
			style={[styles.chatLi, index == 0 ? styles.chatLi2 : null]}
			activeOpacity={opacityVal}
			onPress={() => {
				const roomName = 'match_'+item.cr_idx;
				console.log(item.cr_idx);
        navigation.navigate('ChatRoom', {pd_idx:item.page_idx, page_code:'match', recv_idx:item.recv_idx, roomName:roomName, cr_idx:item.cr_idx});
			}}
		>
			<View style={styles.chatBoxLeft}>
				<View style={styles.chatBoxProfile}>
					<View style={styles.chatBoxProfileImg}>
						{item.mb_img ? (
							<AutoHeightImage width={69} source={{uri: item.mb_img}} />
						) : (
							<AutoHeightImage width={69} source={require("../../assets/img/not_profile.png")} />
						)}
					</View>
					<View style={styles.readCnt}>
						<Text style={styles.readCntText}>{item.cr_unread}</Text>
					</View>
				</View>
				<View style={styles.chatBoxInfo}>
					<View style={styles.chatBoxName}>
						<Text style={styles.chatBoxNameText}>{item.mb_nick}</Text>
					</View>
					<View style={styles.chatBoxLoc}>					
						<AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
						<Text style={styles.chatBoxLocText}>{item.mc_loc}</Text>
					</View>
					<View style={styles.chatBoxCont}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.chatBoxContText}>{item.cr_last_msg}</Text>
					</View>
				</View>
			</View>
			<View style={styles.chatBoxRight}>
				<View style={styles.chatBoxDate}>
					<Text style={styles.chatBoxDateText}>{item.cr_lastdate}</Text>
				</View>
				<View style={styles.chatItemBox}>
					{item.mf_image ? (
						<AutoHeightImage width={47} source={{uri: item.mf_image}} />
					) : null}
				</View>
			</View>
		</TouchableOpacity>
	);
	
	const chatSch = async () => {
		Keyboard.dismiss();
		if(tabState == 1){
			getProductList();
			setNowPage(1);    
		}else{
			getMatchList();
			setNowPage2(1);
		}
	}

	function fnTab(v){
		setTabState(v);
    setNowPage(1);
    setNowPage2(1);
    if(v == 1){
      getProductList();
			setTimeout(function(){
        setMatchList([]);
      },200);
    }else if(v == 2){
      getMatchList();
			setTimeout(function(){
        setPrdList([]);
      },200);
    }
  }

	//const ref = firestore().collection('chat').doc('chatList').collection('product_12');
	const roomAry = ['product_9', 'product_11', 'product_12', 'product_13'];
	//const ref = firestore().collection('chat').doc('chatList').collection('product_12');
	useEffect(() => {
		for(var i=0; i<roomAry.length; i++){
			var roomRef = firestore().collection('chat').doc('chatList').collection(roomAry[i]);
			roomRef.orderBy('datetime', 'desc').limit(1).onSnapshot(querySnapshot => {								
				console.log(i);
				console.log("querySnapshot : ",querySnapshot);
				getProductList('realtime');
				if(i+1 == roomAry.length){
					//getProductList('realtime');
				}
			})
		}
		// ref.orderBy('datetime', 'desc').limit(1).onSnapshot(querySnapshot => {
    //   console.log("querySnapshot : ",querySnapshot)
    //   querySnapshot.forEach((doc, index) => {
		// 		console.log("doc id : ",doc.id);
    //   });
    // });
	}, []);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<View style={styles.headerBtn1}>
					<Text style={styles.headerBtn1Text}>채팅</Text>
				</View>
				<TouchableOpacity 
					style={styles.headerBtn2}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('AlimList');
					}}
				>
					<AutoHeightImage width={20} source={require("../../assets/img/icon_alarm.png")} />
				</TouchableOpacity>
			</View>
			<View style={styles.schBox}>
				<View style={styles.faqListWrap}>					
					<TextInput
						value={inputText}
						onChangeText={(v) => {setInputText(v)}}
						placeholder={"검색어를 입력해 주세요."}
						style={[styles.schInput]}
						placeholderTextColor={"#C5C5C6"}
						returnKyeType='done'
						onSubmitEditing={chatSch}
					/>
					<TouchableOpacity
						style={styles.schBtn}
						activeOpacity={opacityVal}
						onPress={() => {chatSch()}}
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_sch.png")} />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.tabBox}>
				<TouchableOpacity
					style={styles.tabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{fnTab(1)}}
				> 
					{tabState == 1 ? (
						<>
						<Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>중고거래</Text>
						<View style={styles.tabLine}></View>
						</>
					) : (
						<Text style={styles.tabBtnText}>중고거래</Text>  
					)}
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.tabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{fnTab(2)}}
				>
					{tabState == 2 ? (
						<>
						<Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>매칭</Text>
						<View style={styles.tabLine}></View>
						</>
					) : (
						<Text style={styles.tabBtnText}>매칭</Text>  
					)}
				</TouchableOpacity>
			</View>
			
			{tabState == 1 ? (
				<FlatList
					data={prdList}
					renderItem={(getList)}
					keyExtractor={(item, index) => index.toString()}	
					onEndReachedThreshold={0.6}
					onEndReached={moreData}
					style={styles.flatList}
					ListEmptyComponent={					
						isLoading ? (
							<View style={styles.notData}>
								<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
								<Text style={styles.notDataText}>진행중인 채팅이 없습니다.</Text>
							</View>
						):(
							<View style={[styles.indicator]}>
								<ActivityIndicator size="large" />
							</View>
						)
					}
				/>
			) : (
				<FlatList
					data={matchList}
					renderItem={(getList2)}
					keyExtractor={(item, index) => index.toString()}	
					onEndReachedThreshold={0.6}
					onEndReached={moreData2}
					style={styles.flatList}
					ListEmptyComponent={
						isLoading ? (
							<View style={styles.notData}>
								<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
								<Text style={styles.notDataText}>진행중인 채팅이 없습니다.</Text>
							</View>
						):(
							<View style={[styles.indicator]}>
								<ActivityIndicator size="large" />
							</View>
						)
					}
				/>
			)}
	
			<View style={{height:90}}></View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	header: {padding:20,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	headerBtn1: {display:'flex',flexDirection:'row',alignItems:'center',},
	headerBtn1Text: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#000',marginRight:5,},
	schBox: {paddingHorizontal:20,position:'relative'},
	schInput: {width:widnowWidth-40,height:44,backgroundColor:'#F2F2F2',borderRadius:12,paddingLeft:39,paddingRight:15,fontSize:14,color:'#000'},
	schBtn: {width:34,height:44,display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',left:5,top:0,},
	tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4',marginTop:5,},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
	notData: {height:(widnowHeight-320),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},

	chatLi: {flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',padding:20,borderTopWidth:1,borderTopColor:'#E9EEF6',},
	chatLi2: {borderTopWidth:0,marginTop:10,},
	chatBoxLeft: {width:innerWidth-115,flexDirection:'row',alignItems:'center'},
	chatBoxProfile: {position:'relative'},
	chatBoxProfileImg: {width:69,height:69,borderRadius:50,overflow:'hidden',alignItems:'center',justifyContent:'center',},
	readCnt: {width:25,height:25,backgroundColor:'#E86F61',borderRadius:50,alignItems:'center',justifyContent:'center',position:'absolute',top:0,right:0,},
	readCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#fff'},
	chatBoxInfo: {width:innerWidth-184,paddingLeft:14,},
	chatBoxName: {},
	chatBoxNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:19,color:'#353636'},
	chatBoxLoc: {flexDirection:'row',alignItems:'center',marginTop:3,},
	chatBoxLocText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#000',marginLeft:5,},
	chatBoxCont: {marginTop:10,},
	chatBoxContText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#191919'},
	chatBoxRight: {width:75,alignItems:'flex-end'},
	chatBoxDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#919191'},
	chatItemBox: {width:47,height:47,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center',marginTop:4,},

	indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
});

export default Chat