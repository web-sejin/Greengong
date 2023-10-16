import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, Image} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

import Font from "../assets/common/Font";

// Text 적용
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// TextInput 적용
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const opacityVal = 0.8;

const Header = (props) => {    
	const {navigation, headertitle, backType=''} = props;	
	
	return (
		<View style={styles.header}>
			<>			
			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>{headertitle}</Text>
			{backType == 'close' ? (
			<TouchableOpacity
				style={styles.headerBackBtn2}
				onPress={() => navigation.goBack()}
				activeOpacity={opacityVal}
			>
				<AutoHeightImage width={14} source={require("../assets/img/icon_close.png")} />
			</TouchableOpacity>
			) : (
			<TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn} activeOpacity={opacityVal}>
				<AutoHeightImage width={9} source={require("../assets/img/icon_header_back.png")} />
			</TouchableOpacity>
			)}
			</>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn: {width:49,height:50,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerBackBtn2: {width:44,height:50,position:'absolute',right:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},
	headerDot: {width:43,height:50,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
});

export default Header;