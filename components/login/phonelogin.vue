<template>
	<view class="phone-login">
		<view class="phone-login__title">
			手机快捷登录
		</view>
		<view class="phone-login__box">
			<view class="detail phone-login__box-phone">
				<view class="phone-login__box-icon"><BIcon icon="person" font-size="20"/></view>
				<input class="input" placeholder-class="placeholder" type="tel" confirm-type="send" placeholder="请输入手机号" v-model="userPhone">
			</view>
			<view class="detail phone-login__box-captcha">
				<view class="phone-login__box-icon"><BIcon icon="term" font-size="20"/></view>
				<input class="input" placeholder-class="placeholder" :focus="captchaInputFocus" type="number" placeholder="请输入验证码" v-model="userCaptcha">
				<view v-if="!captchaSent" class="phone-login__box-sentcode" @tap="sendCaptchaHanlder">
					获取验证码
				</view>
				<view v-else class="phone-login__box-sentcode">
					{{ countDownText }}
				</view>
			</view>
		</view>
		<button
			class="btn primary-btn"
			@tap="onLogin"
		>
			登录
		</button>
		<view class="phone-login__desc">未注册的手机号码验证后自动创建平台账户</view>
	</view>
</template>

<script>
import LoginService from '@/services/login'
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {
			userPhone: '',
			userCaptcha: '',
			countDown: 59,
			countDownText: '59 秒后可重发',
			timer: null,
			captchaSent: false,
			captchaInputFocus: false,
		}
	},
	computed: {
		...mapState({
			openId: state => state.user.openId,
		}),
	},
	methods: {
		...mapActions({
			LOGIN_BY_PHONE: 'user/LOGIN_BY_PHONE',
		}),
		debounce(fn, time) {
			const _this = this
			if (_this.timer) clearTimeout(_this.timer)
			_this.timer = setTimeout(() => {
				fn()
				_this.timer = undefined
			}, time)
		},
		isPhone(phoneNum) {
			if (!phoneNum) return false
			
			const phoneReg = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/
			
			return phoneReg.test(phoneNum)
		},
		async sendCaptchaHanlder() {
			const isPhone = this.isPhone(this.userPhone)
			
			if (!isPhone) {
				return 	uni.showToast({
					icon: 'none',
					title: '请输入正确的手机号码',
					duration: 2000
				})
			}
			
			//获取短信验证码
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			const smsData = {
				openid: this.openId,
				phone: this.userPhone
			}
			
			try{
				await LoginService.getPhoneSms(smsData)
				uni.hideLoading()
				this.captchaSent = true
				this.waitCodeNumCount()
				this.$nextTick(() => {
					this.captchaInputFocus = true
				})
			}catch(e){
				uni.hideLoading()
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
		},
		waitCodeNumCount() {
			if (!this.timer) {
				this.timer = setInterval(() => {
					if (this.countDown > 0 && this.countDown <= 59) {
						this.countDown--
						if (this.countDown !== 0) {
							this.countDownText = `${this.countDown} 秒后可重发`
						}else {
							clearInterval(this.timer)
							this.countDown = 59
							this.countDownText = '59 秒后可重发'
							this.captchaSent = false
							this.timer = null
						}
					}
				}, 1000)
			}
		},
		onLogin() {
			this.debounce(this.phoneLogin, 500)
		},
		
		async phoneLogin() {
			if (!this.userPhone) {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号',
					duration: 2000
				})
			}
			
			const loginData = {
				phone: this.userPhone,
				code: this.userCaptcha,
				openid: this.openId,
			}
			
			try{
				await this.LOGIN_BY_PHONE(loginData)
				this.$emit('success')
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.phone-login {
	&__title {
		margin-top: 40upx;
		color: #1D1D1D;
		font-size: 40upx;
	}
	
	&__box {
		margin-top: 40upx;
		padding: 0 36upx;
		border: 1upx solid rgba(30,30,30,0.1);
		border-radius: 24upx;
		
		.detail {
			display: flex;
			width: 100%;
			padding: 60upx 0;
		}
		
		.placeholder {
			color: #999;
			font-size: 28upx;
			line-height: 40upx;
		}
		
		.input {
			flex: 1;
			margin-left: 40upx;
		}
		
		&-icon {
			@include wh(40upx, 40upx);
		}
		
		&-captcha {
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				width: 100%;
				height: 1px;
				background: rgba($color: #1E1E1E, $alpha: .1);
			}
		}
		
		&-sentcode {
			color: #1D1D1D;
			font-size: 26upx;
		}
	}
	
	.btn {
		margin-top: 80upx;
		width: 100%;
		height: 108upx;
		line-height: 108upx;
		border-radius: 54upx;
	}
	
	&__desc {
		margin-top: 54upx;
		font-size: 24upx;
		color: #999999;
		text-align: center;
		text-decoration: underline;
	}
}
</style>
