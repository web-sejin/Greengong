import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Swiper from 'react-native-swiper'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/HeaderView';
import Api from '../../Api';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const UsedView = ({navigation, route}) => {
  const scrollRef = useRef();

  const idx = route.params.idx;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [zzim, setZzim] = useState(0);
  const [like, setLike] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [swp, setSwp] = useState({});
  const [latest, setLatest] = useState({});
  const [naviPage, setNaviPage] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setVisible(false);
        setVisible2(false);
        //setIsLoading(false);
        //setItemInfo({});
        //setSwp({});
        //setLatest({});
        //setNaviPage('');
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

  function notBuy(){
    ToastMessage('판매완료된 상품은 가격협상이 불가합니다.');
  }

  const ModalOn = () => {
    setVisible(true);
  }

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'view_product', {'is_api': 1, pd_idx:idx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log(responseJson);
				setItemInfo(responseJson);
        setSwp(responseJson.pf_data);
        setLatest(responseJson.mb_latest);
        setZzim(responseJson.is_scrap);

        if(responseJson.c1_idx == 1){
          setNaviPage('UsedWrite1');
        }else if(responseJson.c1_idx == 2){
          setNaviPage('UsedWrite2');
        }else if(responseJson.c1_idx == 3){
          setNaviPage('UsedWrite3');
        }else if(responseJson.c1_idx == 4){
          setNaviPage('UsedWrite4');
        }
        setTimeout(function(){
          setIsLoading(true);
        },300);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!');
			}
		});
  }

  useEffect(() => {
    getData();
  }, []);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header 
        navigation={navigation} 
        headertitle={itemInfo.pd_name} 
        ModalEvent={ModalOn} 
      />

      {isLoading ? (
        <>
        <ScrollView ref={scrollRef}>
          {swp.length > 0 ? (
          <Swiper 
            style={styles.swiper} 
            showsButtons={true}
            nextButton={
              <View style={[styles.swiperNavi, styles.swiperNext]}>
                <AutoHeightImage width={35} source={require("../../assets/img/swipe_next.png")} />
              </View>
            }
            prevButton={
              <View style={[styles.swiperNavi, styles.swiperPrev]}>
                <AutoHeightImage width={35} source={require("../../assets/img/swipe_prev.png")} />
              </View>
            }
            showsPagination={true}
            paginationStyle={styles.swiperDotBox}
            dot={<View style={styles.swiperDot} />}
            activeDot={<View style={[styles.swiperDot, styles.swiperActiveDot]} />}
          >
            {/* <View style={styles.swiperSlider}>            
              <AutoHeightImage width={widnowWidth} source={require("../../assets/img/view_img.jpg")} />
            </View> */}
            {swp.map((item, index) => {
              return(
                <View key={index} style={styles.swiperSlider}>
                  <AutoHeightImage width={widnowWidth} source={{uri: item.pf_name}} />
                </View>
              )
            })}
          </Swiper>
          ) : null}
          
          <View style={[styles.viewBox1, styles.borderBot]}>
            <View style={styles.profileBox}>
              <TouchableOpacity
                activeOpacity={opacityVal}
                onPress={()=>{
                  navigation.navigate('Other', {});
                }}
              >
                <AutoHeightImage width={58} source={require("../../assets/img/profile_img.png")} />
              </TouchableOpacity>
              <View style={styles.profileBoxInfo}>
                <View style={styles.profileName}>
                  <Text style={styles.profileNameText}>{itemInfo.mb_nick}</Text>
                </View>
                <View style={styles.profileLocal}>
                  <AutoHeightImage width={10} source={require("../../assets/img/icon_local2.png")} />
                  <Text style={styles.profileLocalText}>{itemInfo.pd_loc}</Text>
                </View>
                <View style={styles.profileResult}>
                  <Text style={styles.profileResultText}>거래평가 : {itemInfo.mb_score}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.profileZzim, zzim==1 ? styles.profileZzimOn : null]}
                activeOpacity={opacityVal}
                onPress={() => {
                  if(zzim == 0){
                    setZzim(1);
                  }else{
                    setZzim(0);
                  }                
                }}
              >
                <Text style={[styles.profileZzimText, zzim==1 ? styles.profileZzimTextOn : null]}>관심판매자</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewSubjectBox}>
              <View style={styles.viewSubject}>
                <View style={styles.viewState}>
                  {itemInfo.pd_status_org == 1 ? (
                    <Text style={styles.viewStateText}>판매중</Text>
                  ): null }
                  
                  {itemInfo.pd_status_org == 2 ? (
                    <Text style={styles.viewStateText}>예약중</Text>
                  ): null }

                  {itemInfo.pd_status_org == 3 ? (
                    <Text style={styles.viewStateText}>판매완료</Text>
                  ): null }
                </View>
                <View style={styles.viewSubjectPart}>
                  <Text style={styles.viewSubjectText}>{itemInfo.pd_name}</Text>
                </View>
              </View>
              <View style={styles.viewOpt}>
                {itemInfo.pd_option1 == 1 ? (
                <View style={styles.viewOptLabel}>
                  <Text style={styles.viewOptLabelText}>가격협상가능</Text>
                </View>
                ) : null}

                <View style={styles.viewOptLabel}>
                  <Text style={styles.viewOptLabelText}>{itemInfo.pd_date} 등록</Text>
                </View>

                {itemInfo.pd_bidding_enday ? (
                <View style={[styles.viewOptLabel, styles.viewOptLabel2]}>
                  <Text style={styles.viewOptLabelText}>입찰 마감 ~ {itemInfo.pd_bidding_enday}</Text>
                </View>
                ) : null}
              </View>
            </View>
            <View style={styles.viewSumm}>
              <Text  style={styles.viewSummText}>{itemInfo.pd_summary}</Text>
            </View>
            <View style={styles.viewContent}>
              <Text  style={styles.viewContentText}>{itemInfo.pd_contents}</Text>
            </View>
            <View style={styles.viewSubInfoBox}>
              <View style={styles.viewSubInfo}>
                <Text style={styles.viewSubInfoText}>채팅 : {itemInfo.pd_chat_cnt}</Text>
              </View>
              <View style={styles.viewSubInfoLine}></View>
              <View style={styles.viewSubInfo}>
                <Text style={styles.viewSubInfoText}>찜 : {itemInfo.pd_scrap_cnt}</Text>
              </View>
              <View style={styles.viewSubInfoLine}></View>
              <View style={styles.viewSubInfo}>
                <Text style={styles.viewSubInfoText}>조회 : {itemInfo.pd_view_cnt}</Text>
              </View>
              <TouchableOpacity
                style={styles.likeBtn}
                activeOpacity={opacityVal}
                onPress={() => {
                  if(like == 0){
                    setLike(1);
                  }else{
                    setLike(0);
                  }                
                }}
              >
                {like == 1 ? (
                  <AutoHeightImage width={20} source={require("../../assets/img/icon_heart.png")} />
                ) : (
                  <AutoHeightImage width={20} source={require("../../assets/img/icon_heart_off.png")} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.viewBox2, styles.borderTop]}>
            <View style={styles.otherItemTit}>
              <Text style={styles.otherItemTitText}>{itemInfo.mb_nick}님의 다른 판매상품</Text>
            </View>

            {latest.length > 0 ? (
            <View style={styles.otherItemList}>
              {latest.map((item2, index2) => {
                return(
                <TouchableOpacity 
                  key={index2}
                  style={[styles.listLi, index2!=0 ? styles.listLiBorder : null ]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    navigation.push('UsedView', {idx:item2.pd_idx});
                    scrollRef.current.scrollTo({
                      y: 0,
                      animated: true,
                    });
                  }}
                >
                  <>
                  <AutoHeightImage width={131} source={require("../../assets/img/sample1.jpg")} style={styles.listImg} />
                  <View style={styles.listInfoBox}>
                    <View style={styles.listInfoTitle}>
                      <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>
                        {item2.pd_name}
                      </Text>
                    </View>
                    <View style={styles.listInfoDesc}>
                      <Text style={styles.listInfoDescText}>{item2.pd_loc} · {item2.pd_date}</Text>
                    </View>
                    <View style={styles.listInfoCate}>
                      <Text style={styles.listInfoCateText}>{item2.pd_summary}</Text>
                    </View>
                    <View style={styles.listInfoCnt}>
                      <View style={styles.listInfoCntBox}>
                        <AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
                        <Text style={styles.listInfoCntBoxText}>{item2.mb_score}</Text>
                      </View>
                      <View style={styles.listInfoCntBox}>
                        <AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
                        <Text style={styles.listInfoCntBoxText}>{item2.pd_chat_cnt}</Text>
                      </View>
                      <View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
                        <AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
                        <Text style={styles.listInfoCntBoxText}>{item2.pd_scrap_cnt}</Text>
                      </View>
                    </View>
                    <View style={styles.listInfoPriceBox}>
                      {item2.is_free != 1 && item2.pd_status_org == 1 ? (
                      <View style={[styles.listInfoPriceArea]}>
                        <View style={styles.listInfoPrice}>
                          <Text style={styles.listInfoPriceText}>{item2.pd_price}원</Text>
                        </View>
                      </View>
                      )
                      :
                      null
                      }

                      {item2.pd_status_org == 2 ? (
                      <View style={[styles.listInfoPriceArea]}>
                        <View style={[styles.listInfoPriceState, styles.listInfoPriceState1]}>
                          <Text style={styles.listInfoPriceStateText}>예약중</Text>
                        </View>
                        <View style={styles.listInfoPrice}>
                          <Text style={styles.listInfoPriceText}>{item2.pd_price}원</Text>
                        </View>
                      </View>
                      )
                      :
                      null
                      }
            
                      {item2.is_free == 1 && item2.pd_status_org == 1 ? (
                      <View style={[styles.listInfoPriceArea]}>
                        <View style={[styles.listInfoPriceState, styles.listInfoPriceState2]}>
                          <Text style={styles.listInfoPriceStateText}>나눔</Text>
                        </View>
                      </View>
                      )
                      :
                      null
                      }

                      {item2.pd_status_org == 3 ? (
                      <View style={[styles.listInfoPriceArea]}>
                        <View style={[styles.listInfoPriceState, styles.listInfoPriceState3]}>
                          <Text style={styles.listInfoPriceStateText}>판매완료</Text>
                        </View>
                        {item.is_free != 1 ? (
                        <View style={styles.listInfoPrice}>
                          <Text style={styles.listInfoPriceText}>{item2.pd_price}원</Text>
                        </View>
                        ) : null }
                      </View>
                      )
                      :
                      null
                      }                        
                    </View>
                  </View>
                  </>
                </TouchableOpacity>
                )
              })}
            </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={[styles.nextFix]}>
          <View style={styles.nextFixFlex}>
            <View style={styles.fixPriceBox}>
              {itemInfo.pd_sell_type==1 ? (
              <>
              <View style={styles.fixPrice}>              
                <Text style={styles.fixPriceText}>{itemInfo.pd_price}</Text>
                <Text style={styles.fixPriceText2}>원 ({itemInfo.pd_unit})</Text>
              </View>
              {/* <View style={styles.fixPriceUnit}>
                <Text style={styles.fixPriceUnitText}>(kg ₩)</Text>
              </View> */}
              </>
              ) : null}

              {itemInfo.pd_sell_type==2 ? (
              <>
              <View style={styles.fixPrice}>              
                <Text style={[styles.fixPriceText, styles.fixPriceText3]}>나눔상품</Text>
              </View>
              </>
              ) : null}

              {itemInfo.pd_sell_type==3 ? (
              <>
              <View style={styles.fixPrice}>              
                <Text style={[styles.fixPriceText]}>입찰상품</Text>
              </View>
              </>
              ) : null}
            </View>
            
            <View style={styles.fixBtnBox}>
              {itemInfo.pd_sell_type==3 ? (
              <TouchableOpacity 
                style={[styles.nextBtn, styles.nextBtn2]}
                activeOpacity={opacityVal}
                //onPress={() => {notBuy()}}
                onPress={() => {
                  navigation.navigate('Bid', {idx:itemInfo.pd_idx});
                }}
              >
                <Text style={styles.nextBtnText}>입찰하기</Text>
              </TouchableOpacity>
              ) : null } 

              <TouchableOpacity 
                style={[styles.nextBtn, itemInfo.pd_sell_type==3 ? styles.nextBtn2 : styles.nextBtn4, styles.nextBtn3]}
                activeOpacity={opacityVal}
                onPress={() => {
                  navigation.navigate('UsedChat', {idx:itemInfo.pd_idx});
                }}
              >
                <Text style={styles.nextBtnText}>채팅하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </>
      ) : (
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
				<View style={styles.modalCont2}>
					<View style={styles.modalCont2Box}>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.choice]}
							activeOpacity={opacityVal}
							onPress={() => {
								navigation.navigate(naviPage, {idx:itemInfo.pd_idx});
						}}
						>
							<Text style={styles.modalCont2BtnText}>수정하기</Text>
						</TouchableOpacity>
            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
								setVisible(false)
						}}
						>
							<Text style={styles.modalCont2BtnText}>예약중</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
								setVisible(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>판매중</Text>
						</TouchableOpacity>
            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible(false)
								navigation.navigate('SalesComplete');
						}}
						>
							<Text style={styles.modalCont2BtnText}>판매완료</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
								setVisible(false)
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제하기</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setVisible(false)
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>

      <Modal
        visible={visible2}
				transparent={true}
				onRequestClose={() => {setVisible2(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible2(false)}}
				></Pressable>
				<View style={styles.modalCont3}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>입찰삭제</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>이미 입찰을 신청하셨습니다.</Text>
            <Text style={styles.avatarDescText}>취소 후 신청 가능합니다.</Text>
            <Text style={styles.avatarDescText}>취소하시겠습니까?</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setVisible2(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {}}
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
  swiper: {height:220,},
  swiperSlider: {height:220,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',},
  nextFix: {height:105,paddingHorizontal:20,paddingTop:15,backgroundColor:'#F3FAF8'},
  nextFixFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  fixPriceBox: {},
  fixPrice: {display:'flex',flexDirection:'row',alignItems:'center'},
  fixPriceText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#000'},
  fixPriceText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#000',marginLeft:2,},
  fixPriceText3: {color:'#F58C40'},
  fixPriceUnit: {marginTop:3,},
  fixPriceUnitText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#000'},
  fixBtnBox: {width:210,display:'flex',flexDirection:'row',justifyContent:'space-between',},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',
  justifyContent:'center',},
  nextBtn2: {width:100,},
  nextBtn3: {backgroundColor:'#353636',},
  nextBtn4: {width:210,},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
  swiperDotBox: {bottom:15},
  swiperDot: {width:7,height:7,backgroundColor:'#fff',borderRadius:50,opacity:0.5,marginHorizontal:5,},
  swiperActiveDot: {opacity:1,},
  swiperNavi: {marginTop:-5},
  viewBox1: {paddingHorizontal:20,},
  profileBox: {paddingTop:25,paddingBottom:30,borderBottomWidth:1,borderBottomColor:'#E9EEF6',display:'flex',flexDirection:'row',position:'relative',},
  profileBoxInfo: {width:(innerWidth-58),paddingLeft:10,},
  profileName: {},
  profileNameText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#000'},
  profileLocal: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:4,},
  profileLocalText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#000',marginLeft:5,},
  profileResult: {marginTop:7,},
  profileResultText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#6A6A6A'},
  profileZzim: {width:75,height:24,backgroundColor:'#eaeaea',borderRadius:12,position:'absolute',top:25,right:0,display:'flex',alignItems:'center',justifyContent:'center',},
  profileZzimOn: {backgroundColor:'#31B481'},
  profileZzimText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#bbb'},
  profileZzimTextOn: {color:'#fff'},
  viewSubjectBox: {paddingVertical:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  viewSubject: {},
  viewState: {},
  viewStateText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#31B481',},
  viewSubjectPart: {marginTop:10,},
  viewSubjectText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#000',},
  viewOpt: {marginTop:5,display:'flex',flexDirection:'row',flexWrap:'wrap',},
  viewOptLabel: {height:24,paddingHorizontal:10,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,marginTop:10,marginRight:10,display:'flex',alignItems:'center',justifyContent:'center'},
  viewOptLabel2: {marginRight:0,},
  viewOptLabelText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#353636'},
  viewSumm: {paddingTop:15,paddingBottom:13,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  viewSummText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#000'},
  viewContent: {paddingTop:20,paddingBottom:15,},
  viewContentText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#000'},
  viewSubInfoBox: {display:'flex',flexDirection:'row',alignItems:'center',paddingBottom:30,position:'relative'},
  viewSubInfoLine: {width:1,height:10,backgroundColor:'#ADADAD',marginHorizontal:8,},
  viewSubInfo: {},
  viewSubInfoText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#6A6A6A'},  
  likeBtn: {position:'absolute',right:0,top:0,},
  viewBox2: {paddingTop:30,paddingHorizontal:20,},
  otherItemTit: {},
  otherItemTitText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#000'},
  otherItemList: {},
  listLi: {display:'flex',flexDirection:'row',paddingVertical:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
	listImg: {borderRadius:8},
	listInfoBox: {width:(widnowWidth - 171),paddingLeft:15,},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},
	listInfoCate: {marginTop:5},
	listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#353636'},
	listInfoCnt: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	listInfoCntBox: {display:'flex',flexDirection:'row',alignItems:'center',marginRight:15,},
	listInfoCntBox2: {marginRight:0},
	listInfoCntBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#000',marginLeft:4,},
	listInfoPriceBox: {marginTop:10},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
  listInfoPriceState3: {width:64,backgroundColor:'#353636'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},
  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},
  modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-160)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
})

export default UsedView