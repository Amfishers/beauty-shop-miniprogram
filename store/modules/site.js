import http from "../../utils/http.js";

export default {
	namespaced: true,
	state: { //存储数据,同data
		siteId: uni.getStorageSync("siteId") || "10000",
		siteName: uni.getStorageSync("siteName") || "深圳站",
	},
	getters: { //计算属性,同computed
	},
	mutations: { //存放同步的方法,同vue页面的method
		setSite(state, siteId, siteName) {
			state.siteId = siteId;
			state.siteName = siteName;
		},
		setSiteId(state, siteId) {
			state.siteId = siteId;
			uni.setStorageSync('siteId', siteId)
		},
		setSiteName(state, siteName) {
			state.siteName = siteName;
			uni.setStorageSync('siteName', siteName)
		},
	},
	actions: {}
}
