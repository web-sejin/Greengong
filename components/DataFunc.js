export const email_check = (email) => {
	var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return (email != '' && email != 'undefined' && regex.test(email));
}

export const pwd_check = (pwd) => {
  let res = false;
	const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,16}$/;
  const refex1 = pwd.search(/[0-9]/g);
  const refex2 = pwd.search(/[a-z]/ig);
  const refex3 = pwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
  
  if((refex1>=0&&refex2>=0) || (refex1>=0&&refex3>=0) || (refex2>=0&&refex3>=0)){
    res = true;
  }else{
    res = false;
  }

  return res;

	//return (pwd != '' && pwd != 'undefined' && regex.test(pwd));
}

export const phoneFormat = (phone) => {
	return phone
		.replace(/[^0-9]/g, '')
		.replace(
			/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
			'$1-$2-$3'
		)
		.replace('--', '-');
};

export const textLengthOverCut = (txt, len, lastTxt) => {
	if (len == "" || len == null) { // 기본값
		len = 20;
	}
	if (lastTxt == "" || lastTxt == null) { // 기본값
		lastTxt = "...";
	}

	if(!!txt){
		if(txt.length > len){
			txt = txt.substr(0, len) + lastTxt;
		}
	}
	return txt;
}


export const numberFormat = num => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const validateDate = (text) => {
	//const regex = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
	//return regex.test(text);

	const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
	return regExp.test(text);
}

//날짜 저장
export const getToday = () => {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() + 1;
	let date = today.getDate();

	return year + '-' + month + '-' + date;
}
