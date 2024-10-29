import orderService from '@/services/order.js'

const state = {
	orderDetail: {},
	orderList: [],
	orderTotal: 0, 
	orderSubmit: false,  // 是否在提交订单页面，用来选择地址/门店逻辑判断
	orderRefundDetail: {},
}

const getters = {
	
}

const mutations = {
	SET_ORDER_SUBMIT_PAGE_STATUS(state, payload) {
		state.orderSubmit = payload
	},
	SET_ORDER_DETAIL(state, payload) {
		state.orderDetail = payload
	},
	SET_ORDER_LIST(state, payload) {
		// 订单列表
		state.orderList = payload
	},
	SET_ORDER_TOTAL(state, payload) {
		// 订单当前页面总数
		state.orderTotal = payload
	},
	SET_ORDER_REFUND_DETAIL(state, payload) {
		state.orderRefundDetail = payload
	},	
}

const actions = {
	// 下单
	async PLACE_ORDER({ commit }, data) {
		try{
			const resData = await orderService.placeOrder(data)
			return resData
		}catch(e){
			throw e
		}
	},
	async GET_ORDER_DETAIL({ commit, state }, {id, type}) {
		try{
			const resData = await orderService.getOrderDetail(id, type)
			commit('SET_ORDER_DETAIL', resData.data)
			return resData.data
		}catch(e){
			throw e
		}
	},
	async GET_ORDER_LIST({ commit, state }, data) {
		try{
			const resData = await orderService.getOrderList(data)
			const orderData = resData.data
			
			if (orderData.curr_page != 1) {
				commit('SET_ORDER_LIST', [...state.orderList, orderData.items])
			}else {
				commit('SET_ORDER_LIST', orderData.items)
			}
			commit('SET_ORDER_TOTAL', orderData.total_count)
			
			return resData
		}catch(e){
			throw e
		}
	},
	async WECHAT_PAY({commit}, payload) {		//支付接口
		return new Promise((resolve, reject) => {
			uni.requestPayment({
				provider: "wxpay",
				...payload,
				_debug: 1,
				success: function(res) {
					console.log("success:" + JSON.stringify(res));
					resolve(res);
				},
				fail: function(err) {
					console.log("fail:" + JSON.stringify(err));
					resolve(err);
				}
			});
		});
	},
	// 订单列表直接支付
	async ORDER_PAY({ commit, state }, {id, data}) {
		try{
			const resData = await orderService.orderPay(id, data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 订单申请退款
	async ORDER_REFUND({ commit, state }, {id, data}) {
		try{
			const resData = await orderService.orderRefund(id, data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 订单申请退款
	async ORDER_RECEIPT({ commit, state }, {id, data}) {
		try{
			const resData = await orderService.orderReceipt(id, data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 订单评价
	async ORDER_COMMENT({ commit, state }, {id, data}) {
		try{
			const resData = await orderService.orderComment(id, data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 订单申请退款
	async ORDER_REFUND_DETAILD({ commit, state }, {id, data}) {
		try{
			const resData = await orderService.orderRefundDetail(id, data)
			commit('SET_ORDER_REFUND_DETAIL', resData)
			return resData
		}catch(e){
			throw e
		}
	},	
	// 取消订单申请退款
	async ORDER_REFUND_CANCEL({ commit, state }, {id, data}) {
		try{
			const resData = await orderService.orderRefundCancel(id, data)
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