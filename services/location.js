import network from '@/utils/network'

export default {
	// 三级联动查询地区信息
	// identifier 必须字段
	getSelectLocation(data) {
		return network.get('/public/select_area', { data })
	},
	// 根据定位地址或者经纬度获取站点详情
	getShopSite(data) {
		return network.get('/shop/site', { data })
	},
	getShopSites() {
		return network.get('/shop/sites')
	},
	// 获取站点
	getUserIndexSite(data) {
		return network.get('/shop/current-site')
	},
	// 获取站点
	switchUserIndexSite(id) {
		return network.post(`/shop/switch-site/${id}`)
	},
	
}