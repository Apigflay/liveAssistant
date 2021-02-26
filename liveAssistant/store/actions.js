
const actions ={
	SET_allLoginInfo: ({ commit }, data) => {
		commit('set_allLoginInfo', data)
	},
	SET_allUserInfo: ({ commit }, data) => {
		commit('set_allUserInfo', data)
	},
	SET_allIsLogin: ({ commit }, data) => {
		commit('set_allIsLogin', data)
	}
}
export default actions