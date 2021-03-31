const state ={//所有状态以all开头
	allLoginInfo:null,//socket登录成功信息
	allUserInfo:null,//账号密码--no
	allIsLogin:false,//是否socket登录  默认为不登录 
	allGiftData:[],//直播间礼物信息
	allEmojiData:[],//直播间表情信息
	allAnchorLoginData:{},//主播登录信息
	alluserIdx:null,//用户idx
	allusertoken:null,//用户token
	allserverid:0,//当前直播间服务id
	allUrlTime:{url:'',time:0},//本次直播链接 时间
	allroomidx:0,//默认房间id
}
export default state