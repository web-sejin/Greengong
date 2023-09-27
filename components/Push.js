import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Dimensions, TouchableOpacity, Modal, Pressable, StyleSheet, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Font from "../assets/common/Font";
import Api from '../Api';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const PushChk = (props) => {    
	const {navigation, currentNavi=''} = props;	
  const [pushVisible, setPushVisible] = useState(false);
  const [state, setState] = useState(false);
  const [naviIntent, setNaviIntent] = useState('');
  const [naviProp, setNaviProp] = useState({});
  const [content, setContent] = useState('');

  if (Platform.OS === 'ios') { PushNotificationIOS.setApplicationIconBadgeNumber(0); }

  function PusgAlert(remoteMessage){
    let navi = remoteMessage.data.intent;
    let navi_idx = '';
    let contentIdx = '';

    if(remoteMessage.data.content_idx){
      contentIdx = JSON.parse(remoteMessage.data.content_idx);        
    }

    setNaviIntent(navi);
    setContent(remoteMessage.data.body);    
    
    if((currentNavi == 'ChatRoom' && navi != 'ChatRoom') || currentNavi != 'ChatRoom'){
      setPushVisible(true);
      if(navi == 'UsedView'){
        //등록한 키워드의 중고 상품을 등록 했을 때
        //중고 상품 입찰 승인이 되었을 때
        //중고 상품 입찰 요청 건에 대해서 거절 했을 때
        console.log('contentIdx : ',contentIdx.pd_idx);
        setNaviProp({idx:contentIdx.pd_idx});

      }else if(navi == 'MatchView'){
        //등록한 키워드의 매칭을 등록 했을 때
        //매칭 도면 다운로드 권한이 도착 했을 때
        setNaviProp({idx:contentIdx.mc_idx});

      }else if(navi == 'ChatRoom'){
        //채팅 메시지가 전송 되었을 때
        const roomName = contentIdx.page_code+'_'+contentIdx.cr_idx;
        setNaviProp({pd_idx:contentIdx.cr_idx, page_code:contentIdx.page_code, recv_idx:contentIdx.recv_idx, roomName:roomName,});
      }else if(navi == 'QnaView'){
        setNaviProp({bd_idx:contentIdx.bd_idx});
      }
    }
  }
  
  useEffect(() => {
   //포그라운드 상태
    messaging().onMessage((remoteMessage) => {
      console.log('실행중 메시지 !!! ::: ',remoteMessage);
      if(remoteMessage){
        if(!state){
          PusgAlert(remoteMessage);
          setState(true);
        }
      }
    });

    //백그라운드 상태
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('onNotificationOpenedApp', remoteMessage);
      if(remoteMessage){
        PusgAlert(remoteMessage);
      }
    });

    //종료상태
    messaging().getInitialNotification().then((remoteMessage) => {
      // console.log('getInitialNotification', remoteMessage);
      console.log('백그라운드 메시지:::',remoteMessage)
      if(remoteMessage){
        PusgAlert(remoteMessage);
      }
    });

  }, []);

  const moveNavigation = () => {
    setPushVisible(false);
    navigation.navigate(naviIntent, naviProp);
  }
	
	return (
		<Modal
      visible={pushVisible}
      transparent={true}
      onRequestClose={() => {setPushVisible(false)}}
    >
      <Pressable 
        style={styles.modalBack}
        onPress={() => {setPushVisible(false)}}
      ></Pressable>
      <View style={styles.modalCont}>
        <View style={styles.avatarDesc}>
          <Text style={styles.avatarDescText}>{content}</Text>
        </View>
        <View style={styles.avatarBtnBox}>
          <TouchableOpacity 
            style={styles.avatarBtn}
            onPress={() => {setPushVisible(false)}}
          >
            <Text style={styles.avatarBtnText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.avatarBtn, styles.avatarBtn2]}
            onPress={() => {moveNavigation()}}
          >
            <Text style={styles.avatarBtnText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
	);
};

const styles = StyleSheet.create({
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-100)},  
  avatarDesc: {},
  avatarDescText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  
});

export default PushChk;