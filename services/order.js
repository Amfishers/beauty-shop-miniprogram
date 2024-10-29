import network from '@/utils/network'

export default {
	getOrderList(data) {
		return network.get(`/shop/orders`, { data })
	},
	getOrderDetail(id, type) {
		let url = `/shop/orders/${id}`
		if (type) url += `?order_type=${type}`
		return network.get(url)
	},
	// 下单
	placeOrder(data) {
		return network.post('/shop/orders', { data })
	},
	// 订单列表直接支付
	orderPay(id, data) {
		return network.post(`/shop/orders/${id}/pay`, { data })
	},
	// 订单申请退款
	orderRefund(id, data) {
		return network.post(`/shop/orders/${id}/refund`, { data })
	},
	// 订单确认收货
	orderReceipt(id, data) {
		return network.post(`/shop/orders/${id}/receipt`, { data })
	},
	// 订单评价发表评论
	orderComment(id, data) {
		return network.post(`/shop/orders/${id}/comment`, { data })
	},
	// 订单退款详情
	orderRefundDetail(id, data) {
		return network.get(`/shop/orders/${id}/refund`, { data })
	},
	// 订单退款详情
	orderRefundCancel(id, data) {
		return network.post(`/shop/orders/${id}/refund-cancel`, { data })
	},
}