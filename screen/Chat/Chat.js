import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Chat = ({navigation, route}) => {
    return (
        <SafeAreaView style={{flex:1}}>
            <View><Text>채팅</Text></View>
        </SafeAreaView>
    )
}

export default Chat