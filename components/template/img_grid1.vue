<template>
	<view class="index-wrap">
		<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />
		<view class="bg-white">
			<view v-for="(item, index) in resdata.item_data" :key="index">
				<navigator hover-class="none" :url="mapUrl(item)">
					<image :src="item.img" mode="widthFix" lazy-load class="widthFix"></image>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import lib from '@/common/common.js';
import floor_title from '@/components/template/floor_title.vue';

export default {
	components: {
		floor_title
	},
	props: {
		resdata: [Array, Object],
	},
	computed: {
	},
	methods: {
		mapUrl(item) {
			return lib.mapUrl(item);
		}
	}
};
</script>

<style lang="scss">
	.index-wrap {
		margin: 24upx 32upx;
	}
	.widthFix{
		display: block;
		width: 100%;
		border-radius: 24upx;
		overflow: hidden;
	}
</style>
