import BankcardService from '@/services/bankcard.js'

const state = {
	bankcardList: [],
	bankcardTotal: 0,
	bankcardDetail: [],
	selectedBankcard: {},
	cashSubmit: false,
}

const getters = {
}

const mutations = {
	SET_BANKCARD_LIST(state, data) {
		state.bankcardList = data
	},
	SET_BANKCARD_TOTAL(state, data) {
		state.bankcardTotal = data
	},
	// 提交订单时，选中的银行卡
	SET_SELECTED_BANKCARD(state, data) {
		state.selectedBankcard = data
	},
	SET_CASH_SUBMIT_PAGE_STATUS(state, payload) {
		state.cashSubmit = payload
	},	
}

const actions = {
	async GET_BANKCARD_LIST({commit, state}, data) {
		try{
			const resData = await BankcardService.getBankcardList(data)
			const bankcardData = resData.data
			
			if (bankcardData.curr_page > 1) {
				commit('SET_BANKCARD_LIST', [...state.bankcardList, bankcardData.items])
			}else {
				commit('SET_BANKCARD_LIST', bankcardData.items)
			}
			commit('SET_BANKCARD_TOTAL', bankcardData.total_count)
			
			return resData.data
		}catch(e){
			throw e
		}
	},
	// 保存地址
	async BIND_BANKCARD({commit}, data) {
		try{
			const resData = await BankcardService.bindBankcard(data)
			return resData.data
		}catch(error){
			throw error
		}
	},		
	// 获取银行卡详情
	async GET_BANKCARD_DETAIL({commit}, id) {
		try{
			const resData = await BankcardService.getBankcardDetail(id)
			return resData.data
		}catch(error){
			throw error
		}
	},
	// 更新地址详情
	async UPDATE_BANKCARD_DETAIL({commit}, {id, data}) {
		try{
			const resData = await BankcardService.updateBankcard(id, data)
			return resData.data
		}catch(error){
			throw error
		}
	},
	// 删除地址
	async DELETE_BANKCARD({commit}, id) {
		try{
			const resData = await BankcardService.deleteBankcard(id)
			return resData.data
		}catch(error){
			throw error
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