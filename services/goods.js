import network from '@/utils/network'

export default {
	// 获取商品列表
	getGoodsList(data) {
		return network.get('/shop/products', { data })
	},
	// 获取商品详情
	getGoodsDetail(id) {
		return network.get(`/shop/products/${id}`)
	},
	// 大家问
	getGoodsConsults(id) {
		return network.get(`/shop/products/${id}/consults?show_items=true`)
	},
	// 评论
	getGoodsComments(id, data) {
		return network.get(`/shop/products/${id}/comments`, { data })
	},
	// 商品活动券
	getGoodsCoupons(id) {
		return network.get(`/shop/products/${id}/coupons`)
	},
	// 商品适用门店
	getGoodsStores(data) {
		return network.get(`/shop/stores`, { data })
	},	
	// 提问
	postGoodsConsults(id, data) {
		return network.post(`/shop/consults/${id}`, { data })
	},
	// 获取提问详情
	getGoodsIdConsults(id) {
		return network.get(`/shop/consults/${id}`)
	},
	// 直接购买商品
	postGoodsSettlement(id, data) {
		return network.post(`/shop/products/${id}/settlement`, { data })
	},
}