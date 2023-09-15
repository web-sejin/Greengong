import React from 'react';
import { Platform, Linking, View, ActivityIndicator } from 'react-native';
import Axios from 'axios';
var RNFS = require('react-native-fs');

class Api {
  constructor() {
		//super(props);

		this.state = {
			isLoading   : false,
			url         : 'https://cnj0005.cafe24.com',
			path        : '/app/',
			option  : {
				method: 'POST',
				headers: {
					'content-type': 'multipart/form-data',
				},
				body: null,
			},
			dataSource: {},
		};
	}

	//formdata 로 변경
	makeFormData(method = '', datas = {}) {
		let formdata = new FormData();
		// formdata.append('method', method);
		// formdata.append('secretKey', '40ed77f38d24ac80b36764f4a423f314');
		for (let [key, value] of Object.entries(datas)) {
			formdata.append(key, value);
		}
		// console.log('type : ' + typeof (formdata));
		this.state.option.body = formdata;
	}

  send(protocol, method, datas, callback) {
		// this.state.isLoading = true;
		if(protocol === 'POST'){			
			this.makeFormData(method, datas);

			//console.log("send_method : ",method);
			//console.log('api body : ', this.state.option.headers);
			return Axios.post(this.state.url + this.state.path + method, this.state.option.body, {headers: this.state.option.headers})
			/*return Axios.post(this.state.url + this.state.path + method, this.state.option.body, {
				headers: {'content-type': 'multipart/form-data'}
			})*/
				.then((response) => {
					let responseJson = response.data;
					let resultItem = responseJson.result;
					let message = responseJson.result;
					let resultCode = responseJson.result_code;
					let arrItems = responseJson.data;
					// console.log('message : ' + resultItem);
					//console.log('responseJson : ', responseJson);
					let returnJson = {
						resultItem: {result: resultItem === 'error' ? 'N' : 'Y', message: message},
						arrItems: arrItems,
						responseJson: responseJson,
					};
					// this.state.isLoading = false;
					// this.state.dataSource = arrItems;
					//  각 메소드별로 값을 저장해둠.

					// if (resultItem === 'error' && message) console.log(method, message);
					if (typeof (callback) == 'function') {
						callback(returnJson);
					} else {
						return returnJson;
					}
				})
				.catch(function (error) {
					if(error.response){
						console.log('error1', error.response);
					} else if (error.request) {
						console.log('error2', error.request);
					}
				});
		}else{
			return Axios.get(this.state.url + this.state.path + method, {
				headers: {
					Pragma: 'no-cache',
					Expires: '0',
				},
				params:
						datas
				})
				.then((response) => {
					// console.log('api data : ', response.data);

					let responseJson = response.data;
					let resultItem = responseJson.result;
					let message = responseJson.result;
					let resultCode = responseJson.result_code;
					let total = responseJson.total;
					let arrItems = responseJson.data;
					// console.log('responseJson', responseJson);
					let returnJson = {
						resultItem: {
							result: resultItem === 'error' ? 'N' : 'Y', message: message
						},
						total: total === undefined ? 0 : total,
						arrItems: arrItems,
						responseJson: responseJson,						
					};
					// this.state.isLoading = false;
					// this.state.dataSource = arrItems;
					//  각 메소드별로 값을 저장해둠.

					// if (resultItem === 'error' && message) console.log(method, message);
					if (typeof (callback) == 'function') {
						callback(returnJson);
					} else {
						return returnJson;
					}
				})
				.catch(function (error) {
					console.log("Axios catch!!! >>", method, error);
				});
		}
	}
}

export default Api = new Api();