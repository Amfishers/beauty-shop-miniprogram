<template>
	<view class="plus">
		<cu-custom :bgColor="navClass" isBack>
			<block slot="content">PLUS会员</block>
		</cu-custom>
		<!-- 头部 -->
		<view class="plus-header">
			<view class="plus-info">
				<view class="open-plus">
					<image class="plus-hd__bg" :src="image_path + '/plus/plus-bg.png'" mode=""></image>
					<view class="open-plus__item">
						<template v-if="isPlus">
							<view class="plus-user__main">
								<view class="plus-user flex justify-between">
									<image class="plus-user__avatar cu-avatar cu-avatar-plus round" :src="userInfo.avatarUrl"></image>
									<view class="plus-user__info flex-sub">
										<view class="plus-user__name">{{ currUser.nickname }}</view>
										<view class="plus-user__date grey">{{ currUser.plus_end_time.split(' ')[0] }}到期   <navigator class="link" url="/pages/my/plus_record" hover-class="none">购买记录></navigator></view>
									</view>
								</view>
								<view class="flex align-center justify-between">
									<image class="plus-user__img" :src="image_path + '/plus.png'" mode=""></image>
									<text class="plus-user__info flex-sub grey">已为您节省1255元</text>
									<view class="plus-user__btn" @tap="tobePlusHandler">
										立即续费
									</view>
								</view>
							</view>
						</template>						
						<template v-else>
							<image class="text" :src="image_path + '/plus/plus-text.png'" mode=""></image>
							<text class="state">尊享6大会员权益</text>
						</template>
					</view>
				</view>
			</view>
			<!-- 波浪线背景块 -->
			<view :class="isPlus ? 'bg-p': 'bg-u'"></view>
		</view>
		
		<view class="plus-main" :style="{ marginTop: bodyMain }">
			<view class="plus-detail">
				<view class="plus-detail__hd text-center">
					<text class="text">PULS尊享6大会员权益</text>
				</view>
				<view class="plus-detail__bd grid col-3">
					<view class="plus-detail__item">
						<image class="plus-detail__item-img" :src="image_path + '/plus/plusright-1.png'" mode=""></image>
						<view class="text">卖手特权 <br> 分享商品赚取收益</view>
					</view>
					<view class="plus-detail__item">
						<image class="plus-detail__item-img" :src="image_path + '/plus/plusright-2.png'" mode=""></image>
						<view class="text">优惠折扣 <br> 尊享会员专属价格</view>
					</view>
					<view class="plus-detail__item">
						<image class="plus-detail__item-img" :src="image_path + '/plus/plusright-3.png'" mode=""></image>
						<view class="text">服务特权 <br> 进店优先安排服务</view>
					</view>
					<view class="plus-detail__item">
						<image class="plus-detail__item-img" :src="image_path + '/plus/plusright-4.png'" mode=""></image>
						<view class="text">物流特权 <br> 商品优先安排派送</view>
					</view>
					<view class="plus-detail__item">
						<image class="plus-detail__item-img" :src="image_path + '/plus/plusright-5.png'" mode=""></image>
						<view class="text">免运费 <br> 全部商品0运费</view>
					</view>
					<view class="plus-detail__item">
						<image class="plus-detail__item-img" :src="image_path + '/plus/plusright-6.png'" mode=""></image>
						<view class="text">专属客服 <br> 一对一服务</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<!-- 推荐 -->
		<view class="plus-recommend" v-if="isPlus">
			<view class="title">推荐PLUS尊享爆品</view>
			<view class="plus-recommend__bd grid col-2">
				<view class="plus-recommend__item">
					<Card
						img="https://jelyon-1302252586.cos.ap-guangzhou.myqcloud.com/default/icon_sp02.png"
						name="威古氏【床上用品】舒适自然洁净，适合您…"
						price="6.9"
						:isPlus="true"
						description="199人订购"
					/>
				</view>
				<view class="plus-recommend__item">
					<Card
						img="https://jelyon-1302252586.cos.ap-guangzhou.myqcloud.com/default/icon_sp02.png"
						name="威古氏【床上用品】舒适自然洁净，适合您…"
						price="6.9"
						:isPlus="true"
						description="199人订购"
					/>
				</view>

			</view>
		</view>
		<!-- 开通 -->
		<view class="plus-open" v-else>
			<view class="plus-open__hd">
				选择服务类型
			</view>
			<view class="plus-open__bd">
				<view class="plus-open__card">
					<view class="title"> PLUS年卡 </view>
					<view class="price">
						<text class="price-now third-color"><text>¥</text>520</text>
						<text class="price-unit">/年</text>
						<text class="price-origin">¥798/年</text>
					</view>
					<checkbox class="checkbox" :checked="agreeCheck" @tap="agreeCheck = !agreeCheck" />
				</view>
				<view class="plus-open__copyright">
					<checkbox class="checkbox black" :checked="protocolCheck"  @tap="protocolCheck = !protocolCheck"/>
					<text>开通会员代表接受</text><navigator class="third-color link">《娇杨PLUS会员服务协议》</navigator>
				</view>
						
				<!-- 点击购买 -->
				<view class="buy-btn" @click="tobePlusHandler">
					立即购买
				</view>				
			</view>
		</view>
	</view>
