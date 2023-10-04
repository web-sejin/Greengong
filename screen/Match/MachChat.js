import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchChat = ({navigation, route}) => {
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [chatList, setChatList] = useState([]);
  const [mcIdx, setMcIdx] = useState();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage(1);
      getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_chat_match_user', {'is_api': 1, mc_idx: idx, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("list_chat : ",responseJson);
        setChatList(responseJson.data);
        setTotalPage(responseJson.total_page);
        setMcIdx(responseJson.mc_idx);
			}else{
        setNowPage(1);
        setChatList([]);
				ToastMessage(responseJson.result_text);
			}
		});  
    setIsLoading(true);
  }

  const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_chat_match_user', {is_api: 1, pd_idx: idx, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log('list_chat more : ',responseJson.data);				
          const addItem = alimList.concat(responseJson.data);				
          setChatList(addItem);			
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
      style={[styles.chatBox, styles.chatBoxFst]}
      onPress={() => {
        const roomName = 'match_'+item.cr_idx;
        navigation.navigate('ChatRoom', {pd_idx:idx, page_code:'match', recv_idx:item.mb_idx, roomName:roomName, cr_idx:item.cr_idx});
      }}
    >
      <View style={styles.chatBoxLeft}>
        <View style={styles.chatBoxProfile}>
          {item.image ? (
            <AutoHeightImage width={63} source={{uri: item.image}} />
          ) : (
            <AutoHeightImage width={63} source={require("../../assets/img/not_profile.png")} />
          )}
        </View>
        <View style={styles.chatBoxInfo}>
          <View style={styles.chatBoxName}>
            <Text style={styles.chatBoxNameText}>{item.mb_nick}</Text>
          </View>
          <View style={styles.chatBoxCont}>
            <Text style={styles.chatBoxContText} numberOfLines={1} ellipsizeMode='tail'>{item.cr_last_msg}</Text>
          </View>
        </View>
      </View>
      <View style={styles.chatBoxRight}>
        <View style={styles.chatBoxDate}>
          <Text style={styles.chatBoxDateText}>{item.cr_lastdate}</Text>
        </View>
        <View style={styles.chatBoxLoc}>
          <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
          <Text style={styles.chatBoxLocText}>{item.mb_loc}</Text>
        </View>
      </View>
    </TouchableOpacity>
	); 

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'채팅목록'} />      
			{isLoading ? (
        <FlatList
          data={chatList}
          renderItem={(getList)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData}
          disableVirtualization={false}
          ListEmptyComponent={
            <View style={styles.notData}>
              <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
              <Text style={styles.notDataText}>진행중인 채팅이 없습니다.</Text>
            </View>
          }
        />
      ) : (
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" />
        </View>
      )}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},	
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  chatBox: {padding:20,borderTopWidth:1,borderColor:'#E9EEF6',display:'flex',flexDirection:'row',justifyContent:'space-between',},
  chatBoxFst: {borderTop:0},
  chatBoxLeft: {width:(innerWidth-90),display:'flex',flexDirection:'row',},
  chatBoxProfile: {width:63,height:63,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',},
  chatBoxInfo: {width:(innerWidth-153),paddingLeft:20,paddingTop:5,},
  chatBoxName: {},
  chatBoxNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  chatBoxCont: {marginTop:5,},
  chatBoxContText: {mily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#191919'},
  chatBoxRight: {width:80,display:'flex',alignItems:'flex-end',paddingTop:10,},
  chatBoxDate: {},
  chatBoxDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#919191'},
  chatBoxLoc: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginTop:7,},
  chatBoxLocText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
})

export default MatchChat