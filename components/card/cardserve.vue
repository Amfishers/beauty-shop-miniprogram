<template>
	<navigator hover-class="none" :url="url">
		<view :class="['b-cardserve', customClass]">
			<view class="b-cardserve__box">
				<view class="b-cardserve__img">
					<image class="b-cardserve__img-main" :src="img" mode=""></image>
				</view>
				<view class="b-cardserve__info">
					<view class="b-cardserve__phone" @tap="phoneTap"></view>
					<view class="b-cardserve__title">
						<template v-if="badge">
							<text class="b-cardserve__badge primary-btn">{{ badge }}</text>
						</template>
						{{ name }}
					</view>
					<BRate v-if="rate" class="b-cardserve__rate" :value="rate" size="16" />
					<view class="b-cardserve__desc">
						{{ description }}
					</view>			
					<view class="b-cardserve__distance">
						<BIcon class="b-cardserve__distance--icon" icon="location-outline" fontSize="14" color="#D8D8D8"></BIcon>
						{{ distance }}
					</view>
				</view>
			</view>
			<view class="b-cardserve__location" v-if="location">
				地址：<text class="b-cardserve__location-main">{{ location }}</text>
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
		phone: {
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
		rate: {
			type: [String, Number],
			default: 0
		},
		distance: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		},
		location: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			
		}
	},
	methods: {
		phoneTap() {
			uni.makePhoneCall({
				phoneNumber: this.phone
			});
		},
	}
}
</script>

<style lang="scss">
.b-cardserve {
	padding: 28upx;
	background-color: #FFF;
	border-radius: 24upx;
	
	&__box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
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
		position: relative;
		flex: 1;
		padding-left: 24upx;
		padding-right: 78upx;
	}
	
	&__phone {
		position: absolute;
		top: 0;
		right: 0;
		width: 64upx;
		height: 64upx;
		background: url(../../static/phone.png) center no-repeat;
		background-size: cover;
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
	
	&__rate {
		display: block;
		margin-top: 12upx;
	}
	
	&__distance {
		// display: flex;
		// align-items: center;
		margin-top: 14upx;
		color: #666666;
		font-size: 24upx;
		height: 38upx;
		line-height: 38upx;
		
		&--icon {
			margin-right: 6upx;
			display: inline-block;
			vertical-align: middle;
			line-height: 24upx;
		}
	}
	
	&__desc {
		margin-top: 16upx;
		color: #999999;
		font-size: 24upx;
		line-height: 34upx;
		@include ellipsis;
	}
	
	&__location {
		margin-top: 24upx;
		color: #666666;
		line-height: 34upx;
		font-size: 24upx;
		@include ellipsis;
	}
}
</style>
