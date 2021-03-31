
const actions ={
	SET_allLoginInfo: ({ commit }, data) => {
		commit('set_allLoginInfo', data)
	},
	SET_allUserInfo: ({ commit }, data) => {
		commit('set_allUserInfo', data)
	},
	SET_allIsLogin: ({ commit }, data) => {
		commit('set_allIsLogin', data)
	},
	SET_allGiftData: ({ commit }, data) => {
		commit('set_allGiftData', data)
	},
	SET_allEmojiData: ({ commit }, data) => {
		commit('set_allEmojiData', data)
	},
	SET_allAnchorLoginData: ({ commit }, data) => {
		commit('set_allAnchorLoginData', data)
	},
	SET_alluserIdx: ({ commit }, data) => {
		commit('set_alluserIdx', data)
	},
	SET_allusertoken: ({ commit }, data) => {
		commit('set_allusertoken', data)
	},
	SET_allserverid: ({ commit }, data) => {
		commit('set_allserverid', data)
	},
	SET_allUrlTime: ({ commit }, data) => {
		commit('set_allUrlTime', data)
	},
	SET_allroomidx: ({ commit }, data) => {
		commit('set_allroomidx', data)
	},
	
}
export default actions