<template>
	<navigator hover-class="none" :url="url">
		<view :class="['b-cardline', customClass]">
			<view class="b-cardline__img">
				<image class="b-cardline__img-main" :src="img" mode=""></image>
			</view>
			<view class="b-cardline__info">
				<view class="b-cardline__title">
					<template v-if="badge">
						<text class="b-cardline__badge primary-btn">{{ badge }}</text>
					</template>
					{{ title }}
				</view>
				<view class="b-cardline__price">
					¥<text class="b-cardline__price-main">{{ price }}</text>
					<text v-if="originPrice" class="b-cardline__originprice">¥{{ originPrice }}</text>
				</view>
				<BRate class="b-cardline__rate" :value="rate" size="16" />			
				<view class="b-cardline__desc">
					{{ description }}
				</view>			
			</view>
		</view>
	</navigator>
</template>

<script>
import BRate from '@/components/rate/index.vue'
export default {
	components: {
		BRate
	},
	props: {
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
		title: {
			type: String,
			default: ''
		},
		price: {
			type: [String, Number],
			default: ''
		},
		rate: {
			type: [String, Number],
			default: 0
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
			
		}
	},
}
</script>

<style lang="scss">
.b-cardline {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28upx;
	background-color: #FFF;
	border-radius: 24upx;
	
	&__img {
		position: relative;
		@include wh(200upx, 200upx);
		
		&-main {
			@include absolute-t-l(0,0);
			width: 100%;
			height: 100%;
		}
	}
	
	&__info {
		flex: 1;
		padding-left: 24upx;
	}
	
	&__title {
		width: 100%;
		font-size: 28upx;
		line-height: 40upx;
		@include ellipsisMultiline(1);
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
	
	&__price {
		margin-top: 18upx;
		margin-bottom: 6upx;
		font-size: 20upx;
		line-height: 28upx;
		&-main {
			font-size: 34upx;
			line-height: 48upx;	
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
		margin-top: 20upx;
		color: #999999;
		font-size: 24upx;
		line-height: 34upx;
	}
}
</style>
