<template>
	<navigator hover-class="none" :url="url">
		<view :class="['b-card', customClass]">
			<view class="b-card__img">
				<image class="b-card__img-main" :src="img" mode=""></image>
			</view>
			<view class="b-card__info">
				<view class="b-card__title">
					<template v-if="badge">
						<text class="b-card__badge primary-btn">{{ badge }}</text>
					</template>
					{{ name }}
				</view>
				<view class="b-card__opt">
					<view class="b-card__price">
						¥<text class="b-card__price-main">{{ price }}</text>
						<template v-if="isPlus">
							<image :src="image_path + '/plus/plus.png'" class="b-card__price-plus" mode=""></image>
						</template>
						<text v-if="originPrice" class="b-card__originprice">¥{{ originPrice }}</text>
					</view>
					<view class="b-card__desc">
						{{ description }}
					</view>
				</view>
			</view>
		</view>
	</navigator>
</template>

<script>
export default {
	props: {
		isPlus: {
			type: Boolean,
			default: false
		},
		url: {
			type: String,
			default: ''
		},
		customClass: {
			type: String,
			default: ''
		},
		img: {
			type: String,
			default: ''
		},
		badge: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		price: {
			type: [String, Number],
			default: ''
		},
		originPrice: {
			type: [String, Number],
			default: ''
		},
		description: {
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
.b-card {
	border-radius: 16upx;
	overflow: hidden;
	&__img {
		position: relative;
		width: 100%;
		padding-top: 100%;
		background: #fff;
		
		&-main {
			@include absolute-t-l(0,0);
			width: 100%;
			height: 100%;
		}
	}
	
	&__info {
		padding: 20upx;
		background-color: #FFF;
	}
	
	&__title {
		font-size: 28upx;
		line-height: 40upx;
		height: 80upx;
		@include ellipsisMultiline(2);
	}
	
	&__badge {
		display: inline-block;
		vertical-align: 2px;		
		padding: 0 4px;
		margin-right: 6upx;		
		border-radius: 14upx;
		line-height: 28upx;
		font-size: 16upx;
	}
	
	&__opt {
		margin-top: 22upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	&__price {
		font-size: 20upx;
		line-height: 28upx;
		&-main {
			font-size: 34upx;
			line-height: 48upx;	
		}
		&-plus {
			margin-left: 8upx;
			width: 76upx;
			height: 30upx;
		}
	}
	
	&__originprice {
		padding-left: 16upx;
		text-decoration: line-through;
		color: #999999;
		font-size: 24upx;
		line-height: 34upx;
	}
	
	&__desc {
		margin-left: 12upx;
		color: #999999;
		font-size: 24upx;
		line-height: 34upx;
		@include ellipsisMultiline(1);
	}
}
</style>
