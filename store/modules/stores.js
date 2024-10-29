import StoreServices from '@/services/stores.js'
import GoodsServices from '@/services/goods.js'

const state = {
	storeId: null,
	storeDetail: {},
	storeGoods: {},  // 门店商品
	storeNearest: {}  ,// 附近门店
	orderSelectStore: {}, // 服务订单选中的门店
}

const getters = {
	
}

const mutations = {
	SET_STORE_ID(state, id) {
		state.storeId = id
	},
	SET_STORE_DETAIL(state, data) {
		state.storeDetail = data
	},
	SET_STORE_GOODS(state, data) {
		state.storeGoods = data
	},
	SET_STORE_NEAREST(state, data) {
		state.storeNearest = data
	},
	// 提交订单时，选中的地址
	SET_CART_SELECT_STORE(state, data) {
		state.orderSelectStore = data
	},	
}

const actions = {
	// 获取门店详情
	async GET_STORE_DETAIL({commit, state}) {
		try{
			const resData = await StoreServices.getStoreDetail(state.storeId)
			commit('SET_STORE_DETAIL', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 获取门店商品列表
	async GET_STORE_GOODS({commit, state}, data) {
		try{
			const resData = await GoodsServices.getGoodsList(data)
			commit('SET_STORE_GOODS', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},	// 获取门店商品列表
	async GET_STORE_NEAREST({commit, state}, data) {
		try{
			const resData = await StoreServices.getStoresList(data)
			commit('SET_STORE_NEAREST', resData.data)
			return resData
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