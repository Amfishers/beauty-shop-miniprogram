<template>
	<view>
		<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />
		<view class="bg-white">
			<view class="grid col-4 grid-square">
				<view v-for="(item, index) in resdata.item_data" :key="index" class="bg-img" >					
					<navigator hover-class="none" :url="mapUrl(item)">
						<image :src="item.img" mode="widthFix" lazy-load></image>
					</navigator>
				</view>
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
		}
	}
};
</script>

<style lang="scss">
</style>
