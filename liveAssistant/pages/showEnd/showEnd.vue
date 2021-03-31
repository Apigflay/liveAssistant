<template>
	<view class="content">
		<!-- <img class="closeBtnImg" src="static/imgs/close.png" alt=""> -->
		<view class="anchorInfoArea">
			<view class="endTips">{{this.Language.language[language].language3}}</view>
			<img class="photo" :src="anchorLoginData.headpic" alt="">
			<view class="name">{{anchorLoginData.signature}}</view>
			<view class="idx">{{anchorLoginData.useridx}}</view>
		</view>
		<div class="passwordArea">
			<view class="tips"><text class="text">{{this.Language.language[language].language5}}</text>{{UrlTime.url}}</view>
			<view class="tipsTime"><text class="text">{{this.Language.language[language].language6}}</text>{{nowTime}}</view>
		</div>
		<view class="sureBtn" @click="goLivePages">
			{{this.Language.language[language].language4}}({{timeNum}}s)
		</view>
	</view>
</template>

<script>
	import {NavLanguage} from "../../lib/js/GlobalFunction.js";
	export default {
		data() {
			return {
				language:1,
				timeNum:30,
				timer:null,
				anchorLoginData:null,//主播信息
				UrlTime:null,//本次直播信息
				nowTime:0,//时差
			};
		},
		onLoad() {
			this.language=NavLanguage();
			this.add()
			this.anchorLoginData=this.$store.getters['AllallAnchorLoginData'];
			this.UrlTime=this.$store.getters['AllallUrlTime'];
			this.nowTime=this.secondToDate(Math.floor((new Date().getTime()-this.UrlTime.time)/1000));
			console.log(this.nowTime)
			this.$store.dispatch('SET_allIsLogin',false);
			this.closeSocket()
		},
		methods: {
			add:function(){
				var that = this;
				this.timer = setInterval(function(){
					console.log(that.timeNum)
					if(that.timeNum<=0){
						that.timeNum=0;
						clearInterval(that.timer)
						window.location.href="https://www.google.com/";
						// uni.reLaunch({
						// 	url: '/pages/beginShow/beginShow'
						// });
					}else{
						that.timeNum--;
					}
				},1000)
			},
			goLivePages:function(){
				console.log('close')
				window.location.href="https://www.google.com/";
			},
			secondToDate:function(result) {
			    var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
			    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
			    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
			    return result = h + ":" + m + ":" + s;
			},
			closeSocket:function(){
				uni.closeSocket();
			}
		},
		onUnload(){
			clearInterval(this.timer)
		}
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
	background-image:url('../../static/imgs/endBg.png');
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
		padding-top: 160rpx;
		.endTips{
			line-height: 60rpx;
			font-size: 42rpx;
			text-align: center;
			color: #FFFFFF;
			margin-bottom: 32rpx;
		}
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
			// padding-top: 58rpx;
			word-break:break-all;
			width: 600rpx;
			padding: 58rpx 50rpx 20rpx 50rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #FFFFFF;
			.text{
				padding-right: 40rpx;
			}
		}
		.tipsTime{
			width: 600rpx;
			padding: 0 50rpx;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #FFFFFF;
			.text{
				padding-right: 40rpx;
			}
		}
		
	}
	.sureBtn{
		width: 640rpx;
		height: 82rpx;
		border-radius: 20rpx;
		margin: auto;
		margin-top: 240rpx;
		background-image: linear-gradient(-100deg, rgba(254,225,64,0.27) 0%, rgba(254,7,189,0.52) 100%);
		border: 2rpx solid #FFD525;
		font-size: 36rpx;
		text-align: center;
		line-height: 82rpx;
		color:#FFD525;
	}
}
</style>
