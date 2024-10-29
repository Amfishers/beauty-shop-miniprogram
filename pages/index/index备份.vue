<template>
	<view class="home-page">
		<view class="home-page__bg" :style="bgStyle"></view>
		<!-- top header -->
		<CusHeader :bgColor="navClass" :isBack="false">
			<block slot="backText"> </block>
			<block slot="content"> </block>
		</CusHeader>
		<!-- 头部导航栏 -->
		<MenuBar class="home-page__menubar"/>
		<!-- banner图片 -->
		<view class="home-page__banner">
			<image class="home-page__banner-img" src="../../static/index/banner.png" mode=""></image>
		</view>
		<!-- 快速连接导航 -->
		<QuickNav class="home-page__quicknav" :listData="quickNavData" />
		<!-- 新人大礼包 百亿补贴 -->
		<Classify :classifyData="classifyData"/>
		<!-- 店长推荐 -->
		<RecommendManager class="recomanager" />
		<!-- 为您推荐 -->
		<RecommendYou class="recoyou" />
	</view>
</template>

<script>
import IndexService from '@/services/index'
import { mapActions, mapMutations, mapState } from 'vuex'	

import CusHeader from '@/components/customHeader/index'
import MenuBar from '@/components/index/menubar'
import QuickNav from '@/components/index/quicknav'
import Classify from '@/components/index/classify'
import RecommendManager from '@/components/index/recomendManager'
import RecommendYou from '@/components/index/recomendYou'


export default {
	components: {
		CusHeader,		
		MenuBar,
		QuickNav,
		Classify,
		RecommendManager,
		RecommendYou,
	},
	data() {
		return {
			navClass: 'bg-transparent',
		}
	},
	async onLoad() {
		await this.GET_USER_LOCATION()
		await this.fetchData()
		console.log(this)
	},
	onReady() {
		
	},
	computed: {
		...mapState({
			locationInfo: state => state.user.locationInfo,
		}),
		bgStyle() {
			return `height: ${uni.upx2px(420)}px`
		},
		// 快速连接导航数据
		quickNavData() {
			return [
				{img: require('@/static/index/nav/1.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/2.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/3.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/4.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/5.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/6.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/7.png'), text: '日用护肤'},
				{img: require('@/static/index/nav/7.png'), text: '日用护肤'},
			]
		},
		classifyData() {
			return [
				{img: require('@/static/index/style-1.png'), text: '生美', url: ''},
				{img: require('@/static/index/style-2.png'), text: '科美', url: ''},
				{img: require('@/static/index/style-3.png'), text: '康美', url: ''},
				{img: require('@/static/index/style-4.png'), text: '医美', url: ''},
			]
		},
	},
	methods: {
		...mapActions({
			GET_USER_LOCATION: 'user/GET_USER_LOCATION'
		}),		
		async fetchData() {
			const { longitude, latitude } = this.locationInfo
			const data = {
				longitude,
				latitude
			}
			
			try{
				const resData = await IndexService.getIndexData(data)
				console.log('resData', resData)
			}catch(e){
				//TODO handle the exception
			}
		},
	}
}
</script>

<style lang="scss">
.home-page {
	padding: 0 32upx;
	
	&__bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 420upx;
		z-index: -1;
		background: url(../../static/index/index-bg.png)
	}
	
	&__menubar {
		.menubar {
			margin-top: 27upx;
		}
	}
	
	&__banner {
		margin-top: 56upx;
		&-img {
			display: block;
			width: 100%;
			height: 188upx;
		}
	}
	
	&__quicknav {
		.quick-nav {
			margin-top: 36upx;
		}
	}
	
	.recomanager {
		.reco-manager {
			margin-top: 48upx;
		}
	}
	
	.recoyou {
		.reco-you {
			margin-top: 48upx;
		}
		.reco-you__card {
			margin-top: 20upx;
			padding: 24upx 0;
		}
		.b-card {
			margin-left: 24upx;
		}
		.reco-you__card--grid {
			margin-left: -24upx;
		}
		.reco-you__card--list {
			margin-top: 12upx;
		}
		.reco-you__cardlist-item {
			padding: 12upx 0;
		}
	}
}
</style>
