import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import home from './modules/home'
import goods from './modules/goods'
import stores from './modules/stores'
import cart from './modules/cart'
import my from './modules/my'
import order from './modules/order'
import address from './modules/address'
import bankcard from './modules/bankcard'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		customBar: 0,
		statusBar: 0,
  },
	mutations: {
		SET_CUSTOM_BAR(state, data) {
			if (state.customBar != data) {
				state.customBar = data
			}
		},
		SET_STATUS_BAR(state, data) {
			if (state.statusBar != data) {
				state.statusBar = data
			}
		},
	},
	modules: {
		user,
		home,
		goods,
		stores,
		cart,
		my,
		order,
		address,
		bankcard,
	}
})