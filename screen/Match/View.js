import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Swiper from 'react-native-swiper'
import DocumentPicker from 'react-native-document-picker'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/HeaderView';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchView = (props) => {
  const scrollRef = useRef();
  const DATA = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: '거의 사용하지 않은 스크랩 거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: '스크랩',
      naviPage: 'UsedWrite1',
      stateVal: '',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: '중고자재',
      naviPage: 'UsedWrite2',
      stateVal: '나눔',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: '중고기계/장비',
      naviPage: 'UsedWrite3',
      stateVal: '입찰',
		},
		{
			id: '68694a0f-3da1-471f-bd96-145571e29d72',
			title: '거의 사용하지 않은 스크랩',
			desc: '김포시 고촌읍 · 3일전',
			cate: '스크랩 / 고철 / 중량 / 금형 / 드럼',
			score: 2,
			review: 8,
			like: 5,
			price: '20,000',
			category: '폐기물',
      naviPage: 'UsedWrite4',
      stateVal: '',
		},
	];

  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [indicatorSt, setIndCatorSt] = useState(false);
  const [zzim, setZzim] = useState(0);
  const [like, setLike] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [state, setState] = useState('');
  const [floorFile, setFloorFile] = useState(''); //도면 파일
	const [floorFileType, setFloorFileType] = useState(''); //도면 파일
	const [floorFileUri, setFloorFileUri] = useState(''); //도면 파일
  const [toastModal, setToastModal] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [swp, setSwp] = useState({});
  const [latest, setLatest] = useState({});
  const [myInfo, setMyInfo] = useState({});
  const [prdMbIdx, setPrdMbIdx] = useState();
  const [radio, setRadio] = useState(1);
  const [radioList, setRadioList] = useState([]);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setIndCatorSt(false);
				setVisible(false);
        setVisible2(false);
        setVisible3(false);
        setState('');
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
      getData();
      getMyData();
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'view_match', {'is_api': 1, mc_idx:idx, page_name:'view'}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("view_match : ",responseJson);
				// setItemInfo(responseJson);
        // setSwp(responseJson.pf_data);
        // setLatest(responseJson.mb_latest);
        // setZzim(responseJson.is_scrap);
        // setPrdMbIdx(responseJson.pd_mb_idx);

        // if(responseJson.is_product_like == 1){
        //   setLike(1);
        // }else{
        //   setLike(0);
        // }

        setIsLoading(true);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!', responseJson);
			}
		});
  }

  const getMyData = async () => {
    await Api.send('GET', 'get_member_info', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_member_info : ",responseJson);
        setMyInfo(responseJson);
			}else{
				ToastMessage(responseJson.result_text);
			}
		});  
  }

  function notBuy(){
    ToastMessage('판매완료된 상품은 가격협상이 불가합니다.');
  }

  const ModalOn = () => {
    setVisible(true);
  }

  function fnSendEmail(){
    setVisible2(false);
    setIndCatorSt(true);
    setTimeout(function(){
      setIndCatorSt(false);
      ToastMessage('도면이 메일로 전송되었습니다.');
    }, 3000)
  }

  const openPicker = async () => {
		console.log(DocumentPicker.types)
		try {
			const res = await DocumentPicker.pick({
				type: [
          DocumentPicker.types.pdf, 
          DocumentPicker.types.zip, 
          DocumentPicker.types.ppt, 
          DocumentPicker.types.pptx
        ],
			})
      console.log(res);
			setFloorFile(res[0].name);
			setFloorFileType(res[0].type);
			setFloorFileUri(res[0].uri);

			// console.log(
			// 	res.uri,
			// 	res.type, // mime type
			// 	res.name,
			// 	res.size
			// )
			// console.tron.debug('URI')
			// console.tron.debug(res)
			const name = decodeURIComponent(res.uri)
	
			if (name.startsWith(CONTENT_PREFIXES.RESILLIO_SYNC)) {
				const realPath = name.replace(CONTENT_PREFIXES.RESILLIO_SYNC, '')
				const content = await RNFetchBlob.fs.readFile(realPath, 'utf8')
				const stat = await RNFetchBlob.fs.stat(realPath, 'utf8')
				// console.tron.debug(stat)
				// console.tron.debug(content)
				await RNFetchBlob.fs.writeFile(realPath, content + '1')
			}
			return
		} catch (err) {}
	}

  function fnFileUpload(){

  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header 
        navigation={navigation} 
        headertitle={'title'} 
        ModalEvent={ModalOn} 
      />
			<ScrollView ref={scrollRef}>
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
          <View style={styles.swiperSlider}>
            {/* <AutoHeightImage width={79} source={{uri: item.path}} /> */}
            <AutoHeightImage width={widnowWidth} source={require("../../assets/img/view_img.jpg")} />
          </View>
          <View style={styles.swiperSlider}>            
            <AutoHeightImage width={widnowWidth} source={require("../../assets/img/view_img.jpg")} />
          </View>
          <View style={styles.swiperSlider}>            
            <AutoHeightImage width={widnowWidth} source={require("../../assets/img/view_img.jpg")} />
          </View>
        </Swiper>
        <View style={[styles.viewBox1]}>
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
                <Text style={styles.profileNameText}>홍길동</Text>
              </View>
              <View style={styles.profileLocal}>
                <AutoHeightImage width={10} source={require("../../assets/img/icon_local2.png")} />
                <Text style={styles.profileLocalText}>중동</Text>
              </View>
              <View style={styles.profileResult}>
                <Text style={styles.profileResultText}>거래평가 : 4</Text>
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
              <Text style={[styles.profileZzimText, zzim==1 ? styles.profileZzimTextOn : null]}>관심요청자</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewSubjectBox}>
            <View style={styles.viewSubject}>
              <View style={styles.viewState}>                
                {state == '' || state == 1 ? (
                <Text style={styles.viewStateText}>견적요청중</Text>
                ) : null}

                {state == 2 ? (
                <Text style={styles.viewStateText}>발주완료</Text>
                ) : null}
              </View>
              <View style={styles.viewSubjectPart}>
                <Text style={styles.viewSubjectText}>
                스크랩 싸게 급매로 팝니다. 이 재료로 우주선 만들 수 있습니다.
                </Text>
              </View>
            </View>
            <View style={styles.viewOpt}>
              <View style={styles.viewOptLabel}>
                <Text style={styles.viewOptLabelText}>3일 전 등록</Text>
              </View>
            </View>
          </View>
          <View style={styles.viewSumm}>
            <Text  style={styles.viewSummText}>
              밀링 / 플라스틱 / ABS / 도면 업로드 유 / 모든 파트너 도면 다운로드 가능 / 견적서를 제출한 경우에만 상담 가능
            </Text>
          </View>
          <View style={styles.viewContent}>
            <Text  style={styles.viewContentText}>
              파이프 제작 공장입니다.
              304파이프 202계 파이프 제작합니다.
              길이는 4m 안쪽이고 1T에 100파이입니다.
              304랑 200계 섞여있습니다.
              사진 보시고 연락주세요.
            </Text>
          </View>
          <View style={styles.viewSubInfoBox}>
            <View style={styles.viewSubInfo}>
              <Text style={styles.viewSubInfoText}>채팅 : 10</Text>
            </View>
            <View style={styles.viewSubInfoLine}></View>
            <View style={styles.viewSubInfo}>
              <Text style={styles.viewSubInfoText}>찜 : 5</Text>
            </View>
            <View style={styles.viewSubInfoLine}></View>
            <View style={styles.viewSubInfo}>
              <Text style={styles.viewSubInfoText}>조회 : 100</Text>
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
      </ScrollView>
      <View style={[styles.nextFix]}>
        <View style={styles.nextFixFlex}>
          <TouchableOpacity 
            style={[styles.nextBtn]}
            activeOpacity={opacityVal}
            onPress={() => {
              navigation.navigate('DownUsed', {}); //도면 다운로드 허용
              //setVisible2(true); //도면받기
            }}
          >
            <Text style={styles.nextBtnText}>도면 권한 요청 확인</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.nextBtn, styles.nextBtn2]}
            activeOpacity={opacityVal}
            onPress={() => {
              //navigation.navigate('MachChat', {}); //매칭 채팅리스트
              //setVisible3(true); //회사소개서 업로드 팝업
              navigation.navigate('Estimate', {}); //견적서 업로드 페이지
            }}
          >
            <Text style={styles.nextBtnText}>채팅하기</Text>
          </TouchableOpacity>
        </View>
			</View>

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
								navigation.navigate('MatchWrite', {});
						}}
						>
							<Text style={styles.modalCont2BtnText}>수정하기</Text>
						</TouchableOpacity>

            <TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
                setState(1);
								setVisible(false)
						}}
						>
							<Text style={styles.modalCont2BtnText}>견적요청중</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
                setVisible(false);
								navigation.navigate('MatchCompelte', {});
							}}
						>
							<Text style={styles.modalCont2BtnText}>발주완료</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
                setState(2);
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
            <Text style={styles.avatarTitleText}>도면받기</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>도면을 받아서 검토후 견적서를 발송하시겠습니까?</Text>
            <Text style={styles.avatarDescText}>도면은 회원님의 메일로 발송이 됩니다.</Text>
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
              onPress={() => {fnSendEmail();}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
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
				<View style={[styles.modalCont3, styles.modalCont4]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>회사소개서 업로드</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>회사소개서를 업로드하시면 채팅이 가능합니다.</Text>
            <Text style={styles.avatarDescText}>PDF, PPT, ZIP 파일을 업로드하여 주세요.</Text>
          </View>
          <View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={floorFile}
									editable = {false}
									placeholder={'파일을 업로드해 주세요.'}
									placeholderTextColor="#8791A1"
									style={[styles.input, styles.input2]}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={openPicker}
								>
									<Text style={styles.certChkBtnText}>업로드</Text>
								</TouchableOpacity>
							</View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setVisible3(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {fnFileUpload();}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>
      
      {indicatorSt ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
      ) : null}
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
	nextBtn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',
  justifyContent:'center',},
  nextBtn2: {backgroundColor:'#353636',},
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
  profileZzimOn: {backgroundColor:'#F58C40'},
  profileZzimText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#bbb'},
  profileZzimTextOn: {color:'#fff'},
  viewSubjectBox: {paddingVertical:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  viewSubject: {},
  viewState: {},
  viewStateText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#F58C40',},
  viewSubjectPart: {marginTop:10},
  viewSubjectText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#000',},
  viewOpt: {marginTop:5,display:'flex',flexDirection:'row',flexWrap:'wrap',},
  viewOptLabel: {height:24,paddingHorizontal:10,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,marginTop:10,marginRight:10,display:'flex',alignItems:'center',justifyContent:'center'},
  viewOptLabel2: {marginRight:0,},
  viewOptLabelText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#353636'},
  viewSumm: {paddingTop:15,paddingBottom:13,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  viewSummText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#000'},
  viewContent: {paddingTop:20,paddingBottom:15,},
  viewContentText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#000'},
  viewSubInfoBox: {display:'flex',flexDirection:'row',alignItems:'center',paddingBottom:20,position:'relative'},
  viewSubInfoLine: {width:1,height:10,backgroundColor:'#ADADAD',marginHorizontal:8,},
  viewSubInfo: {},
  viewSubInfoText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#6A6A6A'},  
  likeBtn: {position:'absolute',right:0,top:0,},
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
  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
  modalCont4: {top:((widnowHeight/2)-160)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  typingInputBox: {marginTop:20,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:(innerWidth-130),height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
  certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
  indicator: {width:widnowWidth,height:widnowHeight, display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,zIndex:10,backgroundColor:'rgba(0,0,0,0.5)'},
})

export default MatchView