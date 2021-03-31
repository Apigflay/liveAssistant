<template>
	<view class="content">
		<div id="remote-user" class="remote-user"></div>
		<div class="videoInfo">
			<view class="title">
				
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
	// import AgoraRTC from '../../lib/agora/AgoraRTC_N-4.3.0.js';
	export default {
		data() {
			return {
				appid: '03ac21a052434a9792bec6223b6fbeb0',//03ac21a052434a9792bec6223b6fbeb0
			    token: '00603ac21a052434a9792bec6223b6fbeb0IAAeQjsy+BbURFCY/ohYziu8LuOh0wKsg3WuHqTHHvXn9T1Ra00AAAAAEADYCUcovOtSYAEAAQC761Jg',//
				channel: '111',//
				uid:null,
				muted:true,
			};
		},
		onReady() {
			// this.joinRoom()
		},
		methods:{
			joinRoom:function(){
				// 处理错误的函数
				var handleError = function(err){
				        console.log("Error: ", err);
				};
				
				// 定义远端视频画面的容器
				var remoteContainer = document.getElementById("remote-user");
				
				// 将视频流添加到远端视频画面容器的函数
				function addVideoStream(elementId){
				        // 给每个流创建一个 div
				        var streamDiv = document.createElement("div");
				        // 将 elementId 分配到 div
				        streamDiv.id = elementId;
				        // 处理镜像问题
				        streamDiv.style.transform = "rotateY(180deg)";
				        // 将 div 添加到容器
				        remoteContainer.appendChild(streamDiv);
				};
				
				console.log(AgoraRTC)//播放器
				console.log(AgoraRTC.checkSystemRequirements())//是否支持
				// 创建并初始化一个用于控制通话的客户端对象
				var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
				console.log(client)
				// AgoraRTC.init(this.appid);
				
				//设置用户角色 role 的值可以是 "host" 或者 "audience".
				// client.setClientRole('audience');
				
				var uid = client.join(this.appid,this.channel,this.token,this.uid);
				console.log(uid)
				
				
				client.on("user-published", async (user, mediaType) => {//user-published
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
				
				
				
				
				//join(appid: string, channel: string, token: string | null, uid?: UID | null): Promise<UID>
				// var uid = client.join(this.appid,this.channel,this.token,this.uid);
				// console.log(uid)
				// // 订阅远端视频
				// client.on("stream-added", async (user, mediaType) => {//user-published
				// 	console.log('11111')
				// 	console.log(user)
				// 	console.log('2222'+mediaType)
				//   await client.subscribe(user, mediaType);
				//   if (mediaType === "video") {
				//     console.log("subscribe video success");
				//     user.videoTrack.play(document.getElementById('remote-user'));
				// 	// console.log(document.getElementsByClassName('uni-video-video'))
				// 	// user.videoTrack.play(document.getElementsByClassName('uni-video-video')[0])
					
					
				// 	// document.getElementById('remote-user')
				//   }
				//   if (mediaType === "audio") {
				//     console.log("subscribe audio success");
				//     user.audioTrack.play();
				//   }
				// })
				

			},
			joinRoom1:function(){
				console.log(AgoraRTC)
				console.log(AgoraRTC.checkSystemRequirements())
				// create Agora client
				var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
				// 加入channel
				//join(appid: string, channel: string, token: string | null, uid?: UID | null): Promise<UID>
				var uid = client.join(this.appid,this.channel,this.token,this.uid);
				console.log(uid)
				// 订阅远端视频
				client.on("user-published", async (user, mediaType) => {//user-published
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
				this.joinRoom()
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
