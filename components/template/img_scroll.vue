<template>
	<view class="bg-white">
		<block v-if="resdata.background">
			<view class="fresh-pannel bg-img">
				<image class="fresh-img-bg" :style="{ 'background-image': 'url(' + resdata.background + ')' }" />
				<view class="fresh-pannel-header flex align-center justify-between padding-xs">
					<view class="left">
						<view class="title">{{ resdata.title }}</view>
						<view class="sub-title">{{ resdata.sub_title }}</view>
					</view>
					<navigator hover-class="none" url="/pages/goods/list" class="round btn-right flex justify-center align-center">
						去逛逛
						<image class="right-img" :src="image_path + '/font/right.png'" />
					</navigator>
				</view>
				<scroll-view scroll-x class="fresh-scroll scroll" scroll-with-animation>
					<navigator v-for="(item, index) in resdata.item_data" class="scroll-item" :url="mapUrl(item)" hover-class="none" :key="index">
						<image class="scroll-item-img" :src="item.img" mode="aspectFill" style="height: 333upx" />
					</navigator>
				</scroll-view>
			</view>
		</block>

		<block v-if="!resdata.background && resdata.title">
			<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />

			<view class="myScroll">
				<scroll-view class="scroll-view_H" scroll-x="true"  scroll-with-animation>
					<view class="scroll-view-item_H"  v-for="(item, index) in resdata.item_data" :key="index">
						<navigator :url="mapUrl(item)" hover-class="none" :key="index">
							<image :src="item.img" mode="widthFix" />
						</navigator>
					</view>
						
				</scroll-view>
			</view>
		</block>
	</view>
</template>

<script>
import lib from '@/common/common.js';
import floor_title from '@/components/template/floor_title.vue';
export default {
	components: {
		floor_title
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
            scrollTop: 0,
            old: {
                scrollTop: 0
            }
		};
	},
	props: {
		resdata: [Array, Object]
	},
	computed: {},
	methods: {
		mapUrl(item) {
			return lib.mapUrl(item);
		},
        scroll: function(e) {
            this.old.scrollTop = e.detail.scrollTop
        },
	}
};
</script>

<style lang="scss">
.fresh-pannel {
	@include wh(750upx, 540upx);
	position: relative;
	padding: 24upx 0 0 32upx;
	margin-bottom: 48upx;
	@include sc($font-sm, #ffffff);
	font-weight: 300;
	line-height: 33upx;
	.fresh-img-bg {
		@include wh(100%, 100%);
		position: absolute;
		left: 0;
		top: 0;
		background-size: cover;
	}
	.title {
		font-size: 36upx;
		font-weight: 500;
		line-height: 50upx;
	}
	
	.fresh-pannel-header {
		background: none;
		position: relative;
	}
	
	.scroll {
		white-space: nowrap;
		.scroll-item {
			@include wh(240upx, 100%);
			display: inline-block;
			margin-right: 24upx;
			.scroll-item-img {
				@include wh(100%, 100%);
			}
		}
	}
	.fresh-scroll {
		height: 333upx;
		margin-top: 28upx;
	}
	.btn-right {
		margin-right: 32upx;
		@include wh(148upx, 56upx);
		background-color: rgba(0, 0, 0, 0);
		color: #ffffff;
		border: 1upx solid #ffffff;
		font-weight: 400;
		.right-img {
			margin-left: 7upx;
			@include wh(20upx, 20upx);
		}
	}
}


.myScroll{
		
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item_H {
		display: inline-block;
		height: 294upx;
		width: 620upx;
		margin-left: 32upx;
	}
}
</style>
