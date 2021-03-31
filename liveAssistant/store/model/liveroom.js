// 状态
const state = {
	liveEnterData:[],//进入房间消息
	liveChatData:null,//房间聊天信息
	liveUserListData: [],//房间用户列表
	liveOverData:null,//下播消息
	liveHotNum:0,//直播间热度
	// liveGiftData:[],//直播间礼物展示
	liveGiftData:null,//直播间礼物展示
  
}
const getters ={
	get_liveEnterData(state){
		return state.liveEnterData;
	},
	get_liveChatData(state){
		return state.liveChatData;
	},
	get_liveUserListData(state){
		return state.liveUserListData;
	},
	get_liveOverData(state){
		return state.liveOverData;
	},
	get_liveHotNum(state){
		return state.liveHotNum;
	},
	get_liveGiftData(state){
		return state.liveGiftData;
	},
	
}
// 提交
const mutations = {
	set_liveEnterData:(state,data)=>{
	  state.liveEnterData = data 
	},
	set_liveChatData:(state,data)=>{
	  state.liveChatData = data 
	},
	set_liveUserListData:(state,data)=>{
		state.liveUserListData = data 
	},
	set_liveOverData:(state,data)=>{
		state.liveOverData = data 
	},
	set_liveHotNum:(state,data)=>{
		state.liveHotNum = data 
	},
	set_liveGiftData:(state,data)=>{
		state.liveGiftData = data 
	},
}
// 方法
const actions = {
	SET_liveEnterData: ({ commit }, data) => {
	  commit('set_liveEnterData', data)
	},
	SET_liveChatData: ({ commit }, data) => {
	  commit('set_liveChatData', data)
	},
	SET_liveUserListData: ({ commit }, data) => {
		commit('set_liveUserListData', data)
	},
	SET_liveOverData: ({ commit }, data) => {
		commit('set_liveOverData', data)
	},
	SET_liveHotNum: ({ commit }, data) => {
		commit('set_liveHotNum', data)
	},
	SET_liveGiftData: ({ commit }, data) => {
		commit('set_liveGiftData', data)
	},
	
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
