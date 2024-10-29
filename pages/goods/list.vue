<template>
	<view class="search">
		<cu-custom isBack bgColor="bg-white">
			<block slot="content">商品列表</block>
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
			
		<!-- 商品卡片 -->
		<scroll-view class="search-bd">
			<view class="search-result">
				<view class="search-result__item" v-for="(item, index) in searchData" :key="item.id">
					<navigator :url="`/pages/goods/goods?id=${item.id}`">
						<Card
							:img="item.cover_pic"
							:name="item.name"
							:price="item.plus_price"
							:originPrice="item.market_price"
							:description="`${item.total_sale ? item.total_sale + '人订购' : ''}`"
						/>
					</navigator>
				</view>
				<view class="search-more">
					<LoadMore :status="loadMore"/>
				</view>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
import GoodsServices from '@/services/goods.js'
import Card from '@/components/card/card.vue'

export default {
	components: {
		Card,
	},
	data() {
		return {
			placeholder: '搜索关键词',
			search: '',
			screen:{
				currentIndex:0,
				list:[
					{ name:"智能推荐",status:1, show: false },
					{ name:"人气最高",status:0, show: true },
					{ name:"价格最高",status:0, show: true },
				]
			},
			page: 1,
			searchData: [],
			total: 0,
			loadMore:"more",
			product_type: 0,
		}
	},
	computed: {
		customBar() {
			return this.$store.state.customBar
		},		
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
		const { type, keyword } = option
		
		if (type != undefined && type != null) {
			this.product_type = type
		}
		if (keyword) {
			this.search = keyword
		}
		this.fetchData()
	},
	methods: {
		async fetchData() {
			const data = this.queryData()
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			try{
				const resData = await GoodsServices.getGoodsList(data)
				
				this.page = resData.data.curr_page
				this.total = resData.data.total_count
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
			
			data.name = this.search
			
			if (this.product_type != undefined && this.product_type != null) {
				data.product_type = this.product_type
			}
			// data.page = this.page
			data = {...data, ...this.screenFilter()}
			
			return data
		},
		screenFilter() {
			const screen = this.screen
			let params = {}
			
			switch (screen.currentIndex){
				case 0:
					// 智能推荐
					params.order_by = 'intelligent:desc'
					break;
				case 1:	
					// 人气最高
					params.order_by = screen.list[screen.currentIndex].status === 1 ? 'click:desc' : 'click:asc'
					break;
				case 2:
					params.order_by = screen.list[screen.currentIndex].status === 1 ? 'price:desc' : 'price:asc'				
					// 价格最高
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
		background-color: #F7F7F7;
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
		padding:12upx 24upx 12upx 0;
		
		&__item {
			width: 50%;
			margin: 12upx 0;
			
			Card {
				display: block;
				margin-left: 24upx;
			}
		}
	}

	&-more {
		width: 100%;
		
	}
}
</style>
