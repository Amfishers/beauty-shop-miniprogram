import network from '@/utils/network'

export default {
	// 获取提现列表
	getCashoutList(data) {
		return network.get('/shop/withdraws', { data })
	},
	// 提现
	postCashout(data) {
		return network.post('/shop/withdraws', { data })
	},

}