<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">优惠券</block>
		</cu-custom>
		<view class="coupon-list" v-if="receivedCouponList && receivedCouponList.length">
			<view class="coupon-item flex" v-for="(item, index) in receivedCouponList" :key="item.id">
				<view class="coupon-money flex flex-direction align-center justify-center" :class="item.use_status > 0 ? 'expired' : ''">
					<view class="money">
						￥
						<text>{{ item.amount | toAmount }}</text>
					</view>
					<view class="condition text-center">{{ item.min_point > 0 ? '满' + item.min_point + '可用' : '无门槛' }}</view>
				</view>
				<view class="coupon-content flex flex-sub">
					<view class="flex-sub flex flex-direction align-start justify-between">
						<view class="coupon-header">
							<text class="cu-tag" :class="item.use_status > 0 ? 'expired' : 'line-mc-primary'">{{ item.amount_type == 0 ? '优惠券' : '红包' }}</text>
							<text class="title">{{ item.coupon.name }}</text>
						</view>
						<view class="coupon-time">{{ item.start_time && timeHandler(item.start_time) }} - {{ item.end_time && timeHandler(item.end_time) }}</view>
					</view>
					<view class="coupon-action flex flex-direction align-end justify-between">
						<block v-if="item.use_status == 0">
							<button class="cu-btn line-mc round share" open-type="share">分享</button>
							<button class="cu-btn bg-primary round use" @click="clickCoupon(index)">立即使用</button>
						</block>

						<image v-if="item.use_status == 1" :src="image_path + '/used.png'" class="expired-img" />
						<image v-if="item.use_status == 2" :src="image_path + '/lose.png'" class="expired-img" />
					</view>
				</view>
			</view>
		</view>
		<blank-item :type="'red-package'" v-else />
	</view>
</template>

<script>
import blankItem from '../../components/blank.vue';
import { mapActions, mapState } from 'vuex';
import CounponService from '@/services/coupons.js'
import Timer from '@/utils/time.js'

export default {
	components: {
		blankItem
	},
	computed: {
		...mapState({
			receivedCouponList: state => state.my.receivedCouponList,
		}),		
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			type: '',
		};
	},
	methods: {
		...mapActions({
			GET_USER_RECEIVED_COUPINS: 'my/GET_USER_RECEIVED_COUPINS',
		}),		
		async getCouponList() {
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			
			try{
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
		timeHandler(timeStr) {
			if (!timeStr) return ''
			
			const timeData = new Date(timeStr)
			
			return Timer.dateFormat(timeData, '{Y}.{MM}.{DD}')
		},
		clickCoupon(index) {
			if (this.type === 'select') {
				setActiveCoupon(this.couponList[index]);
				uni.navigateBack();
			} else {
				uni.navigateTo({
					url: '/pages/goods/list'
				});
			}
		},
	},
	async onLoad(option) {
		// this.$hasLogin(); // 检查登陆状态
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		const { type, productId, productNum } = option;
		if (type === 'select') {
			this.type = type;
			await this.getCouponList({
				useStatus: '3',		// 从支付入口进来，3=可使用优惠券
				productId,
				productNum
			});
		} else {
			await this.getCouponList();
		}
		uni.hideLoading()
	},
	filters: {
		toAmount: function(value) {
			value = parseFloat(value)
			value = value.toFixed(2)
			return  parseFloat(value)
		}
	},
	onShareAppMessage() {
		return {
			path: `/pages/index/index?shareId=${this.userId}`
		};
	}
};
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.coupon-list {
	margin: 32upx 35upx 32upx 32upx;
	.coupon-item {
		@include wh(683upx, 194upx);
		margin-bottom: 24upx;
		position: relative;
		overflow: hidden;
		&::after,
		&::before {
			content: '';
			display: inline-block;
			@include wh(22upx, 22upx);
			border-radius: 11upx;
			background: #f2f2f2;
			position: absolute;
			left: 177upx;
		}
		&::after {
			bottom: -11upx;
		}
		&::before {
			top: -11upx;
		}
		.coupon-money {
			@include wh(188upx, 194upx);
			@include sc(24upx, $mc-white);
			background: linear-gradient(90deg, rgba(64,64,64,1) 0%, rgba(29,29,29,1) 100%);
			&.expired {
				background: #c4ccd4;
				.condition {
					color: #FFF;
					background:linear-gradient(328deg,rgba(177,187,196,1) 0%,rgba(209,216,222,1) 100%);
				}
			}
			.money {
				margin-bottom: 8upx;
				text {
					font-size: 44upx;
				}
			}
			.condition {
				@include wh(136upx, 40upx);
				line-height: 40upx;
				@include ellipsis;
				color: $primary-color;
				background: linear-gradient(90deg,rgba(245,219,195,1) 0%,rgba(202,147,94,1) 100%);
			}
		}
		.coupon-content {
			padding: 30upx 24upx 30upx 26upx;
			background: $mc-white;
			.coupon-header {
				line-height: 45upx;
				.cu-tag {
					vertical-align: 2upx;
					height: 40upx;
					padding: 0 8upx;
					margin-right: 8upx;
					&::after {
						border-radius: 50upx;
					}
					&.expired {
						color: #999999;
						background-color: $mc-white;
						border: 1upx solid #dddddd;
					}
				}
				.title {
					@include sc($font-lg, #1e1e1e);
					font-weight: 500;
				}
			}
			.coupon-time {
				@include sc($font-sm, #999999);
			}
			.coupon-action {
				width: 138upx;
				.expired-img {
					@include wh(132upx, 132upx);
				}
				.share {
					height: 48upx;
					padding: 0 15upx;
					@include sc(26upx, $mc-greylight);
				}
				.use {
					height: 48upx;
					padding: 0 16upx;
					@include sc(26upx, $mc-white);
					background: $primary-color;
					color: #F5DBC3;
				}
			}
		}
	}
}
</style>
