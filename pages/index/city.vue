<template>
	<view class="city">
		<cu-custom :bgColor="navClass" isBack>
			<block slot="content">定位</block>
		</cu-custom>
		
		<view class="city_block">
			当前定位
		</view>
		
		<view class="city_main">
			
			<view class="city_curr flex align-center justify-between">
				<view class="city_curr-city">
					<BIcon icon="location" size="20"/>
					<text> {{ userLocData.city || '定位中...'}}</text>
				</view>
				<view class="city_curr-refresh third-color" @tap="refreshLocation">
					重新定位
				</view>
			</view>
			
			<view class="city_hot">
				<view class="title">
					热门城市
				</view>
				<view class="city_hot-list">
					<view 
						v-for="(hot, hindex) in hotCity"
						:key="hot.id"
						class="city_hot-item"
						@tap="selectCity(hot)"
					>
						{{ hot.city_name }}
					</view>
				</view>
			</view>
			
			<view class="city_list">
				<view v-for="(value, letter) in cityList" :key="letter" >
					<text class="city_list-title">{{  letter.toLocaleUpperCase() }}</text>
					<view 
						class="city_list-item"
						v-for="item in value"
						:key="item.id"
						@tap="selectCity(item)"
					>
						{{ item.city_name }}
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
import locationServices from '@/services/location.js'
import UserServices from '@/services/user.js'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
	data() {
		return {
			hotCity: [],
			cityList: {}
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,			
			userLocData: state => state.user.userLocData,
			locationInfo: state => state.user.locationInfo,
		}),
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		
		try{
			const restData = await locationServices.getShopSites()
			const { hot_sites, items } = restData.data
			this.hotCity = hot_sites
			this.cityList = items
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		uni.hideLoading()
	},
	methods: {
		...mapActions({
			GET_USER_LOCTION_WITH_IP: 'user/GET_USER_LOCTION_WITH_IP'
		}),	
		...mapMutations({
			SET_LOC_WITHIP: 'user/SET_LOC_WITHIP'
		}),	
		async selectCity(obj) {
			try{
				const resData = await locationServices.switchUserIndexSite(obj.id)
				let pages = getCurrentPages() // 当前页面
				let beforePage = pages[pages.length - 2] // 前一个页面
				uni.navigateBack({
					success() {
						beforePage.$vm.getData() // 执行前一个页面的onLoad方法
					}
				})
				
				// uni.switchTab({
				// 	url: '/pages/index/index'
				// })
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
		},
		
		refreshLocation() {
			const param = {
				identifier: this.userInfo
			}
			try{
				this.GET_USER_LOCTION_WITH_IP(param)
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
	}
};
</script>

<style lang="scss">
.city {
	&_block {
		padding: 0 32upx;
		line-height: 72upx;
		color: #999999;
		background-color: $bg-color;
	}
	
	&_curr {
		padding: 36upx 32upx 36upx 0;
		border-bottom: 1px solid #F2F2F2;
		&-city {
			text {
				margin-left: 6upx;
				font-size: 30upx;
				font-weight: bold;
			}
		}
	}
	&_main {
		margin-left: 32upx;
	}
	// 热门城市
	&_hot {
		.title {
			padding: 24upx 0;
			color: #999999;
			line-height: 40upx;
		}
		&-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		&-item {
			margin: 14upx 48upx 14upx 0;
			padding: 0 28upx;
			line-height: 52upx;
			border-radius: 26upx;
			background-color: $bg-color;
			color: $primary-color;
		}
	}
	
	// 列表
	&_list {
		&-title {
			padding: 36upx 0;
			display: block;
			color: #999999;
			font-size: 28upx;
			line-height: 40upx;
		}
		&-item {
			padding: 28upx 0;
			color: $primary-color;
			line-height: 38upx;
			border-bottom: 1px solid #F2F2F2;
		}
	}
}

</style>
