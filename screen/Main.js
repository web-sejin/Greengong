import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  BackHandler,
  Button,
  Dimensions,
  FlatList,
  LogBox,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,  
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { CALL_PERMISSIONS_NOTI, usePermissions } from '../hooks/usePermissions'; 

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AutoHeightImage from "react-native-auto-height-image";
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import Font from '../assets/common/Font';
import Intro from './Intro';
import Home from './Home'; //메인-중고상품 리스트
import AlimList from './AlimList'; //알림 리스트
import Login from './member/Login'; //로그인
import Register from './member/Register'; //약관
import Register2 from './member/Register2'; //회원가입
import SnsRegister from './member/SnsRegister'; //약관-SNS
import SnsRegister2 from './member/SnsRegister2'; //회원가입-SNS
import Findid from './member/Findid'; //아이디 찾기
import Findpw from './member/Findpw'; //비밀번호 찾기
import Match from './Match/Match';
import Chat from './Chat/Chat';
import Mypage from './Mypage/Mypage';
import SearchList from './Search'; //검색 리스트
import UsedWrite1 from './usedArticle/Write1'; //스크랩 글쓰기
import UsedModify1 from './usedArticle/Modify1'; //스크랩 글수정
import UsedWrite2 from './usedArticle/Write2'; //중고자재 글쓰기
import UsedModify2 from './usedArticle/Modify2'; //중고자재 글수정
import UsedWrite3 from './usedArticle/Write3'; //중고기계/장비 글쓰기
import UsedModify3 from './usedArticle/Modify3'; //중고자재 글수정
import UsedWrite4 from './usedArticle/Write4'; //폐기물 글쓰기
import UsedModify4 from './usedArticle/Modify4'; //폐기물 글수정
import UsedView from './usedArticle/View'; //상세페이지
import Bid from './usedArticle/Bid'; //입찰하기
import SalesComplete from './usedArticle/SalesComplete'; //판매완료업체선정
import UsedChat from './usedArticle/UsedChat'; //중고상품 채팅목록
import MatchWrite from './Match/MatchWrite'; //매칭 글쓰기
import MatchView from './Match/View'; //매칭 상세페이지
import DownUsed from './Match/DownUsed'; //매칭 도면다운로드 허용
import Estimate from './Match/Estimate'; //매칭 예상 견적서 등록
import MatchCompelte from './Match/MatchComplete'; //매칭 업체선정
import EstimateResult from './Match/EstimateResult'; //매칭 예상 견적서 보기
import MachChat from './Match/MachChat'; //매칭 채팅목록
import ChatRoom from './Chat/Room'; //채팅방
import UsedSaleList from './Mypage/UsedSaleList'; //마이페이지 판매내역
import UsedBuyList from './Mypage/UsedBuyList'; //마이페이지 구매내역
import UsedBidList from './Mypage/UsedBidList'; //마이페이지 입찰내역
import UsedLike from './Mypage/UsedLike'; //마이페이지 관심목록
import UsedLikeView from './Mypage/UsedLikeView'; //마이페이지 관심목록 판매자 뷰
import MatchReq from './Mypage/MatchReq'; //마이페이지 요청내역
import MatchComparison from './Mypage/MatchComparison'; //마이페이지 비교내역
import MatchComparisonView from './Mypage/MatchComparisonView'; //마이페이지 발주업체 비교내역
import MatchOrder from './Mypage/MatchOrder'; //마이페이지 발주내역
import MatchDownUsed from './Mypage/MatchDownUsed'; //마이페이지 도면권한요청내역
import MatchDownUsedView from './Mypage/MatchDownUsedView'; //마이페이지 도면권한요청내역 뷰
import Keyword from './Mypage/Keyword'; //마이페이지 키워드 등록
import Message from './Mypage/Message'; //마이페이지 자주쓰는메세지
import MessageWrite from './Mypage/Message_write'; //마이페이지 자주쓰는메세지 작성
import MessageModify from './Mypage/MessageModify'; //마이페이지 자주쓰는메세지 수정
import BlockList from './Mypage/BlockList'; //마이페이지 차단사용자관리
import LikeList from './Mypage/LikeList'; //마이페이지 관심사용자관리
import FaqList from './Mypage/FaqList'; //마이페이지 고객센터1
import FaqList2 from './Mypage/FaqList2'; //마이페이지 고객센터2
import FaqView from './Mypage/FaqView'; //마이페이지 고객센터 뷰
import Privacy from './Mypage/Privacy'; //마이페이지 약관
import QnaList from './Mypage/QnaList'; //마이페이지 1:1문의
import QnaView from './Mypage/QnaView'; //마이페이지 1:1문의 뷰
import QnaWrite from './Mypage/QnaWrite'; //마이페이지 1:1문의 작성
import QnaModify from './Mypage/QnaModify'; //마이페이지 1:1문의 수정
import NoticeList from './Mypage/NoticeList'; //마이페이지 공지사항
import NoticeView from './Mypage/NoticeView'; //마이페이지 공지사항 뷰
import Profile from './member/Profile'; //프로필 설정
import MyInfo from './member/MyInfo'; //프로필 계정정보 설정
import MyPassword from './member/MyPassword'; //프로필 비밀번호 설정
import MyCompany from './member/MyCompany'; //프로필 공장 및 인증정보 관리
import Distance from './member/Distance'; //프로필 반경 설정
import Setting from './member/Setting'; //설정
import Alim from './member/Alim'; //설정 알림
import Other from './Other/Other'; //다른 회원 프로필
import OtherUsed from './Other/OtherUsed'; //다른 회원 판매상품
import OtherMatch from './Other/OtherMatch'; //다른 회원 매칭

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const opacityVal = 0.8;

