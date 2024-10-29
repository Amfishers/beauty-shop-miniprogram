import network from '@/utils/network'
import UserService from '@/services/user.js'
import LoginService from '@/services/login.js'
import { getStorage, setStorage } from '@/utils/helper.js'
import config from '@/config/config.js'

const state = {
	userInfo: getStorage('_BEAUTY_USERINFO') || '',
	token: getStorage('_BEAUTY_TOKEN') || '',
	openId: getStorage('_BEAUTY_OPENID') || '',
	wxCode: getStorage('_BEAUTY_WXCODE') || '',
	userLocData: getStorage('_BEAUTY_LOCATION') || '',
	locationInfo: {
		longitude: '',
		latitude: ''
	},
	shareId: getStorage("_BEAUTY_SHAREID") || '',
}

const getters = {

}

const mutations = {
	SET_USER_LOCATION(state, data) {
		state.locationInfo = data
	},
	SET_USER_INFO_STORAGE(state, infoData) {
		if (infoData) {
			infoData.openid && setStorage('_BEAUTY_OPENID', infoData.openid)
			infoData.token && setStorage('_BEAUTY_TOKEN', infoData.token)
		}
	},
	// 获取微信code，并设置到vuex
	SET_USER_OPENID(state, payload) {
		setStorage('_BEAUTY_OPENID', payload)
		state.openId = payload
	},
	// 获取微信code，并设置到vuex
	SET_USER_WXCODE(state, payload) {
		setStorage('_BEAUTY_WXCODE', payload)
		state.wxCode = payload
	},
	// 存储用户的userinfo
	SET_USERINFO(state, payload) {
		setStorage('_BEAUTY_USERINFO', payload);
		state.userInfo = payload
	},
	// 存储用户经过ip解析的地理位置
	SET_LOC_WITHIP(state, payload) {
		setStorage('_BEAUTY_LOCATION', payload);
		state.userLocData = payload
		if (!(state.locationInfo.longitude && state.locationInfo.latitude)) {
			state.locationInfo.latitude = payload.latitude
			state.locationInfo.longitude = payload.longitude
		}
	},
	// 保存分享者
	SET_SHAREID(state, payload) {
		setStorage('_BEAUTY_SHAREID', payload);
		state.shareId = payload;
	},
}

const actions = {
	//  获取经纬度坐标
	GET_USER_LOCATION({commit}) {
		return new Promise((resolve, reject) => {
			uni.getLocation({
				type: "wgs84", // gcj02 wgs84
				success: res => {
					if (res.longitude && res.latitude) {
						console.log('location', res)
						const locationData = {
							longitude: '' + res.longitude,
							latitude: '' + res.latitude
						}
						commit('SET_USER_LOCATION', locationData)
						resolve(locationData)
					} else {
						reject(res)
					}
				},
				fail: error => {
					reject(error)
				}
			})
		})
	},
	// 获取用户地理信息，如果没有同意授权经纬度
	async GET_USER_LOCTION_WITH_IP({ commit }, data) {
		try{
			const resData = await UserService.getUserLocation(data)
			commit('SET_LOC_WITHIP', resData.data)
			return resData
		}catch(e){
			throw e
		}
	},
	// 获取用户 TOKEN 
	async GET_USER_LOGIN_CODE({ commit }, data) {
		try{
			const resData = await LoginService.loginByCode(data)
			if (resData.data && resData.data.openid) {
				commit('SET_USER_OPENID', resData.data.openid)
				return resData.data.openid
			}
			return ''
		}catch(error){
			throw error
		}
	},
	// 登陆
	async GET_USER_LOGIN_AUTH({ commit }, data) {
		try{
			const resData = await LoginService.loginByAuth(data)
			if (resData.data && resData.data.token) {
				commit('SET_USER_INFO_STORAGE', resData.data)
				return resData.data
			}
			return ''
		}catch(error){
			throw error
		}
	},
	// 获取用户微信code
	GET_USER_WXCODE({ commit }, data) {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success(res) {
					commit('SET_USER_WXCODE', res.code)
					resolve(res.code)
				},
				fail(e) {
					reject(e)
				}
			})
		})
	},
	// 通过手机号码验证登陆
	async LOGIN_BY_PHONE({commit}, data) {
		try{
			const resData = await LoginService.loginByPhone(data)
			if (resData.data && resData.data.token) {
				commit('SET_USER_INFO_STORAGE', resData.data)
				return resData.data
			}
			return ''
		}catch(error){
			throw error
		}
	},
	// 上传图片
	async UPLOAD_IMG({ state, commit }, path) {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: config.baseURL + "/public/upload",
				header: {
					"Content-Type": "multipart/form-data",
					"csrf_token": state.openId,
					"Authorization": state.token,
				},
				filePath: path,
				name: "upload",
				success(res) {
					if (res && res.data) {
						const data = JSON.parse(res.data);
						resolve(data)
					} else {
						resolve('')
					}
				},
				fail(err) {
					console.log('err', err)
					resolve('')
				}
			})
			
		})
	},


}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}