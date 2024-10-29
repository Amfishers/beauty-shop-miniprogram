<template>
	<view class="cu-modal" :class="redPkg && redPkg.popupId && showModal ? 'show' : ''">
		<view class="cu-dialog dialog-redpacket">
			<view class="bg-img redpacket flex align-center justify-center" @click="navagetaToPage"><image class="red-pkg-bg" :src="redPkg.coverPic" /></view>
			<view class="cuIcon cuIcon-close close-modal" @tap="hideModal" />
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			showModal: false,
			popupId:""
		};
	},
	computed: {
		...mapState({
			redPkg: state => state.home.userInfo,
		}),
	},
	methods: {
		...mapActions({
			'GET_HOME_POPUPS': 'home/GET_HOME_POPUPS',
		}),		
		hideModal() {
			this.showModal = !this.showModal;
		},
		mapUrl(item) {
			if (item.targetType === 'product') {
				return `/pages/goods/detail?id=${item.targetId}`;
			} else if (item.targetType === 'store') {
				return `/pages/store/detail?id=${item.targetId}`;
			} else if (item.targetType === 'special') {
				return `/pages/index/special?id=${item.targetId}`;
			} else if (item.targetType === 'coupon') {
				return `/pages/index/coupon?id=${item.targetId}`;
			} else if (item.targetType === 'article') {
				return `/pages/index/article?id=${item.targetId}`;
			} else if (item.targetType === 'meeting') {
				return `/pages/index/meeting?id=${item.targetId}`;
			} else if (item.targetType === 'link') { // 自定义连接样式直接跳转页面
				return item.targetId;
			} else {
				return `/pages/index/index`;
			}
		},
		navagetaToPage(){
			const url = this.mapUrl(this.redPkg)
			console.log(url);
			this.showModal = false
			uni.navigateTo({
				url:url
			})
		},
		oncePopUp() {
			// 弹窗仅显示1次
			const popupId = uni.getStorageSync('popupId') || null
			console.log(popupId);
			if(popupId == this.popupId ){
				this.showModal = false
			}else{
				uni.setStorageSync('popupId', this.popupId)
				this.showModal = true
			}
			
		}
	},
	async mounted() {
		// 获取首页红包
		const resData = await this.GET_HOME_POPUPS();
		if (resData && resData.popupId) {
			this.popupId = resData.popupId
			console.log(resData);
			await this.oncePopUp()
		}
	}
};
</script>

<style lang="scss">
// modal
.dialog-redpacket {
	width: 528upx;
	background-color: rgba($color: #000000, $alpha: 0);
}
.redpacket {
	@include wh(528upx, 640upx);
	margin-top: 150upx;
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
</style>
