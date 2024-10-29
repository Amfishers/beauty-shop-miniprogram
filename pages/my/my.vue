<template>
	<view class="my">
		<cu-custom bgColor="bg-no" :isBack="false" />

		<!-- 头部 -->
		<view class="my-header flex flex-column justify-between">
			<view class="my-info flex flex-row align-center justify-between" :style="{ marginTop: navTop }">
				<view class="flex flex-row align-center">
					<image class="user_avatar cu-avatar round" :src="userInfo.avatarUrl"></image>
					<text class="user_name">{{ currUser.nickname }}</text>
				</view>

				<view class="flex flex-row">
					<navigator style="margin-right: 37upx;" hover-class="none" url="/pages/my/message_list">
						<image class="user_opt" :src="image_path + '/message.png'" />
					</navigator>
					<navigator hover-class="none" url="/pages/my/setting"><image class="user_opt" :src="image_path + '/setting.png'" /></navigator>
				</view>
			</view>

			<view class="plus_not_open flex flex-row justify-between align-center">
				<view class="plus_left">
					<image style="width: 197upx;height: 40upx;" :src="image_path + '/plus.png'" />
					<view class=""><text class="margin-top" style="font-size: 24upx;color: #1D1D1D;">尊享会员特权，预计每年节省1228元</text></view>
				</view>
				<view class="plus_right primary-btn flex align-center justify-center">
					<text class="openNow" @click="goPlus">{{ isPlus ? '立即查看' : '立即开通' }}</text>
				</view>
			</view>
			<!-- 波浪线背景块 -->
			<view class="bg-u"></view>
		</view>
		
		<view class="my-main" :style="{ marginTop: bodyMain }">
			<!-- 卡片 -->
			<view class="my-card">
				<view class="my-card__hd flex align-center justify-between">
					<text class="title">我的订单/服务</text>
					<navigator class="link" hover-class="none" url="/pages/order/order_list">全部订单 <BIcon icon="right" /></navigator>
				</view>
				<view class="my-card__bd grid col-3">
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/order/order_list?orderindex=1&tabindex=0">
							<BIcon icon="wallet" class="iconfont" fontSize="32"></BIcon>
							<view class="text">我的订单</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/order/order_list?orderindex=0&tabindex=0">
							<BIcon icon="logistics" class="iconfont" fontSize="32"></BIcon>
							<view class="text">我的服务</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/order/order_list?orderindex=1&tabindex=7">
							<BIcon icon="pay" class="iconfont" fontSize="32"></BIcon>
							<view class="text">售后/退款</view>
						</navigator>
					</view>
				</view>
			</view>
			<!-- 我的资产 -->
			<view class="my-card">
				<view class="my-card__hd flex align-center justify-between">
					<text class="title">我的资产</text>
				</view>
				<view class="my-card__bd grid col-3">
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/my/money">
							<view class="num">{{ balance }}</view>
							<view class="text">余额</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/my/earnings">
							<view class="num">{{ earnings }}</view>
							<view class="text">累计收益</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/my/coupon_list">
							<view class="num">{{ activeCoupons.length || 0}}</view>
							<view class="text">红包/卡券</view>
						</navigator>
					</view>
				</view>
			</view>
			<!-- 我的服务 -->
			<view class="my-card my-card__service">
				<view class="my-card__hd flex align-center justify-between">
					<text class="title">我的服务</text>
				</view>
				<view class="my-card__bd grid col-4">
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/my/recommend">
							<BIcon icon="drawer" class="iconfont" fontSize="24"></BIcon>
							<view class="text">推荐名片</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/my/invite">
							<BIcon icon="group" class="iconfont" fontSize="24"></BIcon>
							<view class="text">邀请有礼</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator class="link" hover-class="none" url="/pages/my/bankcard_list">
							<BIcon icon="wallet" class="iconfont" fontSize="24"></BIcon>
							<view class="text">绑定银行卡</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator url="/pages/my/address_list" hover-class="none">
							<BIcon icon="location-outline" class="iconfont" fontSize="24"></BIcon>
							<view class="text">收货地址</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator hover-class="none" url="/pages/my/setting">
							<BIcon icon="file" class="iconfont" fontSize="24"></BIcon>
							<view class="text">个人资料</view>
						</navigator>
					</view>
					<view class="my-card__item">
						<navigator hover-class="none" url="/pages/my/faq_list">
							<BIcon icon="question" class="iconfont" fontSize="24"></BIcon>
							<view class="text">常见问题</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		
		<TabBar pageCur="my" />
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations,mapGetters  } from 'vuex'
import TabBar from '@/components/tabbar/index.vue'

