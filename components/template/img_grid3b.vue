<template>
	<view>
		<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />
		<view class="bg-white">
			<view class="flex pd">
				<view class="flex flex-column">
					
					<navigator hover-class="none" :url="mapUrl(resdata.item_data[0])">
						<image
							:src="resdata.item_data[0].img"
							mode="widthFix"
							style="width: 340upx;height: 184upx;border-bottom: 10upx solid #F5F5F5;"
							lazy-load
							class="widthFix"
						></image>
						</navigator>
						

					<navigator hover-class="none" :url="mapUrl(resdata.item_data[1])">
						<image :src="resdata.item_data[1].img" mode="widthFix" style="width: 340upx;height: 184upx;" lazy-load class="widthFix"></image>
					</navigator>
				</view>

				<view>
					<navigator hover-class="none" :url="mapUrl(resdata.item_data[2])">
					<image
						:src="resdata.item_data[2].img"
						mode="widthFix"
						style="width: 336upx;height:378upx;border-left: 10upx solid #F5F5F5;"
						lazy-load
						class="widthFix"
					></image>
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
.widthFix {
	width: 100%;
}
.pd {
	padding: 32upx;
}
.flex-column {
	flex-direction: column;
}
.one {
	width: 336upx;
	height: 378upx;
}
</style>
