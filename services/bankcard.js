import network from '@/utils/network'

export default {
	// 获取银行列表
	getBankList(data) {
		return network.get('/shop/banks', { data })
	},
	// 银行卡列表
	getBankcardList(data) {
		return network.get('/shop/users/bankcards', { data })
	},
	// 绑定银行卡
	bindBankcard(data) {
		return network.post('/shop/users/bankcards', { data })
	},
	// 删除银行卡
	deleteBankcard(id) {
		return network.delete(`/shop/users/bankcards/${id}`)
	},
	// 获取银行卡详情
	getBankcardDetail(id) {
		return network.get(`/shop/users/bankcards/${id}`)
	},
	// 更新银行卡
	updateBankcard(id, data) {
		return network.post(`/shop/users/bankcards/${id}/update`, { data })
	},
}