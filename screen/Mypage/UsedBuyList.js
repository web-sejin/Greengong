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

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const UsedBuyList = ({navigation, route}) => {
  const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);  
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buyList, setBuyList] = useState([]);
	const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [initLoading, setInitLoading] = useState(false);
  const [pdIdx, setPdIdx] = useState();
  const [score, setScore] = useState(3);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setPdIdx();
        setVisible(false);
        setVisible2(false);
        setScore(3);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage(1);
			getData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () =>{
		setIsLoading(false);

		await Api.send('GET', 'list_buy', {is_api: 1, page:1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log('list_buy : ',responseJson);
				setBuyList(responseJson.data);
        setTotalPage(responseJson.total_page);  
			}else{
				setBuyList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson);
			}
		});

		setIsLoading(true);
	}
  const moreData = async () => {
		if(totalPage > nowPage){
			await Api.send('GET', 'list_buy', {is_api: 1, page:nowPage+1}, (args)=>{
				let resultItem = args.resultItem;
				let responseJson = args.responseJson;
				let arrItems = args.arrItems;
				//console.log('args ', args);
				if(responseJson.result === 'success' && responseJson){
					//console.log(responseJson.data);				
					const addItem = buyList.concat(responseJson.data);				
					setBuyList(addItem);			
					setNowPage(nowPage+1);
				}else{
					console.log(responseJson);
					console.log('결과 출력 실패!');
				}
			});
		}
	}
  const getList = ({item, index}) => (     
    <View style={[styles.matchCompleteMb, styles.matchCompleteMbFst, styles.borderBot]}>
      <View style={[styles.compBtn]}>
        <View style={[styles.compWrap, styles.compWrapFst]}>
          <View style={styles.compInfo}>
            <View style={styles.compInfoDate}>
              <Text style={styles.compInfoDateText}>{item.mb_nick}</Text>
            </View>
            <View style={styles.compInfoName}>
              <Text style={styles.compInfoNameText}>[{item.c1_name}] {item.pd_name}</Text>
            </View>
            <View style={styles.compInfoLoc}>
              <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
              <Text style={styles.compInfoLocText}>중3동</Text>
            </View>
          </View>
          {item.pd_image ? (
          <TouchableOpacity 
            style={styles.compThumb}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('Other', {idx:item.pd_mb_idx})}}
          >
            <AutoHeightImage width={63} source={{uri: item.pd_image}} />
          </TouchableOpacity>
          ) : null}          
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>판매가</Text>
          <Text style={styles.matchPriceText2}>{String(item.pd_price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}원</Text>
        </View>
        <View style={styles.matchPrice}>
          <Text style={styles.matchPriceText}>입찰가</Text>
          <Text style={styles.matchPriceText2}>{String(item.bd_price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}원</Text>
        </View>
      </View>
      <View style={styles.btnBox}>
        {item.so_score > 0 ? (
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3, styles.btn4]}
            activeOpacity={opacityVal}
            onPress={()=>{
              setPdIdx(item.pd_idx);
              setVisible(true);
            }}
          >
            <Text style={[styles.btnText, styles.btnText2]}>거래평가를 완료했습니다.</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btn2, styles.btn3]}
            activeOpacity={opacityVal}
            onPress={()=>{
              setPdIdx(item.pd_idx);
              setVisible(true);
            }}
          >
            <Text style={styles.btnText}>거래평가 작성</Text>
          </TouchableOpacity>
        )}
      </View>  
    </View>
	);

  function submitEndProduct(){
    const formData = {
			is_api:1,
      page_code:'product',
      article_idx: pdIdx,
      so_score: score,
		}; 

    Api.send('POST', 'save_score', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        setVisible(false);
        setNowPage(1);
			  getData();
        setPdIdx();
        setScore(3);
			}else{
				console.log('결과 출력 실패!', responseJson);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'구매내역'} />
      {isLoading ? (
        <FlatList
          data={buyList}
          renderItem={(getList)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>구매한 상품이 없습니다.</Text>
              </View>
            ):(
              <View style={[styles.indicator]}>
                <ActivityIndicator size="large" />
              </View>
            )
          }
        />
      ):(
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <Modal
        visible={visible}
				transparent={true}
				onRequestClose={() => {setVisible(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible(false)}}
				></Pressable>
				<View style={[styles.modalCont, styles.modalCont2]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>거래평가</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>발주완료 할 회원에게 별점으로 발주를</Text>
            <Text style={styles.avatarDescText}>완료를 하여 주세요.</Text>
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
              onPress={() => {submitEndProduct()}}
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
  compInfo: {width:(innerWidth-63)},
  compInfoDate: {},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {marginVertical:8},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
  compThumb: {width:63,height:63,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
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

  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
})

export default UsedBuyList