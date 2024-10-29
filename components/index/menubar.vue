<template>
	<view class="menubar">
		<view class="menubar-location" @tap="goLocationPage">
			<view class="menubar-location__icon"><image :src="image_path + '/index/location.png'" mode=""></image></view>
			<text class="menubar-location__text">{{ currSiteData.city_name || '深圳市'}}</text>
		</view>
		<view class="menubar-search" @tap="goSearchPage">
			<BIcon style="margin-right: 12upx;" icon="search" font-size="12"/> 搜索关键词
		</view>
		<view class="menubar-message"><image :src="image_path + '/index/bell.png'" mode=""></image></view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
	
export default {
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			locationInfo: state => state.user.locationInfo,
			userLocData: state => state.user.userLocData,
			
			currSiteData: state => state.home.currSiteData,
		}),
	},
	methods: {
		...mapActions({
			GET_USER_LOCTION_WITH_IP: 'user/GET_USER_LOCTION_WITH_IP'
		}),	
		goSearchPage() {
			uni.navigateTo({
				url: '/pages/index/search'
			})
		},
		goLocationPage() {
			uni.navigateTo({
				url: '/pages/index/city'
			})
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
		}
	},
	mounted() {
		const param = {
			identifier: this.userInfo
		}
		if (!(this.locationInfo.longitude && this.locationInfo.latitude)) {
			Object.assign({}, param, this.locationInfo)
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
</script>

<style lang="scss">
.menubar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #fff;
	
	&-location {
		display: flex;
		align-items: center;
		color: $secondary-color;
		font-size: 11px;
		&__icon {
			image {
				@include wh(46upx, 46upx);
			}
		}
		&__text {
			max-width: 40px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	
	&-search {
		flex: 1;
		margin: 0 50upx 0 16upx;
		background: #FFF;
		text-align: center;
		height: 64upx;
		line-height: 64upx;
		color: #CACACA;
		border-radius: 32upx;
		font-size: 12px;
		border: 1px solid rgba(234,209,116,1);
	}

	&-message {
		image {
			@include wh(46upx, 46upx);
		}
	}	
}
</style>
