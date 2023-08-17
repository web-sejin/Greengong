import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const BlockList = ({navigation, route}) => {
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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'차단 사용자 관리'} />
			<ScrollView>
				<View style={[styles.listLi]}>
					<TouchableOpacity
						style={styles.otherPeople}
						activeOpacity={opacityVal}
					>
						<AutoHeightImage width={50} source={require("../../assets/img/profile_img.png")} style={styles.listImg} />
					</TouchableOpacity>
					<View style={[styles.listInfoBox]}>
						<View style={styles.listInfoTitle}>
							<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>참좋은공장</Text>
						</View>

						<View style={styles.msgBtnBox}>
							<TouchableOpacity
								style={styles.msgBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<Text style={styles.msgBtnText}>해제</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[styles.listLi, styles.borderTop2]}>
					<TouchableOpacity
						style={styles.otherPeople}
						activeOpacity={opacityVal}
					>
						<AutoHeightImage width={50} source={require("../../assets/img/profile_img.png")} style={styles.listImg} />
					</TouchableOpacity>
					<View style={[styles.listInfoBox]}>
						<View style={styles.listInfoTitle}>
							<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>참좋은공장</Text>
						</View>

						<View style={styles.msgBtnBox}>
							<TouchableOpacity
								style={styles.msgBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<Text style={styles.msgBtnText}>해제</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[styles.listLi, styles.borderTop2]}>
					<TouchableOpacity
						style={styles.otherPeople}
						activeOpacity={opacityVal}
					>
						<AutoHeightImage width={50} source={require("../../assets/img/profile_img.png")} style={styles.listImg} />
					</TouchableOpacity>
					<View style={[styles.listInfoBox]}>
						<View style={styles.listInfoTitle}>
							<Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>참좋은공장</Text>
						</View>

						<View style={styles.msgBtnBox}>
							<TouchableOpacity
								style={styles.msgBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<Text style={styles.msgBtnText}>해제</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* <View style={styles.notData}>
				<AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
				<Text style={styles.notDataText}>차단 사용자가 없습니다.</Text>
			</View> */}
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
})

export default BlockList