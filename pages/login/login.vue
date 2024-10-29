<template>
	<view>
		<cu-custom isBack>
			<block slot="content">登录</block>
		</cu-custom>
		
		<view class="login">
			<!-- 授权登陆 -->
			<template v-if="!isMobileLogin">
				<view class="login-logo">LOGO</view>
				<button
					class="btn primary-btn"
					open-type="getUserInfo"
					:disabled="loading"
					@getuserinfo="getUserInfo"
				>
					微信授权登录
				</button>
				<button 
					plain="true" 
					class="btn default-btn"
					open-type="getPhoneNumber"
					:disabled="loading"
					@getphonenumber="goPhoneLogin"
				>
					手机快捷登录
				</button>
			</template>
			<!--  手机号校验登陆 -->
			<template v-else>
				<PhoneLogin @success="doneToDo"/>
			</template>
		</view>		
	</view>
</template>

<script>
import UserService from '@/services/user'
import { mapActions, mapMutations, mapState } from 'vuex'
import PhoneLogin from '@/components/login/phonelogin.vue'

export default {
	components: {
		PhoneLogin
	},
	data() {
		return {
			loading: false,
			isMobileLogin: false,
		}
	},
	computed: {
		...mapState({
			locationInfo: state => state.user.locationInfo,
			wxCode: state => state.user.wxCode,
			shareId: state => state.user.shareId,			
		}),
	},
	onReady() {
		uni.hideLoading()
	},
	onLoad() {
		this.wxLogin()
	},	
	methods: {
		...mapMutations({
			SET_USERINFO: 'user/SET_USERINFO',
		}),
		...mapActions({
			GET_USER_LOGIN_AUTH: 'user/GET_USER_LOGIN_AUTH',
			GET_USER_WXCODE: 'user/GET_USER_WXCODE',
		}),
		async wxLogin() {
			// 微信登录获取 code
			try{
				await this.GET_USER_WXCODE()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		async getUserInfo(userinfo) {
			this.loading = true
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			if (userinfo.detail.errMsg === 'getUserInfo:ok') {
				this.SET_USERINFO(userinfo.detail.userInfo)
				
				const loginAuthData = {
					code: this.wxCode,
					encryptedData: userinfo.detail.encryptedData,
					iv: userinfo.detail.iv,
					longitude: this.locationInfo.longitude || '',
					latitude: this.locationInfo.latitude  || '',
				}
				
				if (this.shareId) {
					loginAuthData.share_id = this.shareId
				}
				
				try{
					const resData = await this.GET_USER_LOGIN_AUTH(loginAuthData)
					if (!resData) {
						// 首次登陆无token需要绑定手机号
						this.isMobileLogin = true;
					}else {
						this.doneToDo()
					}
					// return uni.reLaunch({
					// 	url: '/pages/index/index'
					// })	
				}catch(e){
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}
			}else {
				// 取消授权,重新授权
				this.isMobileLogin = false;
				uni.showModal({
					title: '授权失败',
					content: '请重新选择微信登陆或手机登陆',
					showCancel: false,
					confirmText: '知道了'
				})
			}
			
			uni.hideLoading()
			this.loading = false
		},
		async goPhoneLogin(userinfo) {
			this.loading = true
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			if (userinfo.detail.errMsg === 'getPhoneNumber:ok') {
				const loginAuthData = {
					code: this.wxCode,
					encryptedData: userinfo.detail.encryptedData,
					iv: userinfo.detail.iv,
					longitude: this.locationInfo.longitude || '',
					latitude: this.locationInfo.latitude  || '',
				}
				
				try{
					const resData = await this.GET_USER_LOGIN_AUTH(loginAuthData)
					if (!resData) {
						this.isMobileLogin = true
						uni.showToast({
							title: '手机登陆失败',
							icon: 'none'
						})
					} else {
						this.doneToDo()
					}
				}catch(e){
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}
			}else {
				// 取消授权,重新授权
				this.isMobileLogin = false
				uni.showModal({
					title: '授权失败',
					content: '请重新选择微信登陆或手机登陆',
					showCancel: false,
					confirmText: '知道了'
				})
			}
			uni.hideLoading()
			this.loading = false
		},
		doneToDo(){	// 登陆完成后的动作
			this.$goBack()		// 跳转页面
			this.updateLocation()	// 提交地址给服务器
			this.getServerUserInfo()	// 获取用户基础信息
		},		
		updateLocation() {
			// 更新地址信息
		},
		getServerUserInfo() {
			// 获取用户基础信息
		},
	}
}
</script>

<style lang="scss">
.login {
	margin: 0 48upx;
	
	&-logo {
		margin: 190upx auto;
		@include wh(362upx, 188upx);
		background: #EEEEEE;
		border-radius: 32upx;
		
		color: #FFF;
		line-height: 188upx;
		text-align: center;
	}
	
	.btn {
		@include wh(100%, 108upx);
		line-height: 108upx;
		border-radius: 54upx;
	}
	
	.default-btn {
		margin-top: 28upx;
	}
}
</style>
