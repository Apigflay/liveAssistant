<template>
	<view class="content_giftShowBox">
		<view class="giftPer" v-for="(item,index) in giftForShowData" :key="index">
			<img class="photo" :src="item.fheadpic" alt="">
			<view class="info">
				<view class="name">{{item.fnickname}}</view>
				<view class="giftId">
					送 <text class="gName">{{item.iconData.name}}</text> 给主播
				</view>
			</view>
			<img class="giftImg" :src="item.iconData.icon" alt="">
		</view>
	</view>
</template>

<script>
	import {NavLanguage} from "../../lib/js/GlobalFunction.js";
	export default {
		props: {
			
		},
		data() {
			return {
				// emoji
				language:1,
				timer:null,
				giftForShowData:[],
				
			};
		},
		created() {
			console.log(NavLanguage())
			this.language=NavLanguage();
		},
		mounted() {
			this.doGiftData()
		},
		computed:{
			giftShowData(){
				console.log('gift-----',this.$store.getters['liveroom/get_liveGiftData'])
				return this.$store.getters['liveroom/get_liveGiftData'];
			},
		},
		watch:{
			// isChatListChange(curval,oldval){   
			// 	this.setInitScrollMsg()
			// }
			giftShowData: {
				deep: true,
				handler: function (newVal,oldVal){
					this.giftForShowData.push(newVal)
				}
			}
		},
		methods:{
			doGiftData:function(){
				var that = this;
				var giftLength=Math.floor(this.giftForShowData.length/2);
				this.timer = setInterval(function(){
					if(that.giftForShowData.length>0&&that.giftForShowData.length<10){
						that.giftForShowData.splice(0,1)
					}else if(that.giftForShowData.length>9&&that.giftForShowData.length<40){
						that.giftForShowData.splice(0,4)
					}else if(that.giftForShowData.length>39){
						that.giftForShowData.splice(0,giftLength)
					}
				},3000)
			},
			goSendEmoji:function(index){
				console.log(index+'emoji')
				this.$emit('sendEmojiBox',index)
			},

		},
		destroyed() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="scss" scoped>
.content_giftShowBox{
	position: absolute;
	// top: 340rpx;
	bottom:647rpx;
	left: 50rpx;
	width: 480rpx;
	height: 370rpx;
	overflow-y:scroll;
	// background: #020003;//1d1d1d
	// border: 1px solid #000;
	.giftPer{
		height: 90rpx;
		background-image: linear-gradient(-230deg, #2ABAFF 0%, #FAD1FB 100%);
		border: 1rpx solid rgba(255,213,37,0.56);
		border-radius: 45rpx;
		margin-bottom: 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.photo{
			border-radius: 50%;
			height: 70rpx;
			width: 70rpx;
			margin-left: 10rpx;
		}
		.info{
			flex: 1;
			height: 90rpx;
			color: #fff;
			.name{
				max-width: 100%;
				font-size: 36rpx;
				line-height: 50rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.giftId{
				font-size: 30rpx;
				line-height: 40rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				.gName{
					color: #FFD525;
				}
			}
		}
		.giftImg{
			width: 100rpx;
			height: 100rpx;
		}
	}
}
</style>
