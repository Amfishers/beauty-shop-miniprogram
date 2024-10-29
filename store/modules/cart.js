import CartServices from '@/services/cart.js'
import { cartDataHandler } from '@/utils/helper.js'
import GoodsServices from '@/services/goods.js'

const state = {
	cartListData: [],
	cartSettleData: {},
}

const getters = {
	// 判断是否全选
	isCheckedAll(state) {
		return state.cartListData.every(store => {
			let storeCheck = store.check
			let productsCheck = store.products.every(pro => pro.check)
			return storeCheck && productsCheck
		})
	},
	// 合计
	totalPrice(state, getters, rootState, rootGetters) {
		const isPlus = rootGetters['my/isPlus']
		let total = 0
		
		state.cartListData.forEach(store => {
			store.products.forEach(item => {
				if (item.check) {
					let price = isPlus ? item.product_plus_price : item.product_price
					total += Number(price) * Number(item.product_num)
				}
			})
		})
		
		return total
	},
	selectedList(state) {
		let selectArr = []
		state.cartListData.forEach(store => {
			store.products.forEach(item => {
				if (item.check) {
					selectArr.push(item)
				}
			})
		})
		return selectArr
	},
}

const mutations = {
	SET_CART_LIST(state, data) {
		state.cartListData = data || []
	},
	SET_STORE_CHECK(state, {store, index}) {
		const expectStatus = !store.check
		// 设置店铺选中
		const list = [...state.cartListData]
		
		list.forEach((item, sIndex) => {
			if (sIndex == index) {
				item.check = expectStatus
				item.products.forEach(pro => {
					pro.check = expectStatus
				})
			}
		})
		state.selectedList = list
	},
	SET_ITEM_CHECK(state, {item, storeIndex}) {
		// 设置某个订单选中
		const list = [...state.cartListData]
		
		list.forEach((store, sIndex) => {
			if (sIndex == storeIndex) {
				// 某项选中/取消选中
				store.products.forEach((pro, proIndex) => {
					if (item.id == pro.id) {
						pro.check = !pro.check
					}
				})
				
				// 检测店铺是否全选
				store.check = store.products.every(s => s.check)
			}
		})
		
		state.selectedList = list		
	},
	SET_ALLCHECK(state, isCheck) {
		// 全选/反全选
		const expectStatus = !isCheck
		const list = [...state.cartListData]
		
		list.forEach((item, sIndex) => {
			item.check = expectStatus
			item.products.forEach(pro => {
				pro.check = expectStatus
			})
		})
		state.selectedList = list
	},
	// 购物车结算之后的数据
	SET_CART_SETTLE_DATA(state, payload) {
		state.cartSettleData = payload
	},
	
}

const actions = {
	async GET_CART_LIST({ commit, state }, data) {
		try{
			const resData = await CartServices.getCartList()
			commit('SET_CART_LIST', cartDataHandler(resData.data))
			return resData
		}catch(e){
			throw e
		}
	},
	async SET_GOODS_TO_CART({ commit, state }, data) {
		try{
			const resData = await CartServices.postGoodsToCart(data)
			return resData
		}catch(e){
			throw e
		}
	},
	async PATCH_CART_NUM({ commit, state }, data) {
		try{
			const resData = await CartServices.patchCartNum(data)
			return resData
		}catch(e){
			throw e
		}
	},
	async SETTLE_CART({ commit, state }, data) {
		try{
			const resData = await CartServices.settleCart(data)
			commit('SET_CART_SETTLE_DATA', resData)
			return resData
		}catch(e){
			throw e
		}
	},
	// 直接下单
	async SETTLEMEN_GOODS({commit, state, }, {id, data}) {
		try{
			const resData = await GoodsServices.postGoodsSettlement(id, data)
			commit('SET_CART_SETTLE_DATA', resData.data)
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