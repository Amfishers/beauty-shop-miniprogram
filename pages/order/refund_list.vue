<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">退款详情</block>
		</cu-custom>

		<view class="detail text-center">
			<view class="header flex align-start justify-between ">
				<view class="header-info flex flex-direction align-start">
					<view class="status">{{ refundDetailMsg[refundData.status].status }}</view>
					<view class="notice">{{ refundDetailMsg[refundData.status].notice }}</view>
				</view>
				<!-- <image :src="image_path + '/font/serve.png'" class="status-icon"></image> -->
			</view>

			<view class="container">
				<view class=" flex align-center justify-between mb28">
					<view>退款金额</view>
					<view class="sub-msg">
						<text>
							￥
							<text>{{ refundData.return_amount }}</text>
						</text>
					</view>
				</view>
				<view class=" flex align-center justify-between mb28">
					<view>退款方式</view>
					<view>微信支付</view>
				</view>
			</view>

			<view class="container bg-white">
				<view class="text-left solid-bottom mb28">
          <view class="record-header">退款进度</view>
        </view>

				<view class="mc-timeline text-left padding-left">
					<!-- 一定会存在 -->
					<view class="mct-box mct-box--finish">
						<view class="flex align-center justify-start mct-box-header">
							<view :class="['mct-icon']"></view>
							<view class="title">退款申请已提交</view>
						</view>
						<view class="mct-box-content">
							<view>您的退款申请已成功提交</view>
							<view>{{ refundData.createTime }}</view>
						</view>
					</view>
					<!-- 处理中 -->
					<view :class="pendingStyle">
						<view class="flex align-center justify-start mct-box-header">
							<view :class="['mct-icon']"></view>
							<view class="title">平台处理中</view>
						</view>
						<view class="mct-box-content"><view>您的退款申请已受理，预计1-3个工作日完成处理</view></view>
					</view>
					
					
					<template v-if="refundStatus > 1">
						<!-- 退款成功 -->
						<view v-if="refundStatus == 2" class="mct-box mct-box--closed mct-box--active">
							<view class="flex align-center justify-start mct-box-header">
								<view :class="['mct-icon']"></view>
								<view class="title">退款成功</view>
							</view>
							<view class="mct-box-content"><view>已退款至原支付账户</view></view>
						</view>
						<!-- 退款失败 -->
						<view v-if="refundStatus == 3" class="mct-box mct-box--fail mct-box--active">
							<view class="flex align-center justify-start mct-box-header">
								<view :class="['mct-icon']"></view>
								<view class="title">退款失败</view>
							</view>
							<view class="mct-box-content">
								<view>{{ refundData.note }}</view>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="mct-box mct-box--unfinish">
							<view class="flex align-center justify-start mct-box-header">
								<view class="mct-icon"></view>
								<view class="title">退款成功</view>
							</view>
							<view class="mct-box-content"><view>已退款至原支付账户</view></view>
						</view>
					</template>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
	data() {
		return {
			image_path: this.$cfg.image_path,
			refundDetailMsg: [
				{
					status: '已提交',
					notice: '请耐心等待处理！'
				},
				{
					status: '处理中',
					notice: '您的退款已受理，请耐心等待！'
				},
				{
					status: '退款成功',
					notice: '已退款返还至原支付账户！'
				},
				{
					status: '退款失败',
					notice: '如有任何问题请联系客服。！'
				}
			]
		};
	},
	computed: {
		...mapState('order', ['orderRefundDetail']),
		refundData() {
			// 1 实物订单  2 服务订单
			// 退款单状态： 
			// 实物： 0->待平台审核； 1->退货中； 2->已退款； 3->已拒绝; 
			// 服务： 0->待门店审核； 1->待平台审核； 2->已完成； 3->已拒绝
			return this.orderRefundDetail.return
		},
		refundStatus() {
			return this.refundData && this.refundData.status
		},
		isServiceGood() {
			return this.refundData && this.refundData.order_type == 2
		},
		isPhysicalGood() {
			return this.refundData && this.refundData.order_type == 1
		},
		pendingStyle() {
			return [
				'mct-box',
				(this.refundStatus == 0 || this.refundStatus == 1) ? 'mct-box--active' : '',
				(this.refundStatus > 1) ? 'mct-box--finish' : 'mct-box--pending'
			]
		},
	},
	methods: {
		...mapActions('order', ['ORDER_REFUND_DETAILD'])
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		const { order, id, type } = option;
		try{
			await this.ORDER_REFUND_DETAILD({ id, data: { order_type: type } })
		}catch(e){
			uni.showLoading({
				title: e.message,
				mask: true
			});
		}
		uni.hideLoading();
	}
};
</script>

