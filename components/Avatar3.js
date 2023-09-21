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
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

interface AvatarProps extends ImageProps {
  onChange?: (file: ImageOrVideo) => void;
}

export const Avatar3 = (props: AvatarProps) => {
  const [uri, setUri] = React.useState(props.source?.uri || undefined);
  const [visible, setVisible] = React.useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);
  const chooseImage = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      // cropping: true,
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
      //width: 300,
      //height: 400,
      //cropping: true,
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
    <TouchableOpacity 
      style={[styles.modalCont2Btn, styles.choice]}
      onPress={openCamera}
    >
      <Text style={styles.modalCont2BtnText}>카메라</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.modalCont2Btn, styles.modify]}
      onPress={chooseImage}
    >
      <Text style={[styles.modalCont2BtnText]}>앨범</Text>
    </TouchableOpacity>  
    </>
  );
};

const styles = StyleSheet.create({
  modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
});