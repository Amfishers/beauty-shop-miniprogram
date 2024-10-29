<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">提现</block>
		</cu-custom>
		
		<view class="cashout">
			<view class="cashout-bankcard">
				<view class="cashout-title">收款人银行卡</view>
				<view class="cashout-bankcard__item flex align-center justify-between">
					<image class="cashout-bankcard__item-img" src="../../static/cash-out.png" mode=""></image>
					<template v-if="selectedCard">
						<navigator url="/pages/my/bankcard_list?type=select" class="flex-sub flex align-center" hover-class="none">
							<view class="flex-sub flex align-center">
								<view class="cashout-bankcard__item-card">
									<view class="flex align-center">
										<text class="text">{{ selectedCard.account_name || '无' }}</text>
										<text class="text-grey">{{ selectedCard.bank_name || '无' }}</text>
									</view>
									<view class="cashout-bankcard__item-num">
										{{  selectedCard.bank_card }}
									</view>
								</view>
								<BIcon class="third-color" icon="right" font-size="14"></BIcon>
							</view>
						</navigator>
					</template>
					<template v-else>
						<navigator url="/pages/my/bankcard" class="flex-sub flex align-center" hover-class="none">
							<view class="cashout-bankcard__item-card">
								<view class="flex align-center">
									<text class="text">绑定银行卡</text>
								</view>
								<view class="cashout-bankcard__item-num">
									<text class="text-grey">提现手续费率0.06%</text>
								</view>
							</view>
							<BIcon class="third-color" icon="right" font-size="14"></BIcon>
						</navigator>
					</template>

				</view>
			</view>
			
			<view class="cashout-main">
				<view class="cashout-title">提现金额</view>
				<view class="cashout-box">
					<view class="cashout-box__input flex">
						<text class="text">¥</text>
						<input focus="isFocus" class="input" type="number" v-model="extract" placeholder="提现手续费率0.06%" placeholder-class="placeholder" />
					</view>
					<view class="cashout-box__tip">
						<text>余额 ¥{{ balance || 0 }}</text>
						<text class="all third-color" @tap="allPickHandler">全部提现</text>
					</view>
				</view>
					
				<view class="phonecheck flex align-center justify-between">
					<view class="phonecheck__box-icon"><BIcon icon="passwork" font-size="20"/></view>
					<input class="input flex-sub" placeholder-class="placeholder" :focus="captchaInputFocus" type="number" placeholder="请输入验证码" v-model="userCaptcha">
					<view v-if="!captchaSent" class="phonecheck__box-sentcode" @tap="sendCaptchaHanlder">
						获取验证码
					</view>
					<view v-else class="phonecheck__box-sentcode">
						{{ countDownText }}
					</view>
				</view>	
				
				<button class="cu-btn common-btn round cashout-btn" :disabled="disabled" @tap="cashoutHandler">提现</button>
				
				<view class="cashout-record">
					<navigator class="link" url="/pages/my/cash_out_list">查看提现记录</navigator>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import LoginService from '@/services/login'
