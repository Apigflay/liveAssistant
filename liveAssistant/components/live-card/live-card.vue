<template>
	<view class="liveCardArea">
		<view class="anchorCard">
			<view class="anchorInfo">
				<img class="photo" :src="anchorData.headpic" alt="">
				<view class="infoArea">
					<view class="name">{{anchorData.signature}}</view>
					<view class="id">ID:{{anchorData.useridx}}</view>
				</view>
			</view>
			<view class="userList">
				<view class="userScroll" :style="'width:'+userList.length*72+'rpx'">
					<image v-for="(item,index) in userList" :key="index" class="userPho" :src="item.headpic" mode=""></image>
				</view>
			</view>
			<img class="closeBtn" @click.stop="gopages" src="static/imgs/close.png" alt="">
		</view>
		<view class="liveNumArea">
			<view class="fireNum">
				<!-- <image class="fireImg" src="static/imgs/close.png" mode=""></image> -->
				<image class="fireImg" src="../../static/imgs/fire.png" mode=""></image>
				<text class="text">{{hotNum}}</text>
			</view>
			<view class="peopleNum">
				<!-- {{this}} -->
				{{userList.length}}{{this.Language.language[language].language7}}
			</view>
		</view>
	</view>
</template>
<script>
	import md5 from '@/lib/md5/md5.js'; //md5加密
	import {NavLanguage,sendDSocket} from "../../lib/js/GlobalFunction.js";
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			hrackH: { //轨道高度
				type: Number,
				default: 40
			}
		},
		data() {
			return {
				language:1,//语言
				anchorData:null,//主播信息
				// userList:[],//用户列表
				// hotNum:0,//热度
			}
		},
		created() {
			this.language=NavLanguage();
			this.anchorData=this.$store.getters['AllallAnchorLoginData'];
			// this.userList=this.$store.getters['liveroom/get_liveUserListData'];
		},
		computed:{
			hotNum(){
				return this.$store.getters['liveroom/get_liveHotNum'];
			},
			userList(){
				return this.$store.getters['liveroom/get_liveUserListData'];
			}
		},
		mounted() {
			//leftBottom 使用参数
			// if (this.type === 'leftBottom') {
			// 	this.hrackNum = Math.floor(this.maxTop / this.hrackH);
			// }
		},
		methods: {
			add(obj) {
	
			},
			gopages:function(){
				console.log('close btn click')
				this.$store.dispatch('SET_allIsLogin',false);
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
					uni.reLaunch({
						url: '/pages/showEnd/showEnd'
					});
				  	console.log(com)
				  }
				});
			}
		}

	}
</script>
<style>

</style>
<style lang="scss" scoped>
.liveCardArea{
	position:absolute;
	top:0;
	left:0;
	width: 100%;
	height: 72rpx;
	padding-top: 10rpx;
	.anchorCard{
		width: 710rpx;
		height: 72rpx;
		padding:0rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.anchorInfo{
			width: 260rpx;
			height: 72rpx;
			border-radius: 36rpx;
			background:rgba(0, 0, 0, 0.3);
			display: flex;
			align-items: center;
			color: #FFFFFF;
			// justify-content: space-between;
			.photo{
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-left: 6rpx;
			}
			.infoArea{
				height: 60rpx;
				width: 160rpx;
				margin-left: 6rpx;
				.name{
					font-size: 28rpx;
					line-height: 32rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.id{
					font-size: 20rpx;
					line-height: 28rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
		.userList{
			width: 370rpx;
			height: 60rpx;
			overflow-x: scroll;
			.userScroll{
				display: flex;
				flex-wrap: nowrap;
				justify-content: space-between;
				height: 60rpx;
				.userPho{
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}
		}
		.closeBtn{
			width: 60rpx;
			height: 60rpx;
			padding: 6rpx;
		}
	}
	.liveNumArea{
		width: 710rpx;
		height: 38rpx;
		padding: 16rpx 20rpx 0rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.fireNum{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 38rpx;
			border-radius: 19rpx;
			background: rgba(0,0,0,0.26);
			padding: 0 13rpx;
			.fireImg{
				width: 22rpx;
				height: 28rpx;
				padding: 8rpx;
			}
			.text{
				font-size: 24rpx;
				padding: 8rpx;
				color: #FFD525;
			}
		}
		.peopleNum{
			padding: 8rpx 13rpx;
			background: rgba(0,0,0,0.26);
			font-size: 24rpx;
			line-height: 24rpx;
			border-radius: 8rpx;
			color: #FFFFFF;
			text-shadow: 0 1px 1px rgba(0,0,0,0.50);
		}
	}
}
</style>
