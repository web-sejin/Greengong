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

const MatchOrder = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabState, setTabState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [odList, setOdList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [odList2, setOdList2] = useState([]);
  const [nowPage2, setNowPage2] = useState(1);
  const [totalPage2, setTotalPage2] = useState(1);
  const [initLoading, setInitLoading] = useState(false);
  const [mcIdx, setMcIdx] = useState();
  const [score, setScore] = useState(3);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setMcIdx();
        setScore(3);
        setVisible(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage2(1);
			getData2();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () =>{
		setIsLoading(false);

		await Api.send('GET', 'order_list_match2', {is_api: 1, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log('order_list_match2 : ',responseJson);
				setOdList(responseJson.data);
        setTotalPage(responseJson.total_page);  
        setNowPage(1);
			}else{
				setOdList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson);
			}
		});

		setIsLoading(true);
	}
  const moreData = async () => {
		if(totalPage > nowPage){
			await Api.send('GET', 'order_list_match2', {is_api: 1, page:nowPage+1}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
				let arrItems = args.arrItems;
				//console.log('args ', args);
				if(responseJson.result === 'success' && responseJson){
					//console.log(responseJson.data);				
					const addItem = odList.concat(responseJson.data);				
					setOdList(addItem);			
					setNowPage(nowPage+1);
				}else{
					console.log(responseJson);
					console.log('결과 출력 실패!');
				}
			});
		}
	}
  const getList = ({item, index}) => (     
    <View style={[styles.matchCompleteMb, index==0 ? styles.matchCompleteMbFst : null, styles.borderBot]}>
      <View style={[styles.compBtn]}>
        <TouchableOpacity 
          style={[styles.compWrap, styles.compWrapFst]}
          activeOpacity={opacityVal}
          onPress={() => {navigation.navigate('MatchView', {idx:item.mc_idx})}}
        >
          <View style={styles.compInfo}>                  
            <View style={styles.compInfoName}>
              <Text style={styles.compInfoNameText}>{item.mc_name}{item.mc_status_org}</Text>
            </View>
            <View style={styles.compInfoDate}>
              <Text style={styles.compInfoDateText}>{item.mc_loc} · {item.mc_regdate}</Text>
            </View>
            <View style={styles.compInfoLoc}>
              <Text style={styles.compInfoLocText}>{item.mc_summary}</Text>
            </View>
          </View>
          {item.mf_image ? (
          <View style={styles.compThumb}>
            <AutoHeightImage width={70} source={{uri:item.mf_image}} />
          </View>
          ) : null}
        </TouchableOpacity>
        {item.is_estimate == 1 ? (
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>발주금액</Text>
          <Text style={styles.matchPriceText2}>{item.me_total_price}원</Text>
        </View>
        ) : null}
      </View>
      <View style={styles.btnBox}>
        {item.so_score > 0 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3, styles.btn4]}
            activeOpacity={1}
          >
            <Text style={[styles.btnText, styles.btnText2]}>거래평가를 완료했습니다.</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{
              setMcIdx(item.mc_idx);
              setVisible(true);
            }}
          >
            <Text style={styles.btnText}>거래평가 작성</Text>
          </TouchableOpacity>
        )}
      </View>  
    </View>
	);

  const getData2 = async () =>{
		setIsLoading(false);

		await Api.send('GET', 'order_list_match3', {is_api: 1, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log('order_list_match3 : ',responseJson);
				setOdList2(responseJson.data);
        setTotalPage2(responseJson.total_page);  
        setNowPage2(1);
			}else{
				setOdList2([]);
				setNowPage2(1);
				console.log('결과 출력 실패!', responseJson);
			}
		});

		setIsLoading(true);
	}
  const moreData2 = async () => {
		if(totalPage > nowPage){
			await Api.send('GET', 'order_list_match3', {is_api: 1, page:nowPage+1}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
				let arrItems = args.arrItems;
				//console.log('args ', args);
				if(responseJson.result === 'success' && responseJson){
					//console.log(responseJson.data);				
					const addItem = odList.concat(responseJson.data);				
					setOdList2(addItem);			
					setNowPage2(nowPage+1);
				}else{
					console.log(responseJson);
					console.log('결과 출력 실패!');
				}
			});
		}
	}
  const getList2 = ({item, index}) => (     
    <View style={[styles.matchCompleteMb, index==0 ? styles.matchCompleteMbFst : null, styles.borderBot]}>
      <View style={[styles.compBtn]}>
        <TouchableOpacity 
          style={[styles.compWrap, styles.compWrapFst]}
          activeOpacity={opacityVal}
          onPress={() => {navigation.navigate('MatchView', {idx:item.mc_idx})}}
        >
          <View style={styles.compInfo}>                  
            <View style={styles.compInfoName}>
              <Text style={styles.compInfoNameText}>{item.mc_name}{item.mc_status_org}</Text>
            </View>
            <View style={styles.compInfoDate}>
              <Text style={styles.compInfoDateText}>{item.mc_loc} · {item.mc_regdate}</Text>
            </View>
            <View style={styles.compInfoLoc}>
              <Text style={styles.compInfoLocText}>{item.mc_summary}</Text>
            </View>
          </View>
          {item.mf_image ? (
          <View style={styles.compThumb}>
            <AutoHeightImage width={70} source={{uri:item.mf_image}} />
          </View>
          ) : null}
        </TouchableOpacity>
        {item.is_estimate == 1 ? (
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>발주금액</Text>
          <Text style={styles.matchPriceText2}>{item.me_total_price}원</Text>
        </View>
        ) : null}
      </View>
      <View style={styles.btnBox}>
        <TouchableOpacity
          style={[styles.btn, styles.btn2, styles.btn3, styles.btn4]}
          activeOpacity={1}
        >
          <Text style={[styles.btnText, styles.btnText2]}>{item.mb_nick}님이 발주되었습니다.</Text>
        </TouchableOpacity>
      </View>  
    </View>
	);

  const submitEndMatch = async () => {
    const formData = {
			is_api:1,
      page_code:'match',
      article_idx: mcIdx,
      so_score: score,
		}; 

    console.log(formData);

    Api.send('POST', 'save_score', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        setVisible(false);
        setNowPage(1);
			  getData();
        setMcIdx();
        setScore(3);
			}else{
				console.log('결과 출력 실패!', responseJson);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  function fnTab(v){
    setTabState(v);
		setNowPage(1);
    setNowPage2(1);
		if(v == 2){
      getData();
      setTimeout(function(){
        setOdList2([]);
      },200);
    }else if(v == 1){
      getData2();
      setTimeout(function(){
        setOdList([]);
      },200);
    }
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'발주내역'} />

      <View style={styles.tabBox}>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(1)}}
        > 
          {tabState == 1 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>발주요청회원</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>발주요청회원</Text>  
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          activeOpacity={opacityVal}
          onPress={()=>{fnTab(2)}}
        >
          {tabState == 2 ? (
            <>
            <Text style={[styles.tabBtnText, styles.tabBtnTextOn]}>발주회원</Text>
            <View style={styles.tabLine}></View>
            </>
          ) : (
            <Text style={styles.tabBtnText}>발주회원</Text>  
          )}
        </TouchableOpacity>
      </View>
      
      {tabState == 1 ? (
        <FlatList
        data={odList2}
        renderItem={(getList2)}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.6}
        onEndReached={moreData2}
        disableVirtualization={false}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.notData}>
              <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
              <Text style={styles.notDataText}>발주요청회원내역이 없습니다.</Text>
            </View>
          ):(
            <View style={[styles.indicator]}>
              <ActivityIndicator size="large" />
            </View>
          )
        }
      />
      ) : (
        <FlatList
          data={odList}
          renderItem={(getList)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData}
          disableVirtualization={false}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>발주회원내역이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
      )}

      <Modal
        visible={visible}
				transparent={true}
				onRequestClose={() => {
          setScore(3);
          setVisible(false);
        }}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {
            setScore(3);
            setVisible(false);
          }}
				></Pressable>
				<View style={[styles.modalCont, styles.modalCont2]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>거래평가</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>거래평가 할 회원에게 별점으로</Text>
            <Text style={styles.avatarDescText}>발주를 완료를 하여 주세요.</Text>
          </View>
          <View style={styles.starBox}>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(1)}}
            >
              {score > 0 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(2)}}
            >
              {score > 1 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(3)}}
            >
              {score > 2 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(4)}}
            >
              {score > 3 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(5)}}
            >
              {score > 4 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {submitEndMatch()}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  mgTop30: {marginTop:30,},
  mgTop35: {marginTop:35,},
  salesAlert: {padding:20,paddingTop:25,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
  matchCompleteMb: {paddingVertical:30},
  matchCompleteMbFst: {paddingTop:20,},
  compBtn: {paddingHorizontal:20},
  compWrap: {display:'flex',flexDirection:'row',justifyContent:'space-between',position:'relative',paddingBottom:10,},
  compRadio: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,position:'absolute',top:30,left:0,display:'flex',alignItems:'center',justifyContent:'center'},
  comRadioChk: {backgroundColor:'#31B481',borderColor:'#31B481',},
  compInfo: {width:(innerWidth-70)},
  compInfoDate: {marginVertical:5,},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',},
  compThumb: {width:70,height:70,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-140)},	
  modalCont2: {top:((widnowHeight/2)-166)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:innerWidth-40,height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  starBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'center',marginTop:20},
  star: {marginHorizontal:4,},
  matchPrice: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',backgroundColor:'#F3FAF8',borderRadius:12,paddingVertical:10,paddingHorizontal:15,marginTop:10,},
  matchPriceText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#353636'} ,
  matchPriceText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#31B481'},
  btnBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',paddingHorizontal:20,marginTop:10,},
  btn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#353636',borderRadius:12,display:'flex',alignItems:"center",justifyContent:'center'},
  btn2: {backgroundColor:'#31B481',},
  btn3: {width:innerWidth},
  btn4: {backgroundColor:'#fff',borderWidth:1,borderColor:'#000'},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:20,color:'#fff'},
  btnText2: {color:'#353636'},

  notData: {height:widnowHeight-220,display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},

  tabBox: {display:'flex',flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
  tabBtn: {width:(widnowWidth/2),height:45,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',},
  tabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#C5C5C6',},
  tabBtnTextOn: {fontFamily:Font.NotoSansBold,color:'#31B481'},
  tabLine: {width:(widnowWidth/2),height:3,backgroundColor:'#31B481',position:'absolute',left:0,bottom:-1,},
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
})

export default MatchOrder