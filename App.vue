<script>
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
	methods: {
		...mapActions({
			GET_USER_LOCATION: 'user/GET_USER_LOCATION',
			GET_CURR_USER: 'my/GET_CURR_USER',
		}),	
	},
	async onLaunch(option) {
		uni.hideTabBar()
		
		if (option.query) {
			this.$saveShareId(option.query || {})  // 保存分享人ID 
		}
						
		await this.GET_USER_LOCATION()
		// 获取用户信息
		await this.GET_CURR_USER()
		
		const _this = this
		uni.getSystemInfo({
			//获取手机的状态栏高度单位px
			success(e) {
				// 状态栏
				Vue.prototype.PhoneHeight = e.windowHeight;
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				// 右上角那个悬浮按钮
				Vue.prototype.Custom = custom;
				// 
				let CustomBar = custom.bottom + custom.top - e.statusBarHeight  // +4 是为了多一点距离
				_this.$store.commit('SET_CUSTOM_BAR', CustomBar)
				_this.$store.commit('SET_STATUS_BAR', e.statusBarHeight)
				Vue.prototype.CustomBar = CustomBar;
			}
		})
	},
	onShow: function(option) {
		console.log('App Show')
		uni.hideTabBar()
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
/*每个页面公共css */

/* 通用样式 */
@import '@/assets/layout';
@import '@/common/colorui/main.css';
</style>
