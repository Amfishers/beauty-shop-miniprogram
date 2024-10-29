<template>
	<view class="bg-white index-banner">
		<swiper autoplay :interval="3000" :duration="1000" class="banner">
			<swiper-item v-for="(item, index) in resdata.item_data" :key="index">
				<navigator hover-class="none" :url="mapUrl(item)">
					<view class="swiper-item"><image :src="item.img" lazy-load /></view>
				</navigator>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import lib from '@/common/common.js';
export default {
	props: {
		resdata: [Array, Object]
	},
	computed: {},
	methods: {
		mapUrl(item) {
			return lib.mapUrl(item)
		}
	}
};
</script>

<style lang="scss">
.index-banner {
	margin: 0 32upx 0;
}
.banner {
	position: relative;
	z-index: 2;
	@include wh(100%, 320upx);
	margin: 0 auto;
	border-radius: 24upx;
	overflow: hidden;
	image {
		@include wh(100%, 320upx);
	}
	.wx-swiper-dot {
		@include wh(16upx, 16upx);
	}
}
</style>
