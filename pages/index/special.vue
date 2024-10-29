<template>
	<view class="index">
		<cu-custom :bgColor="navClass" :isBack="true">
			<block slot="content">{{ specialsTitle }}</block>
		</cu-custom>
		
		<template v-if="specialData.length > 0">
			<view v-for="(item, index) in specialData" :key="index">
				<!-- 页面模块组件 -->
				<img_banner v-if="item.item_type == 'img_banner' && item.item_usable==1" :resdata="item" />
				<img_grid4 v-if="item.item_type == 'img_grid4' && item.item_usable==1" :resdata="item" />
				<img_grid1 v-if="item.item_type == 'img_grid1' && item.item_usable==1" :resdata="item" />
				<img_grid2 v-if="item.item_type == 'img_grid2' && item.item_usable==1" :resdata="item" />
				<img_grid3a v-if="item.item_type == 'img_grid3a' && item.item_usable==1" :resdata="item" />
				<img_grid3b v-if="item.item_type == 'img_grid3b' && item.item_usable==1" :resdata="item" />
				<img_scroll v-if="item.item_type == 'img_scroll' && item.item_usable==1" :resdata="item" />
				<template_goods v-if="item.item_type == 'template_goods' && item.item_usable==1" :resdata="item" />
				<template_stores v-if="item.item_type == 'template_stores' && item.item_usable==1" :resdata="item" />
				<template_h5 v-if="item.item_type == 'template_h5' && item.item_usable==1" :resdata="item" />

			</view>
		</template>
		
		<back-to-top :scrollTop="scrollTop" />
	</view>
</template>

<script>
import img_banner from '@/components/template/img_banner.vue';
import img_grid4 from '@/components/template/img_grid4.vue';
import img_grid1 from '@/components/template/img_grid1.vue';
import img_grid2 from '@/components/template/img_grid2.vue';
import img_grid3a from '@/components/template/img_grid3a.vue';
import img_grid3b from '@/components/template/img_grid3b.vue';
import img_scroll from '@/components/template/img_scroll.vue';
import template_goods from '@/components/template/template_goods.vue';
import template_stores from '@/components/template/template_stores.vue';
import template_h5 from '@/components/template/template_h5.vue';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
	components: {
		img_banner,
		img_grid4,
		img_grid1,
		img_grid3a,
		img_grid2,
		img_grid3b,
		img_scroll,
		template_h5,
		template_stores,
		template_goods
	},
	data() {
		return {
			specialId:'',
			scrollTop:0,
			image_path: this.$cfg.image_path,
			showModal: true,
			receivePacket: false,
			navClass: 'bg-home',
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			specialData: state => state.home.specialData,
			specialsTitle: state => state.home.specialsTitle,
			// siteId: state => state.site.siteId,
			// siteName: state => state.site.siteName,
		}),
	},
	methods: {
		...mapActions({
			'GET_SPECIALS_PAGE_DATA': 'home/GET_SPECIALS_PAGE_DATA',
		}),
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.specialId = option.id
		if(!this.specialId){
			return uni.showToast({
				title:'页面不存在',
				icon:'none'
			})
		}
		// this.$saveShareId(option); // 保存分享人ID
		//异步初始化页面数据
		try{
			await this.GET_SPECIALS_PAGE_DATA(this.specialId)
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		uni.hideLoading()
	},
	onShareAppMessage() {
		// 分享专题页
		let path = `/pages/index/special?id=${this.specialId}`;
		path = path + `&shareId=${this.userId}`;
		console.log(path);
		return {
			title: this.title,
			path: path
		};
	},      
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onPullDownRefresh(){
		// 下拉重新加载
		uni.showLoading({
			title:'加载中'
		})
		this.GET_SPECIALS_PAGE_DATA(this.specialId)
		uni.stopPullDownRefresh();
		uni.hideLoading()
	},
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