</template>

<script>
import Card from '@/components/card/card.vue'
import { mapActions, mapState, mapMutations,mapGetters  } from 'vuex'
import UserService from '@/services/user.js'

export default {
	components: {
		Card,
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			userInfo: state => state.user.userInfo,
			wxCode: state => state.user.wxCode,
			customBar: state => state.customBar,
		}),
		...mapGetters({
			isPlus: 'my/isPlus',
		}),
		navTop() {
			return this.customBar + 'px'
		},
		bodyMain() {
			return (407 - this.customBar) + 'rpx'
		},
	},	
	data() {
		return {
			image_path: this.$cfg.image_path,
			scrollTop: 0,
			navClass: 'bg-transparent',
			protocolCheck: true, // 协议同意
			agreeCheck: true, // 同意开通
			// navTop: this.CustomBar + 'px',
			// bodyMain: 407 - this.CustomBar + 'rpx'
		}
	},
	methods: {
		...mapActions({
			GET_CURR_USER: 'my/GET_CURR_USER',
		}),
		onPageScroll(res) {		// 滚动
			if (res.scrollTop > 45) {
				this.navClass = 'bg-home';
			} else {
				this.navClass = 'bg-transparent';
			}
			this.scrollTop = res.scrollTop;
		},		
		async tobePlusHandler() {
			if(!this.agreeCheck) {
				return 	uni.showToast({
					icon: 'none',
					title: '请选择开通会员',
					duration: 2000
				})
			}
			if(!this.protocolCheck) {
				return 	uni.showToast({
					icon: 'none',
					title: '请阅读协议',
					duration: 2000
				})
			}
			// 开通会员/续费
			let params = {
				code: this.wxCode
			}
			try{
				const resData = await UserService.setUserPlus(params)
				const payData = resData.data

				if (payData) {
					uni.requestPayment({
						...payData,
						success: res => {
							this.GET_CURR_USER()
							uni.showModal({
								title: '支付成功',
								content: `您已成功支付，开启PLUS会员!`,
								showCancel: false,
								confirmText: '好的',
								complete: () => {
									return uni.switchTab({
										url: '/pages/user/index'
									});
								}
							});
						},
						fail: err => {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							})
						},
					});
				} else {
					// 参数错误
					uni.showToast({
						title: '获取支付参数错误',
						icon: 'none'
					})
				}				
				
				
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		// goBuy() {
		// 	uni.navigateTo({
		// 		url: '/pages/cart/pay'
		// 	})
		// },
	},
	async onLoad() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		
		await this.GET_CURR_USER()
		
		uni.hideLoading()
	},	
}
</script>

<style lang="scss">

