<template>
	<view class="phycialstore">
		<view class="phycialstore-header">
			<view class="phycialstore-header__main flex align-center">
				<view
					class="cu-avatar round"
					:style="{
						'background-image': storeDetail.cover_pic ? 'url(' + storeDetail.cover_pic + ')' : ''
					}" 
				/>
				<view class="info flex-sub">
					<view class="name"> {{ storeDetail.name }}</view>
					<BRate v-if="storeDetail.stars" :value="storeDetail.stars" size="16"/>
				</view>
			</view>
		</view>
		
		<view class="phycialstore-suggest">
			<view class="main-title phycialstore-suggest__title">
				<text class="title">为您推荐</text>
			</view>
			
			<view class="phycialstore-goods grid col-2 justify-between">
				<template v-if="storeGoods.items.length">
					<view v-for="item in storeGoods.items" :key="item.id" class="store-items">
						<Card
							class="item"
							:url="`/pages/goods/goods?id=${item.id}&type=${item.product_type}`"
							:img="item.cover_pic"
							:name="item.name"
							:price="item.price"
							:originPrice="item.market_price"
							:description="`${item.total_sale > 0 ? (item.total_sale + '人订购') : ''}`"
						/>
					</view>
				</template>
				<template v-else>
					<text class="store-empty text-center">暂无推荐</text>
				</template>				
			</view>
		</view>
	</view>
</template>

<script>
import BRate from '@/components/rate/index.vue'
import Card from '@/components/card/card.vue'
import CardLine from '@/components/card/cardline.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
	
export default {
	components: {
		BRate,
		Card,
		CardLine,
	},
	computed: {
		...mapState({
			storeDetail: state => state.stores.storeDetail,
			storeId: state => state.stores.storeId,
			storeGoods: state => state.stores.storeGoods,
		}),		
	},
	methods: {
		...mapActions({
			GET_STORE_DETAIL: 'stores/GET_STORE_DETAIL',
			GET_STORE_GOODS: 'stores/GET_STORE_GOODS',
		}),		
		...mapMutations({
			SET_STORE_ID: 'stores/SET_STORE_ID',
		}),
	},
	// async mounted() {
	// 	uni.showLoading({
	// 		title: '加载中...',
	// 		mask: true
	// 	});
		
	// 	// 设置当前 store id
	// 	// this.SET_STORE_ID(this.storeId)
	// 	// 获取 store 详情
	// 	// await this.GET_STORE_DETAIL()
	// 	// 	获取门店商品
	// 	const data = {
	// 		store_id: this.storeId,
	// 	}
	// 	try{
	// 		await this.GET_STORE_GOODS(data)
	// 	}catch(e){
	// 		uni.showToast({
	// 			icon: 'none',
	// 			title: e.message,
	// 			duration: 2000
	// 		})
	// 	}
		
	// 	console.log('storeGoods', this.storeGoods)
		
	// 	uni.hideLoading()
	// },
}
</script>

<style lang="scss">
.phycialstore {
	&-header {
		width: 100%;
		height: 243upx;
		background-image: url(../../static/store-bg.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		
		&__main {
			padding: 70upx 40upx;
			
			.cu-avatar {
				@include wh(104upx, 104upx);
				background-image: url(../../static/store-avatar.png);
			}
			
			.info {
				margin-left: 20upx;
				overflow: hidden;
				.name {
					font-size: 36upx;
					font-weight: 700;
					color: #FFF;
					line-height: 64upx;
					@include ellipsis;
				}
			}
		}
	}
	
	&-suggest {
		padding: 24upx 0;
		
		&__title {
			margin: 0 24upx;
			.title {
				display: inline-block;
				padding-left: 20upx;
				font-size: 32upx;
				line-height: 45upx;
			}
		}
	}

	&-goods {
		padding: 24upx 12upx;
		.store-items {
			display: block;
			margin-bottom: 24upx;
			.item {
				display: block;
				margin: 0 12upx
			}
		}
		.store-empty {
			display: block;
			width: 100%;
			height: 120upx;
			line-height: 120upx;
		}
	}	
}
</style>
