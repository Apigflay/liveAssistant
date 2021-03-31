<template>
	<view class="content">
		<view class="videoArea">
			<video class="video" id="videoElement" :enable-progress-gesture="false" :autoplay="true" :loop="true" objectFit="cover" :muted="muted" :controls="false" :show-center-play-btn="false">
				<cover-view class="videoPopArea" @click="goSendGift(1)">
				<!-- <view class="videoPopArea" @click="goSendGift(1)"> -->
					<div class="closeBtn"><img class="closeBtnImg" src="static/imgs/close.png" alt=""></div>
					<view class="viewK"></view>
					<input class="flvInput" type="text" v-model.trim="flvUrl" value="" placeholder="请输入流地址" />
					<button @click="swichFlvUrl" class="flvBtn" type="primary">切换</button>
					<view class="flvisSupported">FlvisSupported:{{supportFlvText}}--{{supportFlv}}</view>
					
					<div class="voiceBtn">
						<img class="mutedImg" @click="swichVoice(true)" src="static/imgs/muted.png" alt="" v-if='muted==true'>
						<img class="sourceImg" @click="swichVoice(false)" src="static/imgs/source.png" alt="" v-if='muted==false'>
					</div>
					<!-- 弹幕 -->
					<!-- <lff-barrage ref="lffBarrage" :maxTop="240" type="leftBottom"></lff-barrage> -->
					<lff-barrage ref="lffBarrage2"></lff-barrage>
					<button class="sendBarrage" type="primary" @click="sendBarrage">弹幕发送</button>
					<!-- <img v-show="show_gift==false" src="../../static/imgs/gift.png" alt="" class="sendGift" @click.stop="goSendGift(0)"> -->
					<!-- 送礼 -->
					<gift-box v-show="show_gift" @closeGiftBox="goCloseGiftBox" @sendGift="sendGift"></gift-box>
				<!-- </view> -->
				</cover-view>
			</video>
		</view>
		<!-- <button @click="play">播放</button> -->
		
	</view>
</template>

<script>
	import flvjs from '../../lib/flv/flv.js'
	import lffBarrage from '@/components/lff-barrage/lff-barrage.vue'
	import giftBox from '@/components/gift-box/gift-box.vue'
		
	export default {
		components: {
			lffBarrage,
			giftBox
		},
		data() {
			return {
				flvPlayer:null,//播放器
				muted:true,
				list: [],
				aaa:0,
				show_gift:false,
				flvUrl:'',
				supportFlv:null,
				supportFlvText:null,
			}
		},
		onLoad() {
			this.list = [
				'新年到，祝福来报到：大财、小财、意外财，财源滚滚、小财、意外财，财源滚滚、小财、意外财，财源滚滚、小财、意外财，财源滚滚',
				'亲情、爱情、朋友情，份份真情',
				'官运、财运、桃花运，运运亨通',
				'爱人、亲人、家里人，人人平安',
				'福气多多气多多气多多气多多气多多气多多气多多气多多气多多',
				'快乐连连',
				'万事圆圆',
				'微笑甜甜',
				'一帆风顺','二龙腾飞','三羊开泰','四季平安','五福临门','六六大顺','七星高照','八方来财','九九同心','十全十美！',
				'新年快乐',
			];
		},
		onReady() {
			
		},
		methods: {
			swichFlvUrl:function(){
				this.play()
			},
			play:function() {
				this.supportFlv=flvjs;
				this.supportFlvText=flvjs.isSupported()
				console.log(flvjs.isSupported());
				if (flvjs.isSupported()) {
					// var videoElement = document.getElementById('videoElement');
					var videoElement1 = document.getElementsByClassName('uni-video-video')[0];//uni-video-video
					console.log(videoElement1)
					this.flvPlayer = flvjs.createPlayer({
						type: 'flv',
						url: this.flvUrl
						// url: 'http://47.114.133.79:802/faultApp/123456.flv'
						//http://pili-live-hdl.miaobolive.com/live/27a3b716528d08db6e0357d199eeb540.flv
						//http://pili-live-hdl.miaobolive.com/live/16b728e1487585b2573e277607d58540.flv
						//http://hdl.miaobolive.com/live/60dff0cdfe6066472ccbb188b755dd12.flv
					});
					this.flvPlayer.attachMediaElement(videoElement1);
					this.flvPlayer.load();
					this.flvPlayer.play();
				}else{
					uni.showToast({
						title: '不支持',
						duration: 2000
					});
				}
			},
			swichVoice:function(status){
				if(status){
					this.muted=false;
				}else{
					this.muted=true;
				}
			},
			sendBarrage(){
				if(this.aaa==9){
					this.aaa=0;
					this.aaa += 1;
					// this.$refs.lffBarrage.add({item:this.list[this.aaa]});
					this.$refs.lffBarrage2.add({item:this.list[this.aaa]});
				}else{
					this.aaa += 1;
					// this.$refs.lffBarrage.add({item:this.list[this.aaa]});
					this.$refs.lffBarrage2.add({item:this.list[this.aaa]});
				}
				
			},
			goSendGift:function(index){// 0 送礼  1 cover 点击
				if(index==0){
					this.show_gift=true;
				}else if(index==1){
					this.show_gift=false;
				}
			},
			goCloseGiftBox:function(status){//x 点击
				this.show_gift=false;
			},
			sendGift:function(id){//
				console.log(id)
			}
			
		},
		onUnload(){
			//页面卸载
		}
	}
</script>

<style lang="scss" scoped>
page{
	width: 100%;
	height: 100%;
	background: #fff;
	/* background: red; */
}
.content {
	width:100%;
	height:100%;
	.videoArea{
		width:100%;
		height:100%;
		// .video{
		// 	width:100%;
		// 	height:100%;
		// }
		.video{
			width:100%;
			height:100%;
			.videoPopArea{
				width:100%;
				height:100%;
				position:absolute;
				top: 0;
				left: 0;
				.closeBtn{
					position:absolute;
					width:60rpx;
					height:60rpx;
					right: 20rpx;
					top: 20rpx;
					.closeBtnImg{
						width:60rpx;
						height:60rpx;
					}
				}
				.viewK{
					height: 150rpx;
				}
				.flvInput{
					// padding-top: 150rpx;
					height: 80rpx;
					border: 1px solid greenyellow;
					color: aqua;
				}
				.flvBtn{
					margin-top: 50rpx;
				}
				.flvisSupported{
					// width: 750rpx;
					overflow-x: scroll;
					font-size: 30rpx;
					line-height: 100rpx;
					color: aqua;
					word-break:break-all;
				}
				.voiceBtn{
					position:absolute;
					width:60rpx;
					height:60rpx;
					right: 20rpx;
					bottom: 20rpx;
					.mutedImg,.sourceImg{
						width:60rpx;
						height:60rpx;
					}
				}
				.sendBarrage{
					position: absolute;
					bottom: 100rpx;
					right: 0;
				}
				.sendGift{
					width:60rpx;
					height:60rpx;
					position: absolute;
					bottom: 260rpx;
					right: 20rpx;
				}
			}
		}
	}
}
</style>
