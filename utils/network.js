import Config from '../config/config'
import { getStorage, setStorage, TOKENKEY, OPENIDKEY } from './helper'

async function request(method, url, dataConfig) {
	let correctData // 正确数据
	let errorData // 错误数据	
	let config = {}

	url = Config.baseURL + url

	config = {
		method,
		url
	}

	Object.assign(config, dataConfig)

	const header = network.getCustomHeader()
	config.header = config.header || {}
	config.header = { ...config.header, ...header }
	
	try {
		let [error, res] = await uni.request(config)

		if (error !== null) {
			// 有明确错误信息
			errorData = {
				status: error.statusCode,
				errorcode: error.statusCode,
				message: error.errMsg,
				responseData: error.data
			}
		} else {
			// 处理正确的数据
			const responseData = res.data
			if (res.statusCode === 401) {
				// 身份未通过验证
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					duration: 2000,
				})

				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login',
					})
				}, 2000)

				errorData = {
					status: responseData.code,
					message: responseData.msg,
					errorcode: responseData.error_code,
					responseData
				}
			} else if (res.statusCode >= 200 && res.statusCode <= 299) {
				// 成功状态
				correctData = responseData
			} else {
				if (res.statusCode === 500 && responseData.error_code == 40029) {
					return setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/login',
						})
					}, 2000)
				}
				// 其他错误状态
				errorData = {
					status: responseData.code,
					message: responseData.msg,
					errorcode: responseData.error_code,
					responseData
				}
			}
		}

	} catch (e) {
		if (e.response && !e.response.data) {
			// 接口返回错误，无明确错误数据，如服务器内部错误
			errorData = {
				status: e.response.statusCode,
				message: e.response.errMsg,
				errorcode: e.response.statusCode,
				responseData: null
			}
		} else {
			// 接口返回错误，无明确错误数据，如服务器内部错误
			errorData = {
				status: null,
				message: '网络异常',
				errorcode: e.response.statusCode,
				responseData: null
			}
		}
	}

	if (typeof correctData !== 'undefined') {
		return correctData
	} else {
		throw errorData
	}
}

const network = {}
network.get = (url, config) => request('GET', url, config) // eg: { data: xx }
network.post = (url, config) => request('POST', url, config) // eg: { data: xx }
network.delete = (url, config) => request('DELETE', url, config) // eg: { data: xx }
network.put = (url, config) => request('PUT', url, config) // eg: { data: xx }
network.patch = (url, config) => request('patch', url, config) // eg: { data: xx }

network.getCustomHeader = function() {
	const headers = {
		'Content-Type': 'application/json',
	}

	const authorization = getStorage(OPENIDKEY)
	const token = getStorage(TOKENKEY)

	if (authorization || token) {
		headers['indentifier'] = authorization
		headers['Authorization'] = token
	}

	return headers
}

export default network
