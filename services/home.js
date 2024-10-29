import network from '@/utils/network'

export default {
	/*
	* @params data:Object
	* longitude
	* latitude
	*/
	getIndexData(data) {
		return network.get(`/shop/specials`, { data })
	},
	getIndexSpecialsData(id) {
		return network.get(`/shop/specials/${id}`)
	},
	getHomePopups() {
		return network.get('/shop/popups')
	},
}