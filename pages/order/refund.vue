<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content">订单退款</block>
		</cu-custom>

		<view class="refund">
			<view class="container flex flex-sub flex-direction align-start">
				<view class="goods flex flex-sub solid-bottom" v-for="item in orderDetail.items" :key="item.id">
					<image :src="item.product_pic"></image>
					<view class="flex flex-sub flex-direction align-start justify-between">
						<view class="name">{{ item.product_name }}</view>
						<view class="gery-text">
							x
							<text>{{ item.product_quantity }}</text>
						</view>
					</view>
				</view>
				<view class="flex align-center justify-between mb28 w1">
					<view>退款金额</view>
					<view class="money">
						￥
						<text>{{ orderDetail.pay_amount }}</text>
					</view>
				</view>
				<view class="flex align-end justify-between mb28 w1">
					<view class="flex flex-direction align-start">
						<view>退款方式</view>
						<view class="refund-back">原路退回 (1～3个工作日退款到原支付方)</view>
					</view>
					<view><radio class="black checked" value checked /></view>
				</view>
			</view>

			<view class="container flex flex-direction align-start">
				<view class="reason solid-bottom">退款原因 (必选)</view>
				<radio-group class="w1" @change="selectRefundReason">
					<label v-for="item in reasons" :key="item" class="flex flex-sub align-center justify-between mb28 w1">
						<text>{{ item }}</text>
						<radio class="black" :value="item" :checked="checked === item ? true : false" />
					</label>
				</radio-group>
			</view>
			
			<view class="btn-bar">
				<button class="cu-btn bg-white-heavy round btn" @click="goRefund">申请退款</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
	data() {
		return {
			orderId: '',
			orderSn: '',
			checked: '7天无理由退换货',
			reasons: ['7天无理由退换货', '门店让我退款', '不想要了', '其他']
		};
	},
	computed: {
		...mapState({
			orderDetail: state => state.order.orderDetail,
			wxCode: state => state.user.wxCode,
		}),	
	},
	methods: {
		...mapActions('order', ['GET_ORDER_DETAIL', 'launchRefund', 'ORDER_REFUND']),
		selectRefundReason(e) {
			this.checked = e.detail.value;
		},	
		async goRefund() {
			const id = this.orderId
			const data = {
				reason: this.checked,
				order_type: this.orderDetail.order_type
			}
			try{
				await this.ORDER_REFUND({id, data})
				
				uni.navigateTo({
					url: `/pages/cart/result?orderId=${this.orderId}&result=${encodeURIComponent(JSON.stringify({ msg: '提交退款成功', icon: 'success' }))}`
				})
				
			}catch(e){
				uni.navigateTo({
					url: `/pages/cart/result?orderId=${this.orderId}&result=${encodeURIComponent(JSON.stringify({ msg: e.message || '退款提交失败', icon: 'fail' }))}`
				})
				// uni.showToast({
				// 	icon: 'none',
				// 	title: e.message,
				// 	duration: 2000
				// })
			}
		}
	},
	onReady() {
		uni.hideLoading()
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		const { order, id, type } = option
		this.orderId = id
		this.orderSn = order
		if (id && type) {
			await this.GET_ORDER_DETAIL({id, type})
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
.mb28 {
	margin-bottom: 28upx;
	&:last-child {
		margin-bottom: 0;
	}
}
.w1 {
	width: 100%;
}
radio {
	transform: scale(0.7);
}
.goods {
	padding-bottom: 32upx;
	margin-bottom: 32upx;
	image {
		@include wh(160upx, 160upx);
		margin-right: 24upx;
	}
}
.money {
	color: $primary-color;
	font-size: $font-sm;
	text {
		font-size: 44upx;
	}
}
.name {
	@include ellipsisMultiline(3);
}
.refund-back {
	color: $mc-greylight;
	line-height: 40upx;
	margin-top: 12upx;
}
.reason {
	margin-bottom: 32upx;
	padding-bottom: 30upx;
	font-size: 30upx;
	font-weight: 500;
	line-height: 42upx;
}
.btn {
	@include wh(202upx, 72upx);
	@include sc(28upx, $primary-color);
	border: 1px solid $primary-color;
}
.btn-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 120upx;
	padding: 24upx 48upx;
	text-align: right;
	background-color: #FFF;
}
</style>
