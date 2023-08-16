import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DocumentPicker from 'react-native-document-picker'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Estimate = ({navigation, route}) => {
	const itemData = [
		{'idx': 1, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 2, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 3, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 4, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 5, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 6, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 7, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 8, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 9, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
		{'idx': 10, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''},
	];

	const itemData2 = [
		{'idx': 1, 'itemName':'', 'itemPrice':''},
		{'idx': 2, 'itemName':'', 'itemPrice':''},
		{'idx': 3, 'itemName':'', 'itemPrice':''},
		{'idx': 4, 'itemName':'', 'itemPrice':''},
		{'idx': 5, 'itemName':'', 'itemPrice':''},
	];

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [expiryDate, setExpiryDate] = useState(''); //유효기간
	const [compName, setCompName] = useState(''); //상호명
	const [compNumber, setCompNumber] = useState(''); //등록번호
	const [mbName, setMbName] = useState(''); //담당자명
	const [mbHp, setMbHp] = useState(''); //연락처
	const [mbEmail, setMbEmail] = useState(''); //이메일
	const [compIntro, setCompIntro] = useState(''); //회사소개서
	const [compIntroType, setCompIntroType] = useState(''); //회사소개서
	const [compIntroUri, setCompIntroUri] = useState(''); //회사소개서
	const [price, setPrice] = useState(0); //공급가액
	const [priceTax, setPriceTax] = useState(0); //부가세(10%)
	const [delPrice, setDelPrice] = useState(0); //배송비
	const [delPriceStr, setDelPriceStr] = useState('0'); //배송비

	const [itemList, setItemList] = useState(itemData); //견적정보
	const [itemCnt, setItemCnt] = useState(1); //견적정보 개수

	const [itemList2, setItemList2] = useState(itemData2); //디자인/설계정보
	const [itemCnt2, setItemCnt2] = useState(1); //디자인/설계정보 개수

	let deliver = delPrice;
	if(!deliver){
		deliver = 0;
	}
	const resultTotal = price+priceTax+deliver;
	const [totalPrice, setTotalPrice] = useState(resultTotal); //총 견적금액

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setExpiryDate('');
				setCompName('');
				setCompNumber('');
				setMbName('');
				setMbHp('');
				setMbEmail('');
				setCompIntro('');
				setCompIntroType('');
				setCompIntroUri('');
				setPrice(0);
				setPriceTax(0);
				setDelPrice(0);
				setDelPriceStr('0');
				setCompIntroUri(itemData);
				setCompIntroUri(1);
				setCompIntroUri(itemData2);
				setCompIntroUri(1);
				setCompIntroUri(resultTotal);
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
		calcTotal();
	}, [itemList, itemList2])

	const openPicker = async () => {
		console.log(DocumentPicker.types)
		try {
			const res = await DocumentPicker.pick({
				//type: [DocumentPicker.types.allFiles],
				type: [
          DocumentPicker.types.pdf, 
          DocumentPicker.types.zip, 
          DocumentPicker.types.ppt, 
          DocumentPicker.types.pptx
        ],
			})
			setCompIntro(res[0].name);
			setCompIntroType(res[0].type);
			setCompIntroUri(res[0].uri);

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

	const inputChange = (idx, v, col) => {
		//console.log(idx+"//"+v+"//"+col);
		
		let temp = itemList.map((item, index) => {
			if(idx === index){
				if(col == 'itemName'){
					return { ...item, itemName: v, itemInfo: item.itemInfo, itemCnt:item.itemCnt, itemPrice:item.itemPrice, itemTotalPrice:item.itemTotalPrice };
				}else if(col == 'itemInfo'){
					return { ...item, itemName: item.itemName, itemInfo: v, itemCnt:item.itemCnt, itemPrice:item.itemPrice, itemTotalPrice:item.itemTotalPrice  };
				}else if(col == 'itemCnt'){
					let val0 = v.split(',').join('');

					let val1 = 0;
					if(val0 == '' || val0*1 <= 0){ val1 = 0; }else{ val1 = val0*1 }

					let val2 = 0;
					if(item.itemPrice == '' || (item.itemPrice)*1 <= 0){ val2 = 0; }else{ val2 = (item.itemPrice)*1; }

					const result = String(val1*val2);
					return { ...item, itemName: item.itemName, itemInfo: item.itemInfo, itemCnt: val0, itemPrice:item.itemPrice, itemTotalPrice: result };
				}else if(col == 'itemPrice'){
					let val0 = v.split(',').join('');

					let val1 = 0;
					if(item.itemCnt == '' || (item.itemCnt)*1 <= 0){ val1 = 0; }else{ val1 = (item.itemCnt)*1; }

					let val2 = 0;
					if(val0 == '' || val0*1 <= 0){ val2 = 0; }else{ val2 = val0*1 }					
					
					const result = String(val1*val2);
					return { ...item, itemName: item.itemName, itemInfo: item.itemInfo, itemCnt: item.itemCnt, itemPrice:val0, itemTotalPrice: result };
				}
			}else{
				return { ...item, itemName: item.itemName, itemInfo: item.itemInfo, itemCnt: item.itemCnt, itemPrice: item.itemPrice, itemTotalPrice: item.itemTotalPrice };
			}
		});
		
		setItemList(temp);
	}

	const inputDelete = (idx) => {
		let order = 0;
		itemList.splice(idx, 1);
		itemList.push({'idx': 11, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''})

		let temp = itemList.map((item, index) => {
			//console.log(item.idx);
			if(index >= idx){
				let order = (item.idx)-1;
				return { ...item, idx:order };
			}else{
				order=item.idx;								
				return { ...item, idx:item.idx };
			}	
		});

		setItemList(temp);		
	}

	const inputChange2 = (idx, v, col) => {
		//console.log(idx+"//"+v+"//"+col);
		
		let temp = itemList2.map((item, index) => {
			if(idx === index){
				if(col == 'itemName'){
					return { ...item, itemName: v };
				}else if(col == 'itemPrice'){
					return { ...item, itemPrice: v };
				}
			}else{
				return { ...item, itemName: item.itemName, itemPrice: item.itemPrice };
			}			
		});
		setItemList2(temp);		
	}

	const inputDelete2 = (idx) => {
		let order = 0;
		itemList2.splice(idx, 1);
		itemList2.push({'idx': 6, 'itemName':'', 'itemInfo':'', 'itemCnt':'', 'itemPrice':'', 'itemTotalPrice':''})

		let temp = itemList2.map((item, index) => {
			//console.log(item.idx);
			if(index >= idx){
				let order = (item.idx)-1;
				return { ...item, idx:order };
			}else{
				order=item.idx;								
				return { ...item, idx:item.idx };
			}	
		});

		setItemList2(temp);		
	}

	function calcTotal(){
		let total = 0;
		let temp = itemList.map((item, index) => {
			const val0 = (item.itemTotalPrice).split(',').join('');
			if(val0 == '' || val0*1 <= 0){ 
				total = total + 0;
				return total;
			}else{ 
				total = total+(val0*1);
				return total;
			}			
		});
		
		let total2 = 0;
		let temp2 = itemList2.map((item, index) => {
			const val1 = (item.itemPrice).split(',').join('');
			if(val1 == '' || val1*1 <= 0){ 
				total2 = total2 + 0;
				return total2;
			}else{ 
				total2 = total2+(val1*1);
				return total2;
			}			
		});

		const res = temp[9]+temp2[4];
		const res2 = res/10
		const del = delPrice*1;

		//console.log(res+"//"+res2+"//"+del);

		setPrice(res);
		setPriceTax(res2);
		setTotalPrice(res+res2+del);
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'예상 견적서 등록'} backType={'close'} />
			<KeyboardAwareScrollView>
				<View style={styles.registArea}>					
					<View style={[styles.registBox, styles.borderBot, styles.zindexTop]}>
						<View style={{marginBottom:10,}}>
							<Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>발행정보</Text>
						</View>
						<View style={styles.alertBox}>
							<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
							<Text style={styles.alertBoxText}>참좋은공장</Text>
							<Text style={[styles.alertBoxText, styles.alertBoxText2]}>아직 밝혀지지 않은 달 뒤를 가보고 남은 장비 프로젝트</Text>
						</View>
						<View style={[styles.typingBox, styles.mgTop30]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>유효기간</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={expiryDate}
									keyboardType = 'numeric'
									onChangeText={(v) => {setExpiryDate(v)}}
									placeholder={"유효기간 입력"}
									style={[styles.input, styles.input4]}
									placeholderTextColor={"#C5C5C6"}
								/>
								<View style={styles.inputUnit}>
									<Text style={styles.inputUnitText}>일</Text>
								</View>
								<View style={styles.inputUnit2}>
									<Text style={styles.inputUnitText}>발행일로부터</Text>
									<View style={styles.inputUnit2Line}></View>
								</View>
							</View>
						</View>
					</View>

					<View style={[styles.registBox, styles.borderBot, styles.zindexTop]}>
						<View style={styles.secBoxTit}>
							<Text style={styles.secBoxTitText}>공급자정보</Text>
						</View>
						<View style={[styles.typingBox]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>상호명</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={compName}
									onChangeText={(v) => {setCompName(v)}}
									placeholder={"상호명을 입력해 주세요."}
									style={[styles.input]}
									placeholderTextColor={"#C5C5C6"}
								/>
							</View>
						</View>
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>등록번호</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={compNumber}
									onChangeText={(v) => {setCompNumber(v)}}
									placeholder={"012-345-6789"}
									style={[styles.input]}
									placeholderTextColor={"#C5C5C6"}
								/>
							</View>
						</View>
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>담당자명</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={mbName}
									onChangeText={(v) => {setMbName(v)}}
									placeholder={"담당자명을 입력해 주세요."}
									style={[styles.input]}
									placeholderTextColor={"#C5C5C6"}
								/>
							</View>
						</View>
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>담당자 연락처</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={mbHp}
									keyboardType = 'numeric'
									onChangeText={(v) => {setMbHp(v)}}
									placeholder={"담당자 연락처를 입력해 주세요."}
									style={[styles.input]}
									placeholderTextColor={"#C5C5C6"}
								/>
							</View>
						</View>
						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>담당자 이메일</Text>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									keyboardType='email-address'
									value={mbEmail}
									onChangeText={(v) => {setMbEmail(v)}}
									placeholder={'이메일을 입력해 주세요.'}
									placeholderTextColor="#C5C5C6"
									style={[styles.input]}
								/>
							</View>
						</View>
					</View>

					<View style={[styles.registBox, styles.borderBot]}>
						<View style={[styles.typingBox]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>회사소개서 업로드</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={compIntro}
									editable = {false}
									placeholder={'회사소개서를 업로드하여 주세요.'}
									placeholderTextColor="#C5C5C6"
									style={[styles.input, styles.input2]}
								/>
								<TouchableOpacity 
									style={[styles.certChkBtn]}
									activeOpacity={opacityVal}
									onPress={openPicker}
								>
									<Text style={styles.certChkBtnText}>업로드</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.inputAlert}>
								<AutoHeightImage width={14} source={require("../../assets/img/icon_alert3.png")} />
								<Text style={styles.inputAlertText}>PDF, PPT, ZIP파일을 업로드해 주세요.</Text>
							</View>
						</View>
					</View>
					
					{itemList.map((item, index) => {
						let openState = false;

						if(itemCnt > index){
							openState = true;
						}else{
							openState = false;
						}

						let itemListCnt = (item.itemCnt).split(',').join('');
						itemListCnt = String(itemListCnt).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

						let itemListPrice = (item.itemPrice).split(',').join('');
						itemListPrice = String(itemListPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

						let itemListTotalPrice = (item.itemTotalPrice).split(',').join('');
						itemListTotalPrice = String(itemListTotalPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

						return(
						<View 
							key={index}
							style={[styles.registBox, styles.borderBot, !openState ? styles.displayNone : null]}>
							{index == 0 ? (
							<View style={styles.secBoxTit}>
								<Text style={styles.secBoxTitText}>견적정보 ({itemCnt}개)</Text>
								<TouchableOpacity
									style={styles.addBtn}
									activeOpacity={opacityVal}
									onPress={()=>{
										if(itemCnt < 10){
											setItemCnt(itemCnt+1);
										}
									}}
								>
									<Text style={styles.addBtnText}>추가</Text>
								</TouchableOpacity>
							</View>
							) : null }

							<View style={[styles.typingBox]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>품명</Text>
									{index > 0 ? (
									<TouchableOpacity
										style={[styles.addBtn, styles.addBtn2]}
										activeOpacity={opacityVal}
										onPress={()=>{
											if(itemCnt < 10){
												inputDelete(index);
												setItemCnt(itemCnt-1);
											}											
										}}
									>
										<Text style={[styles.addBtnText]}>삭제</Text>
									</TouchableOpacity>
									) : null}
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={item.itemName}
										onChangeText={(v) => {
											inputChange(index, v, 'itemName');
										}}
										placeholder={"품명을 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#C5C5C6"}
									/>
								</View>
							</View>
							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>재질</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={item.itemInfo}
										onChangeText={(v) => {
											inputChange(index, v, 'itemInfo');
										}}
										placeholder={"재질을 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#C5C5C6"}
									/>
								</View>
							</View>
							<View style={[styles.typingBox]}>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={itemListCnt}
										keyboardType = 'numeric'
										onChangeText={(v) => {											
											inputChange(index, v, 'itemCnt');																					
										}}
										placeholder={"수량입력"}
										style={[styles.input, styles.input6]}
										placeholderTextColor={"#C5C5C6"}
									/>
									<TextInput
										value={itemListPrice}
										keyboardType = 'numeric'
										onChangeText={(v) => {											
											inputChange(index, v, 'itemPrice');
										}}
										placeholder={"단가입력"}
										style={[styles.input, styles.input6]}
										placeholderTextColor={"#C5C5C6"}
									/>
									<TextInput
										value={itemListTotalPrice}
										keyboardType = 'numeric'
										editable = {false}
										onChangeText={(v) => {
											inputChange(index, v, 'itemTotalPrice');
										}}
										placeholder={"소계"}
										style={[styles.input, styles.input6]}
										placeholderTextColor={"#C5C5C6"}
									/>
								</View>
							</View>
						</View>
						)
					})}

					{itemList2.map((item, index) => {
						let openState2 = false;

						if(itemCnt2 > index){
							openState2 = true;
						}else{
							openState2 = false;
						}
						let itemList2Price = (item.itemPrice).split(',').join('');
						itemList2Price = String(itemList2Price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

						return(
						<View 
							key={index}
							style={[styles.registBox, styles.borderBot, !openState2 ? styles.displayNone : null]}>
							{index == 0 ? (
							<View style={styles.secBoxTit}>
								<Text style={styles.secBoxTitText}>디자인/설계 정보 ({itemCnt2}개)</Text>
								<TouchableOpacity
									style={styles.addBtn}
									activeOpacity={opacityVal}
									onPress={()=>{
										if(itemCnt2 < 5){
											setItemCnt2(itemCnt2+1);
										}
									}}
								>
									<Text style={styles.addBtnText}>추가</Text>
								</TouchableOpacity>
							</View>
							) : null }

							<View style={[styles.typingBox]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>품명</Text>
									{index > 0 ? (
									<TouchableOpacity
										style={[styles.addBtn, styles.addBtn2]}
										activeOpacity={opacityVal}
										onPress={()=>{
											if(itemCnt2 < 10){
												inputDelete2(index);
												setItemCnt2(itemCnt2-1);
											}											
										}}
									>
										<Text style={[styles.addBtnText]}>삭제</Text>
									</TouchableOpacity>
									) : null}
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={item.itemName}
										onChangeText={(v) => {
											inputChange2(index, v, 'itemName');
										}}
										placeholder={"품명을 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#C5C5C6"}
									/>
								</View>
							</View>
							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>단가</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={itemList2Price}										
										keyboardType = 'numeric'
										onChangeText={(v) => {
											inputChange2(index, v, 'itemPrice');
										}}
										placeholder={"단가를 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#C5C5C6"}
									/>
								</View>
							</View>
						</View>
						)
					})}

					<View style={[styles.registBox, styles.borderTop]}>
						<View>
							<Text style={{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'}}>최종금액</Text>
						</View>
						<View style={styles.table}>
							<Text style={styles.tableth}>공급가액</Text>
							<View style={styles.tabletd}>
								<Text style={[styles.tabletdText, styles.tabletdTextBold]}>
									{String(price).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}
								</Text>
								<Text style={styles.tabletdText}>원</Text>
							</View>
						</View>
						<View style={styles.table}>
							<Text style={styles.tableth}>부가세(10%)</Text>
							<View style={styles.tabletd}>
								<Text style={[styles.tabletdText, styles.tabletdTextBold]}>
									{String(priceTax).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}
								</Text>
								<Text style={styles.tabletdText}>원</Text>
							</View>
						</View>
						<View style={[styles.table, styles.table_2]}>
							<Text style={styles.tableth}>배송비</Text>
							<View style={[styles.tabletd]}>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={delPriceStr}
										keyboardType = 'numeric'
										onChangeText={(v) => {
											const v1 = v.split(',').join('');
											setDelPrice(v1);
											
											const v2 = String(v1).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
											setDelPriceStr(v2);

											setTotalPrice(price+priceTax+(v1*1));
										}}
										placeholder={"배송비를 입력해 주세요."}
										style={[styles.input, styles.input5]}
										placeholderTextColor={"#C5C5C6"}
									/>
									<View style={styles.inputUnit}>
										<Text style={styles.inputUnitText}>원</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={[styles.table, styles.table2]}>
							<Text style={[styles.tableth, styles.tablethBold]}>총 견적금액</Text>
							<View style={[styles.tabletd]}>
								<Text style={[styles.tabletdText, styles.tabletdTextBold, styles.tabletdTextGreen]}>
									{String(totalPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')}
								</Text>
								<Text style={[styles.tabletdText, styles.tabletdTextGreen]}>원</Text>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => nextStep()}
				>
					<Text style={styles.nextBtnText}>다음</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	typingBox: {},
	typingTitle: {position:'relative'},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	input4: {paddingLeft:130,},
	input5: {width:210,},
	input6: {width:((innerWidth/3)-7),textAlign:'center',paddingLeft:0},
	certChkBtn: {width:80,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:16,color:'#fff'},
	certChkBtn3: {width:110,height:58,backgroundColor:'#31B481',borderWidth:0,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	inputUnit: {height:56,position:'absolute',top:1,right:20,display:'flex',justifyContent:'center'},
	inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000'},
	inputUnit2: {width:98,height:56,position:'absolute',top:1,left:12,display:'flex',justifyContent:'center'},
	inputUnit2Line: {width:1,height:14,backgroundColor:'#E3E3E3',position:'absolute',right:0,top:21.5,},
	secBoxTit: {marginBottom:20,paddingBottom:15,borderBottomWidth:1,borderBottomColor:'#000',position:'relative'},
	secBoxTitText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:19,color:'#353636'},
	addBtn: {width:54,height:25,backgroundColor:'#31B481',borderRadius:13,position:'absolute',right:0,top:-5,display:'flex',alignItems:'center',justifyContent:'center'},
	addBtn2: {backgroundColor:'#C5C5C6'},
	addBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#fff'},
	inputAlert: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	inputAlertText: {width:(innerWidth-14),paddingLeft:7,fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#ED0000'},
	table: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:25,},
	table_2: {marginTop:12},
	table2: {marginTop:20,paddingTop:20,borderTopWidth:1,borderTopColor:'#000'},
	tableth: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000'},
	tablethBold: {fontFamily:Font.NotoSansBold},
	tabletd: {display:'flex',flexDirection:'row',alignItems:'center'},
	tabletdText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000'},
	tabletdTextBold: {fontFamily:Font.NotoSansBold},
	tabletdTextGreen: {color:'#31B481'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
	zindexTop : {position:'relative',zIndex:10,backgroundColor:'#fff'},
	displayNone: {position:'absolute',zIndex:-10,},
})

export default Estimate