<template>
	<view :class="['b-cardstore', customClass]">
		<view class="b-cardstore__info">
			<view class="b-cardstore__avatar">
				<image class="b-cardstore__avatar-main" :src="avatar" mode=""></image>
			</view>
			<view class="">
				<text class="b-cardstore__name">{{ name }}</text>
				<BRate v-if="rate" class="b-cardstore__rate" :value="rate" size="16" />
			</view>
			<navigator hover-class="none" :url="url">
				<view class="b-cardstore__btn primary-btn">
					进店
				</view>
			</navigator>
		</view>
		<scroll-view class="b-cardstore__imgs" scroll-x scroll-with-animation>
			<view class="b-cardstore__imgbox" v-for="(item, index) in storeImg" :key="index">
				<image :src="item.src" mode="" class="b-cardstore__imgbox-img"></image>
				<text class="b-cardstore__imgbox-text">¥ <text class="b-cardstore__imgbox-price">{{ item.price }}</text></text>
			</view>
		</scroll-view>
	</view>
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
		avatar: {
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
		storeImg: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			
		}
	},
}
</script>

<style lang="scss">
.b-cardstore {
	padding: 28upx;
	background-color: #FFF;
	border-radius: 24upx;
	
	&__info {
		position: relative;
		padding-left: 104upx;
		padding-right: 132upx;
		height: 88upx;
	}
	
	&__avatar {
		@include wh(88upx, 88upx);
		@include absolute-t-l(0,0);
		background: url(../../static/avatar.png) center no-repeat;
		background-size: cover;
		
		&-main {
			@include wh(100%, 100%);
			border-radius: 100%;
		}
	}
	
	&__name {
		display: block;
		color: $primary-color;
		font-size: 32upx;
		margin-bottom: 8upx;
		line-height: 45upx;
		height: 45upx;
		@include ellipsis;
	}
	
	&__btn {
		@include absolute-t-r(0,0);
		width: 120upx;
		height: 56upx;
		line-height: 56upx;
		text-align: center;
		border-radius: 32upx;
	}
	
	&__imgs {
		margin-top: 56upx;
		width: 100%;
		white-space: nowrap;
	}
	
	&__imgbox {
		display: inline-block;
		position: relative;
		margin-right: 24upx;
		@include wh(200upx, 200upx);
		background-color: #F1F1F1;
		
		&:last-child {
			margin-right: 0;
		}
		
		&-img {
			display: block;
			@include wh(100%, 100%);
		}
		
		&-text {
			position: absolute;
			bottom: 0;
			left: 10upx;
			right: 10upx;
			@include ellipsis;
			font-size: 20upx;
			line-height: 28upx;		
			text-align: center;
		}
		&-price {
			font-size: 34upx;
			line-height: 48upx;
		}
	}
}
</style>