const TabBarMenu = (props) => {
  const {state, navigation, optionsNum} = props;
  const screenName = state.routes[state.index].name;  

  //console.log("screenName : ",screenName);

  return (
    <View style={styles.TabBarMainContainer}>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('TabNavigator', {
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
          navigation.navigate('TabNavigator', {
            screen: 'Match',
          });
        }}
      >
        {screenName == 'Match' ? (
          <>
          <AutoHeightImage width={27} source={require("../assets/img/tab_icon2_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>매칭</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={27} source={require("../assets/img/tab_icon2_off.png")} style={styles.selectArr} />
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
          navigation.navigate('TabNavigator', {
            screen: 'Chat',
          });
        }}
      >
        {screenName == 'Chat' ? (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon3_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>채팅</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon3_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>채팅</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('TabNavigator', {
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
    </View>
  )
}

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{headerShown: false}}
      tabBar={ (props) => <TabBarMenu {...props} /> }
    >
      <Tab.Screen name="Home" component={Home} options={{}} />
      <Tab.Screen name="Match" component={Match} options={{}} />
      <Tab.Screen name="Chat" component={Chat} options={{}} />
      <Tab.Screen name="Mypage" component={Mypage} options={{}} />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown:false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />      
      <Stack.Screen name="AlimList" component={AlimList} />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Register2" component={Register2} />      
      <Stack.Screen name="SnsRegister" component={SnsRegister} />
      <Stack.Screen name="SnsRegister2" component={SnsRegister2} />
      <Stack.Screen name="Findid" component={Findid} />
      <Stack.Screen name="Findpw" component={Findpw} />
      <Stack.Screen name="SearchList" component={SearchList} />
      <Stack.Screen name="UsedWrite1" component={UsedWrite1} />
      <Stack.Screen name="UsedModify1" component={UsedModify1} />      
      <Stack.Screen name="UsedWrite2" component={UsedWrite2} />
      <Stack.Screen name="UsedModify2" component={UsedModify2} />      
      <Stack.Screen name="UsedWrite3" component={UsedWrite3} />
      <Stack.Screen name="UsedModify3" component={UsedModify3} />
      <Stack.Screen name="UsedWrite4" component={UsedWrite4} />
      <Stack.Screen name="UsedModify4" component={UsedModify4} />
      <Stack.Screen name="UsedView" component={UsedView} />
      <Stack.Screen name="Bid" component={Bid} />
      <Stack.Screen name="SalesComplete" component={SalesComplete} />      
      <Stack.Screen name="UsedChat" component={UsedChat} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="MatchWrite" component={MatchWrite} />
      <Stack.Screen name="MatchView" component={MatchView} />
      <Stack.Screen name="MachChat" component={MachChat} />
      <Stack.Screen name="DownUsed" component={DownUsed} />
      <Stack.Screen name="Estimate" component={Estimate} />
      <Stack.Screen name="MatchCompelte" component={MatchCompelte} />
      <Stack.Screen name="EstimateResult" component={EstimateResult} />
      <Stack.Screen name="UsedSaleList" component={UsedSaleList} />
      <Stack.Screen name="UsedBuyList" component={UsedBuyList} />
      <Stack.Screen name="UsedBidList" component={UsedBidList} />
      <Stack.Screen name="UsedLike" component={UsedLike} />
      <Stack.Screen name="UsedLikeView" component={UsedLikeView} />
      <Stack.Screen name="MatchReq" component={MatchReq} />
      <Stack.Screen name="MatchComparison" component={MatchComparison} />
      <Stack.Screen name="MatchComparisonView" component={MatchComparisonView} />
      <Stack.Screen name="MatchOrder" component={MatchOrder} />
      <Stack.Screen name="MatchDownUsed" component={MatchDownUsed} />
      <Stack.Screen name="MatchDownUsedView" component={MatchDownUsedView} />
      <Stack.Screen name="Keyword" component={Keyword} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="MessageWrite" component={MessageWrite} />
      <Stack.Screen name="MessageModify" component={MessageModify} />
      <Stack.Screen name="BlockList" component={BlockList} />
      <Stack.Screen name="LikeList" component={LikeList} />
      <Stack.Screen name="FaqList" component={FaqList} />
      <Stack.Screen name="FaqList2" component={FaqList2} />
      <Stack.Screen name="FaqView" component={FaqView} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="QnaList" component={QnaList} />
      <Stack.Screen name="QnaView" component={QnaView} />
      <Stack.Screen name="QnaWrite" component={QnaWrite} />
      <Stack.Screen name="QnaModify" component={QnaModify} />
      <Stack.Screen name="NoticeList" component={NoticeList} />
      <Stack.Screen name="NoticeView" component={NoticeView} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyInfo" component={MyInfo} />
      <Stack.Screen name="MyPassword" component={MyPassword} />
      <Stack.Screen name="MyCompany" component={MyCompany} />
      <Stack.Screen name="Distance" component={Distance} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Alim" component={Alim} />
      <Stack.Screen name="Other" component={Other} />
      <Stack.Screen name="OtherUsed" component={OtherUsed} />
      <Stack.Screen name="OtherMatch" component={OtherMatch} />
      
    </Stack.Navigator>
  )
}

const Main = () => {  
  usePermissions(CALL_PERMISSIONS_NOTI);

  const toastConfig = {
		custom_type: (internalState) => (
			<View
				style={{
					backgroundColor: '#000000e0',
					borderRadius: 10,
					paddingVertical: 10,
					paddingHorizontal: 20,
					opacity: 0.8,
				}}
			>
				<Text
					style={{
						textAlign: 'center',
						color: '#FFFFFF',
						fontSize: 15,
						lineHeight: 22,
						fontFamily: Font.NotoSansCJKkrRegular,
						letterSpacing: -0.38,
					}}
				>
					{internalState.text1}
				</Text>
			</View>
		),
	};
  
  // useEffect(() => { 
  //   setTimeout(function(){SplashScreen.hide();}, 1500); 
  // }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <StackNavigator />
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaView>
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
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
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
});

export default Main;
