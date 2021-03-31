<template>
	<view class="optionsArea">
		<div class="voiceBtn">
			<img class="mutedImg img" @click="swichVoice(true)" src="static/imgs/muted.png" alt="" v-if='muted==true'>
			<img class="sourceImg img" @click="swichVoice(false)" src="static/imgs/source.png" alt="" v-if='muted==false'>
		</div>
		<input class="input" :maxlength="14" v-model.trim="valueText" type="text" value="" confirm-type="send" @confirm="goSendGift(2)" />
		<image class="sendBtnImg" @click="goSendGift(2)" src="../../static/imgs/send1y.png" mode=""></image>
		<view class="emojiArea">
			<img class="img" @click.stop="goSendGift(1)" src="static/imgs/emoji.png" alt="" >
		</view>
		<view class="giftArea">
			<img class="img" @click.stop="goSendGift(0)" src="static/imgs/gift1.png" alt="" >
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				muted:true,
				valueText:'',
			};
		},
		methods:{
			swichVoice:function(status){//声音状态
				console.log(status)
				if(status){
					this.muted=false;
				}else{
					// this.muted=true;
				}
			},
			goSendGift:function(id){//0 礼物 1表情 2 文字
				if(id==0){
					this.$emit('openGiftBox',true)
				}else if(id==1){
					this.$emit('openEmojiBox',true)
				}else if(id==2){
					this.$emit('openInputBox',this.valueText)
					this.valueText='';
					uni.hideKeyboard();  
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.optionsArea{
	width: 750rpx;
	height: 110rpx;
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.voiceBtn{
		width: 70rpx;
		height: 70rpx;
		margin-left:20rpx;
		.img{
			width: 70rpx;
			height: 70rpx;
		}
	}
	.input{
		width: 380rpx;
		height: 68rpx;
		border-radius: 10rpx;
		border: 1px solid #FFFFFF;
		color: #fff;
		// border: 1rpx solid #000;
	}
	.sendBtnImg{
		width: 70rpx;
		height: 70rpx;
	}
	.emojiArea{
		width: 70rpx;
		height: 70rpx;
		.img{
			width: 70rpx;
			height: 70rpx;
		}
	}
	.giftArea{
		width: 70rpx;
		height: 70rpx;
		margin-right: 20rpx;
		.img{
			width: 70rpx;
			height: 70rpx;
		}
	}
}
</style>
