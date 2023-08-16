import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
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

const MatchChat = ({navigation, route}) => {
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


  //api 받아오면 FlatList로 변경해야 할 듯
	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'채팅목록'} />      
			<ScrollView>
        <View style={styles.borderBot}></View>
        <View style={styles.borderTop}>          
          <TouchableOpacity
            style={[styles.chatBox, styles.chatBoxFst]}
            onPress={() => {
              navigation.navigate('ChatRoom', {});
            }}
          >
            <View style={styles.chatBoxLeft}>
              <View style={styles.chatBoxProfile}>
                <AutoHeightImage width={63} source={require("../../assets/img/sample1.jpg")} />
              </View>
              <View style={styles.chatBoxInfo}>
                <View style={styles.chatBoxName}>
                  <Text style={styles.chatBoxNameText}>홍길동</Text>
                </View>
                <View style={styles.chatBoxCont}>
                  <Text style={styles.chatBoxContText} numberOfLines={1} ellipsizeMode='tail'>거래 할까요?</Text>
                </View>
              </View>
            </View>
            <View style={styles.chatBoxRight}>
              <View style={styles.chatBoxDate}>
                <Text style={styles.chatBoxDateText}>2023.07.06</Text>
              </View>
              <View style={styles.chatBoxLoc}>
                <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
                <Text style={styles.chatBoxLocText}>중3동</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatBox}
            onPress={() => {
              navigation.navigate('ChatRoom', {});
            }}
          >
            <View style={styles.chatBoxLeft}>
              <View style={styles.chatBoxProfile}>
                <AutoHeightImage width={63} source={require("../../assets/img/sample1.jpg")} />
              </View>
              <View style={styles.chatBoxInfo}>
                <View style={styles.chatBoxName}>
                  <Text style={styles.chatBoxNameText}>홍길동</Text>
                </View>
                <View style={styles.chatBoxCont}>
                  <Text style={styles.chatBoxContText}>거래 할까요?</Text>
                </View>
              </View>
            </View>
            <View style={styles.chatBoxRight}>
              <View style={styles.chatBoxDate}>
                <Text style={styles.chatBoxDateText}>2023.07.06</Text>
              </View>
              <View style={styles.chatBoxLoc}>
                <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
                <Text style={styles.chatBoxLocText}>중3동</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  chatBoxInfo: {width:(innerWidth-153),paddingLeft:20,},
  chatBoxName: {},
  chatBoxNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  chatBoxCont: {marginTop:5,},
  chatBoxContText: {mily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#191919'},
  chatBoxRight: {width:80,display:'flex',alignItems:'flex-end',},
  chatBoxDate: {},
  chatBoxDateText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#919191'},
  chatBoxLoc: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginTop:7,},
  chatBoxLocText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
})

export default MatchChat