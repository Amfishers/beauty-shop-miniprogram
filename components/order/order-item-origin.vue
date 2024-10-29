<template>
	<view @click="goOrderDetail" class="order-item flex flex-direction radius border-custom">
		<view class="flex align-center justify-between">
			<view class="store flex align-center">
				<image class="store-img" :src="storeImg" />
				<text>{{ storeName }}</text>
			</view>
			<view class="order-status">{{ status }}</view>
		</view>
		<view class="content flex" v-for="item in orderItems" :key="item.id">
			<image :src="item.product_pic" class="order-img"></image>
			<view class="flex-sub flex flex-direction">
				<view class="flex flex-sub align-start justify-start flex-direction">
					<view class="flex align-center justify-between wid">
						<view class="flex-sub goods-name">{{ item.product_name }}</view>
						<view class="order-msg">
							<view class="order-price">
								￥
								<text>{{ item.product_price }}</text>
							</view>
							<view class="order-num">
								x
								<text>{{ item.product_quantity }}</text>
							</view>
						</view>
					</view>
					<!-- <view v-if="parseInt(orderType) == 0" class="order-sub">
						剩余服务次数
						<text>{{ orderSub }}次</text>
					</view> -->
				</view>
			</view>
			
			<view class="operation flex-sub flex align-end justify-end">
				<slot name="btns"></slot>
				<!--<button class="cu-btn round line-mc">申请退款</button>
					<button class="cu-btn round line-mc-primary">服务验证</button>
					 <button class="cu-btn round bg-primary margin-left-lg">评价</button> -->
			</view>			
		</view>
	</view>
</template>

<script>
export default {
	name: 'order-item',
	props: {
		url: {
			type: String
		},
		storeImg: {
			type: String
		},
		storeName: {
			type: String
		},
		status: {
			type: String
		},
		orderItems: {
			type: [Array, Object]
		},
		orderName: {
			type: String
		},
		orderType: {
			type: [Number, String],
			default: 0
		},
		orderSub: {
			type: [Number, String],
			default: 1
		}
	},
	data() {
		return {};
	},
	methods: {
		goOrderDetail() {
			uni.navigateTo({
				url: this.url
			});
		}
	}
};
</script>

<style lang="scss">
.order-item {
	position: relative;
	background-color: $mc-white;
	@include sc($font-base, $mc-grey);
	padding: 28upx 28upx 32upx 28upx;
	margin-bottom: 28upx;
	border-radius: 16upx;
	font-weight: 500;
	.store-img {
		@include wh(40upx, 40upx);
		margin-right: 12upx;
	}
	.order-status {
		color: #CA935E;
	}
	.content {
		margin-top: 28upx;
		.order-img {
			@include wh(200upx, 200upx);
			margin-right: 20upx;
		}
		.goods-name {
			height: 80upx;
			line-height: 40upx;
			margin-right: 48upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.order-msg {
			text-align: right;
			.order-price {
				font-size: 26upx;
				text {
					font-size: 36upx;
				}
			}
			.order-num {
				color: #666;
				font-size: 25upx;
				text {
					margin-left: 5upx;
				}
			}
		}
		.order-sub {
			margin-top: 14upx;
			@include sc($font-sm, $mc-greylight);
			text {
				font-size: 25upx;
				margin-left: 12upx;
			}
		}
		.operation {
			position: absolute;
			right: 28upx;
			bottom: 32upx;
			.cu-btn {
				font-size: 26upx;
				height: 60upx;
				font-weight: 400;				
			}
			.line-mc::after {
				border-color: #999999;
			}

			.line-mc-primary::after {
				border-color: linear-gradient(323deg, rgba(241, 71, 68, 1), rgba(252, 133, 131, 1)) 1 1;
			}
		}
		.wid {
			width: 100%;
		}
	}
}
</style>
