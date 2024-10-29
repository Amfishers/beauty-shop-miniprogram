import network from '@/utils/network'

export default {
	getUserLocation(data) {
		return network.get('/public/user_location', { data })
	},
	getAddressLocation() {
		return network.get('/public/address_to_location')
	},
	// 获取用户信息
	getUserInfo() {
		return network.get('/shop/account/user_info')
	},
	// 升级会员
	setUserPlus(data) {
		return network.post('/shop/account/plus', { data })
	},
	// 会员购买记录
	getUserPlusList(data) {
		return network.get('/shop/account/plus', { data })
	},
	// 更新用户资料
	patchUserInfo(data) {
		return network.post('/shop/account/update', { data })
	},
	// 注销登录
	userLogout() {
		return network.post('/shop/account/logout')
	},
	// 收件地址列表
	getUserAddress(data) {
		return network.get('/shop/addresses', { data })
	},
	// 新增收件地址
	addUserAddress(data) {
		return network.post('/shop/addresses', { data })
	},
	// 删除收件地址
	deleteUserAddress(id) {
		return network.delete(`/shop/addresses/${id}`)
	},
	// 收件地址更新
	patchUserAddress(id, data) {
		return network.post(`/shop/addresses/${id}/update`, { data })
	},
	// 收件地址详情
	getUserAddressDetail(id) {
		return network.get(`/shop/addresses/${id}`)
	},	
	// 解析地址信息
	getAddressToLocation(data) {
		return network.get('/public/address_to_location', { data })
	},
	// 上传图片
	orderImgUpload(data) {
		return network.post(`/public/upload`, { data })
	},
	// 用户收益详情
	userAnalyse(data) {
		return network.get(`/shop/account/analyse`, { data })
	},
	// 常见问题列表
	getFaqsList(data) {
		return network.get(`/shop/faqs`, { data })
	},
	// 常见问题详情
	getFaqsDetail(id) {
		return network.get(`/shop/faqs/${id}`)
	},
	// 消息通知列表
	
	// 消息通知详情
	
}