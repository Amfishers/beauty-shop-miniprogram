import network from '@/utils/network'

export default {
	// 将商品加入购物车
	postGoodsToCart(data) {
		return network.post('/shop/carts', { data })
	},
	// 获取购物车列表
	getCartList() {
		return network.get('/shop/carts')
	},
	// 更新购物车数量
	// carts: [{id: xx, product_num: xx}]
	patchCartNum(data) {
		return network.post(`/shop/carts/update`, { data })
	},
	// 购物车结算
	settleCart(data) {
		return network.get('/shop/carts/settlement', { data })
	},
}