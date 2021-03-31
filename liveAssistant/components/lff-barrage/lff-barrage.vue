<template>
	<!-- style="overflow: hidden;position: fixed;width: 100%;height: 100%;pointer-events: none; top: 0;" -->
	<view class="danmuArea" >
		<view class="welText" v-show="welTStaus"><text class="textW">{{welT}}</text></view>
		<view class="danmu-li" v-for="(item,index) in listData" :class="item.type" :style="item.style" :key="index">
			<view class="danmu-inner">
				<view class="user-box">
					<!-- <view class="user-img">
						<view class="img-box">
							<image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=317894666,3379114684&fm=26&gp=0.jpg"></image>
						</view>
					</view> -->
					<view class="user-text cl1" v-if="item.item.ctype==1||item.item.ctype==2">
						{{item.item.fnickname}}: 
					</view>
					<view class="user-text cl1" v-if="item.item.ctype==3">
						{{item.item.fnickname}}
					</view>
					<view class="user-text1 cl1" v-if="item.item.ctype==1">
						{{item.item.msgcontent}}
					</view>
					<!-- icon  SVGA1 -->
					<image class="imgIcon" :src="item.item.iconData.icon" mode="" v-if="item.item.ctype==2"></image>
					<view class="user-text2 cl1" v-if="item.item.ctype==3">
						送出了
					</view>
					<image class="imgIcon" :src="item.item.iconData.icon" mode="" v-if="item.item.ctype==3"></image>
					<view class="user-text4 cl1" v-if="item.item.ctype==4">
						{{item.item.nickname}} <text class="comeText">is coming !</text>
					</view>
					
					<!-- <view class="user-status cl1">
						
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			//rightToLeft leftToRight leftBottom
			type: {
				type: String,
				default: 'rightToLeft'
			},
			list: {
				type: Array,
				default () {
					return []
				}
			},
			minTime: {
				type: Number,
				default: 4
			},
			maxTime: {
				type: Number,
				default: 9
			},
			minTop: {
				type: Number,
				default: 0
			},
			maxTop: {
				type: Number,
				default: 240
			},
			hrackH: { //轨道高度
				type: Number,
				default: 40
			}
		},
		data() {
			return {
				listData: [],
				welT:'欢迎来到直播间',
				welTStaus:true,
			}
		},
		mounted() {
			//leftBottom 使用参数
			if (this.type === 'leftBottom') {
				this.hrackNum = Math.floor(this.maxTop / this.hrackH);
			}
			console.log('aaaa')
			var that =this;
			setTimeout(function(){
				that.welTStaus=false;
			},7000)
		},
		methods: {
			add(obj) {
				let data = {
					item: obj.item,
					id:Date.parse(new Date()),
					time: Math.ceil(Math.floor(Math.random() * (this.maxTime - this.minTime + 1) + this.minTime)),
					type: this.type
				}
				if (this.type === 'leftBottom') {
					let objData = {
						item: data.item,
						type: 'leftBottomEnter',
						style: {
							transition: `all 0.5s`,
							animationDuration: `0.5s`,
							transform: `translateX(0%)`,
							bottom: `${this.minTop}px`
						}
					}
					let listLen = this.listData.length;
					let hrackNum = this.hrackNum;
					for (let i in this.listData) {
						if(this.listData[i].status === 'reuse'){ //重用
							this.$set(this.listData,i,objData);
						}else if(this.listData[i].status === 'reset'){ //重置
							this.listData[i].style.transition = 'none';
							this.listData[i].style.bottom = 0;
							this.listData[i].status = 'reuse';
						}else if(this.listData[i].status === 'recycle'){ //回收
							this.listData[i].type = 'leftBottomExit';
							this.listData[i].status = 'reset';
						}else{
							this.listData[i].style.bottom = parseInt(this.listData[i].style.bottom) + this.hrackH + 'px';
						}
						if(parseInt(this.listData[i].style.bottom) >= (this.maxTop - this.hrackH) && this.listData[i].status !== 'reset'){ //需要回收
							this.listData[i].status = 'recycle';
						}
					}
					if(listLen < hrackNum + 2){
						this.listData.push(objData);
					}
				} else if (this.type === 'rightToLeft') {
					let objData = {
						item: data.item,
						type: 'rightToLeft',
						style: {
							animationDuration: `${data.time}s`,
							top: `${Math.ceil(Math.random() * (this.maxTop - this.minTop + 1) + this.minTop)}px`
						},
						delTime: Date.parse(new Date()) + data.time * 1200
					}
					for (let i in this.listData) {
						if (this.listData[i].delTime <= Date.parse(new Date())) {
							this.repaint(i, objData.type);
							objData.type = '';
							this.$set(this.listData, i, objData);
							return
						}
					}
					this.listData.push(objData);
				}
			},
			repaint(index, type) {
				setTimeout(() => {
					this.listData[index].type = type;
				}, 100)
			}
		}

	}
