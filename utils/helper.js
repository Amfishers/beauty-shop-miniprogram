import moment from './moment.min.js'

/**
 * token存储键名
 */
export const TOKENKEY = '_BEAUTY_TOKEN'
export const OPENIDKEY = '_BEAUTY_OPENID'

/**
 * 获取storage
 */
export function getStorage(key) {
	try {
		let res = uni.getStorageSync(key)
		if (res) {
			return JSON.parse(res)
		}
	} catch (e) {}

	return false
}

/**
 * 存储storage
 * @param {string} token
 */
export function setStorage(key, value) {
	try {
		console.log('set value: ' + value)
		uni.setStorageSync(key, JSON.stringify(value))
		return true
	} catch (e) {
		console.log(e)
		return false
	}
}

// 去重
export function unique(a = [], b = []) {
	return Array.from(new Set([...a, ...b]))
}

// 购物车数据处理
export function cartDataHandler(listdata = []) {
	if (!listdata) return []
	
	if (!listdata.length && !Array.isArray(listdata)) return []
	
	return listdata.map(store => {
		let products = store.products.map(item => {
			let desc = []
			// 单商品 无规格时没有 specs
			if (item.spec && item.spec.specs) {
				item.spec.specs.forEach(spe => {
					Object.keys(spe).forEach(k => {
						desc.push(spe[k])
					})
				})
			}
			
			return {
				...item,
				check: false,
				descript: desc
			}
		})
		return {
			...store,
			check: false,
			products
		}
	})
}

export function isBeforeTime(start, end) {
	return moment(start).isBefore(end, 'second');
}

export function isAfterTime(start, end) {
	return moment(start).isAfter(end, 'second')
}

