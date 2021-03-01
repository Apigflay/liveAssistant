<template>
	<view class="content">
		<div id="remote-user" class="remote-user"></div>
		<div class="videoInfo">
			<view class="title">
				声网
			</view>
			AppID:
			<input v-model="appid" class="appId" type="text" value="" placeholder="请输入AppID" />
			Token:
			<input v-model="token" class="appId" type="text" value="" placeholder="请输入Token" />
			Channel:
			<input v-model="channel" class="appId" type="text" value="" placeholder="请输入Channel" />
			<button type="default" @click="findVideo">订阅远端</button>
		</div>
		
		
		<!-- <video id="remote-user" class="remote-user" src=""  :enable-progress-gesture="false" :autoplay="true" :loop="true" objectFit="cover" :muted="muted" :controls="false" :show-center-play-btn="false"></video> -->
		
	</view>
</template>

<script>
	import AgoraRTC from '../../lib/agora/AgoraRTC_N-4.3.0.js';
	export default {
		data() {
			return {
				appid: '3668ac50c1e34ab38a8830e9f8eb15ac',
			    token: '0063668ac50c1e34ab38a8830e9f8eb15acIAAwbjDxGJ5UcvTnmSnqG9lDoouE/ixmm9IoekFuKZ+/mSwUiesAAAAAEADqgOQ98+I9YAEAAQDz4j1g',
				channel: '1231',
				uid:null,
				muted:true,
			};
		},
		onReady() {
			this.joinRoom()
		},
		methods:{
			joinRoom:function(){
				console.log(AgoraRTC)
				console.log(AgoraRTC.checkSystemRequirements())
				// create Agora client
				var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
				// 加入channel
				//join(appid: string, channel: string, token: string | null, uid?: UID | null): Promise<UID>
				var uid = client.join(this.appid,this.channel,this.token,this.uid);
				// 订阅远端视频
				client.on("user-published", async (user, mediaType) => {
					console.log('11111')
					console.log(user)
					console.log('2222'+mediaType)
				  await client.subscribe(user, mediaType);
				  if (mediaType === "video") {
				    console.log("subscribe video success");
				    user.videoTrack.play(document.getElementById('remote-user'));
					// console.log(document.getElementsByClassName('uni-video-video'))
					// user.videoTrack.play(document.getElementsByClassName('uni-video-video')[0])
					
					
					// document.getElementById('remote-user')
				  }
				  if (mediaType === "audio") {
				    console.log("subscribe audio success");
				    user.audioTrack.play();
				  }
				})
				
				
				
				console.log(this.appid,this.token,this.channel)
			},
			initVideo:function(){
				
			},
			findVideo:function(){
				
			}
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
.content{
	width: 100%;
	height: 100%;
	position: relative;
	.remote-user{
		position: absolute;
		width: 100%;
		height: 100%;
		// height: 500rpx;
	}
	.videoInfo{
		width: 100%;
		height: 100%;
		position: ablolute;
		top: 0;
		left: 0;
		.title{
			text-align: center;
			
		}
		.appId{
			border: 1px solid #000;
		}
	}
	
	
}

</style>
