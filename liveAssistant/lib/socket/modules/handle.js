 import store from '../../../store/index.js';
 import GLOBAL from '../../js/GlobalObj.js'   //全局对象
 import {systemId,sendDSocket,NavLanguage, navigateTo,system,productType} from "../../js/GlobalFunction.js"
 export function webMsg(code,data) {
	 console.log('收到新消息===》start')
	 // console.log(store)
	 console.log(code)
	 console.log(data)
	 console.log('收到新消息===》end')
	if(code==10002){//10002 <===10001 登录协议  登录成功
		store.dispatch('liveroom/SET_liveGiftData',null);//清空礼物
		store.dispatch('SET_allLoginInfo',data);
		if(store.getters['AllallIsLogin']){//登录
			var str =JSON.stringify({
				useridx:store.getters['AllalluserIdx'],//	int64	否		用户idx
				roomidx:store.getters['AllallAnchorLoginData'].roomidx,//	int64	否		直播间idx
				anchoridx:store.getters['AllallAnchorLoginData'].useridx,//	int64	否		主播idx
				serverid:store.getters['AllallAnchorLoginData'].serverid,//	int	否		直播间服务端id
				token:store.getters['Allallusertoken'],//	string	否		进房token
				languageid:JSON.stringify(NavLanguage()+1),//	int	否	1	语言：1：中文；2：英文
			})
			console.log(str)
			uni.sendSocketMessage({//20001 进入直播间
			  data: sendDSocket(str,20001),
			  success(res) {
				  console.log(res)
			  },
			  complete(com) {
				
			  	console.log(com)
			  }
			});
		}else{
			store.dispatch('SET_allIsLogin',true);
		}
	}
	else if(code==10010){//10010 重新登录（服务端->客户端）
		console.log(store.getters['AllallIsLogin']+'-----10010')
		if(store.getters['AllallIsLogin']==true){//登录过后断线重连
			console.log('断线重新登录')
			var str =JSON.stringify({
				devid:systemId(),//systemId(),//	string	否		唯一设备号
				useridx:store.getters['AllalluserIdx'],//	int	否		用户idx
				token:store.getters['Allallusertoken'],//验证用户的token
				// token:md5(systemId()+this.$store.getters['AllalluserIdx']+this.GLOBAL.md5key),//	string	否		加密token MD5(dev_id+useridx+key) key:@#live6HW_80&!
				devtype:'h5',//	string	否		设备类型： ios/android
				isrelogin:true,//	bool	否	false	是否重新登录
				languageid:JSON.stringify(NavLanguage()+1),//	int	否	1	语言：1：中文；2：英文
				verison:'1.0.0',//	string	否		版本号
			})
			console.log(str)
			 
			uni.sendSocketMessage({//10001 登录
			  data: sendDSocket(str,10001),
			  success(res) {
				  console.log(res)
			  },
			  complete(com) {
			  	console.log(com)
			  }
			});
		}else{
			uni.showToast({
				title: data.msg,
				duration: 3000,
				icon:'none'
			});
		}
	}
	else if(code==20002){//20001->20002 进入直播间回复（服务端->客户端）
		if(data.code==1){
			console.log(store.getters['AllalluserIdx']+'---yonghu  id')
			console.log(data.user.useridx +'---进房  id')
			if(data.user.useridx==store.getters['AllalluserIdx']){
				console.log('进房消息')
				store.dispatch('liveroom/SET_liveEnterData',data);//更新用户进房展示
				console.log(store.getters['liveroom/get_liveUserListData']);
				var newLiveUserList = store.getters['liveroom/get_liveUserListData'];
				if(JSON.stringify(newLiveUserList).indexOf(JSON.stringify(data.user)) === -1){
				     console.log('不存在')
				     newLiveUserList.push(data.user)
				}else{
				     console.log('已存在')
				}
				// newLiveUserList.push(data.user)
				store.dispatch('liveroom/SET_liveUserListData',newLiveUserList);
				console.log(store.getters['liveroom/get_liveUserListData']);
				console.log('进房消息---------------展示处理')//1：聊天信息 2：表情  3礼物 4 进房
				console.log(data.user)
				data.user.ctype=4;
				store.dispatch('liveroom/SET_liveChatData',data.user);
				store.dispatch('liveroom/SET_liveGiftData',[]);
				uni.reLaunch({
					url: '/pages/liveRoom/liveRoom'
				});
				
			}else{
				console.log('进房消息')
				store.dispatch('liveroom/SET_liveEnterData',data);//更新用户进房展示
				console.log(store.getters['liveroom/get_liveUserListData']);
				var newLiveUserList = store.getters['liveroom/get_liveUserListData'];
				if(JSON.stringify(newLiveUserList).indexOf(JSON.stringify(data.user)) === -1){
				     console.log('不存在')
				     newLiveUserList.push(data.user)
				}else{
				     console.log('已存在')
				}
				console.log(newLiveUserList)
				// newLiveUserList.push(data.user)
				store.dispatch('liveroom/SET_liveUserListData',newLiveUserList);
				console.log(store.getters['liveroom/get_liveUserListData']);
				
				console.log('进房消息---------------展示处理')//1：聊天信息 2：表情  3礼物 4 进房
				console.log(data.user)
				data.user.ctype=4;
				store.dispatch('liveroom/SET_liveChatData',data.user);
			}
			
			
		}else{
			uni.showToast({
				title: data.msg,
				duration: 3000,
				icon:'none'
			});
		}
		
		
	}
	else if(code==20004){//20003->20004 退出直播间回复（服务端->客户端）
		console.log('退房消息')
		console.log(data)
		var newLiveUserList=store.getters['liveroom/get_liveUserListData'];
		newLiveUserList.forEach(function(item,index){
			if(data.useridx==item.useridx){
				console.log(index+'---')
				newLiveUserList.splice(index,1)
			}
		})
		store.dispatch('liveroom/SET_liveUserListData',newLiveUserList);
		if(data.useridx==store.getters['AllalluserIdx']){
			uni.reLaunch({
				url: '/pages/showEnd/showEnd'
			});
		}	
	}
	else if(code==20008){//20007->20008 聊天信息回复（服务端->客户端）
		console.log('收到聊天信息')
		console.log(data)
		// console.log(store.getters['AllallEmojiData'])
		var emojiData = store.getters['AllallEmojiData'];
		if(data.ctype==1){//1：聊天信息 2：表情  3礼物
			
		}else if(data.ctype==2){
			emojiData.forEach(function(item,index){
				if(data.icoinid==item.id){
					data.iconData=emojiData[index]
				}
			})
			
		}
		store.dispatch('liveroom/SET_liveChatData',data);
	}
	else if(code==20010){//20009->20010 礼物信息回复（服务端->客户端）
		console.log('收到礼物消息')//加入聊天展示
		data.ctype=3;
		data.date=new Date().getTime();
		data.iconData={content: "",giftcartoon: "",giftid: 0,gifttype: 0,icon: "",iscartoon: 0,name: "",price: 0,rate: 0};
		var giftData = store.getters['AllallGiftData'];
		if(data.ctype==3){//1：聊天信息 2：表情  3礼物
			giftData.forEach(function(item,index){
				if(data.giftid==item.giftid){
					data.iconData=giftData[index]
				}
			})
		}else{
		}
		store.dispatch('liveroom/SET_liveChatData',data);

		store.dispatch('liveroom/SET_liveGiftData',data);
		// // store.dispatch('liveroom/SET_liveGiftData',[]);
		// var liveGiftData=store.getters['liveroom/get_liveGiftData'];
		// liveGiftData.push(data)
		// console.log(liveGiftData)
		
		// if(liveGiftData.length>0){
		// 	store.dispatch('liveroom/SET_liveGiftData',liveGiftData);
			
		// }else{
		// 	store.dispatch('liveroom/SET_liveGiftData',liveGiftData);
		// }
	}
	else if(code==20014){//20013->20014 主播暂离（服务端->客户端）
		console.log('主播暂离')
		if(data.isstep==1){
			uni.showToast({
				title: data.msg,
				duration: 3000,
				icon:'none'
			});
		}
	}
	else if(code==20018){//->20018 用户列表（服务端->客户端）
		console.log('用户列表')
		store.dispatch('liveroom/SET_liveUserListData',data.userlist);
	}
	else if(code==20020){//->20020 下播回复（服务端->客户端）
		console.log('下播回复')
		store.dispatch('liveroom/SET_liveOverData',data);
		uni.reLaunch({
			url: '/pages/showEnd/showEnd'
		});
	}
	else if(code==20022){//->20022 踢出（服务端->客户端）
		console.log('被踢出房间')
		store.dispatch('liveroom/SET_liveOverData',data);
		uni.reLaunch({
			url: '/pages/showEnd/showEnd'
		});
	}
	else if(code==20024){//->20024 热度（服务端->客户端）
		console.log('热度下发')
		store.dispatch('liveroom/SET_liveHotNum',data.hotnum);
	}
	
	
	
	else if(code==100003){//10003 登录失败返回信息（服务端->客户端）
		if(data.code==-2){
			navigateTo('/pages/startup/startup',null);
		}else{
			uni.showToast({
				title: data.error,
				duration: 2000,
				icon:"none",
			});
		}
		
	}
	else if(code==110002){//11002 系统消息（服务端->客户端） ok
		uni.showToast({
			title: data.content,
			duration: 1500,
			icon:"none",
		});
	}
	else if(code==110006){//11006 更新币值（服务端->客户端）
		var arr = store.getters['AllallLoginInfo'];
		arr.cash = data.cash;
		store.commit("set_allLoginInfo",arr)
	}
	else if(code==110024){//11024 推荐视频（服务端->客户端）
		store.commit("set_allHomeVideoData",data)
	}
	else if(code==100010){//10010 重新登录（服务端->客户端）
		// console.log(store.getters['AllallIsStartUp'])
		// console.log(store.getters['AllallIsTravalUser'])
		if(store.getters['AllallIsTravalUser']==false){
			if(store.getters['AllallIsStartUp']==true){
				store.commit("set_allisRelogin",true)
			}else{
				console.log('即将断线重连')
				store.commit("set_allisRelogin",true)
				var array =JSON.stringify({
					"userName": JSON.stringify(store.getters['AllallLoginInfo'].useridx),
					"pwd": store.getters['AllallLoginInfo'].logintoken,
					"devId": systemId(),
					"devType": system(),
					"productType": 3,
					"isRelogin": true,
					"loginWay": 0,
					"language": 0,
					"ver": "1.00",
					"ip":"127.0.0.1"
				})
				uni.sendSocketMessage({//
					data: sendDSocket(array,10001),
					success(res) {
					},
					complete(com) {
						console.log(com)
					}
				});
			}
		}
		
		
		
		// store.commit("set_allHomeVideoData",data)
	}
	else if(code==200008){//20008 <===20007（服务端->客户端）
		// console.log(store.getters['AllallChatList'])
		// console.log(data)
		var chatList = store.getters['AllallChatList'];
		var msgdata = data;
		chatList.forEach(function (value,index) {
			// console.log(value.useridx)//聊天对象idx
			msgdata.msgs.forEach(function (value1,index1) {
				if(value.useridx==value1.useridx){
					value.newMsgData.push(value1)
				}
				// console.log(value1.useridx)//聊天对象idx
			});
		});
		store.commit("set_allChatList",chatList)
		var maxMsgIdData = [];//msgId数组
		msgdata.msgs.forEach(function (value1,index1) {
			maxMsgIdData.push(value1.msgId);
			// console.log(value1.useridx)//聊天对象idx
		});
		var maxMsgId = maxMsgIdData.sort(function(a,b){
			return b-a;
		})[0];
		// console.log(maxMsgId)
		// console.log(store.getters['AllallLoginInfo'].useridx)
		if(maxMsgId!=undefined){
			var arrayR =JSON.stringify({
				"appId": 100,            //   int   APP ID
				"msgId":maxMsgId,//最大msgId
				"useridx": store.getters['AllallLoginInfo'].useridx,   //   int   发送者
			})
			uni.sendSocketMessage({//
			    data: sendDSocket(arrayR,20009),//20009 客户端读取消息确认，对应消息20008（客户端->服务端）
			    success(res) {
			    },
			    complete(com) {
			    	console.log(com)
			    }
			});
		}
		
	}
	else if(code==110018){//11018 获取主播私信价格结果（服务端->客户端）
		store.commit("set_allChatPrice",data)
	}
	else if(code==200018){//20018 回复用户消息，对应消息20017（服务端->客户端）
		// 拉取原始消息成功==》开始处理
		// console.log(store.getters['AllallchatObjInfo'])//聊天对象信息
		// console.log(store.getters['AllallLoginInfo'])//自己信息
		// console.log(store.getters['AllallNoGiftList'])//自己信息
		var msgdata = data;
		msgdata.msgs.forEach(function (value,index) {
			var hours =  new Date(value.timestamp*1000).getHours();
			var minuts =  new Date(value.timestamp*1000).getMinutes()<10?'0'+ new Date(value.timestamp*1000).getMinutes():new Date(value.timestamp*1000).getMinutes()
			value.nowTime =hours+":"+minuts;
			if(value.useridx==store.getters['AllallLoginInfo'].useridx){//direction 方向 0为自己 1 为当前聊天对象 photo 
				value.direction = 0
				value.photo = ''
			}else{
				value.direction = 1
				value.photo = store.getters['AllallchatObjInfo'].headpic//、that.chatObjHeadpic
			}
			
			if(value.type==5){//1:文本 2.图片 3.视频 5.礼物 6.作品
				var xitong =system()
				store.getters['AllallNoGiftList'].forEach(function (value1,index1){
					// console.log(value1);
					if(value.attach.giftId==value1.giftId){
						if(xitong=='ios'){
							value.giftPhoto = value1.icon  //png
						}else if(xitong=='android'){
							value.giftPhoto = value1.iconCartoon  //webp
						}
					}
				})
			}else if(value.type==2){
				value.content=JSON.parse(value.content)
				value.giftPhoto = ''
			}else if(value.type==3){
				value.content=JSON.parse(value.content)
				// console.log(value)
				value.giftPhoto = ''
			}else if(value.type==6){
				value.content=JSON.parse(value.content)
				// console.log(value)
				value.giftPhoto = ''
			}else{
				value.giftPhoto = ''
			}
		});
		store.commit("set_allChatObjToObjList",msgdata)
	}
	else if(code==200003){//20003===>20004 推送消息给客户端（服务端->客户端）A发送消息给B，B如果在线的话，会推送消息给B
		store.commit("set_allChatPageIsNew",data)
		console.log(store.getters['AllallIsChatpop'])
		if(store.getters['AllallIsChatpop']==false){//不是pop 不坐处理
			
		}else if(store.getters['AllallIsChatpop']==true){
			var array =JSON.stringify({	
				"appId": 100,            //APP ID
				"msgId": data.msgId,  //消息ID
				"useridx": Number(store.getters['AllallLoginInfo'].useridx),       //用户自己的 idx
				"fromUseridx":Number(data.useridx),		//对应 str里面的 useridx
				"toUseridx":Number(data.toUseridx),	//对应 str里面的 touseridx
			})
			uni.sendSocketMessage({//
			    data: sendDSocket(array,20004),
			    success(res) {},
			    complete(com) {
			    	console.log(com)
			    }
			});
			// 处理收到的消息
			var value = data;
			var hours =  new Date(value.timestamp*1000).getHours();
			var minuts =  new Date(value.timestamp*1000).getMinutes()<10?'0'+ new Date(value.timestamp*1000).getMinutes():new Date(value.timestamp*1000).getMinutes()
			value.nowTime =hours+":"+minuts;
			if(value.useridx==store.getters['AllallLoginInfo'].useridx){//direction 方向 0为自己 1 为当前聊天对象 photo 
				value.direction = 0
				value.photo = ''
			}else{
				value.direction = 1
				value.photo = store.getters['AllallchatObjInfo'].headpic//对象的
			}
			
			if(value.type==5){//1:文本 2.图片 3.视频 5.礼物 6.作品
				var xitong =system()
				store.getters['AllallNoGiftList'].forEach(function (value1,index1){
					// console.log(value1);
					if(value.attach.giftId==value1.giftId){
						// console.log(xitong)
						if(xitong=='ios'){
							value.giftPhoto = value1.icon  //png
						}else if(xitong=='android'){
							value.giftPhoto = value1.iconCartoon  //webp
						}
					}
				})
			}else if(value.type==2){
				value.content=JSON.parse(value.content)
				value.giftPhoto = ''
			}else if(value.type==3){
				value.content=JSON.parse(value.content)
				// console.log(value)
				value.giftPhoto = ''
			}else if(value.type==6){
				value.content=JSON.parse(value.content)
				// console.log(value)
				value.giftPhoto = ''
			}else{
				value.giftPhoto = ''
			}
			
			console.log(store.getters['AllallchatObjInfo'])
			if(value.useridx==store.getters['AllallchatObjInfo'].useridx){
				console.log(store.getters['AllallChatObjToObjList'])
				var newArr = store.getters['AllallChatObjToObjList'];
				newArr.msgs.push(value)
				store.commit("set_allChatObjToObjList",newArr)
			}
		}
		
		
	}
	else if(code==200004){//20004<===20003
		console.log(20004+'回复服务器 收到消息成功')
	}
	else if(code==200002){//20002<===20001 消息接收确认（服务端->客户端） 服务器是否成功接纳了用户发来的消息
		console.log(20002+'回复服务器 收到消息成功')
		console.log(store.getters['AllallchatObjInfo'])
		var array =JSON.stringify({	
			"appId": 100,            //APP ID
			"msgId": 0,  //消息ID
			"useridx": Number(store.getters['AllallLoginInfo'].useridx),       //用户ID
			"toUseridx":Number(store.getters['AllallchatObjInfo'].useridx),
		})
		uni.sendSocketMessage({//
		    data: sendDSocket(array,20017),
		    success(res) {},
		    complete(com) {
		    	console.log(com)
		    }
		});
	}
	else if(code==110008){//11008<===11007 11008 关注或取消关注结果（服务端->客户端）
		// console.log(11008+'回复服务器 收到消息成功')
		// console.log(store.getters['AllallFollowStatus'])
		if(store.getters['AllallFollowStatus']==0){
			store.commit("set_allFollowStatus",1)
		}else if(store.getters['AllallFollowStatus']==1){
			store.commit("set_allFollowStatus",0)
		}
		
	}
	else if(code==110010){//11010<===11009 11010 拉黑或取消拉黑结果（服务端->客户端）
		if(store.getters['AllallBlackStatus']==0){
			store.commit("set_allBlackStatus",1)
			uni.showToast({
				title: '拉黑成功',
				duration: 1000,
				icon:"none",
				success: function () {}
			});
		}else if(store.getters['AllallBlackStatus']==1){
			store.commit("set_allBlackStatus",0)
			uni.showToast({
				title: '解除成功',
				duration: 1000,
				icon:"none",
				success: function () {}
			});
		}
	}
	else if(code==110012){//11012<===11011 11012 设置喜好结果（服务端->客户端））
		uni.showToast({
			title: '设置成功',
			duration: 1000,
			icon:"none",
			success: function () {}
		});
		var arr = store.getters['AllallLoginInfo'];
		arr.preference = store.getters['AllallSexStatus']
		store.commit("set_allLoginInfo",arr)
		// if(store.getters['AllallBlackStatus']==0){
		// 	store.commit("set_allBlackStatus",1)
		// }else if(store.getters['AllallBlackStatus']==1){
		// 	store.commit("set_allBlackStatus",0)
		// }
	}
	else if(code==310006){//31006<===31005 31006 进入直播间确认（服务端->客户端）
		console.log(data)
		if(data.code == 0){
			store.commit("set_allLiveRoomNum",data.usersum)
			store.commit("set_allLiveChatList",[])
			store.commit("set_allLiveGiftList",[])
			// navigateTo('/pages/liveroom/liveroom',null);
		}else{
			uni.showToast({
				title: data.error,
				duration: 1000,
				icon:"none",
					success(res) {},
					fail(err) {},
					complete(com) {
						navigateTo('/pages/home/home',null);
					}
			});
		}
		
	}
	else if(code==310014){//31014    31014 当前直播间人数更新（服务端->客户端）
		store.commit("set_allLiveRoomNum",data.usersum)
	}
	else if(code==310013){//31013<===31009礼物 and 消息 31011 群发礼物以及聊天消息 （服务端->客户端）
		// {
		// 	"type": 1,                 //消息类型 1文字聊天  2送礼
		// 	"usernick": "",            //用户昵称
		// 	"content":  "",   //消息内容
		// 	"timestamp": 147897989,            //时间戳
		// 	"attach":  {"giftid": 11,"num": 5} //礼物内容 礼物id 礼物数量
		// };
		console.log(data)
		if(data.type==1){// 文字聊天处理
			var chatArray = store.getters['AllallLiveChatList'];
			console.log(chatArray)
			console.log(chatArray.length)
			if(chatArray.length < 6){//
				chatArray.push(data)
				store.commit("set_allLiveChatList",chatArray)
			}else{
				chatArray.shift()
				chatArray.push(data)
				store.commit("set_allLiveChatList",chatArray)
			}
		}else if(data.type==2){// 礼物展示处理
			var giftArray = store.getters['AllallLiveGiftList'];
			giftArray = [];
			var noGiftData = store.getters['AllallNoGiftList'];
			noGiftData.forEach(function(item,index){
				if(item.giftId==data.attach.giftid){
					data.icon = item.icon;
					data.iconCartoon = item.icon;
					data.giftName = item.content;
				}
			})
			var chatArray = store.getters['AllallLiveChatList'];
			console.log(chatArray)
			console.log(chatArray.length)
			if(chatArray.length < 6){//
				chatArray.push(data)
				store.commit("set_allLiveChatList",chatArray)
			}else{
				chatArray.shift()
				chatArray.push(data)
				store.commit("set_allLiveChatList",chatArray)
			}
			// 展示礼物
			giftArray.push(data)
			store.commit("set_allLiveGiftList",giftArray)
			setTimeout(function(){
				store.commit("set_allLiveGiftList",[])
			},1500)
		}else if(data.type==3){
			var systemmsg = data.usernick + data.content;
			store.commit("set_allSystemMsg",systemmsg)
		}
	}
	else if(code==310008){//31008<===31007 31008 离开直播间确认（服务端->客户端）
		
	}
	else if(code==310016){//31016<===    31016 主播断线重连，用户更新直播地址（服务端->客户端）
		//主播断线重连房间id变化
		store.commit("set_allRoomid",data.liveaddress)
	}
	else if(code==110016){//11016<===11015 设置个性签名------
		// console.log('收到新消息===》'+code)
		// console.log(data)
		// console.log(store)
		uni.showToast({
			title:data.error,
			duration: 1500,
			icon:"none",
			success(res) {
			},
			fail(err) {
			},
			complete(com) {
			}
		});
	}
	else if(code==110001){//11001<===11000
		// console.log('收到新消息===》'+code)
		// console.log(data)
		// console.log(store)
		// uni.showToast({
		// 	title: '设置成功',
		// 	duration: 5000,
		// 	icon:"none",
		// 		success(res) {
		// 			// console.log(1112)
		// 		},
		// 		fail(err) {
		// 			// console.log(2223)
		// 		},
		// 		complete(com) {
		// 			// console.log(3334)
		// 		}
		// });
	}
	 
	 // Handle.do110()
 }