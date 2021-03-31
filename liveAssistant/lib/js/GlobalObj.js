let tagArry =[];
let urlPoint ='http://173.248.234.214:9008';//测试地址 http://173.248.234.214:9008 http://192.168.1.102:9008
// let urlPoint ='/api';//测试地址 http://173.248.234.214:9008
let md5key='@#live6HW_80&!';
let urlSocketPoint ='ws://173.248.234.214:17000';//192.168.1.102    ws://173.248.234.214:17000 127.0.0.1
export default
{
  tagArry,//tag数组 test
  urlPoint,//url前缀
  md5key,//key
  urlSocketPoint,//socket前缀
}
// // // console.log(this.$store.state.login.userInfo)
// console.log(this.$store.getters['login/get_userInfo'])
// this.$store.commit('login/set_userInfo',4444)
// this.$store.dispatch('login/SET_userInfo',333)
// console.log(this.$store.state.login.userInfo)
// getApp().globalData.url1 
// 1244813168059535361

  // import {InitaddList} from "../../lib/js/http.js"
// InitaddList(params,113,url).then(//地址列表aid 113
// 	  	(res) => {
// 			console.log(res.data)
// 	  		if(res.data.code==200){
// 	  			this.address=res.data.data.memberAddrVoList;
// 				console.log(this.address.length)
// 	  		}else{
// 	  			uni.showToast({
// 	  				icon:'none',
// 	  				title: res.data.message,
// 	  				duration: 1000,
// 	  			});
// 	  		}
// 	  	},
// 	  	(err) => {
// 	  	console.log('get err', err)
// 	  	}
// 	  )