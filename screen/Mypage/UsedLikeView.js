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
import UsedLike from './UsedLike';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const UsedLikeView = ({navigation, route}) => {
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [otherInfo, setOtherInfo] = useState({});
  const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getMbData = async () => {
    await Api.send('GET', 'profile_member', {'is_api': 1, mb_idx: idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log(responseJson);
				setOtherInfo(responseJson);
			}else{
				console.log('결과 출력 실패!', responseJson.result_text);
        ToastMessage(responseJson.result_text);
			}
		}); 
  }

  const getData = async () => {
    console.log(idx);
    setIsLoading(true);
    await Api.send('GET', 'list_scrap_seller2', {'is_api': 1, recv_idx: idx, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);
        setTotalCnt(responseJson.total_count);
			}else{
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		});
    setIsLoading(false);
  }

  const getList = ({item, index}) => (
		<View style={styles.borderBot}>
			<>
      <TouchableOpacity
        style={[styles.listLi]}
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('UsedView', {idx:item.pd_idx})
        }}
      >    
        {item.pd_image ? (
        <View style={styles.pdImage}>
          <AutoHeightImage width={73} source={{uri: item.pd_image}}  style={styles.listImg} />
        </View>
        ) : null}
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
              {item.pd_name}
            </Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{item.pd_summary}</Text>
          </View>
          <View style={styles.listInfoPriceBox}>
            <View style={[styles.listInfoPriceArea]}>
              <View style={styles.listInfoPrice}>
                <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
              </View>
            </View>					
          </View>
          {item.pd_status_org == 3 ? (
          <View style={styles.listInfoStateBox}>
            <Text style={styles.listInfoStateBoxText}>판매완료</Text>
          </View>
          ) : null}
        </View>
      </TouchableOpacity>
			</>
		</View>
	);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;
		if(!isFocused){
			if(!pageSt){
				setIsLoading(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);      
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  useEffect(() => {
    getMbData();
    getData();
  }, [])

  const moreData = async () => {
    console.log(totalPage+"//"+nowPage);
    if(totalPage > nowPage){
      await Api.send('GET', 'list_scrap_seller2', {is_api: 1, recv_idx: idx, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = itemList.concat(responseJson.data);				
          setItemList(addItem);			
          setNowPage(nowPage+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'관심목록'} />
      {!isLoading ? (
      <FlatList
        data={itemList}
        renderItem={(getList)}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.6}
				onEndReached={moreData}
        ListHeaderComponent={
          <View style={[styles.listLi, styles.listLi2, styles.listLi3, styles.borderBot]}>
            <>
            <TouchableOpacity
              style={styles.otherPeople}
              activeOpacity={opacityVal}
              onPress={()=>{
                navigation.navigate('Other', {idx:idx});
              }}
            >
              {otherInfo.mb_img != '' ? (
                <AutoHeightImage width={50} source={{uri: otherInfo.mb_img}} style={styles.listImg} />
              ) : (
                <AutoHeightImage width={50} source={require("../../assets/img/not_profile.png")} style={styles.listImg} />
              )}
              {/* <AutoHeightImage width={50} source={require("../../assets/img/profile_img.png")} style={styles.listImg} /> */}
            </TouchableOpacity>
            <View style={[styles.listInfoBox, styles.listInfoBox2]}>
              <View style={styles.listInfoTitle}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{otherInfo.mb_nick}</Text>
              </View>
              <View style={[styles.listLikeBtn, styles.listLikeBtn2]}>
                <AutoHeightImage width={22} source={require("../../assets/img/icon_heart.png")} />
              </View>
            </View>            
            </>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.notData}>
            <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
            <Text style={styles.notDataText}>등록된 관심 중고상품이 없습니다.</Text>
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
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  listLi: {display:'flex',flexDirection:'row',padding:20,},
  listLi2: {alignItems:'stretch',paddingVertical:0,},
  listLi3: {alignItems:'center',},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
  otherPeople: {width:50,height:50,borderRadius:50,overflow:'hidden'},
  pdImage: {width:73,height:73,overflow:'hidden',borderRadius:50,},
	listImg: {borderRadius:50},
	listInfoBox: {width:(innerWidth - 73),paddingLeft:15,position:'relative'},
  listInfoBox2: {width:(innerWidth - 50),height:90,display:'flex',justifyContent:'center'},
  listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
  listInfoPriceBox: {marginTop:5},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},	
  listInfoStateBox: {width:78,height:23,backgroundColor:'#fff',borderWidth:1,borderColor:'#000',borderRadius:20,position:'absolute',right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',},
  listInfoStateBoxText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:21,color:'#353636',},
  listLikeBtn: {width:42,height:40,position:'absolute',top:10,right:10,display:'flex',alignItems:'center',justifyContent:'center',},
  listLikeBtn2: {top:25,right:0,},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
})

export default UsedLikeView