import network from '@/utils/network'

export default {
	// 获取指定优惠券
	getCoupons(id) {
		return network.post(`/shop/coupons/${id}`)
	},
	// 获取优惠券列表
	getCouponsList(data) {
		return network.get('/shop/coupons', { data })
	},
	// 获取已领取优惠券列表
	getCouponsReceivedList(data) {
		return network.get('/shop/coupons/received', { data })
	},
	// 获取指定优惠券详情
	getCouponsDetail(id) {
		return network.get(`/shop/coupons/${id}`)
	},	
}