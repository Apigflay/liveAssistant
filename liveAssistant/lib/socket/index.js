import store from '../../store/index.js'
import Global_ from '../js/GlobalObj.js'   //全局对象
console.log('websocket')
// console.log(store)
import {sendD110,sendDSocket,doBlob,Do,web} from "..//js/GlobalFunction.js";

var socketOpen = false;
var socketMsgQueue = [66];

console.log(Global_.urlSocketPoint)

uni.connectSocket({
  url: Global_.urlSocketPoint
});

// uni.onSocketOpen(function (res) {
//   console.log('WebSocket连接已打开！');
// });
uni.onSocketError(function (res) {
  console.log('WebSocket连接打开失败，请检查！');
  uni.showToast({
  	title: 'WebSocket连接打开失败，请检查！',
  	duration: 2000,
  	icon:'none'
  });
  uni.connectSocket({
    url: Global_.urlSocketPoint
  });
});
uni.onSocketClose(function (res) {
  console.log('WebSocket 已关闭！');
  uni.showToast({
  	title: 'WebSocket 已关闭！',
  	duration: 4000,
  	icon:'none'
  });
  var timer = null;
  var timerStates= true;
  if(store.getters['AllallIsLogin']==true){
	  console.log('WebSocket 已关闭！--1')
	  timer=setInterval(function(){
	  		  if(timerStates){
				  console.log('lianjie ----中')
	  			  uni.connectSocket({
	  			    url: Global_.urlSocketPoint,
	  			  			success(sus) {
	  			  				console.log(sus)
	  							timerStates=false;
	  							clearInterval(timer)
	  			  			},
							fail(err) {
								console.log(err)
							},
	  			  			complete(com){
	  			  				console.log(com)
	  			  			}
	  			  });
	  		  }
	  		  
	  },100)
  }else{
	console.log('WebSocket 已关闭！--3')
  }
});
uni.onSocketOpen(function (res) {
	console.log('WebSocket连接已打开！');
	console.log(store.getters['AllallIsLogin'])
	if(store.getters['AllallIsLogin']==true){
		var msgS = JSON.stringify({"counter": 66,serverid:store.getters['Allallserverid'],roomidx:store.getters['Allallroomidx']})
		var arr = sendDSocket(msgS,20025)
		uni.sendSocketMessage({
		  data: arr,
		  success(res) {
		  	// console.log(res)
		  },
		  complete(com) {
		  	// console.log(com)
			
		  }
		});
	}else{
		
	}
  socketOpen = true;
  for (var i = 0; i < socketMsgQueue.length; i++) {
    sendSocketMessage(socketMsgQueue[i]);
  }
  socketMsgQueue = [];
});

function sendSocketMessage(msg) {//原始心跳  11000 改为房间心跳 20025
		setInterval(function(){
			var msgS = JSON.stringify({"counter": 66,serverid:store.getters['Allallserverid'],roomidx:store.getters['Allallroomidx']})
			console.log(msgS)
			var arr = sendDSocket(msgS,20025)
			if(store.getters['AllallIsLogin']==true){
				uni.sendSocketMessage({
				  data: arr,
				  success(res) {
				  	// console.log(res)
				  },
				  complete(com) {
				  	// console.log(com)
					
				  }
				});
			}
		},10000)
		
  if (socketOpen) {
    
  } else {
    socketMsgQueue.push(msg);
  }
}
// 收到消息
uni.onSocketMessage(function (res) {
	// console.log(res)
	// console.log(res.data)
	// var result = doBlob(res.data)
	// console.log(result)
	// let base64 =  doBlob(res.data);
	// console.log(base64)
	
	Do(res.data)
// let base64 = Do(res);
// console.log(base64)
});