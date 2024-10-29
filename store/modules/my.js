import UserService from '@/services/user.js'
import CounponService from '@/services/coupons.js'

const state = {
	currUser: {},
	// 收益详情
	analyseDetail: {},
	analyseList: [],
	analyseTotal: 0, 	
	// 优惠券列表
	receivedCouponList: [],
	// 常见问题列表
	faqsDetail: {},
	faqsList: [],
	faqsTotal: 0, 	
}

const getters = {
	isPlus(state) {
		return state.currUser.is_plus
	},
	userId(state) {
		return state.currUser.id
	},
}

const mutations = {
	SET_CURR_USER(state, user) {
		state.currUser = user
	},
	// 收益详情
	SET_ANALYSE_LIST(state, payload) {
		state.analyseList = payload
	},
	SET_ANALYSE_DETAIL(state, payload) {
		state.analyseDetail = payload
	},
	SET_ANALYSE_TOTAL(state, payload) {
		state.analyseTotal = payload
	},
	SET_RECEIVED_COUPON_LIST(state, payload) {
		state.receivedCouponList = payload
	},
	// 常见问题
	SET_FAQS_LIST(state, payload) {
		state.faqsList = payload
	},
	SET_FAQS_DETAIL(state, payload) {
		state.faqsDetail = payload
	},
	SET_FAQS_TOTAL(state, payload) {
		state.faqsTotal = payload
	},	
}

const actions = {
	// 设置当前用户
	async GET_CURR_USER({ commit }) {
		try{
			const resData = await UserService.getUserInfo()
			commit('SET_CURR_USER', resData.data)
		}catch(e){
			throw e
		}
	},
	// 设置当前用户
	async PATCH_CURR_USER({ commit, dispatch }, data) {
		try{
			const resData = await UserService.patchUserInfo(data)
			dispatch('GET_CURR_USER')
		}catch(e){
			throw e
		}
	},
	// 用户收益详情
	async GET_USER_ANALYSE({ commit, dispatch }, data) {
		try{
			const resData = await UserService.userAnalyse(data)
			const { analyse, orders } = resData.data
			
			if (orders.curr_page != 1) {
				commit('SET_ANALYSE_LIST', [...state.analyseList, orders.items])
			}else {
				commit('SET_ANALYSE_LIST', orders.items)
			}
			commit('SET_ANALYSE_TOTAL', orders.total_count)
			// 详情
			commit('SET_ANALYSE_DETAIL', analyse)
						
			return resData.data
		}catch(e){
			throw e
		}
	},
	// 设置优惠券列表
	async GET_USER_RECEIVED_COUPINS({ commit }) {
		try{
			const resData = await CounponService.getCouponsReceivedList()
			commit('SET_RECEIVED_COUPON_LIST', resData.data || [])
		}catch(e){
			throw e
		}
	},
	
	// 常见问题列表
	async GET_USER_FAQS({ commit, dispatch }, data) {
		try{
			const resData = await UserService.getFaqsList(data)
			const faqsData = resData.data
			
			if (faqsData.curr_page != 1) {
				commit('SET_FAQS_LIST', [...state.faqsList, faqsData.items])
			}else {
				commit('SET_FAQS_LIST', faqsData.items)
			}
			commit('SET_FAQS_TOTAL', faqsData.total_count)
						
			return faqsData
		}catch(e){
			throw e
		}
	},
		
	// 常见问题详情
	async GET_USER_FAQS_DETAIL({ commit, dispatch }, id) {
		try{
			const resData = await UserService.getFaqsDetail(id)
			
			commit('SET_FAQS_DETAIL', resData.data)
						
			return resData.data
		}catch(e){
			throw e
		}
	},
}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}