</script>
<style>

</style>
<style lang="scss">
	@keyframes leftBottomEnter {
		0% {
			transform: translateY(100%);
			opacity: 0;
		}

		100% {
			transform: translateY(0%);
			opacity: 1;
		}
	}

	@keyframes leftBottomExit {
		0% {
			transform: translateY(0%);
			opacity: 1;
		}
		
		100% {
			transform: translateY(-200%);
			opacity: 0;
		}
	}

	@keyframes leftToRight {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(100%);
		}
	}

	@keyframes rightToLeft {
		0% {
			transform: translateX(100%);
		}

		100% {
			transform: translateX(-100%);
		}
	}
	.danmuArea{
		overflow: hidden;
		position: absolute;
		z-index: 10;
		width: 100%;
		height: 500rpx;
		pointer-events: none;
		left: 0rpx;
		bottom: 110rpx;
		padding-top: 40rpx;
		.welText{
			position: relative;
			top: -20rpx;
			.textW{
				line-height:60rpx;
				font-size: 32rpx;
				padding:0 50rpx;
				background-image: linear-gradient(66deg, #FFD525 0%, rgba(254,212,99,0.71) 59%, rgba(250,209,251,0.00) 100%);
				border-radius: 50rpx;
				color: red;
			}
		}
	}
	.danmu-li {
		position: absolute;
		width: 100%;
		transform: translateX(100%);
		animation-timing-function: linear;

		&.leftBottomEnter {
			animation-name: leftBottomEnter;
		}
		&.leftBottomExit{
			animation-name: leftBottomExit;
			animation-fill-mode: forwards;
		}

		&.rightToLeft {
			animation-name: rightToLeft;
		}

		&.leftToRight {
			animation-name: rightToLeft;
		}

		.danmu-inner {
			display: inline-block;

			.user-box {
				
				display: flex;
				// padding: 3rpx 40rpx 3rpx 10rpx;
				padding: 3rpx 40rpx 3rpx 10rpx;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 32rpx;
				align-items: center;
				flex-wrap:wrap;
				// .user-img {
				// 	.img-box {
				// 		display: flex;

				// 		image {
				// 			width: 58rpx;
				// 			height: 58rpx;
				// 			background: rgba(55, 55, 55, 1);
				// 			border-radius: 50%;
				// 		}
				// 	}
				// }
				.user-text {
					margin-left: 10rpx;
					// white-space: nowrap;
					line-height:60rpx;
					font-size: 32rpx;
					font-weight: 400;
					// width: 80rpx;
					color:#00deff;
					
				}
				.user-text1 {
					margin-left: 10rpx;
					// white-space: nowrap;
					font-size: 28rpx;
					font-weight: 400;
					color: #fff;
				}
				.user-text2 {
					margin-left: 10rpx;
					// white-space: nowrap;
					font-size: 28rpx;
					font-weight: 400;
					color: #fd48fb;
				}
				.user-text4 {
					margin-left: 10rpx;
					// white-space: nowrap;
					font-size: 28rpx;
					line-height:60rpx;
					font-weight: 400;
					color: #fd48fb;
					.comeText{
						margin-left: 10rpx;
						color:#fee456;
					}
				}
				.user-status {
					margin-left: 10rpx;
					white-space: nowrap;
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(255, 255, 255, 1);
				}
				.imgIcon{
					height:60rpx;
					width:60rpx;
				}
			}
		}
	}
</style>
