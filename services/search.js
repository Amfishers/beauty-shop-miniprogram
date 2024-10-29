import network from '@/utils/network'

export default {
	getSearchByKeyword(data) {
		return network.get('/shop/search/keywords', { data })
	},
	getSearchData(data) {
		return network.get('/shop/search/list', { data })
	}
}