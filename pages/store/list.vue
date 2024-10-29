<template>
	<view class="search">
		<cu-custom isBack bgColor="bg-white">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content"> {{ store_type == 1 ? '店铺' : '门店' }}列表</block>
		</cu-custom>
				
		<view class="search-hd" :style="{'top': `${customBar}px`}">
			<!-- 搜索栏目 -->
			<view class="search-bar">
				<view class="search-input">
					<BIcon icon="search" />
					<input 
						type="text" 
						v-model="search" 
						placeholder-class="input-placeholder"
						class="search-input__input"
						:placeholder="placeholder"
						@confirm="searchConfirm"
						confirm-type="search"
					/>
				</view>
				<view class="search-cancel" @tap="cancelSearch">取消</view>
			</view>
			
			<!-- 筛选栏目 -->
			<view class="search-filter">
						
				<!-- 排序|筛选 -->
				<view class="search-filter__main">
					<view 
						class="search-filter__item"
						v-for="(item,index) in screen.list" :key="index"
						@tap="changeScreen(index)"
					>
						<view :class="screen.currentIndex === index ? 'search-filter__item--active' : ''">{{item.name}}</view>
						<view class="search-filter__sort" v-if="item.show">
							<BIcon icon="up" fontSize="6" :class="item.status===1?'search-filter__item-sort--active':'search-filter__item-sort'"></BIcon>
							<BIcon icon="down" fontSize="6" :class="item.status===2?'search-filter__item-sort--active':'search-filter__item-sort'">></BIcon>
						</view>
					</view>
				</view>
			</view>
		</view>
			
		<!-- 店铺卡片 -->
		<scroll-view class="search-bd">
			<view class="search-result">
				<view class="search-result__item" v-for="(item, index) in searchData" :key="item.name">
					<template v-if="item.store_type == 1">
						<!-- 店铺 -->
						<CardStore
							:url="'/pages/store/store?type=1&id=' + item.id"
							:avatar="item.cover_pic"
							:name="item.name"
							:rate="item.stars"
							:storeImg="item.products"
							:phone="item.phone"
						/>
					</template>
					<template v-if="item.store_type == 2">
						<view @tap="selectStore(item)">
							<CardServe
								:img="item.cover_pic"
								:name="item.name"
								:rate="item.stars"
								description=" · 资质认证 · 健康认证 · 到店实拍"
								:phone="item.phone"
								:distance="`${item.distance/1000}km`"
								:location="item.detailed_address"
							/>
						</view>
					</template>
				</view>
				<view class="search-more">
					<LoadMore :status="loadMore"/>
				</view>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import StoresServices from '@/services/stores.js'
import CardServe from '@/components/card/cardserve.vue'
import CardStore from '@/components/card/cardstore.vue'