import CashService from '@/services/cash.js'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
	data() {
		return {
			isFocus: false,
			extract: null,
			
			phone: '15999545655',
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
			currUser: state => state.my.currUser,
			
			bankcardList: state => state.bankcard.bankcardList,
			selectedBankcard: state => state.bankcard.selectedBankcard,
		}),
		selectedCard() {
			if (this.selectedBankcard) {
				if (JSON.stringify(this.selectedBankcard) !== '{}') return this.selectedBankcard
			}
			
			if (this.bankcardList.length) return this.bankcardList[0]
			
			return null
		},
		balance() {
			return this.currUser.available_amounts || 0
		},
		disabled() {
			return !this.extract
		},
	},
	methods: {
		...mapMutations({
			SET_SELECTED_BANKCARD: 'bankcard/SET_SELECTED_BANKCARD',
			SET_CASH_SUBMIT_PAGE_STATUS: 'bankcard/SET_CASH_SUBMIT_PAGE_STATUS',
		}),
		...mapActions({
			GET_BANKCARD_LIST: 'bankcard/GET_BANKCARD_LIST',
		}),		
		
		allPickHandler() {
			this.extract = this.balance
			this.$nextTick(() => {
				this.isFocus = true
			})
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
			if (!this.selectedCard) {
				return uni.showToast({
					icon: 'none',
					title: '请绑定银行卡',
					duration: 2000
				})
			}
			
			const cardPhone = this.selectedCard.phone
			const isPhone = this.isPhone(cardPhone)
			
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
				phone: '' + cardPhone
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
		cancelWaitCode() {
			this.countDown = 59
			this.countDownText = '59 秒后可重发'
			this.timer = null
			this.captchaSent = false
		},
		cashoutHandler() {
			this.debounce(this.cashOut, 500)
		},
		async cashOut() {
			const data = {
				bank_id: this.selectedCard.id,
				amount: this.extract,
				phone: '' + this.selectedCard.phone,
				code: this.userCaptcha
			}
			try{
				await CashService.postCashout(data)
				uni.navigateTo({
					url: `/pages/cart/result?result=${encodeURIComponent(
						JSON.stringify({
							msg: '提现成功',
							icon: 'success',
							action: [
								{
									title: '返回我的',
									url: '/pages/my/my'
								},
								{
									title: '返回首页',
									url: '/pages/index/index'
								}
							]
						})
					)}`
				})				
			}catch(e){
				this.cancelWaitCode()
				uni.showToast({
					icon: 'none',
					title: '出现错误，请检查输入格式重试',
					duration: 2000
				})
			}
		},
	},
	async onLoad(option) {
		await this.GET_BANKCARD_LIST()
		this.SET_CASH_SUBMIT_PAGE_STATUS(true)
	},
	onUnload() {
		this.SET_CASH_SUBMIT_PAGE_STATUS(false)
	},	
}
</script>

<style lang="scss">
.cashout {
	&-title {
		padding: 30upx 0;
		font-size: 36upx;
		line-height: 50upx;
		color: $primary-color;
	}
	&-bankcard {
		margin: 0 32upx;
		&__item {
			padding: 12upx 0 42upx;
			&-info {
				font-size: 32upx;
				color: #333;
			}
			&-img {
				margin-right: 16upx;
				width: 58upx;
				height: 58upx;
			}
			&-num {
				display: block;
				color: #333;
				margin-top: 12upx;
				font-size: 26upx;
			}
			&-card {
				padding: 0 16upx;
				flex: 1;
			}
			.third-color {
				display: block;
				color: #999;
			}
			.text {
				font-size: 32upx;
				margin-right: 16upx;
			}
			.text-grey {
				color: #999;
				font-size: 28upx;
			}
		}
	}
	&-main {
		border-top: 28upx solid #F2F2F2;
		padding: 0 32upx;
	}
	
	&-box {
		&__input {
			padding: 22upx 0 10upx;
			color: $primary-color;
			.text {
				font-size: 64upx;
				line-height: 90upx;
			}
			.placeholder {
				line-height: 40upx;
				font-weight: 400;
			}
			.input {
				margin-left: 24upx;
				flex: 1;
				font-size: 64upx;
				height: 90upx;
				font-weight: 600;
				line-height: 90upx;
			}
		}
		&__tip {
			border-top: 1upx solid rgba(229,229,229,1);
			padding-top: 28upx;
			
			.all {
				margin-left: 50upx;
			}
		}
	}
	
	&-btn {
		@include wh(100%, 96upx);
		font-size: 32upx;
		font-weight: 400;
		background-color: $primary-color!important;
		color: $secondary-color!important;
	}
	
	&-record {
		margin-top: 32upx;
		text-align: center;
		.link {
			font-size: 26upx;
			color: rgba(153,153,153,1);
			line-height: 37upx;
			text-decoration: underline;
		}
	}
	
	.placeholder {
		color: #999;
		font-size: 32upx;	
	}	
}

.phonecheck {
	margin: 72upx 0 56upx;
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
	
	.input {
		flex: 1;
		margin-left: 40upx;
	}	
}
</style>
