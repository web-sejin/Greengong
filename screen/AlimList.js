import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, PanResponder} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import Header from '../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const AlimList = ({navigation, route}) => {
  const pan = useRef(new Animated.ValueXY()).current;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			//console.log("isFocused");
			if(route.params){
				//console.log("route on!!");
			}else{
				//console.log("route off!!");
			}
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const DATA = [
		{
			id: '1',
      title: '문의 주신 내용의 답변입니다.',
			date: '2023.02.02',
		},
		{
			id: '2',
      title: '[카워드] 상품이 등록되었습니다.',
			date: '2023.02.02',
		},
		{
			id: '10',
      title: '[카워드] 상품이 등록되었습니다.',
			date: '2023.02.02',
		},
	];

  const dataLen = DATA.length;

  const renderRightActions = (dragX, index, idx) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 0],
    });
    return (
      <TouchableOpacity 
        style={[styles.deleteBtn]}
        onPress={() => console.log(idx)}
      >
        <Animated.Text
          style={[
            styles.deleteBtnText,
            {
              //transform: [{translateX: trans}],
            },
          ]}>
          삭제
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const getList = ({item, index}) => (    
    <GestureHandlerRootView
      style={styles.noticeBtn}
      activeOpacity={opacityVal}
    >
      <Swipeable renderRightActions={dragX => renderRightActions(dragX, index, item.id)}>                    
        <View style={[styles.noticeWrap, index == 0 ? styles.noticeWrap2 : null]}>
          <View style={styles.noticeListCont}>
            <View style={styles.noticeTit}>
              <Text style={styles.noticeTitText}>{item.title}</Text>
            </View>
            <View style={styles.noticeDate}>
              <Text style={styles.noticeDateText}>2023.02.02</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
	);  

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'알림'} />
      <FlatList
				data={DATA}
				renderItem={(getList)}
				keyExtractor={item => item.id}		
				ListEmptyComponent={
					<View style={styles.notData}>
						<AutoHeightImage width={74} source={require("../assets/img/not_data.png")} />
						<Text style={styles.notDataText}>등록된 알림이 없습니다.</Text>
					</View>
				}
      />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  notData: {height:(widnowHeight-220),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  noticeBtn: {},
  noticeWrap: {padding:20,borderBottomWidth:1,borderColor:'#E9EEF6'},
  noticeWrap2: {borderTopWidth:1,},
  noticeListCont: {},
  noticeTit: {},
  noticeTitText: {fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:22,color:'#000'},
  noticeDate: {alignItems:'flex-end',marginTop:10,},
  noticeDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#9C9C9C',},
  deleteBtn: {width:53,backgroundColor:'#E9EEF6',alignItems:'center',justifyContent:'center',},
  deleteBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,color:'#404040'},
})

export default AlimList