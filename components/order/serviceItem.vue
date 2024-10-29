<template>
	<view class="order-item">
		<view class="order-item__hd flex align-center justify-between">
			<view class="order-item__storename flex-sub flex align-center">
				<image class="order-item__storename-img" :src="image_path + '/store-s.png'" mode=""></image>
				阿玛尼旗舰店
			</view>
			<view class="third-color" v-if="type">
				待支付
			</view>
		</view>
		<view class="order-item__bd">
			<view class="order-item__bd-box flex">
				<view class="order-item__img">
					<image class="image" :src="image_path + '/index/reco-you.png'" mode=""></image>
				</view>
				<view class="order-item__name flex-sub">
					复古灯饰 流线型设计 简洁大方适合家居日灯光
				</view>
				<view class="order-item__info">
					<view class="price">
						¥<text class="text">59</text>
					</view>
					<view class="num">
						x 1
					</view>
				</view>
				<view class="order-item__opt flex" v-if="type">
					<view class="btn primary"> 去支付 </view>
					<view class="btn plan"> 去评价 </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
		}
	},
}
</script>

<style lang="scss">
.order-item {
	padding: 32upx 28upx;
	background-color: #FFF;
	border-radius: 16upx;
	&__hd {
		
	}
	&__storename {
		@include ellipsis;
		&-img {
			margin-right: 12upx;
			width: 32upx;
			height: 32upx;
		}
	}
	&__bd {
		position: relative;
		margin-top: 28upx;
	}
	&__img {
		margin-right: 20upx;
		width: 200upx;
		height: 200upx;
		.image {
			width: 100%;
			height: 100%;
		}
	}
	&__name {
		font-size: 28upx;
		font-weight: 500;
		line-height: 40upx;
		height: 80upx;
		overflow: hidden;
		@include ellipsisMultiline(2);
	}
	&__info {
		margin-left: 12upx;
		width: 88upx;
		text-align: right;
		.price {
			font-size: 26upx;
			line-height: 50upx;
			@include ellipsis;
			.text {
				font-size: 36upx;
			}
		}
		.num {
			color: #666;
			line-height: 36upx;
			@include ellipsis;
		}
	}
	&__opt {
		position: absolute;
		bottom: 0;
		right: 0;
		.btn {
			width: 140upx;
			height: 60upx;
			line-height: 60upx;
			border-width: 1px;
			border-style: solid;
			text-align: center;
			line-height: 60upx;
			background-color: $third-color;
			color: #FFF;
			font-size: 26upx;
			border-radius: 36upx;
			&.plan {
				background-color: #FFF;
				border-color: $third-color;
				color: $third-color;
			}
		}
	}
}
</style>
