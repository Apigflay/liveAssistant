<template>
	<view class="content">
		<view class="videoArea" :style="bigUrl" @click.stop="goPages(0)">
			<!-- video -->
			<div id="remote-user" class="remote-user"></div>
			<!-- 主播信息 -->
			<live-card></live-card>
			<!-- 消息输入 礼物展示 -->
			<input-options @openGiftBox="goOpenGiftBox" @openEmojiBox="goOpenEmojiBox" @openInputBox="sendInput"></input-options>
			<!-- 送礼 -->
			<gift-box v-show="showStatus_gift" @closeGiftBox="goCloseGiftBox" @sendGift="sendGift"></gift-box>
			<!-- 表情 -->
			<emoji v-show="showStatus_emoji" @sendEmojiBox="sendEmoji"></emoji>
			<!-- 礼物展示 -->
			<gift-show></gift-show>
			<!-- 弹幕 -->
			<lff-barrage ref="lffBarrage" :maxTop="240" type="leftBottom"></lff-barrage>
			<!-- <lff-barrage ref="lffBarrage2"></lff-barrage> -->
			<!--  -->
		</view>
		
	</view>
</template>

<script>
	import AgoraRTC from '../../lib/agora/AgoraRTC_N-4.3.0.js';
	import md5 from '@/lib/md5/md5.js'; //md5加密
	import liveCard from '@/components/live-card/live-card.vue';
	import inputOptions from '@/components/input-options/input-options.vue';
	import giftBox from '@/components/gift-box/gift-box.vue';
	import emoji from '@/components/emoji/emoji.vue';
	import giftShow from '@/components/gift-show/gift-show.vue';
	import lffBarrage from '@/components/lff-barrage/lff-barrage.vue';
	
	import {NavLanguage,sendDSocket} from "@/lib/js/GlobalFunction.js";
	export default {
		components: {
			liveCard,
			inputOptions,
			giftBox,
			emoji,
			giftShow,
			lffBarrage
		},
		data() {
			return {
				showStatus_gift:false,//礼物展示
				showStatus_emoji:false,//表情展示
				language:1,//语言
				appid: '5b51eb9d1472436bba3040b2714801aa',//3668ac50c1e34ab38a8830e9f8eb15ac 1662956534e5417fb9008daff899d5de  03ac21a052434a9792bec6223b6fbeb0
				token: null,//
				channel: '624410',//
				uid:null,
				muted:true,
				bigUrl:'',
				client:null,
				user:null,
			};
		},
		onLoad() {
			this.language=NavLanguage();
			// background-image:url('./img/roomBg.png');
			console.log(this.$store.getters['AllallAnchorLoginData'])
			this.bigUrl='background-image:url('+this.$store.getters['AllallAnchorLoginData'].bigpic+')';
			// this.bigUrl=this.$store.getters['AllallAnchorLoginData'];
			console.log(this.bigUrl)
		},
		onReady() {
			this.joinRoom()
		},
		computed:{
			chatData(){
				return this.$store.getters['liveroom/get_liveChatData'];
			},
		},
		watch:{
			// isChatListChange(curval,oldval){   
			// 	this.setInitScrollMsg()
			// }
			chatData: {
				deep: true,
				handler: function (newVal,oldVal){
					console.log(newVal)
					this.$refs.lffBarrage.add({item:newVal});
				}
			}
		},
		methods: {
			goPages:function(id){//0 关闭
				console.log(id)
				if(id==0){
					this.showStatus_gift=false;
					this.showStatus_emoji=false;
				}
			},
			joinRoom:function(){
				console.log(AgoraRTC)
				// Javascript
				// 开启日志上传功能
				AgoraRTC.enableLogUpload();
				// 将日志输出级别设置为 INFO
				AgoraRTC.setLogLevel(1);
				console.log(AgoraRTC.checkSystemRequirements())
				// create Agora client
				this.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
				// 加入channel
				//join(appid: string, channel: string, token: string | null, uid?: UID | null): Promise<UID> this.channel
				var uid = this.client.join(this.appid,JSON.stringify(this.$store.getters['AllallAnchorLoginData'].roomidx),this.token,this.$store.getters['AllalluserIdx']);
				console.log(uid)
				// 订阅远端视频
				this.client.on("user-published", async (user, mediaType) => {
					console.log('11111')
					console.log(user)
					console.log(this.user)
					this.user=user;
					console.log('2222'+mediaType)
				  await this.client.subscribe(user, mediaType);
				  if (mediaType === "video") {
				    console.log("subscribe video success");
				    user.videoTrack.play(document.getElementById('remote-user'));
				  }
				  if (mediaType === "audio") {
				    console.log("subscribe audio success");
				    user.audioTrack.play();
				  }
				})
				
				// this.client.on("network-quality", (stats) => {
				//     console.log("downlinkNetworkQuality", stats.downlinkNetworkQuality);
				//     console.log("uplinkNetworkQuality", stats.uplinkNetworkQuality);
				// });
				
				
				
				console.log(this.appid,this.token,this.channel)
			},
			joinRoom2:function(){
				console.log(AgoraRTC)
				console.log(AgoraRTC.checkSystemRequirements())
				// create Agora client
				var client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
				// 加入channel
				//join(appid: string, channel: string, token: string | null, uid?: UID | null): Promise<UID> this.channel
				var uid = client.join(this.appid,JSON.stringify(this.$store.getters['AllallAnchorLoginData'].roomidx),this.token,this.uid);
				// 订阅远端视频
				client.on("user-published", async (user, mediaType) => {
				  await client.subscribe(user, mediaType);
				  if (mediaType === "video") {
				    console.log("subscribe video success");
				    user.videoTrack.play(document.getElementById('remote-user'));
				  }
				  if (mediaType === "audio") {
				    console.log("subscribe audio success");
				    user.audioTrack.play();
				  }
				})
				
				
				
				console.log(this.appid,this.token,this.channel)
			},
			goCloseGiftBox:function(status){//送礼关闭
				this.showStatus_gift=false;
			},
			sendGift:function(giftId){//送礼点击
				console.log(giftId)
				var that = this;
				var str =JSON.stringify({
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		房间idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		服务端idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					fromuseridx:this.$store.getters['AllalluserIdx'],//	int64	否		发信息idx --当前用户
					touseridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int	否		接收信息idx  --当前主播
					giftid:giftId,//	int	否		礼物id
					ctype:1,//	int	否		礼物类型：1：普通礼物 。。。
					giftnum:1,//	int	否		礼物数量 默认：1
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
					
				})
				console.log(str)
				uni.sendSocketMessage({//20009 刷礼物
				  data: sendDSocket(str,20009),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
					that.showStatus_gift=false;
				  	console.log(com)
				  }
				});
			},
			sendEmoji:function(emoji){//表情
				console.log(emoji.id)
				var that = this;
				console.log(this.$store.getters['Allallusertoken'])
				var str =JSON.stringify({
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		房间idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		服务端idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					fromuseridx:this.$store.getters['AllalluserIdx'],//	int64	否		发信息idx
					touseridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int	否		接收信息idx
					msgcontent:'',//	string	否		聊天内容
					ctype:2,//	int	否		1：聊天信息 2：表情
					icoinid:emoji.id,//	int	否		表情id 默认0
					languageid:JSON.stringify(this.language+1),//	int	否	1	语言：1：中文；2：英文
					
				})
				console.log(str)
				uni.sendSocketMessage({//20007 聊天 发表情
				  data: sendDSocket(str,20007),
				  success(res) {
					  console.log(res)
				  },
				  complete(com) {
					that.showStatus_emoji=false;
				  	console.log(com)
				  }
				});
			},
			sendInput:function(text){
				console.log(text)
				var str =JSON.stringify({
					roomidx:this.$store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		房间idx
					serverid:this.$store.getters['AllallAnchorLoginData'].serverid,//	int	否		服务端idx
					anchoridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
					fromuseridx:this.$store.getters['AllalluserIdx'],//	int64	否		发信息idx
					touseridx:this.$store.getters['AllallAnchorLoginData'].useridx,//	int	否		接收信息idx
					msgcontent:text,//	string	否		聊天内容
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
			},
			goOpenGiftBox:function(status){
				this.showStatus_gift=true;
			},
			goOpenEmojiBox:function(status){
				this.showStatus_emoji=true;
			},
		},
		onUnload(){
			this.client.unsubscribe(this.user);
			
			// this.client.unsubscribe(this.user, "video");
			// this.client.unsubscribe(this.user, "audio");
		}
	}
</script>

<style lang="scss" scoped>
page{
	width: 100%;
	height: 100%;
	background: #fff;
}
.content{
	width: 100%;
	height: 100%;
	overflow: hidden;
	.videoArea{
		width: 100%;
		height: 100%;
		position: relative;
		// background: #000;
		background-size: auto 100%;
		background-repeat:repeat;
		background-position: top center;
		.remote-user{
			position:absolute;
			width:100%;
			height:100%;
			top:0;
			left:0;
		}
		.removeBtn{
			position:absolute;
			width:100%;
			height:100rpx;
			top:100rpx;
			left:0;
		}
	}
}

</style>
