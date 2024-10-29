<template>
	<view class="pay">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">订单支付</block>
		</cu-custom>
		
		<view class="pay-main">
			<view class="pay-card text-center">
				<view class="pay-card__price">
					¥ <text class="price">398</text>
				</view>
				<view class="pay-card__time">
					支付剩余时：29分59秒
				</view>
			</view>
			
			<view class="pay-type flex align-center justify-between">
				<view class="pay-type__label flex align-center">
					<BIcon class="wechat" icon="wechat-pay" fontSize="20" />
					微信支付
				</view>
				<checkbox class=""></checkbox>
			</view>
			
			<view class="submit-btn" @click="goResult">
				确定支付¥398
			</view>		
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		goResult() {
			uni.navigateTo({
				url: '/pages/cart/result'
			})
		},
	}
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.pay {
	&-main {
		padding: 32upx;
	}
	&-card {
		padding: 40upx;
		border-radius: 16upx;
		background-color: #FFF;
		&__price {
			font-size: 40upx;
			.price {
				font-size: 88upx;
			}
		}
		&__time {
			display: inline-block;
			margin-top: 12upx;
			line-height: 56upx;
			padding: 0 26upx;
			font-size: 28upx;
			background:rgba(245,219,195,.5);
			border-radius: 28upx;
		}
	}
	&-type {
		border-radius: 16upx;
		margin-top: 40upx;
		padding: 36upx 28upx;
		background-color: #FFF;
		&__label {
			.wechat {
				color: #2FB670;
				display: block;
				margin-right: 16upx;
			}
		}
	}
}
.submit-btn {
	margin-top: 64upx;
	height: 98upx;
	line-height: 98upx;
	text-align: center;
	color: $secondary-color;
	background-color: $primary-color;
	font-weight: 400;
	border-radius: 54upx;
}
</style>
