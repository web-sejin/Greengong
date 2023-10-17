import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

const ToastMessage = ( message, duration, position, offset, message2 = '') => {
	Toast.show({
		type    : 'custom_type', //success | error | info
		position: position == '1' ? position : 'bottom',
		text1   : message,
		text2   : message2,
		visibilityTime: duration ? duration : 2000,
		autoHide: true,
		topOffset: (Platform.OS === 'ios' ? 10 : 10),
		bottomOffset: offset ? offset + 100 : 100,
		onShow: () => {},
		onHide: () => {}
	});
}

export default ToastMessage;
