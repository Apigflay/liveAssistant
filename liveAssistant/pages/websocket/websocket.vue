<template>
	<view>
		liveRoom
		<button type="primary" @click="send11111">退出登录11111</button>
		<button type="primary" @click="send20001">进入直播间20001</button>
		<button type="primary" @click="send20003">20003 退出直播间</button>
		<button type="primary" @click="send20007">20007 聊天</button>
	</view>
</template>

<script>
	import md5 from '@/lib/md5/md5.js'; //md5加密
	import {NavLanguage,sendDSocket} from "../../lib/js/GlobalFunction.js";
	export default {
		data() {
			return {
				language:1,
			};
		},
		onLoad() {
			this.language=NavLanguage();
		},
		methods: {
			send11111:function(){
				var str =JSON.stringify({
					useridx:this.$store.getters['AllalluserIdx'],//	int	否		用户idx
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
				})
				console.log(str)
				 
				uni.sendSocketMessage({//10001 登录
				  data: sendDSocket(str,11111),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
					
				  	console.log(com)
				  }
				});
			},
			send20001:function(){
				// console.log(this.$store.getters['AllallAnchorLoginData'])
				// console.log(this.$store.getters['Allallusertoken'])
				
				var str =JSON.stringify({
					useridx:this.$store.getters['AllalluserIdx'],//	int64	否		用户idx
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		直播间idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		直播间服务端id
					token:this.$store.getters['Allallusertoken'],//	string	否		进房token
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
				})
				console.log(str)
				uni.sendSocketMessage({//20001 进入直播间
				  data: sendDSocket(str,20001),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
					
				  	console.log(com)
				  }
				});
			},
			send20003:function(){
				// console.log(this.$store.getters['AllallAnchorLoginData'])
				// console.log(this.$store.getters['Allallusertoken'])
				
				var str =JSON.stringify({
					useridx:this.$store.getters['AllalluserIdx'],//	int64	否		用户idx
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		直播间idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		直播间服务端id
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
				})
				console.log(str)
				uni.sendSocketMessage({//20003 退出直播间
				  data: sendDSocket(str,20003),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
					
				  	console.log(com)
				  }
				});
			},
			send20007:function(){
				// console.log(this.$store.getters['AllallAnchorLoginData'])
				// console.log(this.$store.getters['Allallusertoken'])
				
				var str =JSON.stringify({
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		房间idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		服务端idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					fromuseridx:this.$store.getters['AllalluserIdx'],//	int64	否		发信息idx
					touseridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int	否		接收信息idx
					msgcontent:'hhhhh啊哈哈',//	string	否		聊天内容
					ctype:1,//	int	否		1：聊天信息 2：表情
					icoinid:0,//	int	否		表情id 默认0
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
					
				})
				console.log(str)
				uni.sendSocketMessage({//20007 聊天
				  data: sendDSocket(str,20007),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
					
				  	console.log(com)
				  }
				});
			}
		},
	}
</script>

<style lang="scss">

</style>
