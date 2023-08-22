import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Alim = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [state, setState] = useState(true);
  const [stateEvent, setStateEvent] = useState(new Animated.Value(0));
  const [stateEvent2, setStateEvent2] = useState(new Animated.Value(0));

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setDst();
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

  useEffect(() => {		
    let change = 3;
    let opac = 0;
    
    if(state){
      change = 22;
      opac = 1;
    }else{
      change = 3;
      opac = 0
    }

		Animated.timing(
			stateEvent, {toValue: change, duration: 100, useNativeDriver: false,}
		).start();

    Animated.timing(
      stateEvent2, {toValue: opac, duration: 100, useNativeDriver: false,}
		).start();
	}, [state]);

  function submitRegist(){}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'알림 설정'} />
			<ScrollView>
        <View style={styles.registArea}>
          <View style={[styles.registBox, styles.registBox3]}>
						<View style={styles.alertBox}>
							<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
							<Text style={styles.alertBoxText}>이용자는 푸시 알림에 대한 동의를 거부할 권리가 있으며, 미동의시에도 서비스 이용이 가능합니다.</Text>
						</View>
            <View style={[styles.alimBox, styles.mgTop30]}>
							<View style={styles.alimBoxTit}>
								<Text style={styles.alimBoxTitText}>푸시알림동의</Text>
							</View>
              <View style={styles.alimBtnBox}>
                <Animated.View 
                  style={{
                    ...styles.alimBtnBoxBack,
                    opacity:stateEvent2
                  }}
                ></Animated.View>
                <TouchableOpacity 
                  style={[styles.alimBtn]}
                  activeOpacity={opacityVal}
                  onPress={()=>{setState(!state)}}
                >
                  <Animated.View 
                    style={{
                      ...styles.alimCircle,
                      left:stateEvent
                    }}
                  ></Animated.View>
                </TouchableOpacity>
						  </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.nextFix}>
        <TouchableOpacity 
          style={styles.nextBtn}
          activeOpacity={opacityVal}
          onPress={() => submitRegist()}
        >
          <Text style={styles.nextBtnText}>수정</Text>
        </TouchableOpacity>
      </View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
  registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:0,marginTop:-5},
	registBox3: {paddingTop:20,},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  alimBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  alimBoxTit: {},
  alimBoxTitText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#000'},
  alimBtnBox: {width:52,height:32,backgroundColor:'#999',borderRadius:16,overflow:'hidden'},
  alimBtnBoxBack: {width:52,height:32,backgroundColor:'#31B481',position:'absolute',left:0,top:0,},
  alimBtn: {width:52,height:32,position:'relative',zIndex:5,},
  alimCircle: {width:26,height:26,backgroundColor:'#fff',borderRadius:100,position:'absolute',top:3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15.0,
    elevation: 10,
  },

  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
})

export default Alim