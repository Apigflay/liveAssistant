/**
 * socket 管理模块
 */

/* eslint-disable no-undef */
import store from '../store/index'
import tool from '../utils/tool'
//import Platform from '../common/js/Platform'
import { getServerIp } from '../api/common'
import MsgHandle from '../socket/modules/MsgHandle' // 消息处理类
import Assemble from '../socket/modules/Assemble' // 数据组装
import Analysis from '../socket/modules/Analysis' // 数据解析
/**
 * 客户端定义
 */
// eslint-disable-next-line no-unused-vars
const clientDefine = {
	clientDefine_connect_timeout: 1000,
	clientDefine_timeout: 30000,
	clientDefine_headmsg_timeout: 13000,
	clientDefine_max_reconnect_times: 1
}
/**
 * 网络连接状态
 */
const NetWorkState = {
	NetWorkState_NONE: 'NetWorkState_NONE',
	NetWorkState_CONNECTING: 'NetWorkState_CONNECTING',
	NetWorkState_CONNECTED: 'NetWorkState_CONNECTED',
	NetWorkState_ERROR: 'NetWorkState_ERROR',
	NetWorkState_CLOSE: 'NetWorkState_CLOSE',
	NetWorkState_TIMEOUT: 'NetWorkState_TIMEOUT',
	NetWorkState_MAX: 'NetWorkState_MAX'
}
const socket = {
	_ws: null,
	_msgHandle: null, //消息处理模块
	_assemble: null, //发送消息组装模块
	_analysis: null, //收到消息分析模块
	hostArray: [],
	sm_cDstIp: '', // 连接服务器地址
	sm_eNetWorkState: NetWorkState.NetWorkState_NONE, // 当前网络状态
	sm_bIsSendHeard: true, // 发送心跳
	sm_bReciveHeadMsg: false, // 是否发送心跳中
	sm_nHeartbeatNum: -1, // 心跳句柄
	sm_bIsHoldClose: false, // 是否是手动关闭
	sm_nConnectGameServerNum_1: -1, // 连接逻辑服务句柄
	sm_bIsAutoConnect: false, // 是否自动连接
	sm_bIsSendCloseMsg: false, // 手动关闭时候是否发生结束消息
	sm_nConnectCount: false, // 当前连接的次数（用于判断重连的提示，比如连接三次都没连接上就提示玩家检查网络)
	data: {
		userAccount: {} // 用户信息
	},
	/**
	 *  获取msghandler
	 */
	getMsgHandle() {
		return this._msgHandle
	},
	/**
	 * socket 对外入口
	 * @param {} dstIP
	 * @param {*} isSendHeard
	 */
	init(dstIP, isSendHeard) {
		this._analysis = new Analysis(this)
		this._assemble = new Assemble(this)
		this._msgHandle = new MsgHandle(this)
		this._tool = tool
		// 初始化状态
		this.sm_eNetWorkState = NetWorkState.NetWorkState_NONE
		this.sm_bReciveHeadMsg = false
		this.sm_bIsSendCloseMsg = true
		this.sm_nHeartbeatNum = -1
		this.sm_nConnectNum = -1

		this.connect(dstIP, isSendHeard)
	},
	/**
	 * 开始连接并赋值 ip
	 * @param dstIP ip ws://127.0.0.1:3000/
	 * @param isSendHeard 是否发生心跳包
	 * @expample
	 * this.co
	 */
	connect(dstIP, isSendHeard) {
		//this.sm_cDstIp = 'ws://' + Platform.wsIP + ':' + Platform.wsPort
		let _this = this
		//alert('重新获取服务器ip')
		this.sm_bIsSendHeard = isSendHeard
		let param = { key: 'NotVerificationKey', timestamp: this._tool.getTimesTamp() }
		if (window.location.href.indexOf('https') > -1) {
			_this.sm_cDstIp = 'wss://test1.miaobolive.com:5000/test'
			return _this.doConnect()
		} else {
			//获取服务器地址
			getServerIp(param).then(
				res => {
					console.log('getServerIp success', res)
					if (res.code === 100) {
						_this.sm_cDstIp = 'ws://' + res.data.serverIp.ip + ':' + res.data.serverIp.port
						//_this.sm_cDstIp = 'ws://' + '61.164.160.32' + ':' + '7800'
						//_this.sm_cDstIp = 'ws://' + '115.231.81.95' + ':' + '8554'
					} else {
						_this.sm_cDstIp = 'ws://' + '115.231.81.95' + ':' + '8554'
						this.$message.error(res.message)
						this.$statistics.clickSta(13)
					}
					return _this.doConnect()
				},
				err => {
					_this.sm_cDstIp = 'ws://' + '115.231.81.95' + ':' + '8554'
					console.log('getTourist err', err)
					this.$statistics.clickSta(13)
					return _this.doConnect()
				}
			)
		}
	},
	/**
	 * 使用上次ip 继续连接
	 */
	doConnect() {
		if (
			this.getNetWorkState() === NetWorkState.NetWorkState_CONNECTED ||
			this.getNetWorkState() === NetWorkState.NetWorkState_CONNECTING
		) {
			console.error('already connect to server. state = ' + this.getNetWorkState())
			return false
		}

		if (!(this.sm_cDstIp && this.sm_cDstIp.length > 0)) {
			console.error('dstIP is null')
			return false
		}
		if (this._ws) {
			this._ws.close()
		}

		this._ws = null
		this.sm_nConnectCount++
		this.sm_eNetWorkState = NetWorkState.NetWorkState_CONNECTING

		this._ws = new WebSocket(this.sm_cDstIp)
		this._ws.binaryType = 'arraybuffer' // 设置发生接受二进制
		this._ws.onopen = this.onOpen.bind(this)
		this._ws.onclose = this.onClose.bind(this)
		this._ws.onerror = this.onError.bind(this)
		this._ws.onmessage = this.onMessage.bind(this)

		if (this.sm_nConnectGameServerNum_1 !== -1) {
			clearTimeout(this.sm_nConnectGameServerNum_1)
		}
		this.sm_nConnectGameServerNum_1 = setTimeout(() => {
			if (!this.isConnect()) {
				// console.log("doConnect")
				this.sm_pSocket && this.closeNetWork(false)
			}
		}, clientDefine.clientDefine_timeout)

		return true
	},
	// store 保存登录状态
	saveState() {
		store.dispatch('socketData/setState', this.sm_eNetWorkState)
	},
	// socket 打开
	onOpen() {
		if (this.sm_nConnectGameServerNum_1 !== -1) {
			clearTimeout(this.sm_nConnectGameServerNum_1)
		}
		console.log('onOpen')
		this.sm_nConnectCount = 0
		// 打开
		// 发送心跳，设置当前网络状态，
		this.sm_eNetWorkState = NetWorkState.NetWorkState_CONNECTED
		this.saveState()
		this.sm_bIsSendHeard && this.doSendHeadBet()
	},
	// socket收到消息处理
	onMessage(msg) {
		// 接受消息
		var data = msg.data

		//	var handle = new Uint32Array(data, 0, 3)
		this.splitMessage(data)
		//console.log('<==', handle[1])
		//this._msgHandle.msgHandle(handle[1], data)
	},
	splitMessage(data) {
		var handle = new Uint32Array(data, 0, 3)
		///合并包
		if (data.byteLength > handle[0]) {
			//console.log(data.byteLength, handle[0])
			while (data.byteLength > handle[0]) {
				this._msgHandle.msgHandle(handle[1], data)
				//丢弃上个包的内容
				data = data.slice(handle[0], data.byteLength)
				handle = new Uint32Array(data, 0, 3)
				if (data.byteLength === handle[0]) {
					//最后一个包
					this._msgHandle.msgHandle(handle[1], data)
				}
			}
		} else {
			this._msgHandle.msgHandle(handle[1], data)
		}
	},
	//socket 关闭
	onClose(ev) {
		//alert('onClose ' + ev)
		console.log('onClose ' + ev)
		if (this.sm_nConnectGameServerNum_1 !== -1) {
			clearTimeout(this.sm_nConnectGameServerNum_1)
		}
		this.sm_pSocket = null
		this.sm_eNetWorkState = NetWorkState.NetWorkState_CLOSE

		// 手动关闭才发送服务连接断开消息。如果自动重连 不发生。
		this.saveState()
		if (!this.sm_bIsHoldClose) {
			this.timeOutConnect()
		} else {
			if (this.sm_bIsSendCloseMsg) {
				this.saveState()
			}
		}
	},
	onError(ev) {
		console.log('onError ' + ev)
		//alert('onError ' + ev)
		if (this.sm_nConnectGameServerNum_1 !== -1) {
			clearTimeout(this.sm_nConnectGameServerNum_1)
		}
		this.sm_eNetWorkState = NetWorkState.NetWorkState_ERROR
		this.saveState()
	},
	/**
	 * 设置是否自动连接
	 * @param is 是否自动连接
	 */
	setAutoConnect(is) {
		this.sm_bIsAutoConnect = is
	},
	/**
	 * 获取当前网络状态
	 */
	getNetWorkState() {
		return this.sm_eNetWorkState
	},
	/**
	 *
	 * 当前网络是否连接
	 */
	isConnect() {
		return this.getNetWorkState() === NetWorkState.NetWorkState_CONNECTED
	},
	/**
	 * 发生消息
	 * @param bufferRes  需要发生的消息
	 * @param command 消息ID
	 */
	sendMsg(bufferRes) {
		if (this.isConnect()) {
			this._ws.send(bufferRes)
			//console.log('send', bufferRes.byteLength)
			return true
		}
		// console.log("send msg error. state = " + this.getNetWorkState())

		return false
	},

	/**
	 *  手动关闭连接
	 * @param flag
	 */
	closeNetWork(isHoldClose) {
		this.sm_cDstIp = ''

		// console.log('手动关闭 state ： ', state)
		this.sm_bIsHoldClose = isHoldClose
		if (this._ws) {
			this._ws.onopen = () => {}
			this._ws.onclose = () => {}
			this._ws.onerror = () => {}
			this._ws.onmessage = () => {}
			this._ws.close()
		}

		this.onClose(null)
	},
	/**
	 * 延迟重新连接
	 */
	timeOutConnect() {
		console.log('timeOutConnect')
		if (!this.sm_bIsAutoConnect) {
			return
		}
		// 自动连接超过 3次 手动断开连接
		if (this.sm_nConnectCount > clientDefine.clientDefine_max_reconnect_times) {
			this.closeNetWork(true)
			return
		}
		// 先手动关闭上次连接
		this.sm_pSocket && this.closeNetWork(false)
		// 如果不是手动关闭，自动连接
		if (!this.sm_bIsHoldClose) {
			if (this.sm_nConnectNum !== -1) {
				clearTimeout(this.sm_nConnectNum)
			}
			this.sm_nConnectNum = setTimeout(() => {
				// console.log("--------timeOutConnect-----------")
				if (!this.connect(this.sm_cDstIp, false)) {
					// console.log('cancle doConnect.');
				}
			}, clientDefine.clientDefine_connect_timeout)
		}
	},
	/**
	 * 重新设置服务器连接地址
	 */
	resetDstIp(dstIP) {
		this.sm_cDstIp = dstIP
	},
	/**
	 * 发送心跳包
	 */
	doSendHeadBet() {
		if (!this.isConnect()) {
			this.timeOutConnect()
			return ''
		}
		this.sm_bReciveHeadMsg = true
		this.sendMsg(this._assemble.heartbeat())

		if (this.sm_nHeartbeatNum !== -1) {
			clearTimeout(this.sm_nHeartbeatNum)
		}
		this.sm_nHeartbeatNum = setTimeout(() => {
			if (this.sm_bReciveHeadMsg) {
				this.doSendHeadBet()
			} else {
				this.timeOutConnect()
			}
		}, clientDefine.clientDefine_headmsg_timeout)
	}
}

export default socket
