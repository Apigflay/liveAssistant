<template>
	<view class="content_emojiBox">
		<view class="emojiArea">
			<swiper class="swiper" indicator-color="#0ce625" indicator-active-color="#7f7f7f" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :current="current" :circular="circular">
				<swiper-item class="swiper-item">
					<view class="swperPer">
						<view class="perEmoji" :class="'perEmoji'+index" v-for="(item,index) in emojiData" :key="index" @click.stop="goSendEmoji(item)">
							<img class="img" :src="item.icon" alt="">
							<view class="text">{{item.name}}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// emoji
				indicatorDots: true,//指示点显示
				autoplay: false,//自动播放
				interval: 2000,//间隔
				duration: 500,//动画时长
				current:0,//当前activity的滑块
				circular:true,//衔接
				emojiData:[],//表情
				
				
				GiftsData:[
					{id:0,tabName:'热门',list:[{giftId:1,name:'花花',icon:'../../static/imgs/gift.png',price:'123'},{giftId:2,name:'花花',icon:'../../static/imgs/gift.png',price:'123'},{giftId:3,name:'花花',icon:'../../static/imgs/gift.png',price:'123'},{giftId:4,name:'花花',icon:'../../static/imgs/gift.png',price:'123'},{giftId:5,name:'花花',icon:'../../static/imgs/gift.png',price:'123'},{giftId:6,name:'花花',icon:'../../static/imgs/gift.png',price:'123'},{giftId:7,name:'花花',icon:'../../static/imgs/gift.png',price:'123'}]},
					{id:1,tabName:'普通',list:[{giftId:11,name:'花花',icon:'../../static/imgs/gift.png',price:'123'}]},
					{id:2,tabName:'奢华',list:[{giftId:21,name:'花花',icon:'../../static/imgs/gift.png',price:'123'}]}],//tab 
				acGiftid:null,//当前选中的礼物id 
				
				
				
			};
		},
		created() {
			// console.log(this.$store.getters['AllallGiftData'])
			// console.log(this.$store.getters['AllallEmojiData'])
			this.emojiData=this.$store.getters['AllallEmojiData'];
		},
		methods:{
			goSendEmoji:function(item){
				this.$emit('sendEmojiBox',item)
			},

		}
	}
</script>

<style lang="scss" scoped>
.content_emojiBox{
	position: absolute;
	z-index: 11;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 500rpx;
	background: #020003;//1d1d1d
	.emojiArea{
		height: 500rpx;
		width:750rpx;
		.swiper{
			width: 100%;
			height: 100%;
			.swperPer{
				height: 450rpx;
				display: flex;
				flex-wrap: wrap;
				.perEmoji{
					width: 150rpx;
					height: 150rpx;
					box-sizing: border-box;
					border-right:2rpx solid #1d1d1d;
					border-bottom:2rpx solid #1d1d1d;
					.img{
						height: 90rpx;
						width: 90rpx;
						margin-left: 30rpx;
					}
					.text{
						width: 100%;
						font-size: 24rpx;
						color: #dcdcde;
						line-height: 40rpx;
						text-align: center;
					}
				}
				.perEmoji4,.perEmoji9,.perEmoji14{
					border-right:none;
				}
				.perEmoji10,.perEmoji11,.perEmoji12,.perEmoji13,.perEmoji14{
					border-bottom:none;
				}
			}
		}
		.swiper /deep/ .uni-swiper-slides{
			height: 450rpx;
		}
	}
}
</style>
