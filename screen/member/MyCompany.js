import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Geolocation from 'react-native-geolocation-service';
import Postcode from '@actbase/react-daum-postcode';
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import {Avatar} from '../../components/Avatar';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import PushChk from "../../components/Push";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MyCompany = (props) => {
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	//console.log("userInfo : ",userInfo);
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modal3, setModal3] = useState(false); //내 공장1 정보 등록
	const [modal4, setModal4] = useState(false); //카메라,갤러리 선택
	const [modal5, setModal5] = useState(false); //내 공장1 선택,등록,수정,삭제
	const [modal6, setModal6] = useState(false); //내 공장2 정보 등록
	const [modal7, setModal7] = useState(false); //내 공장2 선택,등록,수정,삭제
	const [toastModal, setToastModal] = useState(false);
	const [toastText, setToastText] = useState('');
  const [mbcompanyNumber, setMbCompanyNumber] = useState('');
	const [mbcompanyName, setMbCompanyName] = useState('');
	const [mbName, setMbName] = useState('');
	const [mbCompanyAddr, setMbCompanyAddr] = useState('');	
  const [picture, setPickture] = useState('');	
  const [state, setState] = useState(0);
  const [fcIdx1, setFcIdx1] = useState('');
	const [factName1, setFactName1] = useState('');
	const [factCode1, setFactCode1] = useState('');
	const [factAddr1, setFactAddr1] = useState('');
	const [factAddrDt1, setFactAddrDt1] = useState('');
	const [fcIdx2, setFcIdx2] = useState('');
	const [factName2, setFactName2] = useState('');
	const [factCode2, setFactCode2] = useState('');
	const [factAddr2, setFactAddr2] = useState('');
	const [factAddrDt2, setFactAddrDt2] = useState('');
	const [location, setLocation] = useState('');
	const [location2, setLocation2] = useState('');
	const [postcodeOn, setPostcodeOn] = useState(false);
	const [postcodeOn2, setPostcodeOn2] = useState(false);
	const [factActive, setFactActive] = useState();
	const [my1, setMy1] = useState(false);
	const [my2, setMy2] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [bcState, setBcState] = useState();
	const [bcStateComment, setBcStateComment] = useState('');
	const [isCert, setIsCert] = useState();

  const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){			
        setVisible(false);
        setModal3(false);
				setModal4(false);
				setModal5(false);
				setModal6(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
			getData();
			//getData2();
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'insert_fac', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				console.log("insert_fac : ",responseJson);
				if(responseJson.cert.bc_no){
					setState(1);
				}
				setMbCompanyNumber(responseJson.cert.bc_no);
				setMbCompanyName(responseJson.cert.bc_com_name);
				setMbName(responseJson.cert.bc_name);
				setMbCompanyAddr(responseJson.cert.bc_local);
				setPickture(responseJson.cert.bc_img);
				setBcState(responseJson.cert.bc_status_org);
				setIsCert(responseJson.is_cert);
				if(responseJson.cert.bc_status_org == 3){
					setBcStateComment(responseJson.cert.bc_comment);
				}else{
					setBcStateComment('');
				}

				if(responseJson.fac_data[0]){
					setMy1(true);
					setFcIdx1(responseJson.fac_data[0].fc_idx);
					setFactName1(responseJson.fac_data[0].fc_name);
					setFactCode1((responseJson.fac_data[0].fc_zip).toString());
					setFactAddr1(responseJson.fac_data[0].fc_addr1);
					setFactAddrDt1(responseJson.fac_data[0].fc_addr2);
					if(responseJson.fac_data[0].fc_use == 1){
						setFactActive('1');
					}
				}	
				
				if(responseJson.fac_data[1]){
					setMy2(true);
					setFcIdx2(responseJson.fac_data[1].fc_idx);
					setFactName2(responseJson.fac_data[1].fc_name);
					setFactCode2((responseJson.fac_data[1].fc_zip).toString());
					setFactAddr2(responseJson.fac_data[1].fc_addr1);
					setFactAddrDt2(responseJson.fac_data[1].fc_addr2);
					if(responseJson.fac_data[1].fc_use == 1){
						setFactActive('2');
					}
				}
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!', responseJson);
			}
		});
		setIsLoading(true);
  }

	const getData2 = async () => {
    await Api.send('GET', 'get_member_info', {is_api: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', responseJson);
			if(responseJson.result === 'success' && responseJson){
				//console.log("get_member_info : ",responseJson);
			}else{
				//setItemList([]);				
				console.log('결과 출력 실패!');
			}
		});
  }

  const onAvatarChange = (image: ImageOrVideo) => {
    console.log(image);
		setModal4(false);
		setPickture(image.path);
    // upload image to server here 
  };

  function findMyPosition(v){
		Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
				if(v == "1"){
					setLocation({
						latitude,
						longitude,
					});
				}else{
					setLocation2({
						latitude,
						longitude,
					});
				}
				findMyAddr(latitude, longitude, v);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
	}

	function findMyAddr(lat, lng, v){		
		Api.send('GET', '	gps_to_addr', {lat:lat, lng:lng, is_api:1}, (args)=>{
			let resultItem = args.resultItem;
			let arrItems = args.arrItems;
			let responseJson = args.responseJson;
			console.log(args);
			if(resultItem.result === 'Y' && responseJson){
					//console.log('출력확인..', responseJson);
					if(v == "1"){
						setPostcodeOn(false);
						setFactCode1((responseJson.si_idx).toString());
						setFactAddr1(responseJson.sido+" "+responseJson.sigungu+" "+responseJson.dong);
						setFactAddrDt1('');
					}else{
						setPostcodeOn2(false);
						setFactCode2((responseJson.si_idx).toString());
						setFactAddr2(responseJson.sido+" "+responseJson.sigungu+" "+responseJson.dong);
						setFactAddrDt2('');
					}

			}else if(responseJson.result === 'error'){
					ToastMessage(responseJson.result_text);
			}else{
					console.log('결과 출력 실패!', resultItem);
					//ToastMessage(resultItem.message);
			}
		});
	}

	function chkFactoryInfo(v){
		if(v == "1"){
			if(factName1 == ''){
				setToastText('공장명을 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factCode1 == ''){
				setToastText('우편번호를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddr1 == ''){
				setToastText('주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddrDt1 == ''){
				setToastText('상세주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}			

			if(!factActive){
				setFactActive('1');
			}

			setPostcodeOn(false)
			setModal3(false)
			setModal5(false)
			setMy1(true)

		}else if(v == "2"){			
			if(factName2 == ''){
				setToastText('공장명을 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factCode2 == ''){
				setToastText('우편번호를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddr2 == ''){
				setToastText('주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddrDt2 == ''){
				setToastText('상세주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			setPostcodeOn2(false)
			setModal6(false)
			setModal7(false)
			setMy2(true)
		}

		setModal3(false);
	}

	function resetCompany(){
		setState(0);
		setMbCompanyNumber('');
		setMbCompanyName('');
		setMbName('');
		setMbCompanyAddr('');
		setPickture();	
	}

	function submitRegist(){
		if(!my1){
			ToastMessage('내 공장1을 등록해 주세요.');
			return false;
		}

		if(state){			
			if(!mbcompanyNumber || mbcompanyNumber == ''){
				ToastMessage('사업자 번호 10자리를 입력해 주세요.');
				return false;
			}
			
			if(mbcompanyNumber.length != 10){
				ToastMessage('사업자 번호 10자리를 입력해 주세요.');
				return false;
			}

			if(!mbcompanyName || mbcompanyName == ''){
				ToastMessage('상호(법인명)를 입력해 주세요.');
				return false;
			}

			if(!mbName || mbName == ''){
				ToastMessage('성명을 입력해 주세요.');
				return false;
			}

			if(!mbCompanyAddr || mbCompanyAddr == ''){
				ToastMessage('사업장 소재지를 입력해 주세요.');
				return false;
			}
			console.log('picture : ',picture);
			if(!picture || picture == undefined || picture == ''){
				ToastMessage('사업자등록증 사진을 입력해 주세요.');
				return false;
			}
		}

		Keyboard.dismiss();

		let fac_use = 0;
		let fac_use2 = 0;
		if(factActive == "1"){
			fac_use = 1;
			fac_use2 = 0;
		}else if(factActive == "2"){
			fac_use = 0;
			fac_use2 = 1;
		}

		let formData = {
			is_api:1,
			os:Platform.OS,
			fac1_idx:fcIdx1,
			fac1_name:factName1, 
			fac1_zip:factCode1, 
			fac1_addr1:factAddr1, 
			fac1_addr2:factAddrDt1, 
			fac2_name:factName2, 
			fac2_idx:fcIdx2,
			fac2_zip:factCode2, 
			fac2_addr1:factAddr2, 
			fac2_addr2:factAddrDt2, 
			fac1_use:fac_use, 
			fac2_use:fac_use2, 
			is_cert:state
		};
		
		if(state){
			formData.bc_no= mbcompanyNumber;
			formData.bc_com_name= mbcompanyName;
			formData.bc_name= mbName;
			formData.bc_local= mbCompanyAddr;
			formData.bc_img= { 'uri': picture, 'type': 'image/png', 'name': 'bc.png'}
		}

		//console.log('formData : ',formData);

		Api.send('POST', 'modify_fac', formData, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;

			if(responseJson.result === 'success'){
				//console.log('성공 : ',responseJson);				
				ToastMessage('수정이 완료되었습니다.');
				getData();
			}else{
				console.log('결과 출력 실패!', resultItem);
				ToastMessage(responseJson.result_text);
			}
		});
	}	

	const delBsLicense = async () => {
		// Api.send('POST', 'del_cert', {is_api:1}, (args)=>{
		// 	let resultItem = args.resultItem;
		// 	let responseJson = args.responseJson;

		// 	if(responseJson.result === 'success'){
		// 		console.log('성공 : ',responseJson);								
		// 		setPickture('');
		// 	}else{
		// 		console.log('결과 출력 실패!', resultItem);
		// 		ToastMessage(responseJson.result_text);
		// 	}
		// });
		setPickture('');
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>			
			<Header navigation={navigation} headertitle={'공장 및 인증 정보 설정'} />
			<KeyboardAwareScrollView>
        <View style={styles.registArea}>
          <View style={[styles.registBox, styles.registBox3]}>
            <View style={styles.alertBox}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>내 공장은 최대 2개 등록 가능합니다.</Text>
              <Text style={[styles.alertBoxText, styles.alertBoxText2]}>최소 1개 등록 해야 하며, 가입 후 변경 가능합니다.</Text>
            </View>

            <View style={[styles.typingBox, styles.mgTop30]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>선택된 공장</Text>
              </View>

              {my1 ? (
              <TouchableOpacity 
                style={[styles.typingInputBox, styles.typingFactory, factActive=='1' ? styles.typingFactoryOn : null]}
                activeOpacity={opacityVal}
                onPress={()=>{setModal5(true)}}
              >
                <Text style={[styles.myFactoryText, styles.myFactoryText2, factActive=='1' ? styles.myFactoryTextOn : null]}>
                  {factName1}
                </Text>
                <AutoHeightImage width={3} source={require("../../assets/img/icon_dot.png")} style={styles.myFactoryArr} />
              </TouchableOpacity>
              ) : (
              <TouchableOpacity 
                style={[styles.typingInputBox, styles.typingFactory]}
                activeOpacity={opacityVal}
                onPress={()=>{setModal3(true)}}
              >
                <Text style={styles.myFactoryText}>
                  내 공장1 등록하기
                </Text>
                <AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} style={styles.myFactoryArr} />
              </TouchableOpacity>
              )}

              {my2 ? (
              <TouchableOpacity 
                style={[styles.typingInputBox, styles.typingFactory, factActive=='2' ? styles.typingFactoryOn : null]}
                activeOpacity={opacityVal}
                onPress={()=>{setModal7(true)}}
              >
                <Text style={[styles.myFactoryText, styles.myFactoryText2, factActive=='2' ? styles.myFactoryTextOn : null]}>
                  {factName2}
                </Text>
                <AutoHeightImage width={3} source={require("../../assets/img/icon_dot.png")} style={styles.myFactoryArr} />
              </TouchableOpacity>
              ) : (
              <TouchableOpacity 
                style={[styles.typingInputBox, styles.typingFactory]}
                activeOpacity={opacityVal}
                onPress={()=>{setModal6(true)}}
              >
                <Text style={styles.myFactoryText}>
                내 공장2 등록하기
                </Text>
                <AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} style={styles.myFactoryArr} />
              </TouchableOpacity>
              )}
            </View>

            <View style={[styles.alertBox, styles.mgTop35]}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              
              {/* 공장및인증정보설정,미등록 */}
							{isCert==0 ? (
              <Text style={styles.alertBoxText}>사업자등록증을 등록하여 인증된 회원들과 거래를 시작해 보세요.</Text>
							) : null }

							{/* 사업자등록증 관리자인증중 */}
							{bcState==1 ? (
              <Text style={styles.alertBoxText}>사업자등록증 인증중입니다.</Text>
							) : null }
              
              {/* 사업자등록번호 정상 등록되어 있을 때 */}
							{bcState==2 ? (
              <Text style={styles.alertBoxText}>사업자등록증을 등록하여 인증된 회원들과 거래를 시작해 보세요.</Text>
							) : null }              

              {/* 사업자등록증 반려 */}
							{bcState==3 ? (
              <Text style={styles.alertBoxText}>사업자등록증이 반려되었습니다.</Text>
							) : null } 
            </View>

						{bcState==3 ? (
            <View style={styles.inputAlert}>
              <AutoHeightImage width={14} source={require("../../assets/img/icon_alert3.png")} />
              <Text style={styles.inputAlertText}>사유 : {bcStateComment}</Text>
            </View>
						) : null}

            {!state ? (
            <TouchableOpacity
              style={styles.addBtn}
              activeOpacity={opacityVal}
              onPress={() => {setState(true)}}
            >
              <AutoHeightImage width={13} source={require("../../assets/img/icon_plus.png")} style={styles.icon_add} />
              <Text style={styles.addBtnText}>등록</Text>
            </TouchableOpacity>
            ) : null}
          </View>
          {state ? (
          <View style={[styles.registBox, styles.registBox2]}>
            <View style={[styles.typingBox]}>
              <View style={[styles.typingTitle, styles.typingTitleFlex]}>
                <Text style={styles.typingTitleText}>사업자 번호</Text>
                <TouchableOpacity 
                  style={styles.resetBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {resetCompany()}}
                >
                  <AutoHeightImage width={13} source={require("../../assets/img/icon_reset.png")} style={styles.icon_reset} />
                  <Text style={styles.resetBtnText}>초기화</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.typingInputBox]}>
                <TextInput
									keyboardType = 'numeric'
                  value={mbcompanyNumber}
                  onChangeText={(v) => {setMbCompanyNumber(v)}}
                  placeholder={'사업자 번호를 입력해 주세요.'}
                  placeholderTextColor="#8791A1"
                  style={[styles.input]}
									maxLength={10}
                />
              </View>
            </View>

            <View style={[styles.typingBox, styles.mgTop35]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>상호(법인명)</Text>
              </View>
              <View style={[styles.typingInputBox]}>
                <TextInput
                  value={mbcompanyName}									
                  onChangeText={(v) => {setMbCompanyName(v)}}
                  placeholder={"상호(법인명)을 입력해 주세요."}
                  style={[styles.input]}
                  placeholderTextColor={"#8791A1"}
                />
              </View>
            </View>

            <View style={[styles.typingBox, styles.mgTop35]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>성명</Text>
              </View>
              <View style={[styles.typingInputBox]}>
                <TextInput
                  value={mbName}									
                  onChangeText={(v) => {setMbName(v)}}
                  placeholder={"성명을 입력해 주세요."}
                  style={[styles.input]}
                  placeholderTextColor={"#8791A1"}
                />
              </View>
            </View>

            <View style={[styles.typingBox, styles.mgTop35]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>사업장 소재지</Text>
              </View>
              <View style={[styles.typingInputBox]}>
                <TextInput
                  value={mbCompanyAddr}									
                  onChangeText={(v) => {setMbCompanyAddr(v)}}
                  placeholder={"사업장 소재지를 입력해 주세요."}
                  style={[styles.input]}
                  placeholderTextColor={"#8791A1"}
                />
              </View>
            </View>

            <View style={[styles.typingBox, styles.mgTop35]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>사업자등록증 사진</Text>
              </View>
              <View style={styles.compImgBox}>
                <TouchableOpacity
									style={styles.photoBoxBtn}
                  activeOpacity={opacityVal}						
                  onPress={() => {setModal4(true);}}
                >
                  {picture ? (
                    <AutoHeightImage width={102} source={{uri: picture}} style={[styles.photoBox]} />
                  ) : (
                    <AutoHeightImage 
                      width={102} 
                      source={require("../../assets/img/pick_photo.jpg")}
                      style={[styles.photoBox]}
                    />
                  )}
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.compImgBoxDelete}
                  activeOpacity={opacityVal}
                  onPress={()=>{setVisible(true)}}
                >
                  <AutoHeightImage width={25} source={require("../../assets/img/icon_delete2.png")} />
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.nextFix}>
        <TouchableOpacity 
          style={styles.nextBtn}
          activeOpacity={opacityVal}
          onPress={() => submitRegist()}
        >
          <Text style={styles.nextBtnText}>수정</Text>
        </TouchableOpacity>
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
				<View style={[styles.modalCont3]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>사업자등록증 삭제</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>삭제하면 서비스에 제한이 있습니다.</Text>
						<Text style={styles.avatarDescText}>그래도 삭제하시겠습니까?</Text>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {setVisible(false)}}
            >
              <Text style={styles.avatarBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {delBsLicense()}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>

      <Modal
        visible={modal3}
				animationType={"slide"}
				onRequestClose={() => {setModal3(false)}}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => {setModal3(false)}} 						
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>내 공장1 정보 등록</Text>
					</>
				</View>
				<KeyboardAwareScrollView>
					<View style={styles.registArea}>
						<View	View style={[styles.registBox, styles.registBox3]}>
							<View style={[styles.typingBox]}>
								<View style={[styles.typingTitle]}>
									<Text style={styles.typingTitleText}>공장명</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factName1}
										onChangeText={(v) => {setFactName1(v)}}
										placeholder={'공장명을 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>공장 주소</Text>
								</View>
								<View style={styles.findLocal}>
									<TouchableOpacity 
										style={styles.findLocalBtn}
										activeOpacity={opacityVal}
										onPress={() => {findMyPosition('1')}}
									>
										<AutoHeightImage width={16} source={require("../../assets/img/icon_local.png")} />
										<Text style={styles.findLocalBtnText}>현재 위치로 찾기</Text>
									</TouchableOpacity>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={factCode1}									
										keyboardType = 'numeric'
										onChangeText={(v) => {setFactCode1(v)}}
										placeholder={"우편번호"}
										style={[styles.input, styles.input3]}
										placeholderTextColor={"#8791A1"}
										editable={false}
									/>
									<TouchableOpacity 
										style={[styles.certChkBtn, styles.certChkBtn3]}
										activeOpacity={opacityVal}
										onPress={() => {
											setPostcodeOn(!postcodeOn);
										}}
									>
										<Text style={styles.certChkBtnText3}>주소 검색</Text>
									</TouchableOpacity>
								</View>								

								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddr1}									
										onChangeText={(v) => {setFactAddr1(v)}}
										placeholder={"주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
										editable={false}
									/>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddrDt1}									
										onChangeText={(v) => {setFactAddrDt1(v)}}
										placeholder={"상세 주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>
						</View>
					</View>
				</KeyboardAwareScrollView>								
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							chkFactoryInfo('1')								
					}}
					>
						<Text style={styles.nextBtnText}>확인</Text>
					</TouchableOpacity>
				</View>								
			</Modal>
			
			<Modal
        visible={postcodeOn}
				animationType={"slide"}
				onRequestClose={() => {
					setPostcodeOn(false);
				}}
			>	
				<View style={[styles.header, styles.header2]}>
					<>
					<TouchableOpacity
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPostcodeOn(false);
						}}
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>내 공장1 주소 찾기</Text>
					</>
				</View>
				<View style={styles.postcodeBox}>
					<Postcode
						style={{ width: widnowWidth, height: widnowHeight-50}}
						jsOptions={{ animation: true }}
						onSelected={data => {
							//console.log(JSON.stringify(data))
							const kakaoAddr = data;												
							setFactCode1(kakaoAddr.zonecode);
							setFactAddr1(kakaoAddr.address);
							setFactAddrDt1(kakaoAddr.buildingName);
							setPostcodeOn(false);
						}}
					/>
				</View>														
			</Modal>	
		
			<Modal
        visible={modal4}
				transparent={true}
				onRequestClose={() => {setModal4(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setModal4(false)}}
				></Pressable>
				<View style={styles.modalCont}>
					<Avatar 
						onChange={onAvatarChange} 
						//source={require('../../assets/img/pick_photo.jpg')}
					/>
				</View>
      </Modal>

			<Modal
				visible={modal5}
				transparent={true}
				onRequestClose={() => {setModal5(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setModal5(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
					<View style={styles.modalCont2Box}>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.choice]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive('1')
								setModal5(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>선택</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
								setModal3(true)
								setModal5(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>수정</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive()
								setFactName1('')
								setFactCode1('')
								setFactAddr1('')
								setFactAddrDt1('')
								setModal5(false)
                setMy1(false);
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setModal5(false)
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>

			<Modal
        visible={modal6}
				animationType={"slide"}
				onRequestClose={() => {setModal6(false)}}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => (setModal6(false))}						
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>내 공장2 정보 등록</Text>
					</>
				</View>
				<KeyboardAwareScrollView>
					<View style={styles.registArea}>
						<View	View style={[styles.registBox]}>
							<View style={[styles.typingBox]}>
								<View style={[styles.typingTitle]}>
									<Text style={styles.typingTitleText}>공장명</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factName2}
										onChangeText={(v) => {setFactName2(v)}}
										placeholder={'공장명을 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>공장 주소</Text>
								</View>
								<View style={styles.findLocal}>
									<TouchableOpacity 
										style={styles.findLocalBtn}
										activeOpacity={opacityVal}
										onPress={() => {findMyPosition('2')}}
									>
										<AutoHeightImage width={16} source={require("../../assets/img/icon_local.png")} />
										<Text style={styles.findLocalBtnText}>현재 위치로 찾기</Text>
									</TouchableOpacity>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={factCode2}									
										keyboardType = 'numeric'
										onChangeText={(v) => {setFactCode2(v)}}
										placeholder={"우편번호"}
										style={[styles.input, styles.input3]}
										placeholderTextColor={"#8791A1"}
										editable={false}
									/>
									<TouchableOpacity 
										style={[styles.certChkBtn, styles.certChkBtn3]}
										activeOpacity={opacityVal}
										onPress={() => {
											setPostcodeOn2(!postcodeOn2);
										}}
									>
										<Text style={styles.certChkBtnText3}>주소 검색</Text>
									</TouchableOpacity>
								</View>								
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddr2}									
										onChangeText={(v) => {setFactAddr2(v)}}
										placeholder={"주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
										editable={false}
									/>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddrDt2}									
										onChangeText={(v) => {setFactAddrDt2(v)}}
										placeholder={"상세 주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>
						</View>
					</View>
				</KeyboardAwareScrollView>								
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							chkFactoryInfo('2')								
					}}
					>
						<Text style={styles.nextBtnText}>확인</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
        visible={postcodeOn2}
				animationType={"slide"}
				onRequestClose={() => {
					setPostcodeOn2(false);
				}}
			>	
				<View style={[styles.header, styles.header2]}>
					<>
					<TouchableOpacity
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPostcodeOn2(false);
						}}
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>내 공장2 주소 찾기</Text>
					</>
				</View>
				<View style={styles.postcodeBox}>
					<Postcode
						style={{ width: widnowWidth, height: widnowHeight-50}}
						jsOptions={{ animation: true }}
						onSelected={data => {
							//console.log(JSON.stringify(data))
							const kakaoAddr = data;												
							setFactCode2(kakaoAddr.zonecode);
							setFactAddr2(kakaoAddr.address);
							setFactAddrDt2(kakaoAddr.buildingName);
							setPostcodeOn2(false);
						}}
					/>
				</View>														
			</Modal>

			<Modal
				visible={modal7}
				transparent={true}
				onRequestClose={() => {setModal7(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setModal7(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
					<View style={styles.modalCont2Box}>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.choice]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive('2')
								setModal7(false)
						}}
						>
							<Text style={styles.modalCont2BtnText}>선택</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
								setModal6(true)
								setModal7(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>수정</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive()
								setFactName2('')
								setFactCode2('')
								setFactAddr2('')
								setFactAddrDt2('')
								setModal7(false)
                setMy2(false);
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setModal7(false)
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>

			<Modal
        visible={toastModal}
				animationType={"slide"}
				transparent={true}
      >
				<View style={styles.toastModal}>
					<View
						style={{
							backgroundColor: '#000000e0',
							borderRadius: 10,
							paddingVertical: 10,
							paddingHorizontal: 20,
							opacity: 0.8,
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								color: '#FFFFFF',
								fontSize: 15,
								lineHeight: 22,
								fontFamily: Font.NotoSansRegular,
								letterSpacing: -0.38,
							}}
						>
							{toastText}
						</Text>
					</View>
				</View>
			</Modal>

			{!isLoading ? (
			<View style={[styles.indicator]}>
				<ActivityIndicator size="large" />
			</View>
			) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  safeAreaView: {flex:1,backgroundColor:'#fff'},
	safeAreaView2: {},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:0,marginTop:-5},
	registBox3: {paddingTop:20,},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	typingBox: {},
	typingTitle: {},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	certChkBtn: {width:80,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#353636'},
	certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:16,color:'#fff'},
	certChkBtn3: {width:110,height:58,backgroundColor:'#31B481',borderWidth:0,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText3: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},

	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	header2: {borderBottomWidth:1,borderBottomColor:'#ccc'},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},

	typingFactory: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,
	paddingLeft:12,display:'flex',justifyContent:'center',position:'relative',},
	typingFactoryOn: {borderColor:'#31B481'},
	myFactoryText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#8791A1'},
	myFactoryText2: {color:'#000'},
	myFactoryTextOn: {fontFamily:Font.NotoSansMedium,color:'#31B481'},
	myFactoryArr: {position:'absolute',right:20,top:21,},
	addBtn: {width:innerWidth,height:58,backgroundColor:'#E3E9ED',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20,},
	addBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#8791A1',marginLeft:8},
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},	
	photoBoxBtn: {width:102,height:102,alignItems:'center',justifyContent:'center',marginTop:10,borderWidth:1,borderColor:'#E1E1E1',borderRadius:12,overflow:'hidden'},
	photoBox: {},
	resetBtn: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',width:75,height:24,backgroundColor:'#31B481',borderRadius:12,},
	resetBtnText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:22,color:'#fff',marginLeft:5,},
	timeBox: {position:'absolute',right:20,top:0,},
	timeBoxText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:56,color:'#000'},
	findLocal: {marginTop:10,},
	findLocalBtn: {width:innerWidth,height:58,backgroundColor:'#E9ECF0',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',},
	findLocalBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#8791A1',marginLeft:5},
	toastModal: {width:widnowWidth,height:(widnowHeight - 50),display:'flex',alignItems:'center',justifyContent:'flex-end'},

	modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
  compImgBox: {width:102,position:'relative',},
  compImgBoxDelete: {position:'absolute',bottom:-10,right:-10,},

  modalCont3: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-130)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},

  inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlertText: {width:(innerWidth-14),paddingLeft:7,fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#ED0000'},

	indicator: {width:widnowWidth,height:widnowHeight,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center',position:'absolute',left:0,top:0,},
})

//export default MyCompany
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
)(MyCompany);