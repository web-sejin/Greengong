import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  BackHandler,
  Button,
  Dimensions,
  Platform,
  StyleSheet,  
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AutoHeightImage from "react-native-auto-height-image";
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect, useIsFocused, useRoute } from '@react-navigation/native';
import Font from '../assets/common/Font';

import Home from './Home'; //메인-중고상품 리스트
import Match from './Match/Match';
import Chat from './Chat/Chat';
import Mypage from './Mypage/Mypage';
import PushChk from '../components/Push';

const Tab = createBottomTabNavigator();

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const TabBarMenu = (props) => {
  const {state, navigation, chatInfo } = props;
  //console.log("chatInfo ::::::::: ",chatInfo);
  const screenName = state.routes[state.index].name;  

  //console.log('screenName : ',screenName);
  if(screenName == 'Home' || screenName == 'Match' || screenName == 'Chat' || screenName == 'Room'){        
    
  }

  return (
    <View style={styles.TabBarMainContainer}>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('TabNav', {
            screen: 'Home',
          });
        }}
      >
        {screenName == 'Home' ? (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon1_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>홈</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon1_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>홈</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('TabNav', {
            screen: 'Match',
          });
        }}
      >
        {screenName == 'Match' ? (
          <>
          <AutoHeightImage width={26} source={require("../assets/img/tab_icon2_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>매칭</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={26} source={require("../assets/img/tab_icon2_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>매칭</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('TabNav', {
            screen: 'Chat',            
          });
        }}
      >
        <View style={styles.chatWrap}>
          {screenName == 'Chat' ? (
            <>
            <AutoHeightImage width={24} source={require("../assets/img/tab_icon3_on.png")} style={styles.selectArr} />
            <View style={styles.tabView}>
              <Text style={[styles.tabViewText, styles.tabViewTextOn]}>채팅</Text>
            </View>          
            </>
          ) : (
            <>
            <AutoHeightImage width={24} source={require("../assets/img/tab_icon3_off.png")} style={styles.selectArr} />
            <View style={styles.tabView}>
              <Text style={[styles.tabViewText]}>채팅</Text>
            </View>
            </>
          )}
          {chatInfo?.total_unread > 0 ? (
          <View style={styles.alimCircle}><Text style={styles.alimCircleText}>{chatInfo?.total_unread}</Text></View>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('TabNav', {
            screen: 'Mypage',
          });
        }}
      >
        {screenName == 'Mypage' ? (
          <>
          <AutoHeightImage width={18} source={require("../assets/img/tab_icon4_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>마이페이지</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={18} source={require("../assets/img/tab_icon4_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>마이페이지</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      {/* <PushChk navigation={navigation} /> */}      
    </View>
  )
}

const TabNav = (props) => {
  const {navigation, userInfo, chatInfo, member_chatCnt} = props;
  const [pushVisible, setPushVisible] = useState(false);
  const [state, setState] = useState(false);
  const [naviIntent, setNaviIntent] = useState('');
  const [naviProp, setNaviProp] = useState({});
  const [content, setContent] = useState('');

  const chatCntHandler = async () => {
    const formData = new FormData();
    formData.append('mid', userInfo.id);
    formData.append('method', 'member_chatCnt');

    const chat_cnt = await member_chatCnt(formData);

    //console.log("chat_cnt Tabnav::", chat_cnt);
  }

  const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
				
		}else{
			chatCntHandler();      
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
  }

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

    if(navi == 'ChatRoom'){
      //채팅 메시지가 전송 되었을 때
      let room_page = '';
      let room_idx = '';

      AsyncStorage.getItem('roomIdx', (err, result) => {
        //console.log("result : ",result);
        room_idx = result;
        if(room_idx != contentIdx.cr_idx){
          setPushVisible(true);
          const roomName = contentIdx.page_code+'_'+contentIdx.cr_idx;
          
          if(contentIdx.page_code == 'product'){
            setNaviProp({pd_idx:contentIdx.pd_idx, page_code:contentIdx.page_code, recv_idx:contentIdx.recv_idx, roomName:roomName, cr_idx:contentIdx.cr_idx});
          }else{
            setNaviProp({pd_idx:contentIdx.mc_idx, page_code:contentIdx.page_code, recv_idx:contentIdx.recv_idx, roomName:roomName, cr_idx:contentIdx.cr_idx});
          }
        }
      });
            
    }else{
      setPushVisible(true);
      if(navi == 'UsedView'){
        //등록한 키워드의 중고 상품을 등록 했을 때
        //중고 상품 입찰 승인이 되었을 때
        //중고 상품 입찰 요청 건에 대해서 거절 했을 때
        //console.log('contentIdx : ',contentIdx.pd_idx);
        setNaviProp({idx:contentIdx.pd_idx});

      }else if(navi == 'MatchView'){
        //등록한 키워드의 매칭을 등록 했을 때
        //매칭 도면 다운로드 권한이 도착 했을 때
        setNaviProp({idx:contentIdx.mc_idx});

      }else if(navi == 'QnaView'){
        setNaviProp({bd_idx:contentIdx.bd_idx});
      }else{
        setNaviProp({});
      }
    }
  }

  useEffect(() => {
    //포그라운드 상태
     messaging().onMessage((remoteMessage) => {
       console.log('포그라운드 ::: ',remoteMessage);       
       if(remoteMessage){
         if(!state){
           PusgAlert(remoteMessage);
           chatCntHandler();
           setState(true);
         }
       }
     });
 
     //백그라운드 상태
     messaging().onNotificationOpenedApp((remoteMessage) => {
       //console.log('onNotificationOpenedApp', remoteMessage);
       console.log('백그라운드 ::: ', remoteMessage);       
       if(remoteMessage){
         PusgAlert(remoteMessage);
         chatCntHandler();
       }
     });
 
     //종료상태
     messaging().getInitialNotification().then((remoteMessage) => {
       // console.log('getInitialNotification', remoteMessage);
       console.log('종료상태 ::: ',remoteMessage)
       if(remoteMessage){
         PusgAlert(remoteMessage);
         chatCntHandler();
       }
     });
 
   }, []);
 
   const moveNavigation = () => {
     setPushVisible(false);
     //console.log("naviProp : ",naviProp);
     navigation.navigate(naviIntent, naviProp);
   }

  return (
    <>
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{headerShown: false}}
      tabBar={ (props) => <TabBarMenu {...props} chatInfo={chatInfo} /> }
      backBehavior={'history'}
    >
      <Tab.Screen name="Home" component={Home} options={{}} initialParams={{alimCnt:chatInfo?.total_unread_alarm}} />
      <Tab.Screen name="Match" component={Match} options={{}} initialParams={{alimCnt:chatInfo?.total_unread_alarm}} />
      <Tab.Screen name="Chat" component={Chat} options={{}} initialParams={{reload: 'on', alimCnt:chatInfo?.total_unread_alarm}} />
      <Tab.Screen name="Mypage" component={Mypage} options={{}} />
    </Tab.Navigator>

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
    </>
  );
};

const styles = StyleSheet.create({
  TabBarMainContainer: {
    position:'absolute',
    bottom:0,
    zIndex:1,
    width:'100%',
    height:80,
    backgroundColor:'#fff',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15.0,
    elevation: 10,
  },
  TabBarBtn: {width:'25%',height:80,display:'flex',justifyContent:'center',alignItems:'center'},
  TabBarBtnText: {},
  TabBarBtnText2: {color:'#EC5663'},
  tabView: {marginTop:8},
  tabViewText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#C5C5C6'},
  tabViewTextOn: {fontFamily:Font.NotoSansBold,color:'#353636'},
  chatWrap: {position:'relative'},
  alimCircle: {alignItems:'center',justifyContent:'center',width:20,height:20,backgroundColor:'#DF4339',borderRadius:50,position:'absolute',top:-10,right:-10,},
  alimCircleText: {fontFamily:Font.NotoSansRegular,fontSize:8,lineHeight:22,color:'#fff'},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-100)},  
  avatarDesc: {},
  avatarDescText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
});

export default connect(
  ({ User }) => ({
      userInfo: User.userInfo, //회원정보      
      chatInfo : User.chatInfo
  }),
  (dispatch) => ({
      member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
      member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회      
      member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
  })
)(TabNav);