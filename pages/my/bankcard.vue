<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">{{ cardId ? '编辑' : '绑定' }}银行卡</block>
		</cu-custom>
		
		<view class="bankcard">
			<view class="bankcard-item">
				<input class="input" v-model="cardNum" placeholder="银行卡卡号" placeholder-class="placeholder" name="input" />
			</view>
			<view class="bankcard-item">
				<picker class="picker" mode="selector" :value="bankIndex" :range="bankList" :range-key="'name'" @change="bindBankChange">
					<view :class="[bankList[bankIndex].name ? 'picker-active' : 'picker-placeholder',]">{{bankList[bankIndex].name || '选择银行'}}</view>
				</picker>
			</view>
			<view class="bankcard-item">
				<input class="input" v-model="subbranch" placeholder="开户支行" placeholder-class="placeholder" name="input" />
			</view>
			<view class="bankcard-item">
				<input class="input" v-model="name" placeholder="开户人姓名" placeholder-class="placeholder" name="input" />
			</view>
			<view class="bankcard-item">
				<input class="input" v-model="phone" placeholder="银行预留手机号" placeholder-class="placeholder" name="input" type="tel" />
			</view>
			
			<view class="bankcard-phonecheck">
				<view class="phonecheck flex align-center justify-between">
					<view class="phonecheck__box-icon"><BIcon icon="passwork" font-size="20"/></view>
					<input class="input" placeholder-class="placeholder" :focus="captchaInputFocus" type="number" placeholder="请输入验证码" v-model="userCaptcha">
					<view v-if="!captchaSent" class="phonecheck__box-sentcode" @tap="sendCaptchaHanlder">
						获取验证码
					</view>
					<view v-else class="phonecheck__box-sentcode">
						{{ countDownText }}
					</view>
				</view>
			</view>
			
			<view class="tip gery-text text-center">
				首次提现需要绑定您的银行卡信息
			</view>
			<view class="bankcard-btn">
				<button class="bg-primary round btn" :disabled="loading" @tap="onBind">保存</button>
			</view>			
			
		</view>
		
	</view>
</template>

<script>
import LoginService from '@/services/login'
import BankcardService from '@/services/bankcard.js'
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {
			loading: false,
			cardId: '',
			bankList: [],
			bankIndex: null,
			cardNum: '',
			subbranch: '',
			name: '',
			phone: '',
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
			GET_BANKCARD_DETAIL: 'bankcard/GET_BANKCARD_DETAIL',
			
			UPDATE_BANKCARD_DETAIL: 'bankcard/UPDATE_BANKCARD_DETAIL',
			BIND_BANKCARD: 'bankcard/BIND_BANKCARD',
		}),
		bindBankChange(e) {
			this.bankIndex = e.target.value
		},
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
			const isPhone = this.isPhone(this.phone)
			
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
				phone: '' + this.phone
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
				this.cancelWaitCode()
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
		onBind() {
			this.debounce(this.cardSave, 500)
		},
		async cardSave() {
			if (!this.phone) {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号',
					duration: 2000
				})
			}
			
			this.loading = true
			
			// uni.showToast({
			// 	title: '保存中...',
			// 	icon: 'none',
			// 	mask: true,
			// 	duration: 500,
			// })
			
			const data = {
				bank_name: this.bankList[this.bankIndex].name,
				bank_card: this.cardNum,
				branch: this.subbranch,
				account_name: this.name,
				phone: '' + this.phone,
				code: this.userCaptcha,
				openid: this.openId,
			}
			
			try{
				if (this.cardId) {
					await this.UPDATE_BANKCARD_DETAIL({ id: this.cardId, data })
				}else {
					await this.BIND_BANKCARD(data)
				}
			}catch(e){
				this.loading = false
				this.cancelWaitCode()
				return uni.showToast({
					icon: 'none',
					title: '出现错误，请检查输入格式重试',
					duration: 2000
				})
			}

			this.loading = false
			
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 前一个页面
			uni.navigateBack({
				success() {
					beforePage.onLoad() // 执行前一个页面的onLoad方法
				}
			});			
			
			
		},		
		cancelWaitCode() {
			this.countDown = 59
			this.countDownText = '59 秒后可重发'
			this.timer = null
			this.captchaSent = false
		},		
	},
	async onLoad(option) {
		// this.$hasLogin(); // 检查登陆状态
		uni.showLoading({
			title: '加载中...',
			mask: true
		});

		try{
			const resData = await BankcardService.getBankList()
			this.bankList = resData.data
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		
		const { id, type } = option;		
		if (id) {
			// edit
			this.cardId = id
			const bk = await this.GET_BANKCARD_DETAIL(id)
			
			this.cardNum = bk.bank_card
			this.subbranch = bk.branch
			this.name = bk.account_name
			this.phone = bk.phone
			
			let bankindex = this.bankList.findIndex(item => item.bank_name == bk.bank_name)
			if (bankindex < 0) bankindex = 0
			this.bankIndex = bankindex
		} 

		uni.hideLoading()
	}		
}
</script>

<style lang="scss">
.bankcard {
	&-item {
		margin-left: 32upx;
		border-bottom: 1upx solid rgba(229,229,229,0.6);
		.input,
		.picker {
			height: 125upx;
			line-height: 125upx;
		}
		.picker {
			&-placeholder {
				color: #999;
				font-size: 28upx;
			}
			&-active {
				color: $primary-color;
				font-size: 28upx;
			}
		}
	}
	
	&-phonecheck {
		
	}
	
	.phonecheck {
		margin: 34upx 48upx 30upx;
		padding: 60upx 40upx;
		border: 1upx solid rgba(30,30,30,0.1);
		border-radius: 24upx;
		
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
	}
	
	.tip {
		font-weight: 400;
		color: rgba(153,153,153,1);
		line-height: 36upx;
		font-size: 26upx;
	}
	
	.placeholder {
		color: #999;
		font-size: 28upx;
		line-height: 40upx;
	}	
	
	&-btn {
		margin: 25upx 32upx;
		.btn {
			height: 96upx;
			line-height: 96upx;
			font-size: 32upx;
			font-weight: 400;
		}
	}	
}
</style>
