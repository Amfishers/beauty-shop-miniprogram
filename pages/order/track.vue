<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content">物流信息</block>
		</cu-custom>

		<view class="msg flex padding bg-white">
			<image :src="orderDetail.orderItem.productPic" />
			<view class="flex flex-direction align-start justify-between">
				<view class="track-status">
					物流状态：
					<text class="text-mc-primary">{{ trackList.issign === '1' ? '已签收' : '未签收' }}</text>
				</view>
				<view>快递单号：{{ trackList.number || '' }}</view>
				<view>信息来源：{{ trackList.expName || '' }} {{ trackList.expPhone || '' }}</view>
			</view>
		</view>

		<view class="container bg-white">
			<view class="header border-bottom">物流跟踪信息</view>
			<view class="express padding-lg">
				<view class="track-box" v-for="(item, index) in trackList.list" :key="index" :class="index === 0 ? 'cur' : ''">
					<view class="flex align-center justify-start track-box-header">
						<view class="cuIcon cuIcon-radiobox icon" v-if="index === 0" />
						<view class="dot-icon" v-else />
						<view>{{ item.status }}</view>
					</view>
					<view class="track-box-content">
						<view>{{ item.time }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapState('order', ['orderDetail', 'trackList'])
	},
	methods: {
		...mapActions('order', ['getExpressInfo'])
	},
	onReady() {
		uni.hideLoading();
	},
	onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		const { orderId } = option;
		this.getExpressInfo({ orderId });
	}
};
</script>

<style lang="scss">
.index {
	background-color: $mc-white;
}
.msg {
	@include sc(26upx, $mc-greylight);
	border-bottom: 28upx solid #f2f2f2;
	.track-status {
		font-size: 30upx;
	}
	image {
		@include wh(140upx, 140upx);
		margin-right: 24upx;
	}
}
.header {
	padding: 34upx 40upx;
	@include sc(30upx, $mc-grey);
}
.express {
	width: 100%;
	@include sc($font-base, $mc-greylight);
	.track-box {
		color: #999999;
		.track-box-header {
			.icon {
				font-size: 40upx;
				margin-right: 40upx;
				color: $mc-primary;
			}
			.dot-icon {
				@include wh(16upx, 16upx);
				background-color: #dddddd;
				border-radius: 8upx;
				margin-right: 52upx;
				margin-left: 12upx;
			}
		}
		.track-box-content {
			margin-left: 18upx;
			border-left: 4upx solid #f2f2f2;
			padding-left: 59upx;
			padding-bottom: 44upx;
			view {
				margin-bottom: 12upx;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		&.cur {
			color: $mc-grey;
		}
		&:last-child {
			.track-box-content {
				border: none;
			}
		}
	}
}
</style>
