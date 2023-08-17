import React from 'react';
import {
  Dimensions,
  Image,
  ImageProps,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
	View,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

import Font from "../assets/common/Font";

const widnowWidth = Dimensions.get('window').width;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

interface AvatarProps extends ImageProps {
  onChange?: (file: ImageOrVideo) => void;
}

export const Avatar2 = (props: AvatarProps) => {
  const [uri, setUri] = React.useState(props.source?.uri || undefined);
  const [visible, setVisible] = React.useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);
  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image.path);
        //setUri(image.path);
        props.onChange?.(image);
      })
      .finally(close);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image.path);
        //setUri(image.path);
        props.onChange?.(image);
      })
      .finally(close);
  };

  return (
    <>
    <View style={styles.avatarTitle}>
      <Text style={styles.avatarTitleText}>중고상품 사진 업로드</Text>
    </View>
		<View style={styles.avatarBtnBox}>
      <TouchableOpacity 
				style={styles.avatarBtn}
        activeOpacity={opacityVal}
				onPress={openCamera}
			>
        <Text style={styles.avatarBtnText}>카메라</Text>
      </TouchableOpacity>
      <TouchableOpacity 
				style={[styles.avatarBtn, styles.avatarBtn2]}
        activeOpacity={opacityVal}
				onPress={chooseImage}
			>
        <Text style={[styles.avatarBtnText, styles.avatarBtnText2]}>앨범</Text>
      </TouchableOpacity>
		</View>    
    </>
  );
};

const styles = StyleSheet.create({
  avatarTitle: {},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#000'},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:15,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#F3FAF8',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#000'},
	avatarBtnText2: {color:'#fff'},
});