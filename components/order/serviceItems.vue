<template>
	<view class="order-item">
		<view class="order-item__bd">
			<view class="order-item__bd-box flex">
				<view class="order-item__img">
					<image class="image" :src="cover" mode=""></image>
				</view>
				<view class="order-item__name flex-sub">
					<view class="name">
						{{ name }}
					</view>
					<view class="desc">
						{{ desc }}
					</view>
				</view>
				<view class="order-item__info">
					<view class="price">
						¥<text class="text">{{ price }}</text>
					</view>
					<view class="num">
						x {{ count }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		cover: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		desc: {
			type: String,
			default: ''
		},
		price: {
			type: [String, Number],
			default: ''
		},
		count: {
			type: [String, Number],
			default: ''
		},
	}
}
</script>

<style lang="scss">
.order-item {
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
		.name {
			font-size: 28upx;
			font-weight: 500;
			line-height: 40upx;
			height: 80upx;
			overflow: hidden;
			@include ellipsisMultiline(2);
		}
		.desc {
			color: #666;
			font-size: 24upx;
		}
	}
	&__info {
		margin-left: 12upx;
		max-width: 138upx;
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
}
</style>
