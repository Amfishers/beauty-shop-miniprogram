import network from '@/utils/network'

export default {
	loginByCode(data) {
		return network.post('/shop/account/login_by_code', { data })
	},
	loginByAuth(data) {
		return network.post('/shop/account/login_by_auth', { data })
	},
	// 获取验证码
	getPhoneSms(data) {
		return network.post('/shop/account/sms_code', { data })
	},
	// 获取验证码
	loginByPhone(data) {
		return network.post('/shop/account/login_by_phone', { data })
	},
	// 绑定推荐人
	bindReferrer(id) {
		return network.pot(`/shop/account/${id}/bind-parent`)
	},
}