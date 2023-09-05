import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const LikeList = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [likeList, setLikeList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);	

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
			getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	const removeLike = async (mb_idx) => {
		const formData = {
			is_api:1,				
			mb_idx:mb_idx,
		};
		
    Api.send('POST', 'remove_scrap', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);				
				getData();
			}else{
				console.log('결과 출력 실패!', resultItem.result_text);
				ToastMessage(responseJson.result_text);
			}
		});
	}

	const getList = ({item, index}) => (
		<View style={[styles.listLi, index!=0 ? styles.borderTop2 : null]}>
			<TouchableOpacity
				style={styles.otherPeople}
				activeOpacity={opacityVal}
				onPress={()=>{
					navigation.navigate('Other', {idx:item.mb_idx});
				}}
			>
				{item.image ? (
					<AutoHeightImage width={50} source={{uri: item.image}} />
				) : (
					<AutoHeightImage width={50} source={require("../../assets/img/not_profile.png")} />	
				)}
			</TouchableOpacity>
			<View style={[styles.listInfoBox]}>
				<View style={styles.listInfoTitle}>
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{item.mb_nick}</Text>
				</View>

				<View style={styles.msgBtnBox}>
					<TouchableOpacity
						style={styles.msgBtn}
						activeOpacity={opacityVal}
						onPress={()=>{removeLike(item.mb_idx)}}
					>
						<Text style={styles.msgBtnText}>해제</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	const getData = async () => {
    setIsLoading(true);
    await Api.send('GET', 'list_scrap', {'is_api': 1, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson);
				setLikeList(responseJson.data);
        setTotalPage(responseJson.total_page);        
			}else{
				setLikeList([]);
				setNowPage(1);
				//console.log('결과 출력 실패!', responseJson.result_text);
        ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(false);
  }

	const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_scrap', {is_api: 1, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log(responseJson.data);				
          const addItem = itemList.concat(responseJson.data);				
          setLikeList(addItem);			
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
			<Header navigation={navigation} headertitle={'관심 사용자 관리'} />
			{!isLoading ? (
				<FlatList
					data={likeList}
					renderItem={(getList)}
					keyExtractor={(item, index) => index.toString()}
					onEndReachedThreshold={0.6}
					onEndReached={moreData}
					ListEmptyComponent={
						<View style={styles.notData}>
							<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
							<Text style={styles.notDataText}>관심 사용자가 없습니다.</Text>
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
	borderTop2: {borderTopWidth:1,borderTopColor:'#E3E3E4'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
	notData: {height:(widnowHeight-200),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
	listLi: {display:'flex',flexDirection:'row',paddingHorizontal:20,},
  otherPeople: {paddingVertical:20,},
	listImg: {borderRadius:50},
	listInfoBox: {width:(innerWidth - 50),height:90,paddingLeft:15,paddingRight:65,display:'flex',justifyContent:'center',position:'relative'},
  listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	msgBtnBox: {display:'flex',flexDirection:'row',alignItems:'center',position:'absolute',right:0,top:33},
  msgBtn: {width:54,height:25,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},  
  msgBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#fff',},
	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

export default LikeList