export default {
	components: {
		CardServe,
		CardStore,
	},
	data() {
		return {
			placeholder: '搜索关键词',
			search: '',
			screen:{
				currentIndex:0,
				list:[]
			},
			page: 1,
			searchData: [],
			total: 0,
			loadMore: "noMore",
			store_type: 1,
			product_id: null,
		}
	},
	computed: {
		...mapState({
			locationInfo: state => state.user.locationInfo,
			customBar: state => state.customBar,

			orderSubmit: state => state.order.orderSubmit,  // 是否在提交订单页面			
		}),
		// customBar() {
		// 	return this.CustomBar
		// },		
	},
	watch: {
		screen: {
			deep: true,
			handler(newVal, oldVal) {
				// 请求数据
				this.searchData = []
				this.fetchData()
			},
		}
	},
	onLoad(option) {
		console.log('option', option)
		const { type, keyword, product } = option
		
		if (type != undefined && type != null) {
			this.store_type = type
		}
		if (keyword) {
			this.search = keyword
		}
		if (product) {
			this.product_id = product
		}
		
		// 1 为个人店铺
		if (this.store_type == 1) {
			this.screen.list = [
				{ name:"智能推荐",status:1, show: false },
				{ name:"销量最高",status:0, show: true },
				{ name:"评价最高",status:0, show: true },
			]
		}else if (this.store_type == 2) {
			// 2为实体店
			this.screen.list = [
				{ name:"智能推荐",status:1, show: false },
				{ name:"距离最近",status:0, show: true },
				{ name:"服务最好",status:0, show: true },
			]
		}
		
		this.fetchData()
	},
	methods: {
		...mapMutations('stores', ['SET_CART_SELECT_STORE']),		
		async fetchData() {
			const data = this.queryData()
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			try{
				const resData = await StoresServices.getStoresList(data)
				
				this.page = resData.data.page
				this.total = resData.data.total
				this.searchData = [...this.searchData, ...resData.data.items]
					
				if (this.searchData.length >= this.total) {
					this.loadMore = 'noMore'
				}else{
					this.loadMore = 'loading'
				}				
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
			uni.hideLoading()
		},
		queryData() {
			let data = {}
			
			data.search = this.search
			
			if (this.store_type != undefined && this.store_type != null) {
				data.store_type = this.store_type
			}
			
			// 店铺根据产品id搜索
			if (this.product_id) {
				data.product_id = this.product_id
			}
			
			// 个人店铺显示商品
			if (data.store_type === 1) {
				data.show_products = true
			}
			
			// 经纬度
			if (this.locationInfo && this.locationInfo.longitude && this.locationInfo.latitude) {
				data = {...data, ...this.locationInfo}
			}
			// data.page = this.page
			data = {...data, ...this.screenFilter()}
			
			return data
		},
		screenFilter() {
			const screen = this.screen
			const storeType = this.store_type
			let params = {}
			
			switch (screen.currentIndex){
				case 0:
					// 智能推荐
					params.order_by = 'intelligent:desc'
					break;
				case 1:	
					// 距离最近 / 销量最高
					params.order_by = screen.list[screen.currentIndex].status === 1 ? (storeType == 1 ? 'serveds:desc' : 'distance:desc') : ((storeType == 1 ? 'serveds:asc' : 'distance:asc'))
					break;
				case 2:
					// 服务最好 / 评价最高
					params.order_by = screen.list[screen.currentIndex].status === 1 ? (storeType == 1 ? 'evaluation:desc' : 'evaluation:desc') : ((storeType == 1 ? 'serveds:asc' : 'distance:asc'))			
					break;
			}
			return params
		},
		changeScreen(index){
			// 判断当前点击是否已经是激活状态
			let oldIndex = this.screen.currentIndex
			let oldItem = this.screen.list[oldIndex]
			if (oldIndex === index) {
				return oldItem.status = oldItem.status === 1 ? 2 : 1
			}
			let newIitem = this.screen.list[index] 
			// 移除旧激活状态
			oldItem.status = 0
			this.screen.currentIndex = index
			// 增加新激活状态
			newIitem.status = 1
		},
		searchConfirm() {
			this.searchData = []
			uni.hideKeyboard()
			this.fetchData()
			// this.fetchSearchData(this.search)
		},		
		async onReachBottom() {
			if (this.searchData.length < this.total) {
				this.loadMore = 'more'
				this.page = this.page + 1;
				await this.fetchData();
			}
		},
		// 点击取消按钮
		cancelSearch() {
			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				delta: 1
			})
		},
		selectStore(item) {
			console.log('item', item)
			if (this.orderSubmit) {
				this.SET_CART_SELECT_STORE(item)
				uni.navigateBack()
			}else {
				uni.navigateTo({
					url: `/pages/store/store?type=2&id=${item.id}`
				})
			}
		},
	}
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.search {
	
	&-hd {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 10;
		background-color: #FFF;
		padding: 0 32upx;
	}
	
	&-bar {
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
	
	// 筛选器
	&-filter {
		width: 100%;
		height: 88upx;
		
		&__main {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__sort {
			margin-left: 10upx;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			width: 12upx;
			line-height: 16px;
			color: #666;
			
			b-icon {
				display: inline-block;
				line-height: 6px;
			}
		}
		
		&__item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			text-align: center;
			color: #666;
			font-size: 32upx;
			line-height: 88upx;
			
			&--popularity {
				display: flex;
				align-items: center;
			}
			
			
			&--active {
				font-weight: 500;
				color: $primary-color;
				&::before {
					content: '';
					@include absolute-b-l(0, 50%);
					@include wh(40upx, 6upx);
					background-color: $primary-color;
					transform: translateX(-50%);
					border-radius: 6upx;
				}
			}
			
			&-sort {
				color: #666;
				
				&--active {
					color: $secondary-color;
				}
			}
		}
	
	}
	
	// 商品列表
	
	&-bd {
		padding-top: 156upx;
	}
	
	&-result {
		display: flex;
		flex-wrap: wrap;
		padding:12upx 24upx;
		
		&__item {
			width: 100%;
			margin: 12upx 0;
		}
	}

	&-more {
		width: 100%;
		
	}
}
</style>
