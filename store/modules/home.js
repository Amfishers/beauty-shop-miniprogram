import homeService from '@/services/home.js'
import locationService from '@/services/location.js'

const state = {
	nearestStore: {},
	pageData: {},
	title: "首页",
	
	// 专题页
	specialData: {},
	specialsTitle: '首页',
	
	// 当前站点
	currSiteData: {},
	
	// 首页弹出层
	redPkg: {},
};
const mutations = {
	SET_INDEX_DATA(state, payload) {
		state.pageData = payload;
	},
	setNearestStore(state, payload) {
		state.nearestStore = payload;
	},
	SET_INDEX_TITLE(state, payload) {
		state.title = payload;
	},
	
	SET_PAGE_DATA(state, payload) {
		state.specialData = payload
	},
	SET_SPECIALS_TITLE(state, payload) {
		state.specialsTitle = payload;
	},	
	SET_CURR_SITE_DETAIL(state, payload) {
		state.currSiteData = payload
	},	
	SET_HOME_POPUPS(state, payload) {
		state.redPkg = payload
	},	
};

const actions = {
	async GET_PAGE_DATA({commit}, data) {
		try{
			let resData = await homeService.getIndexData(data)
			if (resData) {
				let data = resData.data.content;
				let title = resData.data.title || '骄杨佳美店铺';
				commit('SET_INDEX_DATA', data)
				commit('SET_INDEX_TITLE', title)
			}
		}catch(e){
			throw e
		}
	},
	// 专题页
	async GET_SPECIALS_PAGE_DATA({commit}, id) {
		try{
			let resData = await homeService.getIndexSpecialsData(id)
			if (resData) {
				let data = resData.data.content;
				let title = resData.data.title || '骄杨佳美店铺';
				commit('SET_PAGE_DATA', data)
				commit('SET_SPECIALS_TITLE', title)
			}
		}catch(e){
			throw e
		}
	},
	// 获取当前站点
	async GET_CURR_SITE_DATA({commit}, id) {
		try{
			let resData = await locationService.getUserIndexSite(id)
			commit('SET_CURR_SITE_DETAIL', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},

	async getHomeData({commit}) {
		let data = await api.home.getHome();
		data = data && JSON.parse(data);

		// console.log(data);
		data.map(item => {
			const itemData = {
				type: item.item_type,
				data: item
			};
			// nearst store
			if (item.item_type === "template_stores") {
				commit("setNearestStore", item.item_data[0]);
			}
			commit("setHomePageData", itemData);
		});
	},
	
	// 首页弹窗活动
	async GET_HOME_POPUPS({commit, state}) {
		try{
			const resData = await homeService.getHomePopups()
			commit('SET_HOME_POPUPS', resData.data)
			return resData.data
		}catch(e){
			throw e
		}
	},
	
};
const getters = {};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
