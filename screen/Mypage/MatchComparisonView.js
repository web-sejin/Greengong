import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNFetchBlob from "rn-fetch-blob";

import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchComparisonView = (props) => {
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;  
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);  
  const [mailIdx, setMailIdx] = useState();
  const [indicatorSt, setIndCatorSt] = useState(false);
  const [mbId, setMbId] = useState();
  const [score, setScore] = useState(3);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

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
      setNowPage(1);
      getItemList();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getItemList = async () => {    
		setIsLoading(false);
		await Api.send('GET', 'list_diff_detail_match', {'is_api': 1, mc_idx:idx, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				//console.log('list_diff_detail_match', responseJson);
        setItemInfo(responseJson);
				setItemList(responseJson.data);
				setTotalPage(responseJson.total_page);
			}else{
        setItemInfo({});
				setItemList([]);
				setNowPage(1);
				console.log('결과 출력 실패!', responseJson);
			}
		});

		setIsLoading(true);
	}
	const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_diff_detail_match', {is_api: 1, mc_idx:idx, page:nowPage+1}, (args)=>{
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
  const getList = ({item, index}) => (
    <View style={[styles.matchCompleteMb]}> 
      <View style={[styles.matchCompleteMbWrap, index==0 ? styles.matchCompleteMbFst : null]}>
        <View style={[styles.compBtn]}>
          <View style={[styles.compWrap, styles.compWrapFst]}>
            <View style={styles.compInfo}>
              <View style={styles.compInfoDate}>
                <Text style={styles.compInfoDateText}>{item.cr_regdate}</Text>
              </View>
              <View style={styles.compInfoName}>
                <Text style={styles.compInfoNameText}>{item.mb_nick}</Text>
              </View>
              <View style={styles.compInfoLoc}>
                <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
                <Text style={styles.compInfoLocText}>{item.mb_loc}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.compThumb}
              activeOpacity={opacityVal}
              onPress={()=>{
                if(item.mb_idx != userInfo?.mb_idx){
                  navigation.navigate('Other', {idx:item.mb_idx});
                }
             }}
            >
              {item.mb_img ? (
                <AutoHeightImage width={79} source={{uri: item.mb_img}} />
              ):(
                <AutoHeightImage width={79} source={require("../../assets/img/not_profile.png")} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.matchPrice}>
            <Text style={styles.matchPriceText}>가격{itemInfo.mc_chat_permit}</Text>
            <Text style={styles.matchPriceText2}>{item.me_total_price}원</Text>
          </View>            
        </View>
      </View>
                  
      {itemInfo.mc_chat_permit == 1 ? (
        <View style={styles.btnBox}>
          {itemInfo.mc_status_org == 2 ? (
            itemInfo.is_order_mb == 0 ? (
              //발주완료, 업체 미선정
              <>
              <TouchableOpacity
                style={[styles.btn, styles.btn2, styles.btn7]}
                activeOpacity={opacityVal}
                onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
              >
                <Text style={styles.btnText}>견적서 보기</Text>
              </TouchableOpacity>
              </>
            ):(
              //발주완료, 업체 선정
              <>
              {item.is_score==1 ? (
              <TouchableOpacity
                style={[styles.btn, styles.btn5, styles.btn6]}
                activeOpacity={1}              
              >
                <Text style={[styles.btnText, styles.btnText2]}>선정됨</Text>
              </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.btn, styles.btn2, styles.btn5, item.is_score==0 ? styles.btn7 : null]}
                activeOpacity={opacityVal}
                onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
              >
                <Text style={styles.btnText}>견적서 보기</Text>
              </TouchableOpacity>
              </>
            )
          ):(
            <>
            <TouchableOpacity
              style={[styles.btn, styles.btn3, styles.btn5]}
              activeOpacity={opacityVal}
              onPress={()=>{
                setMbId(item.mb_idx);
                setVisible2(true);
              }}
            >
              <Text style={styles.btnText}>업체선정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btn2, styles.btn5]}
              activeOpacity={opacityVal}
              onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
            >
              <Text style={styles.btnText}>견적서 보기</Text>
            </TouchableOpacity>
            </>
          )}          
        </View>
      ): null}

      {itemInfo.mc_chat_permit == 2 ? (
        <View style={styles.btnBox}>
          {itemInfo.mc_status_org == 2 ? (            
            itemInfo.is_order_mb == 0 ? (
              //발주완료, 업체 미선정
              <>
              <TouchableOpacity
                style={[styles.btn, styles.btn7]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setVisible(true);
                  setMailIdx(item.md_idx);
                  setFileUrl(item.md_file);
                  setFileName(item.md_file_org);
                }}
              >
                <Text style={styles.btnText}>회사소개서</Text>
              </TouchableOpacity>
              </>
            ):(
              //발주완료, 업체 선정
              <>
              {item.is_score==1 ? (
              <TouchableOpacity
                style={[styles.btn, styles.btn5, styles.btn6]}
                activeOpacity={1}              
              >
                <Text style={[styles.btnText, styles.btnText2]}>선정됨</Text>
              </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.btn, styles.btn5, item.is_score==0 ? styles.btn7 : null]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setVisible(true);
                  setMailIdx(item.md_idx);
                  setFileUrl(item.md_file);
                  setFileName(item.md_file_org);
                }}
              >
                <Text style={styles.btnText}>회사소개서</Text>
              </TouchableOpacity>
              </>
            )            
          ):(
            <>
            <TouchableOpacity
              style={[styles.btn, styles.btn3, styles.btn5]}
              activeOpacity={opacityVal}
              onPress={()=>{
                setMbId(item.mb_idx);
                setVisible2(true);
              }}
            >
              <Text style={styles.btnText}>업체선정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btn5]}
              activeOpacity={opacityVal}
              onPress={()=>{
                setVisible(true);
                setMailIdx(item.md_idx);
                setFileUrl(item.md_file);
                setFileName(item.md_file_org);
              }}
            >
              <Text style={styles.btnText}>회사소개서</Text>
            </TouchableOpacity>
            </>
          )}          
        </View>
      ): null}

      {itemInfo.mc_chat_permit == 3 ? (
        <View style={styles.btnBox}>
          {itemInfo.mc_status_org == 2 ? (
            itemInfo.is_order_mb == 0 ? (
              //발주완료, 업체 미선정
              <>
              <TouchableOpacity
                style={[styles.btn, styles.btn5]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setVisible(true);
                  setMailIdx(item.md_idx);
                  setFileUrl(item.md_file);
                  setFileName(item.md_file_org);
                }}
              >
                <Text style={styles.btnText}>회사소개서</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btn2, styles.btn5]}
                activeOpacity={opacityVal}
                onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
              >
                <Text style={styles.btnText}>견적서 보기</Text>
              </TouchableOpacity>
              </>
            ) : (
              //발주완료, 업체 선정
              <>
              {item.is_score==1 ? (
              <TouchableOpacity
                style={[styles.btn, styles.btn3, styles.btn6]}
                activeOpacity={1}              
              >
                <Text style={[styles.btnText, styles.btnText2]}>선정됨</Text>
              </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.btn, item.is_score==0 ? styles.btn5 : null]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setVisible(true);
                  setMailIdx(item.md_idx);
                  setFileUrl(item.md_file);
                  setFileName(item.md_file_org);
                }}
              >            
                <Text style={styles.btnText}>회사소개서</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btn2, item.is_score==0 ? styles.btn5 : null]}
                activeOpacity={opacityVal}
                onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
              >
                <Text style={styles.btnText}>견적서 보기</Text>
              </TouchableOpacity>
              </>
            )
          ) : (
            //견적진행중
            <>
            <TouchableOpacity
              style={[styles.btn, styles.btn3, styles.btn6]}
              activeOpacity={opacityVal}
              onPress={()=>{
                setMbId(item.mb_idx);
                setVisible2(true);
              }}       
            >
              <Text style={[styles.btnText, styles.btnText2]}>업체선정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn]}
              activeOpacity={opacityVal}
              onPress={()=>{
                setVisible(true);
                setMailIdx(item.md_idx);
                setFileUrl(item.md_file);
                setFileName(item.md_file_org);                
              }}
            >            
              <Text style={styles.btnText}>회사소개서</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btn2]}
              activeOpacity={opacityVal}
              onPress={()=>{navigation.navigate('EstimateResult', {idx:item.me_idx})}}
            >
              <Text style={styles.btnText}>견적서 보기</Text>
            </TouchableOpacity>
            </>
          )}
        </View>
      ): null}    
    </View>
	);

  function fnSendEmail(){
    setVisible(false);
    setIndCatorSt(true);

    const formData = {
			is_api:1,				
			md_idx:mailIdx,
		};

    Api.send('POST', 'down_doc', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);
        fileDown({url:fileUrl, name:fileName});
        setIndCatorSt(false);
        ToastMessage('회사소개서가 메일로 전송되었습니다.');        
			}else{
				console.log('메일 결과 출력 실패!!!', responseJson);
        setIndCatorSt(false);
				ToastMessage(responseJson.result_text);
			}
		});
  }

  function submitEndProduct(v){
    const formData = {
			is_api:1,				
			mc_idx:idx
		}; 

    if(v == 2){
      formData.recv_idx = mbId;
    }else if(v == 3){
      formData.recv_idx = mbId;
      formData.so_score = score;
    }

    Api.send('POST', 'save_end_match', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				console.log('성공 : ',responseJson);
        setVisible2(false);
        setNowPage(1);
        getItemList();
        setMbId();
        setScore(3);
        setAsync();
			}else{
				console.log('결과 출력 실패!', resultItem);
				//ToastMessage(responseJson.result_text);
			}
		});
  }

  const setAsync = async () => {
		try {
			await AsyncStorage.setItem(
				'matchCompReload',
				'on',
			);
		} catch (error) {
			// Error saving data
		}
	}

  const fileDown = async (file: File) => {
    await RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${file.name}`,
      },
    }).fetch('GET', file.url);
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>      
			<Header navigation={navigation} headertitle={'발주업체 비교내역'} />
      {isLoading ? (
        <>
        <View style={styles.borderBot}>
          <View style={[styles.listLi]}>
            <View style={styles.pdImage}>
              {itemInfo.mc_image ? (
                <AutoHeightImage width={68} source={{uri: itemInfo.mc_image}} style={styles.listImg} />
              ) : null}
            </View>
            <View style={styles.listInfoBox}>
              <View style={styles.listInfoCate}>
                <Text style={styles.listInfoCateText}>{'['}{itemInfo.c1_name}{']'}</Text>
              </View>
              <View style={styles.listInfoTitle}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.listInfoTitleText}>{itemInfo.mc_name}</Text>
              </View>
              <View style={styles.listInfoDesc}>
                <Text style={styles.listInfoDescText}>{itemInfo.mc_summary}</Text>
              </View>
              <View style={[styles.listInfoState, itemInfo.mc_status_org==1 ? null : styles.listInfoState2]}>
                <Text style={[styles.listInfoStateText]}>
                  {itemInfo.mc_status}
                </Text>
              </View>
            </View>          
          </View>
        </View>
        <FlatList
          data={itemList}
          renderItem={(getList)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.6}
          onEndReached={moreData}
          ListHeaderComponent={
            <>          
            <View style={styles.borderTop}></View>
            <View style={[styles.salesAlert]}>
              <View style={styles.alertBox}>
                <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
                <Text style={styles.alertBoxText}>업체를 확인해서 업체를 선택해 주세요.</Text>
              </View>
            </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.notData}>
              <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
              <Text style={styles.notDataText}>발주업체가 없습니다.</Text>
            </View>
          }
        />
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
        <View style={styles.modalCont3}>
          <View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>회사소개서 받기</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>회사소개서를 받으시겠습니까?</Text>
            <Text style={styles.avatarDescText}>회원님의 메일로 발송이 됩니다.</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {
                setVisible(false);
                setMailIdx();
                setFileUrl('');
                setFileName('');
              }}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {fnSendEmail()}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
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
              style={styles.avatarBtn}
              onPress={() => {submitEndProduct(2)}}
            >
              <Text style={styles.avatarBtnText}>평가 하지 않고 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {submitEndProduct(3)}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>

      {indicatorSt ? (
      <View style={[styles.indicator, styles.indicator2]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
      ):null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},  
  listLi: {display:'flex',flexDirection:'row',alignItems:'center',padding:20,},
	listLiBorder: {borderTopWidth:1,borderTopColor:'#E9EEF6'},
  pdImage: {width:68,height:68,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 68),paddingLeft:15,paddingRight:80,position:'relative'},
  listInfoCate: {},
  listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#000'},
	listInfoTitle: {marginTop:3},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:2},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},		
  listInfoState: {alignItems:'center',justifyContent:'center',position:'absolute',top:-5,right:0,width:64,height:24,backgroundColor:'#797979',borderRadius:12,},
  listInfoState2: {backgroundColor:'#31B481'},
  listInfoStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:14,color:'#fff',},
  listInfoStateText2: {},
  salesAlert: {paddingHorizontal:20,paddingTop:15,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	notData: {display:'flex',alignItems:'center',paddingTop:90,},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
  matchCompleteMb: {paddingHorizontal:20,},
  matchCompleteMbWrap: {paddingVertical:30,paddingBottom:0,borderTopWidth:1,borderColor:'#E9EEF6',},
  matchCompleteMbFst: {borderTopWidth:0,},
  compBtn: {},
  compWrap: {display:'flex',flexDirection:'row',justifyContent:'space-between',position:'relative'},
  compRadio: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,position:'absolute',top:0,left:0,display:'flex',alignItems:'center',justifyContent:'center'},
  comRadioChk: {backgroundColor:'#31B481',borderColor:'#31B481',},
  compInfo: {width:(innerWidth-99)},
  compInfoDate: {},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {marginVertical:8},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',marginLeft:5,},
  compThumb: {width:79,height:79,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},  
  matchPrice: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',backgroundColor:'#F3FAF8',borderRadius:12,paddingVertical:10,paddingHorizontal:15,marginTop:15,},
  matchPriceText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#353636'} ,
  matchPriceText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#31B481'},
  btnBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',marginTop:10,paddingBottom:30,},
  btn: {width:((innerWidth/3)-7),height:58,backgroundColor:'#353636',borderRadius:12,display:'flex',alignItems:"center",justifyContent:'center'},
  btn2: {backgroundColor:'#31B481',},
  btn3: {backgroundColor:'#C5C5C6',},
  btn4: {backgroundColor:'#fff',borderWidth:1,borderColor:'#31B481'},
  btn5: {width:((innerWidth/2)-5)},
  btn6: {backgroundColor:'#fff',borderWidth:1,borderColor:'#31B481',color:'#31B481'},
  btn7: {width:innerWidth},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:20,color:'#fff'},
  btnText2: {color:'#31B481'},
  indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
  indicator2: {backgroundColor:'rgba(0,0,0,0.5)'},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},	
  modalCont2: {top:((widnowHeight/2)-166)},
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  starBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'center',marginTop:20},
  star: {marginHorizontal:4,},
  matchPrice: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',backgroundColor:'#F3FAF8',borderRadius:12,paddingVertical:10,paddingHorizontal:15,marginTop:15,},
  matchPriceText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#353636'} ,
  matchPriceText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#31B481'},
})

//export default MatchComparisonView
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
		member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
		member_out: (user) => dispatch(UserAction.member_out(user)), //회원탈퇴
	})
)(MatchComparisonView);