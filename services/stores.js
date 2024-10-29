import network from '@/utils/network'

export default {
	// 获取门店列表
	getStoresList(data) {
		return network.get('/shop/stores', { data })
	},
	// 获取门店详情
	getStoreDetail(id) {
		return network.get(`/shop/stores/${id}`)
	},

}