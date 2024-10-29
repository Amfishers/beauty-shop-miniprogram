<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">订单结果</block>
		</cu-custom>

		<view class="result">
			<view class="container result-success flex flex-direction align-center">
				<image :src="image_path + '/' + result.icon + '.png'" class="result-icon"></image>
				<view class="result-msg">{{ result.msg }}</view>
				<view class="operation flex align-center justify-between">
					<button
						v-for="(item, index) in result.action"
						:key="index"
						:class="index === 0 ? 'bg-white' : 'bg-primary'"
						class="cu-btn  round "
						@click="btnAction(item.url)"
					>
						{{ item.title }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			image_path: this.$cfg.image_path,
			result: {
				icon: 'success',
				msg: '恭喜您，购买成功!',
				action: [
					{
						title: '查看订单',
						url: '/pages/order/order_list'
					},
					{
						title: '返回首页',
						url: '/pages/index/index'
					}
				]
			}
		};
	},
	methods: {
		btnAction(url) {
			if (url === '/pages/index/index' || url === '/pages/my/my') {
				uni.switchTab({
					url
				});
			} else {
				const redUrl = this.orderId ? url + '?order=' + 'this.orderId' : url;
				uni.redirectTo({
					url: redUrl
				})
			}
		}
	},
	onReady() {
		uni.hideLoading()
	},
	onShow(){
		// 下单成功后更新订单状态
		uni.$emit("updateOrderList")
	},
	onLoad(option) {
		console.log(option);
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		if(option.result){
			const result = JSON.parse(decodeURIComponent(option.result));
			if (result) {
				this.result = {
					...this.result,
					...result
				};
			}
		}
		if (option.orderId) {
			this.orderId = option.orderId;
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.container {
	width: 686upx;
	min-height: 148upx;
	background-color: $mc-white;
	border-radius: 16upx;
	@include sc($font-base, $mc-grey);
	font-weight: 400;
	padding: 30upx 32upx;
	margin: 28upx auto;
}
.result {
	.result-success {
		height: 686upx;
	}
	.result-icon {
		@include wh(160upx, 160upx);
		margin-top: 66upx;
	}
	.result-msg {
		@include sc(32upx, $mc-grey);
	}
	.operation {
		margin-top: 164upx;

		button {
			border: 1px solid;
			font-size: 32upx;
			font-weight: 400;
			height: 88upx;
			min-width: 240upx;
			&:last-child {
				margin-left: 78upx;
			}
		}
	}
}
</style>
