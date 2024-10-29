<template>
	<view class="index-wrap">
		<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />
		<view class="bg-white">
			<view class="grid col-2 img-wrap">
				<block v-for="(item, index) in resdata.item_data" :key="index">
					<view class="img-item">
						<navigator :url="mapUrl(item)"><image :src="item.img" mode="widthFix" lazy-load class="widthFix"></image></navigator>
					</view>
				</block>
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
		resdata: [Array, Object]
	},
	computed: {},
	methods: {
		mapUrl(item) {
			return lib.mapUrl(item);
		},
		setClass(index) {
			if (index % 2 == 0) {
				return 'pdl';
			} else {
				return 'pdl pdr';
			}
		}
	}
};
</script>

<style lang="scss">
.widthFix {
	display: block;
	width: 100%;
	border-radius: 24upx;
}
.index-wrap {
	margin: 32upx 32upx 0 10upx;
}
// 2宫格，父级使用负数
.img-wrap {
	padding-top: 0;

	// 子级加边距
	.img-item {
		padding-left: 22upx;
		padding-bottom: 22upx;
	}
}
</style>
