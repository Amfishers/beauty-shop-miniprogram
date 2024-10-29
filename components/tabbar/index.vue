<template>
	<!-- tabbar -->
	<view class="cu-bar tabbar shadow foot footer">
		<view class="action" @click="NavChange" data-on="index">
			<view class="icon-img">
				<image :src="image_path+'/tabbar/index' + [pageCur === 'index' ? '-active' : ''] + '.png'" />
			</view>
			<view class="text" :class="pageCur == 'index' ? 'secondary-color' : 'text-gray'">首页</view>
		</view>
		<view class="action" @click="NavChange" data-on="category">
			<view class="icon-img">
				<image :src="image_path+'/tabbar/goods' + [pageCur == 'category' ? '-active' : ''] + '.png'" />
			</view>
			<view class="text" :class="pageCur == 'category' ? 'secondary-color' : 'text-gray'">分类</view>
		</view>
		<view class="action" @click="NavChange" data-on="cart">
			<view class="icon-img">
				<image :src="image_path + '/tabbar/cart' + [pageCur == 'cart' ? '-active' : ''] + '.png'" />
			</view>
			<view class="text" :class="pageCur == 'cart' ? 'secondary-color' : 'text-gray'">购物车</view>
		</view>
		<view class="action" @click="NavChange" data-on="my">
			<view class="icon-img">
				<image :src="image_path + '/tabbar/my' + [pageCur == 'my' ? '-active' : ''] + '.png'" />
			</view>
			<view class="text" :class="pageCur == 'my' ? 'secondary-color' : 'text-gray'">我的</view>
		</view>
	</view>		
</template>

<script>
export default {
	props: {
		pageCur: {
			type: String,
			default: 'index'
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
		}
	},
	methods: {
		NavChange(e) {
			const tapItem = e.currentTarget.dataset.on
			
			if (tapItem != this.pageCur) {
				let url = ''
				switch(tapItem) {
					case 'index':
						url = "/pages/index/index"
						break
					case 'category':
						url = "/pages/goods/category"
						break
					case 'cart':
						url = "/pages/cart/cart"
						break
					case 'my':
						url = "/pages/my/my"
						break
				}
				uni.switchTab({
					url
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.tabbar {
	background-color: $primary-color;
	.icon-img {
		margin-top: 6upx;
		image {
			display: inline-block;
			width: 40upx;
			height: 40upx;
		}
	}
	.text {
		font-size: 20upx;
		line-height: 28upx;
		margin-top: 2upx;
	}
}
</style>
