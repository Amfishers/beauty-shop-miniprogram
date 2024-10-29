<template>
	<view class="search_list">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">搜索</block>
		</cu-custom>
		
		<view  class="search_list_hd" :style="[{ top: customBar + 'px' }]">
			<view class="search-bar" >
				<view class="search-input">
					<BIcon icon="search" />
					<input 
						type="text" 
						v-model="search" 
						placeholder-class="input-placeholder"
						class="search-input__input"
						:placeholder="placeholder"
						@confirm="searchConfirm"
						:focus="inputfocus"
						confirm-type="search"
					/>
				</view>
				<view class="search-cancel" @tap="cancelSearch">取消</view>
			</view>

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
		</view>

		<view class="tab-nav">
			<scroll-view scroll-y :scroll-top="scrollTop" class="tab-nav__box">
				<template v-if="hasData">
					<!-- 实物商品 -->
					<view v-show="isPPshow" class="gridlist">
						<view class="main-title tab-nav__title">
							<text v-if="search" class="title">{{search}} -</text>
							<text class="subtitle">相关实物商品集合</text>
						</view>
						<view class="gridlist--grid">
							<view class="gridlist--grid-item" v-for="(ppitem, ppindex) in physicalProductsData" :key="ppindex">
								<Card
									:url="`/pages/goods/goods?id=${ppitem.id}`"
									:img="ppitem.cover_pic"
									:name="ppitem.name"
									:price="ppitem.price"
									:originPrice="ppitem.market_price"
									:description="ppitem.total_sale + '人订购'"
								/>
							</view>
						</view>
						<view  v-show="physicalProducts.items.length > maxNum" class="loadmore" @tap="goMore('goods', 0)">
							查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
						</view>				
					</view>
					<!-- 服务商品 -->
					<view v-show="isVPshow" class="gridlist">
						<view class="main-title tab-nav__title">
							<text v-if="search" class="title">{{search}} - </text>
							<text class="subtitle">相关服务商品集合</text>
						</view>
						<view class="gridlist--grid">
							<view class="gridlist--grid-item" v-for="(vpitem, vpindex) in virtualProductsData" :key="vpindex">
								<Card
									:url="`/pages/goods/goods?id=${vpitem.id}`"
									:img="vpitem.cover_pic"
									:name="vpitem.name"
									:price="vpitem.price"
									:originPrice="vpitem.market_price"
									:description="vpitem.total_sale + '人订购'"
								/>
							</view>
						</view>
						<view v-show="virtualProducts.items.length > maxNum" class="loadmore" @tap="goMore('goods', 1)">
							查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
						</view>				
					</view>					
					<!-- 门店 -->
					<view v-show="isVSshow" class="storelist">
						<view class="main-title tab-nav__title">
							<text v-if="search" class="title">{{search}} -</text>
							<text class="subtitle">相关服务门店集合</text>
						</view>
						<view class="storelist-item" v-for="(vsitem, vsindex) in virtualStoreData" :key="vsindex">
							<CardServe
								:url="`/pages/store/store?id=${vsitem.id}`"
								:img="vsitem.cover_pic"
								:name="vsitem.name"
								:rate="vsitem.stars"
								:phone="vsitem.phone"
								distance="3.5km"
								:location="vsitem.city + vsitem.province + vsitem.region + vsitem.detailed_address"
								:description="vsitem.info"
							/>
						</view>
						<view v-show="virtualStore.items.length > maxNum" class="loadmore" @tap="goMore('store', 1)">
							查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
						</view>				
					</view>					
					<!-- 店铺 -->
					<view v-show="isPSshow" class="storelist">
						<view class="main-title tab-nav__title">
							<text v-if="search" class="title">{{search}} -</text>
							<text class="subtitle">- 相关服务店铺集合</text>
						</view>
						<view class="storelist-item" v-for="(psitem, vsindex) in physicalStoreData" :key="psindex">
							<CardStore
								:url="`/pages/store/store?id=${psitem.id}`"
								:avatar="psitem.cover_pic"
								:name="psitem.name"
								:rate="psitem.stars"
								:storeImg="psitem.storeImg"
							/>
						</view>
						<view  v-show="physicalStore.items.length > maxNum" class="loadmore" @tap="goMore('store', 2)">
							查看更多 <image class="loadmore-img" src="../../static/more.png" mode=""></image>
						</view>				
					</view>
				</template>
				<view v-else class="text-center search_list_empty">
				  暂无内容
				</view>
			</scroll-view>
			
		</view>

	</view>
</template>

<script>
import searchServive from '@/services/search.js'
import Card from '@/components/card/card.vue'
import CardServe from '@/components/card/cardserve.vue'
import CardStore from '@/components/card/cardstore.vue'