export default {
	components: {
		TabBar,
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			receivedCouponList: state => state.my.receivedCouponList,
			customBar: state => state.customBar,
			userInfo: state => state.user.userInfo,
		}),
		...mapGetters({
			isPlus: 'my/isPlus',
		}),
		balance() {
			return this.currUser.available_amounts || 0
		},
		earnings() {
			return (this.currUser.analyse && this.currUser.analyse.total_incomes) || 0
		},		
		navTop() {
			return this.customBar + 'px'
		},
		bodyMain() {
			return (478 - this.customBar) + 'rpx'
		},
		activeCoupons() {
			return this.receivedCouponList && this.receivedCouponList.filter(item => item.use_status == 0)
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
		}
	},
	methods: {
		...mapActions({
			GET_CURR_USER: 'my/GET_CURR_USER',
			GET_USER_RECEIVED_COUPINS: 'my/GET_USER_RECEIVED_COUPINS',
		}),
		goPlus() {
			uni.navigateTo({
				url: '/pages/my/plus'
			})
		},
	},
	async onLoad() {
		uni.hideTabBar()
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		
		try{
			await this.GET_CURR_USER()
			await this.GET_USER_RECEIVED_COUPINS()
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		
		uni.hideLoading()
	},
}
</script>

<style lang="scss">
.my-card {
	margin: 24upx 0;
	border-radius: 24upx;
	background-color: #FFF;
	
	&__hd {
		height: 88upx;
		line-height: 40upx;
		padding: 24upx;
		border-bottom: 1px solid #F2F2F2;
		.text {
			font-weight: bold;
			color: $primary-color;
		}
		.link {
			color: #999;
			line-height: 34upx;
			font-size: 24upx;
		}		
	}
	
	&__bd {
		padding: 8upx 10upx 40upx;
	}
	
	&__item {
		margin-top: 32upx;
		text-align: center;
		.iconfont {
			color: #BE865D;
		}
		.text {
			color: #666666;
			margin-top: 18upx;
			font-size: 28upx;
			line-height: 40upx;			
		}
		.num {
			font-size: 40upx;
			line-height: 56upx;
		}
	}
	
	&__service {
		.iconfont {
			color: $primary-color;
		}
	}
}

page {
	background-color: $bg-color;
}

.my {
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
	
	&-header {
		width: 100%;
		height: 478upx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background: #FFF;
		overflow: hidden;
		background-image: url(../../static/my-bg.png);
		background-size: 100% 478upx;
		background-repeat: no-repeat;
		background-position: center center;
		
		.my-info {
			@include wh(100%, 200upx);
			padding: 32upx 45upx;
		}

		.user {
			position: relative;
			z-index: 2;
			top: -40upx;
			width: 100%;

			.avatar {
				@include wh(128upx, 128upx);
				border-radius: 64upx;
				margin-bottom: 22upx;
				overflow: hidden;
			}

			.nickname {
				@include sc(36upx, #ffffff);
			}
		}

		.notice-bar {
			position: absolute;
			left: 0;
			z-index: 10000;
			@include wh(100%, 46upx);
			padding-left: 32upx;

			image {
				margin-right: 59upx;
				@include wh(46upx, 46upx);
			}
		}
	}
	&-main {
		margin: 0 24upx;
	}
}
.user_info {
	@include wh(100%, 200upx);
	padding: 32upx 45upx;
}
.user_avatar {
	width: 96upx;
	height: 96upx;
	margin-right: 27upx;
}
.user_name {
	font-size: 36upx;
	color: #ffffff;
}
.user_opt {
	width: 48upx;
	height: 48upx;
}
.plus_not_open {
	width: 686upx;
	height: 128upx;
	background: #FFFFF;
	margin: 0 auto;
	padding: 24upx 32upx;
	position: relative;
	background:linear-gradient(90deg,rgba(245,219,195,1) 0%,rgba(202,147,94,1) 100%,rgba(202,147,94,1) 100%);
	border-radius: 32upx 32upx 0 0 ;
}
.plus_left{
	z-index: 2;
}
.plus_right {
	width: 147upx;
	height: 56upx;
	border-radius: 30upx;
	z-index: 2;
}
.openNow {
	font-size: 26upx;
	line-height: 56upx;
	border-radius: 30upx;
}
.bg-u{
	position: absolute;
	bottom: 0;
	height: 20upx;
	width:100%;
	background-image: url(../../static/cover.png); 
	z-index: 3;
	background-size: 100% 20upx;
	background-repeat: no-repeat;
	background-position: center center;
}
</style>
