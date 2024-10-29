import Vue from 'vue'
import App from './App'
import store from "./store"
import seeting from "@/common/config"
import qs from 'qs'

// 全局组件
import BRate from '@/components/rate/index.vue'
import BIcon from '@/components/icon/index.vue'
import customHeader from '@/components/customHeader/index.vue'
import backToTop from '@/components/backToTop/index.vue'
import loadMore from '@/components/loadmore/index.vue'
Vue.component('BRate', BRate)
Vue.component('BIcon', BIcon)
Vue.component("cu-custom", customHeader);
Vue.component("back-top-top", backToTop);
Vue.component("LoadMore", loadMore);


Vue.prototype.$cfg = seeting
Vue.prototype.$goBack= () => {
	// 重写返回规则，如果直接扫码进入某个页面，则直接返回首页
	if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
		let url = '/' + __wxConfig.pages[0];
		if (getCurrentPages().length == 1) {
			return uni.switchTab({ url });
		} else {
			return uni.redirectTo({ url });
		}
	}
	uni.navigateBack({
		delta: 1
	})
}

Vue.prototype.$qs = qs;

// 通过页面参数，检测、保存、覆盖推荐人ID
Vue.prototype.$saveShareId = (option) => {
	// console.log(qs.parse(option));
	if (option.scene) {
		const scene = decodeURIComponent(option.scene)
		const wxArgs = qs.parse(scene) 
		if (wxArgs.shareId) {
			store.commit('user/SET_SHAREID', wxArgs.shareId)
		}
		if (wxArgs.uid) {	//新增二维码参数uid为分享者id
			store.commit('user/SET_SHAREID', wxArgs.uid)
		}
	}
	if (option.shareId) {
		store.commit('user/SET_SHAREID', option.shareId)
	}
}

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,	
    ...App
})
app.$mount()
