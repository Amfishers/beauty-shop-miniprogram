<template>
	<view class="tab-nav">
		<scroll-view scroll-x :scroll-left="scrollLeft" class="tab-nav__main">
			<view class="tab-nav__item" v-for="(nav, index) in navList" :key="nav">
				<view 
					class="tab-nav__item-text" 
					:class="activeIndex === index ? 'tab-nav__item--active' : ''"
					@tap="navTap(nav, index)"
				>
					{{ nav }}
				</view>
			</view>
		</scroll-view>
		
		<scroll-view scroll-y :scroll-top="scrollTop" class="tab-nav__box">
			<template v-if="true">
				<!-- 服务商品 -->
				<view class="gridlist">
					<view class="main-title tab-nav__title">
						<text class="title">{{keyword}}</text>
						<text class="subtitle">- 相关服务商品集合</text>
					</view>
					<view class="gridlist--grid">
						<view class="gridlist--grid-item" v-for="(vpitem, vpindex) in cardData" :key="vpindex">
							<Card
								:img="vpitem.img"
								badge="活动价"
								:title="vpitem.title"
								:price="vpitem.price"
								:originPrice="vpitem.originPrice"
								:description="vpitem.description"
							/>
						</view>
					</view>
					<view class="loadmore" @tap="goMore('goods')">
						查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
					</view>				
				</view>
				<!-- 实物商品 -->
				<view class="gridlist">
					<view class="main-title tab-nav__title">
						<text class="title">{{keyword}}</text>
						<text class="subtitle">- 相关实物商品集合</text>
					</view>
					<view class="gridlist--grid">
						<view class="gridlist--grid-item" v-for="(ppitem, ppindex) in cardData" :key="ppindex">
							<Card
								:img="ppitem.img"
								badge="活动价"
								:title="ppitem.title"
								:price="ppitem.price"
								:originPrice="ppitem.originPrice"
								:description="ppitem.description"
							/>
						</view>
					</view>
					<view class="loadmore" @tap="goMore('goods')">
						查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
					</view>				
				</view>
				<!-- 门店 -->
				<view class="storelist">
					<view class="main-title tab-nav__title">
						<text class="title">{{keyword}}</text>
						<text class="subtitle">- 相关服务门店集合</text>
					</view>
					<view class="storelist-item" v-for="(psitem, psindex) in cardData" :key="psindex">
						<CardServe
							:img="psitem.img"
							:title="psitem.title"
							:rate="psitem.star"
							:distance="psitem.distance"
							:location="psitem.location"
							:description="psitem.description"
						/>
					</view>
					<view class="loadmore" @tap="goMore('store')">
						查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
					</view>				
				</view>					
				<!-- 店铺 -->
				<view class="storelist">
					<view class="main-title tab-nav__title">
						<text class="title">{{keyword}}</text>
						<text class="subtitle">- 相关服务店铺集合</text>
					</view>
					<view class="storelist-item" v-for="(vsitem, vsindex) in cardData" :key="vsindex">
						<CardStore
							:avatar="vsitem.img"
							:name="vsitem.title"
							:rate="vsitem.star"
							:storeImg="vsitem.storeImg"
							:location="vsitem.location"
							:description="vsitem.description"
						/>
					</view>
					<view class="loadmore" @tap="goMore('store')">
						查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
					</view>				
				</view>
									
									
			</template>
			<view v-else class="text-center">
				{{noneDataToast}}
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
import Card from '@/components/card/card.vue'
import CardServe from '@/components/card/cardserve.vue'
import CardStore from '@/components/card/cardstore.vue'

