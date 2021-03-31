<template>
	<view class="content">
		<!-- <img class="closeBtnImg" src="static/imgs/close.png" alt=""> -->
		<view class="anchorInfoArea">
			<img class="photo" :src="anchorLoginMsg.headpic" alt="">
			<view class="name">{{anchorLoginMsg.signature}}</view>
			<view class="idx">{{anchorLoginMsg.useridx}}</view>
		</view>
		<div class="passwordArea">
			<view class="tips">{{this.Language.language[language].language1}}</view>
			<input class="input" v-model="nowUrl" type="text" value="" />
		</div>
		<view class="sureBtn" @click="goLiveRoom">
			{{this.Language.language[language].language2}}
		</view>
		<!-- <button type="primary" @click="goWecketRoom">qu测试</button> -->
	</view>
</template>

<script>
	//语言 strToliu 系统id
	import {NavLanguage,sendDSocket,systemId} from "../../lib/js/GlobalFunction.js";
	import md5 from '@/lib/md5/md5.js'; //md5加密
	export default {
		data() {
			return {
				language:1,
				anchorIdx:null,
				anchorToken:null,
				anchorLoginMsg:{},//主播登录信息
				nowUrl:'',
			};
		},
		onLoad(option) {
			this.nowUrl=window.location.href;
			this.$store.dispatch('SET_allIsLogin',false);
			this.$store.dispatch('SET_allroomidx',0);
			console.log(this.$store.getters['AllallIsLogin'])
			this.language=NavLanguage();
			this.anchorIdx=option.useridx;
			this.anchorToken=option.token;
			this.getInitData()
			this.getUserCheckMsg()//验证token 获取用户信息
			this.getAnchorInitMsg()//获取主播信息
		},
		onReady() {
			this.keepLiveUrl()//直播链接
		},
		methods: {
			goLiveRoom:function(){//
				var str =JSON.stringify({
					useridx:this.$store.getters['AllalluserIdx'],//	int64	否		用户idx
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		直播间idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		直播间服务端id
					// token:this.$store.getters['Allallusertoken'],//	string	否		进房token
					token:this.anchorToken,//	string	否		进房token
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
			goWecketRoom:function(){//
				uni.reLaunch({
					url: '/pages/websocket/websocket'
				});
			},
			goLivePages:function(){
				console.log(this.$store.getters['AllalluserIdx']);
				console.log(this.$store.getters['Allallusertoken']);
				console.log(this.GLOBAL.md5key)
				var str =JSON.stringify({
					devid:systemId(),//systemId(),//	string	否		唯一设备号
					useridx:this.$store.getters['AllalluserIdx'],//	int	否		用户idx
					token:this.$store.getters['Allallusertoken'],//验证用户的token
					// token:md5(systemId()+this.$store.getters['AllalluserIdx']+this.GLOBAL.md5key),//	string	否		加密token MD5(dev_id+useridx+key) key:@#live6HW_80&!
					devtype:'h5',//	string	否		设备类型： ios/android
					isrelogin:false,//	bool	否	false	是否重新登录
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
					verison:'1.0.0',//	string	否		版本号
				})
				console.log(str)
				 
				uni.sendSocketMessage({//10001 登录
				  data: sendDSocket(str,10001),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
				  	console.log(com)
				  }
				});
			},
			getInitData:function(){
				console.log(this.GLOBAL.urlPoint)
				console.log(JSON.stringify(this.language+1))
				uni.request({//this.GLOBAL.urlPoint
					url: this.GLOBAL.urlPoint+'/app/h5config', //仅为示例，并非真实接口地址。 https://live.mycat1314.com/
					data: {
						languageid:JSON.stringify(this.language+1),//	是	string	语言 1：中文；2：英文
					},
					method:'GET',
					success: (res) => {
						if(res.data.code==10000){
							this.$store.dispatch('SET_allGiftData',res.data.data.giftinfos);
							this.$store.dispatch('SET_allEmojiData',res.data.data.emoticons);
							console.log(this.$store.getters['AllallGiftData'])
							console.log(this.$store.getters['AllallEmojiData'])
						}else{
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								icon:'none'
							});
						}
						
					},
					fail(err) {
						console.log(err)
					}
				});
			},
			getUserCheckMsg:function(){
				uni.request({//this.GLOBAL.urlPoint
					url: this.GLOBAL.urlPoint+'/user/getlive', //仅为示例，并非真实接口地址。 https://live.mycat1314.com/
					 header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						useridx:Number(this.anchorIdx),//	是	int64	主播idx
						token:this.anchorToken,//	是	string	token
						languageid:JSON.stringify(this.language+1),//	是	string	语言 1：中文；2：英文
					},
					method:'POST',
					success: (res) => {
						console.log(res.data)
						if(res.data.code==10000){
							this.$store.dispatch('SET_alluserIdx',res.data.data.useridx);
							this.$store.dispatch('SET_allusertoken',res.data.data.token);
							this.goLivePages()
						}else{
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								icon:'none'
							});
						}
						console.log(this.$store.getters['AllalluserIdx']);
						console.log(this.$store.getters['Allallusertoken']);
						
					},
					fail(err) {
						console.log(err)
					}
				});
			},
			getAnchorInitMsg:function(){
				uni.request({//this.GLOBAL.urlPoint
					url: this.GLOBAL.urlPoint+'/anchor/info', //仅为示例，并非真实接口地址。 https://live.mycat1314.com/
					data: {
						useridx:Number(this.anchorIdx),//	是	int64	主播idx
						languageid:JSON.stringify(this.language+1),//	是	string	语言 1：中文；2：英文
					},
					method:'GET',
					success: (res) => {
						console.log(res.data.data)
						if(res.data.code==10000){
							this.anchorLoginMsg=res.data.data;
							this.$store.dispatch('SET_allAnchorLoginData',res.data.data);
							this.$store.dispatch('SET_allserverid',res.data.data.serverid);
							this.$store.dispatch('SET_allroomidx',res.data.data.roomidx);
						}else{
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								icon:'none'
							});
						}
						
					},
					fail(err) {
						console.log(err)
					}
				});
			},
			keepLiveUrl:function(){
				var urlTime ={url:window.location.href,time:new Date().getTime()};
				console.log(urlTime)
				this.$store.dispatch('SET_allUrlTime',urlTime);
			}
		},
	}
