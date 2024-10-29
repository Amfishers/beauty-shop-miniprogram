import GoodsServices from '@/services/goods.js'
import CouponsServices from '@/services/coupons.js'

const state = {
	goodsDetail: [],
	goodsConsult: [],
	goodsComments: [],
	goodsCoupons: [],
	goodsStores: {},
	getCoupons: [],
	// 优惠券列表
	couponsList: [],
	// 已获取到的优惠券
	catchCoupons: [],
}

const getters = {
	
}

const mutations = {
	SET_GOODS_DETAIL(state, data) {
		state.goodsDetail = data
	},
	SET_GOODS_CONSULTS(state, data) {
		state.goodsConsult = data
	},
	SET_GOODS_COMMENTS(state, data) {
		state.goodsComments = data
	},
	SET_GOODS_COUPONS(state, data) {
		state.goodsCoupons = data
	},
	SET_GOODS_STORES(state, data) {
		state.goodsStores = data
	},
	// 优惠券列表
	SET_ALL_COUPONS(state, data) {
		state.couponsList = data
	},
	// 领取优惠券
	DRAW_COUPONS(state, data) {
		state.catchCoupons = data
	},
}

const actions = {
	async GET_GOODS_DETAIL({commit, state}, id) {
		try{
			const resData = await GoodsServices.getGoodsDetail(id)
			commit('SET_GOODS_DETAIL', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},
	async GET_GOODS_CONSULTS({commit, state}, id) {
		try{
			const resData = await GoodsServices.getGoodsConsults(id)
			commit('SET_GOODS_CONSULTS', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},	
	async GET_GOODS_COMMENTS({commit, state}, id) {
		try{
			const resData = await GoodsServices.getGoodsComments(id)
			commit('SET_GOODS_COMMENTS', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},	
	async GET_GOODS_COUPONS({commit, state}, id) {
		try{
			const resData = await GoodsServices.getGoodsCoupons(id)
			commit('SET_GOODS_COUPONS', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},	
	async GET_GOODS_STORES({commit, state}, data) {
		try{
			const resData = await GoodsServices.getGoodsStores(data)
			commit('SET_GOODS_STORES', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 获取优惠券
	async GET_ALL_COUPONS({commit, state}) {
		try{
			const resData = await CouponsServices.getCouponsList()
			commit('SET_ALL_COUPONS', resData.data)
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