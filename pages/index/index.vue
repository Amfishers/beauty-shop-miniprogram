<template>
	<view class="index">
		<!-- top header -->
		<cu-custom :bgColor="navClass" :isBack="false">
			<block slot="content">{{title}}</block>
		</cu-custom>
		<!-- top banner -->
		<image class="topbg" :src="image_path + '/index/index-bg.png'"></image>
		<!-- 城市及消息 -->
		<!-- <view class="flex justify-between align-center topbar">
			<view class="location flex justify-center align-center">
				<image :src="image_path + '/font/location.png'" class="location-icon"></image>
				<view class="location-addr"><navigator hover-class="none" url="/pages/index/city">{{ siteName }}</navigator> </view>
			</view>
			<navigator hover-class="none" url="/pages/user/message"><image :src="image_path + '/font/msg.png'" class="location-icon location-msg"></image></navigator>
		</view> -->
		
		<!-- 头部导航栏 -->
		<MenuBar class="home-page__menubar"/>		

		<template v-if="pageData.length > 0">
			<view v-for="(item, index) in pageData" :key="index" class="zindex2">
				<!-- 页面模块组件 -->
				<img_banner v-if="item.item_type == 'img_banner' && item.item_usable==1" :resdata="item" />
				<img_grid4 v-if="item.item_type == 'img_grid4' && item.item_usable==1" :resdata="item" />
				<img_grid1 v-if="item.item_type == 'img_grid1' && item.item_usable==1" :resdata="item" />
				<img_grid2 v-if="item.item_type == 'img_grid2' && item.item_usable==1" :resdata="item" />
				<img_grid3a v-if="item.item_type == 'img_grid3a' && item.item_usable==1" :resdata="item" />
				<img_grid3b v-if="item.item_type == 'img_grid3b' && item.item_usable==1" :resdata="item" />
				<img_scroll v-if="item.item_type == 'img_scroll' && item.item_usable==1" :resdata="item" />
				<template_goods v-if="item.item_type == 'template_goods' && item.item_usable==1" :resdata="item" />
				<!-- <template_stores v-if="item.item_type == 'template_stores' && item.item_usable==0" :resdata="item" /> -->
				<template_h5 v-if="item.item_type == 'template_h5' && item.item_usable==1" :resdata="item" />
			</view>
		</template>
		
		<!-- 首页弹窗 -->
		<img_popup />
		<back-to-top :scrollTop="scrollTop" />
		
		<TabBar pageCur="index"/>
	</view>
	
</template>

<script>
import MenuBar from '@/components/index/menubar'
import img_banner from '@/components/template/img_banner.vue';
import img_grid4 from '@/components/template/img_grid4.vue';
import img_grid1 from '@/components/template/img_grid1.vue';
import img_grid2 from '@/components/template/img_grid2.vue';
import img_grid3a from '@/components/template/img_grid3a.vue';
import img_grid3b from '@/components/template/img_grid3b.vue';
import img_scroll from '@/components/template/img_scroll.vue';
import img_popup from '@/components/template/img_popup.vue';
import template_goods from '@/components/template/template_goods.vue';
import template_stores from '@/components/template/template_stores.vue';
import template_h5 from '@/components/template/template_h5.vue';
import TabBar from '@/components/tabbar/index.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';