export default {
	components: {
		Card,
		CardServe,
		CardStore,
	},
	data() {
		return {
			search: '',
			searchData: {},
			placeholder: '请输入搜索内容',
			scrollLeft: 0,
			scrollTop: 0,
			active: '全部',
			activeIndex: 0,
			maxNum: 4,
			inputfocus: false,
		}
	},	
	computed: {
		customBar() {
			return this.$store.state.customBar
		},		
		// 服务产品
		virtualProducts() {
			return this.searchData.virtual_products || {}
		},
		virtualProductsData() {
			const itemList = this.virtualProducts.items
			return itemList && itemList.splice(0, this.maxNum)
		},		
		// 实物商品
		physicalProducts() {
			return this.searchData.physical_products || {}
		},
		physicalProductsData() {
			const itemList = this.physicalProducts.items
			return itemList && itemList.splice(0, this.maxNum)
		},
		// 实体店铺
		physicalStore() {
			return this.searchData.physical_store || {}
		},
		physicalStoreData() {
			const itemList = this.physicalStore.items
			return itemList && itemList.splice(0, this.maxNum)
		},
		// 虚拟商店
		virtualStore() {
			return this.searchData.virtual_store || {}
		},
		virtualStoreData() {
			const itemList = this.virtualStore.items
			return itemList && itemList.splice(0, this.maxNum)
		},
		navList() {
			return ['全部','服务','商品','门店','店铺']
		},
		hasData() {
			const PP = this.physicalProductsData && this.physicalProductsData.length
			const PS = this.physicalStoreData && this.physicalStoreData.length
			const VP = this.virtualProductsData && this.virtualProductsData.length
			const VS = this.virtualStoreData && this.virtualStoreData.length
			
			return !!(PP || PS || VP || VS)
		},
		isVPshow() {
			return this.virtualProductsData && this.virtualProductsData.length && (this.active === '全部' || this.active === '服务')
		},
		isPPshow() {
			return this.physicalProductsData && this.physicalProductsData.length && (this.active === '全部' || this.active === '商品')
		},
		isPSshow() {
			return this.physicalStoreData  && this.physicalStoreData.length && (this.active === '全部' || this.active === '门店')
		},
		isVSshow() {
			return this.virtualStoreData && this.virtualStoreData.length && (this.active === '全部' || this.active === '店铺')
		},
		
	},	
	onLoad(option) {
		const { keyword } = option
		
		this.search = keyword
		this.fetchSearchData(keyword)
	},
	methods: {
		async fetchSearchData(keyword) {
			
			const paramsData = { keyword }
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			try{
				const resData = await searchServive.getSearchData(paramsData)
				const { data } = resData
				this.searchData = data ? data : {}
			} catch(e) {
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			uni.hideLoading()			
		},
		searchConfirm() {
			uni.hideKeyboard()
			this.fetchSearchData(this.search)
		},		
		// 设置当前点击的索引
		navTap(nav, index) {
			if (nav !== this.active) {
				this.activeIndex = index
				this.active = nav
			}
		},
		goMore(type, difftype) {
			let url = ''
			if(type === 'goods') {
				url = `/pages/goods/list?keyword=${this.search || ' '}&type=${difftype}`
			}
			if (type === 'store') {
				url = `/pages/store/list?keyword=${this.search || ' '}&type=${difftype}`
			}
			uni.navigateTo({
				url
			})
		},		
		// 点击取消按钮
		cancelSearch() {
			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1 
			})
		},
	}
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.search {
	&_list{
		&_hd {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			background-color: #FFF;
			z-index: 10;
		}
		&_empty {
			padding-top: 180upx;
			color: #999999;
			font-size: 24upx;			
		}
	}
	
	&-bar {
		padding: 0 32upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	&-cancel {
		padding-left: 40upx;
		line-height: 68upx;
		font-size: 30upx;
	}
	
	&-input {
		flex: 1;
		position: relative;
		padding-left: 84upx;
		background-color: $bg-color;
		border-radius: 34upx;
		height: 68upx;
		
		.iconfont {
			@include absolute-t-l(50%,28upx);
			transform: translateY(-50%);
			color: #999999;
		}
		
		&__input {
			line-height: 68upx;
			height: 68upx;
		}
	}
}	
	
.tab-nav {
	padding-top: 168upx;
	&__main {
		font-size: 0;
		@include wh(100%, 88upx);
		white-space: nowrap;
		padding: 0 24upx;		
		margin: 12upx 0 0;
	}
	
	&__item {
		margin-top: 8upx;
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
	padding: 24upx;
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
	padding: 24upx;
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