export default {
	components: {
		Card,
		CardServe,
		CardStore
	},
	props: {
		tabsData: {
			type: Object,
			default: () => {}
		},
		noneDataToast: {
			type: String,
			default: '暂无内容~'
		},
		currKeyword: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			scrollLeft: 0,
			scrollTop: 0,
			activeIndex: 0,
			maxNum: 4,
			keyword: this.currKeyword,
			
			cardData: [
				{
					img: require('@/static/index/reco-you.png'),
					title: '威古氏【床上用品】舒适自然洁净威古氏【床上用品】舒适自然洁净',
					price: 6.9,
					originPrice: 8.8,
					star: 5,
					description: '123人订购',
					distance: '3.1km',
					location: '地址：广东省深圳市罗湖区深南东路4003号世界金融中心…',
					storeImg: [
						{src: require('@/static/index/reco-you.png'), price: 932},
						{src: require('@/static/index/reco-you.png'), price: 932},
					],
				},
				{
					img: require('@/static/index/reco-you.png'),
					title: '威古氏【床上用品】舒适自然洁净威古氏【床上用品】舒适自然洁净',
					price: 6.9,
					originPrice: 8.8,
					star: 5,
					description: '123人订购',
					distance: '3.1km',
					location: '地址：广东省深圳市罗湖区深南东路4003号世界金融中心…',
					storeImg: [
						{src: require('@/static/index/reco-you.png'), price: 932},
						{src: require('@/static/index/reco-you.png'), price: 932},
					],
				},
				{
					img: require('@/static/index/reco-you.png'),
					title: '威古氏【床上用品】舒适自然洁净威古氏【床上用品】舒适自然洁净',
					price: 6.9,
					originPrice: 8.8,
					star: 5,
					description: '123人订购',
					distance: '3.1km',
					location: '地址：广东省深圳市罗湖区深南东路4003号世界金融中心…',
					storeImg: [
						{src: require('@/static/index/reco-you.png'), price: 932},
						{src: require('@/static/index/reco-you.png'), price: 932},
					],
				},
				{
					img: require('@/static/index/reco-you.png'),
					title: '威古氏【床上用品】舒适自然洁净威古氏【床上用品】舒适自然洁净',
					price: 6.9,
					originPrice: 8.8,
					star: 5,
					description: '123人订购',
					distance: '3.1km',
					location: '地址：广东省深圳市罗湖区深南东路4003号世界金融中心…',
					storeImg: [
						{src: require('@/static/index/reco-you.png'), price: 932},
						{src: require('@/static/index/reco-you.png'), price: 932},
					],
				},
			]
			
		}
	},	
	computed: {
		// 服务产品
		virtualProducts() {
			return this.tabsData.virtual_products || {}
		},
		virtualProductsData() {
			const itemList = this.virtualProducts.items
			return itemList.splice(0, this.maxNum)
		},		
		// 实物商品
		physicalProducts() {
			return this.tabsData.physical_products || {}
		},
		physicalProductsData() {
			const itemList = this.physicalProducts.items
			return itemList.splice(0, this.maxNum)
		},
		// 实体店铺
		physicalStore() {
			return this.tabsData.physical_store || {}
		},
		physicalStoreData() {
			const itemList = this.physicalStore.items
			return itemList.splice(0, this.maxNum)
		},
		// 虚拟商店
		virtualStore() {
			return this.tabsData.virtual_store || {}
		},
		virtualStoreData() {
			const itemList = this.virtualStore.items
			return itemList.splice(0, this.maxNum)
		},
		navList() {
			return ['全部','服务','商品','门店','店铺']
		},
		hasData() {
			const PP = this.physicalProductsData.length
			const PS = this.physicalStoreData.length
			const VP = this.virtualProductsData.length
			const VS = this.virtualStoreData.length
			
			return !!(PP || PS || VP || VS)
		},
	},
	methods: {
		// 设置当前点击的索引
		navTap(nav, index) {
			this.activeIndex = index
		},
		goMore(type) {
			let url = ''
			if(type === 'goods') {
				url = `/pages/goods/list?keyword=${this.keyword}`
			}
			if (type === 'store') {
				url = `/pages/store/list?keyword=${this.keyword}`
			}
			uni.navigateTo({
				url
			})
		},
	}

}
</script>

<style lang="scss">
.tab-nav {
	&__main {
		font-size: 0;
		@include wh(100%, 88upx);
		white-space: nowrap;
	}
	
	&__item {
		display: inline-block;
		line-height: 88upx;
		margin-right: 64upx;
		color: #666;
		
		&-text {
			position: relative;
			line-height: 54upx;
			font-size: 32upx;
		}
		
		&--active {
			font-weight: 500;
			color: $primary-color;
			&::before {
				content: '';
				@include absolute-b-l(-14upx, 50%);
				@include wh(40upx, 6upx);
				background-color: $primary-color;
				transform: translateX(-50%);
				border-radius: 6upx;
			}
		}
		
		&:last-child {
			margin-right: 0;
		}
	}
	
	&__box {
		background-color: $bg-color;
		height: 100vh;
	}
	
	&__title {
		margin: 24upx 0;
		.title {
			display: inline-block;
			padding-left: 20upx;
			font-size: 32upx;
			line-height: 45upx;
		}
		.subtitle {
			padding-left: 16upx;
			color: #999999;
			font-size: 24upx;
		}
	}	
}

.gridlist {
	padding: 0 24upx;
	&--grid {
		margin-left: -22upx;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		
		&-item {
			display: block;
			width: 50%;
			padding-left: 22upx;
			margin: 12upx 0;
		}
	}
}

.storelist {
	padding: 0 24upx;
	&-item {
		display: block;
		margin:24upx 0;
	}
}


.loadmore {
	flex: 1;
	width: 100%;
	text-align: center;
	color: #666666;
	line-height: 50upx;
	padding: 12upx 0;
	
	&-img {
		margin-left: 10upx;
		width: 28upx;
		height: 28upx;
		vertical-align: -2px;
	}
}
</style>
