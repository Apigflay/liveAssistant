<template>
	<view class="content_giftBox">
		<!-- 送礼 -->
		<view class="giftArea" >
			<view class="gift" >
				<!-- tab -->
				<view class="tab">
					<view :class="index==current?'tabActive':'item'" v-for="(item,index) in GiftsData" :key="index" :id="index" @click.stop="changeTab(index)">
						<text class="text">{{item.tabName}}</text>
					</view>
					<image class="closeBtn" @click.stop="goBackPages(1)" src="../../static/imgs/close.png" mode=""></image>
				</view>
				<!-- 礼物区域 -->
				<view class="swiperArea">
					<swiper class="swiper" :current="current" :circular="circular" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" @animationfinish="getChangeMsg">
						<swiper-item v-for="(item,index) in GiftsData" :key="index" :id="index">
							<view class="swiper-item uni-bg-green">
								<view class="listPer" :class="acGiftid==item1.giftid?'aclistPer':''" v-for="(item1,index1) in item.list" :key="index1" :id="index1" @click.stop="sendPic(item1.giftid,$event)">
									<view class="gift_img"><image class="photo" :src="item1.icon"></image></view>
									<view class="gift_name">{{item1.name}}</view>
									<view class="gift_num">
										<!-- <image class="img" src="../../static/imgs/goldM1.png"></image> -->
										<!-- <text class="text">{{item1.price}}</text> -->
									</view>
								</view>
								
							</view>
						</swiper-item>
						
					</swiper>		
				</view>
				<!-- 赠送 -->
				<view class="giftSendArea">
					<view class="cashArea">
						<text class="cash">送给</text>
						<text class="num">{{anchorLoginData.signature}}</text>
						<!-- <text class="cash">CAT币: </text>
						<text class="num">555</text>
						<text class="pay"  @click.stop="goBackPages(2)">充值</text> -->
					</view>
					<text class="send" @click.stop="sendGiftBtn">赠送</text>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// liwu
				GiftsData:[
					{id:0,tabName:'礼物',list:[]}],//tab 
				acGiftid:-1,//当前选中的礼物id 
				indicatorDots: false,//指示点显示
				autoplay: false,//自动播放
				interval: 2000,//间隔
				duration: 500,//动画时长
				circular:true,//衔接
				current:0,//当前activity的滑块
				anchorLoginData:null,//主播信息
			};
		},
		created() {
			console.log(this.$store.getters['AllallGiftData'])
			this.GiftsData[0].list=this.$store.getters['AllallGiftData'];
			console.log(this.GiftsData)
			this.anchorLoginData=this.$store.getters['AllallAnchorLoginData'];
		},
		methods:{
			goBackPages:function(index){//1 关闭
				if(index==1){
					this.$emit('closeGiftBox',false)
				}else if(index==2){
					
				}
				
			},
			changeTab:function(e){// tab 部分
				this.current = e;
			},
			getChangeMsg:function(e){ // swiper 给 tab传值
				this.current = e.detail.current
			},
			sendPic:function(giftId,event){//礼物图片点击
				this.acGiftid=giftId;
			},
			sendGiftBtn:function(){
				if(this.acGiftid==-1){
					
				}else{
					console.log(this.acGiftid)
					this.$emit('sendGift',this.acGiftid)
					this.acGiftid=-1;
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
// page{
// 	width: 100%;
// 	height: 100%;
// 	background: #fff;
// }
.content_giftBox{
	// position: relative;
	.giftArea{//礼物区域
		position: absolute;
		z-index: 11;
		right:0rpx;
		background: #000;
		bottom:0rpx;
		width: 100%;
		height:485rpx;//+90
		.gift{
			width: 100%;
			height: 100%;
			// ---
			.swiperArea{
				// padding:0 25rpx;
				height: 305rpx;
				.swiper{
					width: 100%;
					height: 100%;
					.swiper-item{
						height: 100%;
						display: flex;
						justify-content: flex-start;
						// align-items: center;
						flex-wrap: wrap;
						overflow-y: scroll;
						.listPer{
							width: 175rpx;//240
							height: 180rpx;
							color: #fff;
							margin-top: 20rpx;
							margin-bottom: 8rpx;
							display: flex;
							flex-direction:column;
							align-items: center;
							margin-left: 10rpx;
							.gift_img{ // 礼物图片div大小
								width: 100rpx;//140
								height: 100rpx;
								.photo{
									width: 100rpx;
									height: 100rpx;
								}
							}
							.gift_name{
								font-size:20rpx;
								color:rgba(116,116,116,1);
								line-height:36rpx;
							}
							.gift_num{
								display: flex;
								justify-content: center;
								align-items: center;
								.img{
									width:20rpx;
									height:20rpx;
									margin-right: 5rpx;
								}
								.text{
									font-size:18rpx;
									font-family:PingFang TC;
									font-weight:400;
									color:rgba(255,255,255,1);
									line-height:36rpx;
								}
							}
						}
						.aclistPer{
							border:1rpx solid #FFD600;
							box-sizing: border-box;
						}
					}				
				}
			}
			.tab{
				width: 660rpx;
				padding-right: 90rpx;
				overflow-x: scroll;
				height: 90rpx;
				background: #191919;
				display:flex;
				align-items:center;
				position: relative;
				.closeBtn{
					position: absolute;
					right: 0;
					top: 0;
					padding: 15rpx;
					width: 60rpx;
					height: 60rpx;
				}
				.item{
					color: #747474;
					font-size: 26rpx;
					font-weight: 400;
					padding:32rpx 40rpx 33rpx 40rpx;
					height: 25rpx;
					line-height: 36rpx;
					white-space:nowrap
				}
				.tabActive{
					color:#FFFFFF;
					font-size: 26rpx;
					font-weight: 400;
					margin:0rpx 40rpx 0rpx 40rpx;
					height: 25rpx;
					line-height: 36rpx;
					white-space:nowrap
				}
			}
			.giftSendArea{
				width: 100%;
				height: 90rpx;
				background:rgba(25,25,25,1);
				display:flex;
				align-items:center;
				justify-content: space-between;
				font-size: 30rpx;
				.cashArea{
					display:flex;
					align-items:center;
					margin-left: 28rpx;
					.cash{
						color: #fff;
					}
					.num{
						color:#FFD600;
					}
					.pay{
						width:100rpx;
						height:46rpx;
						border:2px solid rgba(255,214,0,1);
						border-radius:8rpx;
						margin-left: 20rpx;
						line-height: 46rpx;
						text-align: center;
						color: #FFD600;
					}
				}
				.send{
					width:100rpx;
					height:46rpx;
					background:rgba(255,214,0,1);
					border-radius:8rpx;
					line-height: 46rpx;
					text-align: center;
					margin-right: 28rpx;
				}
			}
			// ---
		}
	}
}
</style>