.plus {
	&-header {
		width: 100%;
		height: 407upx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background: #FFF;
		background-image: url(../../static/my-bg.png);
		background-size: 100% 407upx;
		background-repeat: no-repeat;
		background-position: center center;
	}
	&-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 240upx;
		margin-left: 24upx;
		margin-right: 24upx;
	}
	&-main {
		margin: 0 24upx;
	}
	
	// 会员
	&-user {
		padding-bottom: 16upx;
		border-bottom: 1px solid rgba(29,29,29,.15);
		margin-bottom: 16upx;
		
		&__main {
			padding: 30upx 35upx;
			.grey {
				color: #666666;
				font-size: 26upx;
				line-height: 38upx;
			}
		}
		&__avatar {
			width: 96upx;
			height: 96upx;
			border: 1px solid #FFF;
		}
		&__info {
			text-align: left;
			margin-left: 24upx;
		}
		.link {
			display: inline-block;
			margin-left: 32upx;
		}
		&__name {
			font-size: 36upx;
			font-weight: 600;
			color: $primary-color;
			line-height: 50upx;
			@include ellipsis;
		}
		&__img {
			width: 168upx;
			height: 43upx;
		}
		&__btn {
			width:147upx;
			height:56upx;
			background:linear-gradient(90deg,rgba(53,53,53,1) 0%,rgba(29,29,29,1) 100%);
			border-radius:30upx;
			line-height: 56upx;
			color: #F5DBC3;
			font-size: 26upx;
		}
	}
	
	// 权益
	&-detail {
		&__hd {
			.text {
				font-weight: 600;
				font-size: 32upx;
				line-height: 46upx;
			}
		}
		&__bd {
			padding-bottom: 40upx;
		}
		&__item {
			margin: 56upx 0 0;
			text-align: center;
			&-img {
				width: 120upx;
				height: 120upx;
			}
			.text {
				font-size:24upx;
				line-height:34upx;
			}
		}
	}
	
	// 推荐
	&-recommend {
		.title {
			margin-top: 20upx;
			border-top: 1px solid #F2F2F2;
			padding: 48upx 12upx 24upx;
			text-align: center;
			font-weight: 600;
			font-size: 32upx;
			line-height: 46upx;
		}
		&__bd {
			padding: 24upx 24upx 24upx 0;
			background-color: $bg-color;
		}
		&__item {
			padding-left: 24upx;
		}
	}
	
	// 开卡
	&-open {
		border-top: 16upx solid $bg-color;
		padding: 40upx;
		&__hd {
			padding: 10upx 0 30upx;
			font-size: 32upx;
			font-weight: 600;
			line-height: 45upx;
		}
		&__bd {
			padding-bottom: 40upx;
		}
		&__card {
			position: relative;
			padding: 32upx;
			background: rgba(245,219,195,0.47);
			border-radius: 16upx;
			border: 1px solid rgba(202,147,94,1);
			.title {
				font-size: 28upx;
				font-weight: 600;
				line-height: 40upx;
			}
			.price {
				margin-top: 12upx;
				&-now {
					font-size: 32upx;
					font-weight: 600;
					line-height: 45upx;
					text {
						font-size: 28upx;
					}
				}
				&-unit {
					margin-left: 4upx;
					font-size: 28upx;
					line-height: 40upx;
				}
				&-origin {
					margin-left: 12upx;
					font-size: 24upx;
					color: #999;
					line-height: 34upx;
					text-decoration: line-through;
				}
			}
			.checkbox {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 48upx;
			}
		}
		
		&__copyright {
			padding: 32upx 0 55upx;
			.link {
				display: inline-block;
			}
			.checkbox {
				margin-right: 8upx;
				.wx-checkbox-input{
					width: 32upx!important;
					height: 32upx!important;
				}	
			}
		}
	}
}
.open-plus {
	width: 100%;
	height: 100%;
	text-align: center;
	
	.plus-hd__bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.text {
		box-sizing: content-box;
		display: block;
		margin: 0 auto;
		padding-top: 70upx;
		width: 385upx; 
		height: 53upx;
	}
	.state {
		margin-top: 30upx;
		padding: 0 20upx;
		display: inline-block;
		line-height: 48upx;
		font-size: 24upx;
		color: #FFF;
		background:linear-gradient(270deg,rgba(64,64,64,1) 0%,rgba(29,29,29,1) 100%);
		border-radius:24px;
	}
	&__item {
		width: 100%;
		height: 100%;
	}
}
	
.bg-u{
	position: absolute;
	bottom: 0;
	height: 20upx;
	width:100%;
	background-image: url(../../static/cover-white.png); 
	z-index: 3;
	background-size: 100% 20upx;
	background-repeat: no-repeat;
	background-position: center center;
}
.bg-p {
	position: absolute;
	bottom: -34upx;
	height: 36upx;
	width: 100%;
	background: linear-gradient(to right, $primary-color 24upx, #FFF 24upx, #FFF calc(100% - 24upx),$primary-color calc(100% - 24upx), $primary-color 100%);
	overflow: hidden;
	&::before,
	&::after {
		content: '';
		position: absolute;
		top: -2upx;
		width: 72upx;
		height: 72upx;
		border-radius: 100%;
		background-color: #FFF;
	}
	&::before {
		left: 0;
	}
	&::after {
		right: 0;
	}
}
.buy-btn {
	height: 98upx;
	line-height: 98upx;
	text-align: center;
	color: $secondary-color;
	background-color: $primary-color;
	font-weight: 400;
	border-radius: 54upx;
}
</style>