</script>

<style lang="scss" scoped>
page{
	width: 100%;
	height: 100%;
	// opacity: 0.74;
	background: #fff;
}
.content{
	width:100%;
	height:100%;
	background-image:url('../../static/imgs/beginBg.png');
	background-size: 100% 100%;
	background-repeat:no-repeat;
	background-position: top center;
	// background-image: radial-gradient(48% 103%, rgba(0,0,0,0.58) 25%, rgba(0,0,0,0.78) 100%);
	position: relative;
	.closeBtnImg{
		position: absolute;
		right: 33rpx;
		top: 33rpx;
		width:60rpx;
		height:60rpx;
		padding: 10rpx;
	}
	.anchorInfoArea{
		width: 100%;
		padding-top: 170rpx;
		.photo{
			margin: auto;
			width: 110rpx;
			height: 110rpx;
			border-radius: 50%;
			border:1rpx solid firebrick;
			margin-left: 320rpx;
			margin-bottom: 34rpx;
		}
		.name{
			font-size: 32rpx;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: center;
			line-height:45rpx;
		}
		.idx{
			text-align: center;
			line-height:40rpx;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}
	.passwordArea{
		width: 700rpx;
		height: 250rpx;
		background: rgba(0,0,0,0.40);
		border: 1px solid rgba(255,255,255,0.20);
		border-radius: 16rpx;
		margin: auto;
		margin-top: 100rpx;
		.tips{
			padding-top: 58rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			text-indent: 52rpx;
			color: #FFFFFF;
		}
		.input{
			border: 2rpx solid #FFFFFF;
			height: 62rpx;
			width: 615rpx;
			margin-left: 52rpx;
			margin-top: 30rpx;
			background-image: linear-gradient(-143deg, rgba(254,225,64,0.11) 0%, rgba(254,7,189,0.23) 100%);
			border-radius: 8rpx;
			text-indent: 10rpx;
			color: #FFFFFF;
		}
	}
	.sureBtn{
		width: 640rpx;
		height: 82rpx;
		border-radius: 20rpx;
		margin: auto;
		margin-top: 390rpx;
		background-image: linear-gradient(-100deg, rgba(254,225,64,0.27) 0%, rgba(254,7,189,0.52) 100%);
		border: 2rpx solid #FFD525;
		font-size: 36rpx;
		text-align: center;
		line-height: 82rpx;
		color:#FFD525;
	}
}
</style>
