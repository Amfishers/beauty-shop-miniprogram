import UserService from '@/services/user.js'

const state = {
	addressList: [],
	addressTotal: 0,
	addressDetail: [],
	orderSelectAddr: {},
}

const getters = {
	
}

const mutations = {
	SET_ADDRESS_LIST(state, data) {
		state.addressList = data
	},
	SET_ADDRESS_TOTAL(state, data) {
		state.addressTotal = data
	},
	// 提交订单时，选中的地址
	SET_CART_SELECT_ADDR(state, data) {
		state.orderSelectAddr = data
	},
}

const actions = {
	async GET_ADDRESS_LIST({commit, state}, data) {
		try{
			const resData = await UserService.getUserAddress(data)
			const addressData = resData.data
			
			if (addressData.curr_page > 1) {
				commit('SET_ADDRESS_LIST', [...state.addressList, addressData.items])
			}else {
				commit('SET_ADDRESS_LIST', addressData.items)
			}
			commit('SET_ADDRESS_TOTAL', addressData.total_count)
			
			return resData.data
		}catch(e){
			throw e
		}
	},
	// 通过经纬度解析地址信息
	async GET_ADDRESS_TO_LOCATION({commit}, data) {
		try{
			const resData = await UserService.getAddressToLocation(data)
			return resData.data
		}catch(error){
			throw error
		}
	},	
	// choose location
	async CHOOSE_LOCATION({commit}, keyword) {
		return new Promise((resolve, reject) => {
			uni.chooseLocation({
				keyword,
				complete(res) {
					if (res.errMsg === "chooseLocation:ok") {
						resolve(res);
					} else {
						reject(res);
					}
				}
			})
		})
	},
	// 保存地址
	async SAVE_ADDRESS({commit}, data) {
		try{
			const resData = await UserService.addUserAddress(data)
			return resData.data
		}catch(error){
			throw error
		}
	},		
	// 获取地址详情
	async GET_ADDRESS_DETAIL({commit}, id) {
		try{
			const resData = await UserService.getUserAddressDetail(id)
			return resData.data
		}catch(error){
			throw error
		}
	},
	// 更新地址详情
	async UPDATE_ADDRESS_DETAIL({commit}, {id, data}) {
		try{
			const resData = await UserService.patchUserAddress(id, data)
			return resData.data
		}catch(error){
			throw error
		}
	},
	// 删除地址
	async DELETE_ADDRESS({commit}, id) {
		try{
			const resData = await UserService.deleteUserAddress(id)
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