<style lang="scss">
page {
	background: $bg-color;
}
.container {
	width: 686upx;
	min-height: 148upx;
	background-color: $mc-white;
	border-radius: 16upx;
	@include sc($font-base, $mc-grey);
	font-weight: 400;
	padding: 30upx 32upx;
	margin: 28upx auto;
}
.header {
	@include wh(750upx, 280upx);
	background: $primary-color;
	border-radius: 0 0 50% 50% / 0 0 40upx 40upx;
	margin-bottom: -100upx;

	.header-info {
		padding: 40upx 20upx 0 40upx;
	}

	.status {
		@include sc(36upx, $mc-white);
		font-weight: 500;
		line-height: 50upx;
		margin-bottom: 12upx;
	}
	.notice {
		@include sc(26upx, $mc-white);
		font-weight: 400;
		line-height: 37upx;
	}
	.status-icon {
		@include wh(312upx, 240upx);
	}
}

.mb28 {
	margin-bottom: 28upx;
	&:last-child {
		margin-bottom: 0;
	}
}

.sub-msg {
	@include sc(30upx, $primary-color);
	& > text {
		@include sc(24upx, $primary-color);
		text {
			font-size: 44upx;
		}
	}
}
.record-header {
	padding-bottom: 30upx;
	font-weight: 500;
	line-height: 42upx;
	font-size: 30upx;
	border-bottom: 1upx solid #E5E5E5;
}

// mc-timeline
.mc-timeline {
	width: 100%;
	@include sc($font-base, $mc-greylight);
	.mct-box {
		.mct-box-header {
			.mct-icon {
				width: 40upx;
				height: 40upx;
				margin-right: 40upx;
				background-size: cover;
			}
			image {
				@include wh(40upx, 40upx);
				margin-right: 40upx;
			}
		}
		.mct-box-content {
			margin-left: 18upx;
			border-left: 4upx solid #CA935E;
			padding-left: 59upx;
			padding-bottom: 44upx;
			margin-top: 8upx;
			margin-bottom: 8upx;
			color: #ccc;
			view {
				margin-bottom: 12upx;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		&.cur {
			.mct-box-header {
				color: $mc-primary;
			}
			.mct-box-content {
				border-color: #f2f2f2;
			}
		}
		&.pending {
			.mct-box-header {
				color: #cccccc;
				.mct-icon {
					color: #cccccc;
				}
			}
			.mct-box-content {
				border-color: #f2f2f2;
				color: #cccccc;
			}
		}
		&:last-child {
			.mct-box-content {
				border: none;
			}
		}
		
		&--active {
			.title {
				color: #CA935E;
				font-size: 32upx;
			}
		}
		
		&--finish {
			.mct-icon {
				background-image: url(../../static/order/done.png);
			}
		}
		&--closed {
			.mct-icon {
				background-image: url(../../static/order/done.png);
			}
		}
		&--pending {
			.mct-icon {
				background-image: url(../../static/order/pending.png);
			}
			.mct-box-content {
				border-left-color: #F2F2F2;
			}
		}
		&--fail {
			.mct-icon {
				background-image: url(../../static/order/fail.png);
			}
		}
		&--unfinish {
			color: #ccc;
			.title {
				color: #CCCCCC;
			}
			.mct-box-content {
				border-left-color: #ccc;
			}
			.mct-icon {
				background-image: url(../../static/order/unfinish.png);
			}
		}		
	}
}
</style>
