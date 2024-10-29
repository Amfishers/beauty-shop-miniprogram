<template>
	<view>
		<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />
		<view class="bg-white botder">
			<view class="img-wrap">
					<block v-for="(item, index) in resdata.item_data" :key="index">
						<navigator class="goods-wrap" hover-class="none" :url="'/pages/goods/goods?id=' + item.id">
							<view class="goods">
								<view class="img-item"><image :src="item.cover_pic" lazy-load class="widthFix"></image></view>
								<view class="goods-name">{{ item.name }}</view>
								<view class="goods-price">
									<text class="price">
										￥
										<text class="price-info">{{ item.price }}</text>
									</text>

									<text class="marketprice">
										<!-- <text>原价</text> -->
										<text class="marketprice-info">￥{{ item.market_price }}</text>
									</text>
								</view>
							</view>
						</navigator>
					</block>
			</view>
			<view class="more">
				<more :url="'/pages/goods/list'" />
			</view>
		</view>
	</view>
</template>

<script>
import lib from '@/common/common.js';
import floor_title from '@/components/template/floor_title.vue';
import more from '@/components/more/index.vue';
export default {
	components: {
		floor_title,more
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
.more{
	position: relative;
	top: -26upx;
}
.botder{
	border-bottom: 24upx solid rgba(242,242,242,1);
}
.widthFix {
	width: 100%;
}
// 2宫格，父级使用负数
.img-wrap {
	overflow: hidden;
	padding: 0 32upx 32upx 32upx;
	display: flex;
	flex-direction: row;
	flex-wrap:wrap ;
	justify-content: space-between;
	// background: $mc-bg;
}

.goods {
	width: 330upx;
	background: $mc-white;

	image {
		width: 330upx;
		height: 330upx;
	}
	.goods-name {
		width: 100%;
		height: 80upx;
		font-size: 28upx;
		font-weight: 500;
		color: #333;
		line-height: 40upx;
		margin: 20upx 0 0 0;
		@include ellipsisMultiline(2);
	}
	.goods-price {
		margin-top: 22upx;
		height: 90upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.price {
		@include sc(20upx, $primary-color);
		.price-info {
			@include sc(34upx, $primary-color);
		}
	}
	.marketprice {
		@include sc(24upx, #999999);
		margin-left: 16upx;
		.marketprice-info {
			text-decoration: line-through;
		}
	}
}

</style>
