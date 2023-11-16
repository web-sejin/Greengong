import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Postcode from '@actbase/react-daum-postcode';
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/HeaderView';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Other = ({navigation, route}) => {
  const otherIdx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [radio, setRadio] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [nick, setNick] = useState('');
  const [factName, setFactName] = useState('');
  const [score, setScore] = useState('');
  const [itemList, setItemList] = useState([]);
  const [itemList2, setItemList2] = useState([]);
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [blockSt, setBlckSt] = useState(0);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setVisible(false);
        setVisible2(false);
        setVisible3(false);
        setRadio(1);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      getOtherData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getOtherData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'other_member', {is_api: 1, mb_idx:otherIdx}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("other_member : ",responseJson);	
        setProfileImg(responseJson.mb_img);
        setNick(responseJson.mb_nick);
        setFactName(responseJson.fc_name);
        setScore(responseJson.mb_score);
        setItemList(responseJson.pd_latest);
        setItemList2(responseJson.mc_latest);
        setTotal1(responseJson.product_total);
        setTotal2(responseJson.match_total);
        setBlckSt(responseJson.is_block);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!',responseJson);
			}
		});
		setIsLoading(true);
  }

  const ModalOn = () => {
    setVisible(true);
  }

  //신고하기
  const fnSingo = async () => {
    const formData = {
			is_api:1,				
			reason_idx:radio,
      page_code:'member',
      article_idx:otherIdx
		};

    Api.send('POST', 'save_report', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('신고 성공 : ',responseJson);
        setVisible2(false);
        getOtherData();
        ToastMessage("신고가 접수되었습니다.");
			}else{
				console.log('결과 출력 실패!', responseJson);
        setVisible2(false);        
				ToastMessage(responseJson.result_text);
			}
		});
  }

  //차단하기
  const fnBlock = async () => {
    const formData = {
			is_api:1,				
			recv_idx:otherIdx
		};

    Api.send('POST', 'save_block', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('차단 성공 : ',responseJson);
        setVisible3(false);
        getOtherData();
        ToastMessage(responseJson.result_text);
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
  } 

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header 
        navigation={navigation} 
        headertitle={'다른 회원 프로필'} 
        ModalEvent={ModalOn}
      />
      
      <ScrollView>          
        <View style={[styles.otherBox, styles.borderBot]}>
          <View style={styles.otherWrap}>
            <View style={styles.otherBoxLeft}>
              <View style={styles.otherProfile}>
                {profileImg ? (
                  <AutoHeightImage width={69} source={{uri: profileImg}} />  
                ):(
                  <AutoHeightImage width={69} source={require("../../assets/img/not_profile.png")} />  
                )}
              </View>
              <View style={styles.otherBoxInfo}>
                <Text style={styles.otherBoxInfoText}>{nick}</Text>
                <Text style={styles.otherBoxInfoText2}>{factName}</Text>
              </View>
            </View>
            {/* <View style={styles.otherBoxRight}>
              <Text style={styles.otherBoxRightText}>최근 3일 이내 활동</Text>
              <Text style={styles.otherBoxRightText2}>2023.07.04 가입 완료</Text>
            </View> */}
          </View>
          <View style={styles.myDealResultBox}>
            <Text style={styles.myDealResultBoxText}>거래평가점수</Text>
            <Text style={styles.myDealResultBoxText2}>{score}점</Text>
          </View>
        </View>
        
        {isLoading ? (
          <>
          <View style={[styles.borderTop, styles.borderBot]}>
            <View style={styles.otherItem}>
              <Text style={styles.otherItemText}>판매상품 ({total1}개)</Text>
              <TouchableOpacity
                style={styles.moreBtn}
                activeOpacity={opacityVal}
                onPress={()=>{
                  navigation.navigate('OtherUsed', {idx:otherIdx})
                }}
              >
                <Text style={styles.moreBtnText}>더보기</Text>
                <AutoHeightImage width={5} source={require("../../assets/img/icon_arrow2.png")} style={styles.moreBtnArr} />
              </TouchableOpacity>
            </View>
            {total1 > 0 ? (
              itemList.map((item, index) => {
                return(
                <TouchableOpacity 
                  key={index}
                  style={[styles.listLi]}
                  activeOpacity={opacityVal}
                  onPress={() => {navigation.push('UsedView', {idx:item.pd_idx})}}
                >
                  <>
                  <View style={[styles.listLiBorder, index==0 ? styles.listLiBorderNot : null]}>
                    {item.image ? (
                    <View style={styles.pdImage}>
                      <AutoHeightImage width={131} source={{uri: item.image}} style={styles.listImg} />
                    </View>
                    ) : null}
                    <View style={styles.listInfoBox}>
                      <View style={styles.listInfoTitle}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{item.pd_name}</Text>
                      </View>
                      <View style={styles.listInfoDesc}>
                      <Text style={styles.listInfoDescText}>{item.pd_loc} · {item.pd_date}</Text>
                      </View>
                      <View style={styles.listInfoCate}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoCateText}>{item.pd_summary}</Text>
                      </View>
                      <View style={styles.listInfoCnt}>
                        <View style={styles.listInfoCntBox}>
                          <AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
                          <Text style={styles.listInfoCntBoxText}>{item.mb_score}</Text>
                        </View>
                        <View style={styles.listInfoCntBox}>
                          <AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
                          <Text style={styles.listInfoCntBoxText}>{item.pd_chat_cnt}</Text>
                        </View>
                        <View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
                          <AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
                          <Text style={styles.listInfoCntBoxText}>{item.pd_like_cnt}</Text>
                        </View>
                      </View>
                      <View style={styles.listInfoPriceBox}>
                        {item.is_free != 1 && item.pd_sell_type != 3 && item.pd_status_org == 1 ? (
                        <View style={[styles.listInfoPriceArea]}>
                          <View style={styles.listInfoPrice}>
                            <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
                          </View>
                        </View>
                        ) : null}

                        {item.is_free == 1 && item.pd_status_org == 1 ? (
                        <View style={[styles.listInfoPriceArea]}>
                          <View style={[styles.listInfoPriceState, styles.listInfoPriceState2]}>
                            <Text style={styles.listInfoPriceStateText}>나눔</Text>
                          </View>
                        </View>
                        ) : null}

                        {item.pd_status_org == 2 ? (
                        <View style={[styles.listInfoPriceArea]}>
                          <View style={[styles.listInfoPriceState, styles.listInfoPriceState1]}>
                            <Text style={styles.listInfoPriceStateText}>예약중</Text>
                          </View>
                          {item.is_free != 1 && item.pd_sell_type != 3 ? (
                          <View style={styles.listInfoPrice}>
                            <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
                          </View>
                          ) : null }
                        </View>
                        ) : null}

                        {item.pd_status_org == 3 ? (
                        <View style={[styles.listInfoPriceArea]}>
                          <View style={[styles.listInfoPriceState, styles.listInfoPriceState3]}>
                            <Text style={styles.listInfoPriceStateText}>판매완료</Text>
                          </View>
                          {item.is_free != 1 && item.pd_sell_type != 3 ? (
                          <View style={styles.listInfoPrice}>
                            <Text style={styles.listInfoPriceText}>{item.pd_price}원</Text>
                          </View>
                          ) : null }
                        </View>
                        ) : null}

                        {item.pd_status_org != 2 && item.pd_status_org != 3 && item.pd_sell_type == 3 ? (
                        <View style={[styles.listInfoPriceArea]}>
                          <View style={[styles.listInfoPriceState, styles.listInfoPriceState4]}>
                            <Text style={styles.listInfoPriceStateText}>입찰상품</Text>
                          </View>
                        </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                  </>
                </TouchableOpacity>
                )
              })
            ) : (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 상품이 없습니다.</Text>
              </View>
            )}
          </View>

          <View style={[styles.borderTop]}>
            <View style={styles.otherItem}>
              <Text style={styles.otherItemText}>매칭 ({total2}개)</Text>
              <TouchableOpacity
                style={styles.moreBtn}
                activeOpacity={opacityVal}              
                onPress={()=>{navigation.navigate('OtherMatch', {idx:otherIdx})}}
              >
                <Text style={styles.moreBtnText}>더보기</Text>
                <AutoHeightImage width={5} source={require("../../assets/img/icon_arrow2.png")} style={styles.moreBtnArr} />
              </TouchableOpacity>
            </View>
            {total2 > 0 ? (
              itemList2.map((item, index) => {
                return(
                <TouchableOpacity 
                  key={index}
                  style={[styles.listLi]}
                  activeOpacity={opacityVal}
                  onPress={() => {navigation.push('MatchView', {idx:item.mc_idx})}}
                >
                  <>
                  <View style={[styles.listLiBorder, index==0 ? styles.listLiBorderNot : null]}>
                    {item.image ? (
                    <View style={styles.pdImage}>
                      <AutoHeightImage width={131} source={{uri: item.image}} style={styles.listImg} />
                    </View>
                    ) : null}
                    <View style={styles.listInfoBox}>
                      <View style={styles.listInfoTitle}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{item.mc_name}</Text>
                      </View>
                      <View style={styles.listInfoDesc}>
                        <Text style={styles.listInfoDescText}>{item.mc_loc} · {item.mc_date}</Text>
                      </View>
                      <View style={styles.listInfoCate}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoCateText}>{item.mc_summary}</Text>
                      </View>
                      <View style={styles.listInfoCnt}>
                        <View style={styles.listInfoCntBox}>
                          <AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
                          <Text style={styles.listInfoCntBoxText}>{item.mb_score}</Text>
                        </View>
                        <View style={styles.listInfoCntBox}>
                          <AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
                          <Text style={styles.listInfoCntBoxText}>{item.mc_chat_cnt}</Text>
                        </View>
                        <View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
                          <AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
                          <Text style={styles.listInfoCntBoxText}>{item.mc_like_cnt}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  </>
                </TouchableOpacity>
                )
              })
            ) : (
              <View style={styles.notData}>
                <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
                <Text style={styles.notDataText}>등록된 매칭이 없습니다.</Text>
              </View>
            )}
          </View> 
          </>
        ):(
          <View style={[styles.indicator]}>
            <ActivityIndicator size="large" />
          </View>
        )}  
      </ScrollView>      

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
                setVisible3(true)
								setVisible(false)                
						}}
						>
              {blockSt==0 ? (
							  <Text style={styles.modalCont2BtnText}>차단하기</Text>
              ) : (
                <Text style={styles.modalCont2BtnText}>차단해제</Text>
              )}
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible2(true)
								setVisible(false)                
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>신고하기</Text>
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
				animationType={"slide"}
				onRequestClose={() => {setVisible2(false)}}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity
						style={styles.headerCloseBtn}
						activeOpacity={opacityVal}
						onPress={() => {setVisible2(false)}} 						
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>신고하기</Text>
					</>
				</View>
				<ScrollView>
          <View	View style={[styles.alertWrap]}>
            <View style={styles.alertBox}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>비매너 메세지 건에 대해서 신고해 주세요.</Text>
            </View>
          </View>

          <View style={styles.radioList}>
            <View style={styles.borderTop2}></View>
            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(1)}}
            >
              <View style={[styles.circle, radio==1 ? styles.circleOn : null]}>              
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>음란성 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(2)}}
            >
              <View style={[styles.circle, radio==2 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>욕설 및 영업 방해 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(3)}}
            >
              <View style={[styles.circle, radio==3 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>개인정보나 저작권 침해 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(4)}}
            >
              <View style={[styles.circle, radio==4 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>허위정보 건 입니다.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioBtn]}
              activeOpacity={opacityVal}
              onPress={()=>{setRadio(5)}}
            >
              <View style={[styles.circle, radio==5 ? styles.circleOn : null]}>
                <AutoHeightImage width={11} source={require("../../assets/img/icon_chk_on.png")} />
              </View>
              <Text style={styles.radioBtnText}>기타 부적절한 내용</Text>
            </TouchableOpacity>
          </View>
				</ScrollView>								
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {fnSingo()}}
					>
						<Text style={styles.nextBtnText}>신고하기</Text>
					</TouchableOpacity>
				</View>						
			</Modal>

      <Modal
        visible={visible3}
				transparent={true}
				onRequestClose={() => {setVisible3(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setVisible3(false)}}
				></Pressable>
				<View style={[styles.modalCont3]}>
          {blockSt==0 ? (
            <>
            <View style={styles.avatarTitle}>
              <Text style={styles.avatarTitleText}>상대방 차단</Text>
            </View>
            <View style={styles.avatarDesc}>
              <Text style={styles.avatarDescText}>상대방을 차단하면 상대방의 글과 채팅 메세지를 보낼 수 없습니다.</Text>
              <Text style={[styles.avatarDescText, styles.avatarDescText2]}>차단하시겠습니까?</Text>
            </View>
            </>
          ):(
            <>
            <View style={styles.avatarTitle}>
              <Text style={styles.avatarTitleText}>차단해제</Text>
            </View>
            <View style={styles.avatarDesc}>
              <Text style={[styles.avatarDescText, styles.avatarDescText2]}>차단해제를 하시겠습니까?</Text>
            </View>
            </>
          )}
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setVisible3(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {fnBlock()}}
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
  borderTop2: {borderTopWidth:1,borderTopColor:'#E3E3E4'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-300, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  otherBox: {padding:20,},
  otherWrap: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',},
  otherBoxLeft: {flexDirection:'row',alignItems:'center',},
  otherProfile: {width:69,height:69,overflow:'hidden',borderRadius:50,display:'flex',alignItems:'center', justifyContent:'center'},
  otherBoxInfo: {paddingLeft:12,},
  otherBoxInfoText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#323232'},
  otherBoxInfoText2: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#353636'},
  otherBoxRight: {},
  otherBoxRightText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#323232'},
  otherBoxRightText2: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#8C8C8C',marginTop:2,},

  myDealResultBox: {width:innerWidth,paddingVertical:11,paddingHorizontal:30,backgroundColor:'#F3FAF8',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,},
	myDealResultBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#323232',},
	myDealResultBoxText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#31B481',},

  otherItem: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20,paddingTop:30,paddingBottom:0,},
  otherItemText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#191919',},
  moreBtn: {flexDirection:'row',alignItems:'center',},
  moreBtnText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#8F9092',},
  moreBtnArr: {position:'relative',top:-1,marginLeft:7},
  listLi: {paddingHorizontal:20,},
	listLiBorder: {flexDirection:'row',paddingVertical:20,borderTopWidth:1,borderTopColor:'#E9EEF6'},
	listLiBorderNot: {borderTopWidth:0,},
  pdImage: {width:131,height:131,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 131),paddingLeft:15,},
	listInfoBox2: {width:(innerWidth - 99)},
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
	listInfoPriceBox: {marginTop:8},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
  listInfoPriceState3: {width:64,backgroundColor:'#353636'},
  listInfoPriceState4: {width:64,backgroundColor:'#31B481'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},

  notData: {paddingVertical:60,display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},

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
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-155)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:10,},
  avatarDescText2: {marginTop:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  typingInputBox: {marginTop:20,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:(innerWidth-130),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
  certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},

  header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
  headerCloseBtn: {width:34,height:50,position:'absolute',right:10,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},

	alertWrap: {padding:20,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},

  radioList: {paddingHorizontal:20,paddingBottom:30,},
  radioBtn: {paddingVertical:20,flexDirection:'row',alignItems:'center'},  
  radioBtnText: {width:(innerWidth-21),fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:21,color:'#000',paddingLeft:15},
  circle: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,alignItems:'center',justifyContent:'center'},
  circleOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
})

export default Other