export default {
	components: {
		MenuBar,
		img_banner,
		img_grid4,
		img_grid1,
		img_grid3a,
		img_grid2,
		img_grid3b,
		img_scroll,
		template_h5,
		template_stores,
		template_goods,
		img_popup,
		TabBar,
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			scrollTop:0,
			navClass: 'bg-transparent',
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			shareId: state => state.user.shareId,
			pageData: state => state.home.pageData,
			title: state => state.home.title,
			// siteId: state => state.site.siteId,
			// siteName: state => state.site.siteName,
		}),
	},
	methods: {
		...mapActions({
			'GET_PAGE_DATA': 'home/GET_PAGE_DATA',
			'GET_CURR_SITE_DATA': 'home/GET_CURR_SITE_DATA',
		}),
		...mapGetters({
			userId: 'my/userId'
		}),
		// hideModal() {
		// 	this.showModal = !this.showModal;
		// },
		// async receciveRedPkg() {
		// 	if (!this.receivePacket) {
		// 		await this.receiveRedPkg({ popupId: this.redPkg.popupId });
		// 		this.receivePacket = true;
		// 	} else {
		// 		// use redPkg
		// 		uni.navigateTo({
		// 			url: '/pages/goods/list'
		// 		});
		// 		this.hideModal();
		// 	}
		// },
		async getData() {
			// 获取首页数据
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			// 获取首页数据
			try{
				await this.GET_PAGE_DATA()
				await this.GET_CURR_SITE_DATA()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			uni.hideLoading()
		},
	},
	async onLoad(option) {
		uni.hideTabBar()
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.$saveShareId(option); // 保存分享人ID
		// 获取首页数据
		try{
			await this.GET_PAGE_DATA()
			await this.GET_CURR_SITE_DATA()
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		uni.hideLoading()
	},
	onPullDownRefresh(){
		// 下拉重新加载
		uni.showLoading({
			title:'加载中'
		})
		this.GET_PAGE_DATA();
		console.log(this.pageData);
		uni.stopPullDownRefresh();
		uni.hideLoading()
	},
	onPageScroll(res) {		// 滚动
		if (res.scrollTop > 45) {
			this.navClass = 'bg-home';
		} else {
			this.navClass = 'bg-transparent';
		}
		this.scrollTop = res.scrollTop;
	},
	onShareAppMessage() {
		return {
			title: '您的好友向您推荐了娇杨佳美',
			path: `/pages/index/index?shareId=${this.userId}`
		};
	}
};
</script>

<style lang="scss">
page {
	background-color: $mc-white;
	overflow-x: hidden;
}
.index {
	background-color: $mc-white;
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);	
}
.zindex2{
	z-index: 2;
}
.topbg {
	@include wh(100%, 420upx);
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
.topbar {
	position: relative;
	z-index: -1;
	.location-icon {
		@include wh(44upx, 44upx);
		&.location-msg {
			margin-right: 28upx;
		}
	}
	.location {
		height: 60upx;
		padding: 0 20upx 0 14upx;
		// @include wh(155upx, 60upx);
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 4upx 10upx 0upx rgba(0, 0, 0, 0.3), 0upx 0upx 15upx 0upx rgba(255, 182, 181, 1);
		border-radius: 0upx 100upx 100upx 0upx;
		.location-addr {
			margin-left: 5upx;
			@include sc($font-sm, rgba(241, 71, 61, 1));
		}
	}
}
// modal
.dialog-redpacket {
	width: 528upx;
	background-color: rgba($color: #000000, $alpha: 0);
}
.redpacket {
	@include wh(528upx, 640upx);
	&.first-step {
		@include wh(529upx, 612upx);
	}
	position: relative;
	.red-pkg-bg {
		@include wh(100%, 100%);
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
	}
	.notice {
		@include sc(36upx, $mc-white);
		font-weight: 300;
		margin-bottom: 320upx;
	}
	.receive-msg {
		@include wh(440upx, 133upx);
		margin-top: 76upx;
		.receive-money {
			width: 129upx;
			@include sc(17upx, $mc-white);
			view:first-child {
				text {
					font-size: 40upx;
				}
			}
			view:last-child {
				@include wh(94upx, 28upx);
				background: rgba(255, 255, 255, 0.2);
				line-height: 28upx;
			}
		}
		.receive-notice {
			padding: 22upx 20upx;
			@include sc(17upx, #999999);
			font-weight: 400;
			view:first-child {
				view {
					@include wh(65upx, 28upx);
					@include sc(18upx, $mc-primary);
					vertical-align: middle;
				}
				text {
					vertical-align: middle;
					@include sc(22upx, #1e1e1e);
					font-weight: 500;
					margin-left: 6upx;
				}
			}
		}
	}
}
.close-modal {
	border: 1upx solid $mc-white;
	padding: 15upx;
	border-radius: 50%;
	margin: 32upx auto 0 auto;
	@include wh(66upx, 66upx);
	@include sc(36upx, $mc-white);
}
.no-padding {
	padding: 0 !important;
}

// 顶部导航栏
.home-page {
	&__menubar {
		.menubar {
			position: relative;
			z-index: 2;
			padding: 26upx 32upx 50upx;
		}
	}
}
</style>
