<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white">
			<block slot="content">订单详情</block>
		</cu-custom>
		
		<view class="detail text-center">
			
			<!-- 订单状态 -->
			<view class="header flex align-start justify-between">
				<view class="flex flex-direction align-start header-info">
					<view class="status">{{ order_msg.status }}</view>
					<view class="notice">{{ order_msg.notice }}</view>
				</view>
				<image :src="set_status_img" class="status-icon"></image>
			</view>

			<!-- 快递信息 -->
			<view class="container address flex align-center" v-if="orderDetail.order_type == 1 && orderDetail.delivery_time" @click="goDeliveryDetail">
				<view><image :src="image_path + '/delivery.png'" class="location-icon"></image></view>
				<view class="flex flex-direction align-start justify-between text-left">
					<view class="contact flex flex-sub align-center justify-between text-bold">订单已{{ orderDetail.delivery_company ? '由' + orderDetail.delivery_company : '' }}发出</view>
					<view class="location-time">{{ orderDetail.delivery_time || '' }}</view>
				</view>
			</view>
			
			<!-- 地址/服务地址 -->
			<view class="container address flex align-center" v-if="orderDetail.order_type == 1">
				<view><image :src="image_path + '/location.png'" class="location-icon"></image></view>
				<view class="flex flex-direction align-start justify-between text-left" style="margin-bottom: 24upx;width: 100%;" v-if="orderDetail.order_type == 1">
					<view class="contact flex flex-sub align-center justify-between">
						<view class="text-bold">{{ orderDetail.receiver_name }}</view>
						<view class="text-bold">{{ orderDetail.receiver_phone }}</view>
					</view>
					<view class="location">{{ orderDetail.receiver_detail_address }}</view>
				</view>
				<view class="flex flex-direction align-start justify-between text-left" v-else @click="openLocation(orderDetail.storeInfo)">
					<view class="contact flex flex-sub align-center justify-between">
						<view>{{ orderDetail.storeInfo.name }}</view>
						<view>{{ orderDetail.storeInfo.phone || '' }}</view>
					</view>
					<view class="location">{{ orderDetail.storeInfo.detailedAddress || '' }}</view>
				</view>
			</view>

			<view class="container goods">
				<view class="store flex align-center justify-between">
					<view class="flex flex-row align-center">
						<image :src="image_path + '/store-s.png'" class="store-icon"></image>
						<text class="text-bold">{{ orderDetail.store_name || '' }}</text>
					</view>
				</view>
				<view class="goods" @tap="gotoProduct(orderDetail.orderItem.productId)">
					<view v-for="(item, index) in orderDetail.items" :key="item.id">
						<template v-if="orderDetail.order_type == 1">
							<GoodsItem 
								:cover="item.product_pic"
								:name="item.product_name"
								:price="item.product_price"
								:count="item.product_quantity"
							/>
						</template>
						<template v-else>
							<serviceItems
								:cover="item.product_pic"
								:name="item.product_name"
								:price="item.product_price"
								:count="item.product_quantity"
							/>
						</template>
						<!-- <image :src="item.product_pic" class="goods-img"></image>
						<view class="flex flex-sub flex-direction align-start justify-between padding-bottom-sm">
							<view class="flex justify-between" style="width: 100%;">
								<view class="text-left">{{ item.product_name }}</view>
								<view class="money">
									￥
									<text>{{ item.product_price || '' }}</text>
								</view>
							</view>
							<view class="text-gray text-sm" v-if="orderDetail.order_type == 1">
								<text>可用次数:{{ item.available_times || 0 }}</text>
								<text>/{{ orderDetail.available_times }}</text>
							</view>
							<view class="num">
								购买数量
								<text>x</text>
								<text>{{ item.product_quantity || '' }}</text>
							</view>
						</view> -->
					</view>
				</view>

				<view
					v-if="orderDetail.order_type == 2 && parseInt(orderDetail.status) > 0 && parseInt(orderDetail.status) < 3"
					class="qrcode flex align-center justify-center flex-direction"
				>
					<view class="tip">向门店出示二维码即可享受服务</view>
					<view class="qrcode-code"><image :src="orderDetail.service_verify_url" mode=""></image></view>
					<!-- <qrcode
						v-if="qrShow && ((orderDetail.order_type == 2 && orderDetail.status == 1) || orderDetail.status == 2)"
						cid="qrcode1"
						:val="set_path"
						:size="size"
						:unit="unit"
						:background="background"
						:iconSize="iconsize"
						:lv="lv"
						:onval="onval"
						:loadMake="loadMake"
						:usingComponents="true"
						:showLoading="false"
						:showUesd="!isValidOrderCode"
					/> -->
					<view class="verify-code">
							验证码： {{ orderDetail.order_code }}
					</view>
				</view>

				<!-- <view class="flex align-center justify-between mb28 text-red" v-if="orderDetail.order_code">
					<view>服务码</view>
					<view>{{ orderDetail.order_code }}</view>
				</view> -->
				<view class="flex align-center justify-between mb28">
					<view>订单总价</view>
					<view>￥{{ orderDetail.total_amount }}</view>
				</view>
				<view class="flex align-center justify-between mb28">
					<view>优惠</view>
					<view v-if="orderDetail.coupon_amount">-￥{{ orderDetail.coupon_amount }}</view>
					<view v-else>￥ 0</view>
				</view>
				<view class="text-right solid-top">
					<view class="text-right sub-msg">
						实付金额
						<text>
							￥
							<text>{{ orderDetail.pay_amount }}</text>
						</text>
					</view>
				</view>
			</view>

			<view class="container desc flex align-start justify-between">
				<view>备注</view>
				<view class="remarks text-right">{{ orderDetail.note || '无' }}</view>
			</view>
			
			<view class="container">
				<view class="flex align-center justify-between mb28">
					<view>订单编号</view>
					<view class="grey-text">{{ orderDetail.order_sn }}</view>
				</view>
				<view class="flex align-center justify-between mb28">
					<view>创建时间</view>
					<view class="grey-text">{{ orderDetail.create_time }}</view>
				</view>				
			</view>

			<!-- 订单记录信息 -->
			<view class="container" v-if="orderDetail.operate_list.length > 0">
				<view class="text-left solid-bottom mb28"><view class="record-header text-bold">订单记录</view></view>
				<block v-for="(note, index) in orderDetail.operateList" :key="index">
					<view class=" flex align-start justify-between mb28">
						<view class="text-left" style="width: 60%;">{{ note.note }}</view>
						<view class="number text-right" style="width: 40%;">{{ note.createTime }}</view>
					</view>
				</block>
			</view>

			<!-- 服务记录信息 -->
			<view class="container" v-if="orderDetail.service_histories.length > 0">
				<view class="text-left solid-bottom mb28"><view class="record-header text-bold">服务记录</view></view>

				<block v-for="(service, index) in orderDetail.service_histories" :key="index">
					<view class=" flex align-start justify-between mb28">
						<view>{{ service.use_time }}</view>
						<view>{{ service.count }}次</view>
					</view>
				</block>

				<!-- <view class="text-right solid-top" v-if="orderDetail.orderItem.availableTimes > 0">
					<view class="text-right sub-msg">
						剩余次数
						<text>
							<text>{{ orderDetail.orderItem.availableTimes }}</text>
							次
						</text>
					</view>
				</view> -->
			</view>

			<view class="operation" v-if="showOptionbtn">
				<button v-if="orderDetail.status == 0" class="cu-btn bg-primary round btn" @click="clickBtn(orderDetail.order_sn, orderDetail.id, 'pay', orderDetail.pay_amount)">
					去付款
				</button>
				<button
					v-if="orderDetail.return_status == 1 && parseFloat(orderDetail.pay_amount) > 0"
					class="cu-btn bg-white round btn btn-refund"
					@click="clickBtn(orderDetail.order_sn, orderDetail.id, 'refund')"
				>
					申请退款
				</button>				
				<button
					v-if="orderDetail.status == 2 && orderDetail.order_type == 1"
					class="cu-btn bg-white round btn btn-refund-progress"
					@click="clickBtn(orderDetail.order_sn, orderDetail.id, 'confirm')"
				>
					确认收货
				</button>
				<button v-if="orderDetail.status == 3" class="cu-btn bg-white round btn btn-refund-progress" @click="clickBtn(orderDetail.order_sn, orderDetail.id, 'evaluate')">
					去评价
				</button>
				<button
					v-if="orderDetail.status_return == 0 ||  orderDetail.status_return == 3"
					class="cu-btn bg-white round btn btn-refund-progress"
					@click="clickBtn(orderDetail.order_sn, orderDetail.id, 'refund-calcel')"
				>
					取消退款
				</button>
				<button
					v-if="orderDetail.return_status == 2"
					class="cu-btn bg-white round btn btn-refund-progress"
					@click="clickBtn(orderDetail.order_sn, orderDetail.id, 'refund-detail')"
				>
					查看退款进度
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import qrcode from '../../components/qrcode/qrcode.vue';
import GoodsItem from '@/components/order/goodsItem.vue'
import serviceItems from '@/components/order/serviceItems.vue'

export default {
	components: {
		// qrcode,
		GoodsItem,
		serviceItems,
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			qrShow: false,
			val: '二维码', // 要生成的二维码值
			size: 300, // 二维码大小
			unit: 'upx', // 单位
			background: '#ffffff', // 背景色
			foreground: '#B4B4B4', // 前景色
			pdground: '#B4B4B4', // 角标色
			icon: this.$cfg.image_path + '/used.png', // 二维码图标
			iconsize: 65, // 二维码图标大小
			lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
			onval: true, // val值变化时自动重新生成二维码
			loadMake: true, // 组件加载完成后自动生成二维码
			src: '', // 二维码生成后的图片地址或base64
			orderStatus: 0,
			orderId: '',
			orderSn: '',
		};
	},
	computed: {
		...mapState({
			orderDetail: state => state.order.orderDetail,
			wxCode: state => state.user.wxCode,
		}),
		set_status_img() {
			if (this.orderDetail.order_type == 1) {
				return this.$cfg.order_status_img[this.orderDetail.status];
			} else if ((this.orderDetail.order_type == 2 && this.orderDetail.status == 1) || this.orderDetail.status == 2) {
				return this.$cfg.order_service_status_img;
			} else {
				return this.$cfg.order_status_img[0];
			}
		},
		set_path() {
			let qr_code = {
				qrType: 'orderCode',
				storeId: this.orderDetail.store_id,
				storeName: this.orderDetail.store_name,
				orderId: this.orderDetail.id,
				orderSn: this.orderDetail.order_sn,
				orderCode: this.orderDetail.order_code
			};
			return JSON.stringify(qr_code);
		},
		showOptionbtn() {
			const detail = this.orderDetail
			const { status, status_return } = detail
			
			if (status == 4) return false
			
			if (status == 5) return false
			
			return true
		},
		isValidOrder() {
			return true
			// 有效订单
			return parseInt(this.orderDetail.status) > 0 && parseInt(this.orderDetail.status) < 5 ? true : false;
		},
		isValidOrderCode() {
			//二位码是否有效
			return true
			return parseInt(this.orderDetail.order_type) == 2 && parseInt(this.orderDetail.orderItem.availableTimes) == 0 ? false : true;
		},
		order_msg() {
			// 订单状态
			return this.$cfg.getOrderStatusMsg(this.orderDetail.order_type, this.orderDetail.status)
		}
	},
	methods: {
		...mapActions({
			GET_ORDER_DETAIL: 'order/GET_ORDER_DETAIL',
			ORDER_REFUND_CANCEL: 'order/ORDER_REFUND_CANCEL',
			
			ORDER_PAY: 'order/ORDER_PAY',
			WECHAT_PAY: 'order/WECHAT_PAY',
			ORDER_RECEIPT: 'order/ORDER_RECEIPT',
		}),
		gotoProduct(pid){
			uni.navigateTo({
				url:`/pages/goods/detail?id=${pid}`
			})
		},
		async clickBtn(order, id, type, money) {
			if (type === 'pay') {
				this.orderPay(id)
				// uni.navigateTo({
				// 	url: `/pages/order/pay?order=${order}&id=${id}&amount=${money}`
				// });
			} else if (type === 'refund') {
				uni.navigateTo({ url: `/pages/order/refund?order=${order}&id=${id}&type=${this.orderDetail.order_type}` });
			} else if (type === 'evaluate') {
				uni.navigateTo({
					url: `/pages/order/evaluate?order=${order}&id=${id}&type=${this.orderDetail.order_type}`
				});
			} else if (type === 'refund-detail') {
				uni.navigateTo({
					url: `/pages/order/refund-detail?order=${order}&id=${id}`
				});
			} else if (type === 'confirm') {
				// 确认收货
				let data = {
					order_type: this.orderDetail.order_type
				}
				try{
					await this.ORDER_RECEIPT({ id, data })
					await this.GET_ORDER_DETAIL({id, type: this.orderDetail.order_type})
					uni.showToast({
						title:'收货完成',
						icon:'none'
					})		
				}catch(e){
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}
			}else if (type === 'refund-calcel') {
				await this.ORDER_REFUND_CANCEL({id, data: { order_type: this.orderDetail.order_type }})
				await this.GET_ORDER_DETAIL({id, data: { type:this.orderDetail.order_type }})
			}
		},
		goDeliveryDetail() {
			uni.navigateTo({
				url: `/pages/order/track?orderId=${this.orderId}`
			});
		},
		// 打开地图显示门店地址
		openLocation(value) {
			uni.openLocation({
				longitude: Number(value.longitude),
				latitude: Number(value.latitude),
				name: value.name,
				address: value.detailedAddress
			});
		},
		async orderPay(id) {
			const data = {
				order_type: parseInt(this.orderDetail.order_type),
				code: this.wxCode,
			}
			
			try {
				const resData = await this.ORDER_PAY({id, data})
				const payData = resData.data
				if (payData) {
					const payResult = await this.WECHAT_PAY(payData)
					if (payResult && payResult.errMsg === 'requestPayment:ok') {
						// 支付成功, orderId 先不传，多店铺下单的话会有多个订单的
						uni.navigateTo({
							url: '/pages/cart/result'
						});
					}else if (payResult && payResult.errMsg === 'requestPayment:fail cancel') {
						console.log('取消支付，不作处理')
					}else {
						uni.navigateTo({
							url: `/pages/cart/result?result=${encodeURIComponent(
								JSON.stringify({
									msg: '支付失败!',
									icon: 'fail'
								})
							)}`
						})
					}
				}
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		const { order, id, type } = option
		if (id && type) {
			this.orderId = id
			await this.GET_ORDER_DETAIL({id, type})
		}
		if (order) {
			this.orderSn = order;
		}
		uni.hideLoading();
	}
};
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.index {
	padding-bottom: 120upx;
}
.container {
	width: 686upx;
	min-height: 120upx;
	background-color: $mc-white;
	border-radius: 16upx;
	@include sc($font-base, $mc-grey);
	font-weight: 400;
	padding: 30upx 32upx;
	margin: 28upx auto;
}
.header {
	@include wh(750upx, 280upx);
	background: $primary-color;
	border-radius: 0 0 50% 50% / 0 0 40upx 40upx;
	margin-bottom: -100upx;

	.header-info {
		padding: 40upx 20upx 0 40upx;
	}

	.status {
		@include sc(36upx, $mc-white);
		font-weight: 500;
		line-height: 50upx;
		margin-bottom: 12upx;
	}
	.notice {
		@include sc(26upx, $mc-white);
		font-weight: 400;
		line-height: 37upx;
	}
	.status-icon {
		@include wh(312upx, 240upx);
	}
}
.address {
	.location-icon {
		@include wh(64upx, 64upx);
		margin-right: 16upx;
	}
	.contact {
		width: 100%;
		@include sc(30upx, $mc-grey);
		margin-bottom: 20upx;
	}
	.location {
		font-size: 26upx;
		line-height: 37upx;
	}
	.location-time {
		@include sc($font-sm, $mc-greylight);
		line-height: 33upx;
	}
	.right-icon {
		@include wh(28upx, 28upx);
		margin-left: 10upx;
	}
}
.mb28 {
	margin-bottom: 28upx;
	&:last-child {
		margin-bottom: 0;
	}
}
.goods {
	.store-icon {
		@include wh(40upx, 40upx);
		margin-right: 12upx;
	}
	.goods {
		margin: 28upx 0 56upx 0;

		.goods-img {
			@include wh(200upx, 200upx);
			margin-right: 20upx;
		}
		.money {
			font-size: 26upx;
			text {
				font-size: 36upx;
			}
		}
		.num {
			@include sc($font-sm, $mc-greylight);
			text {
				margin-left: 12upx;
			}
		}
	}
}
.sub-msg {
	padding-top: 30upx;
	@include sc(30upx, $mc-grey);
	& > text {
		@include sc(24upx, $primary-color);
		margin-left: 16upx;
		text {
			font-size: 44upx;
		}
	}
}
.record-header {
	padding-bottom: 30upx;
	font-weight: 500;
	line-height: 42upx;
}
.qrcode {
	margin-bottom: 28upx;
	.tip {
		display: inline-block;
		@include sc(26upx, $primary-color);
		padding: 7upx 20upx;
		background: #F5DBC3;
		border-radius: 26upx;
		margin-bottom: 20upx;
	}
	.qrcode-code {
		width: 300upx;
		height: 300upx;
		margin: 16upx auto;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

.remarks {
	width: 80%;
}
.number {
	color: $mc-greylight;
}
.desc view{
	line-height: 60upx;
}
.grey-text {
	color: #666;
}
.verify-code {
	margin-bottom: 40upx;
}
.operation {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	height: 120upx;
	background-color: #FFF;
	padding: 24upx 32upx;
	text-align: right;

	.btn {
		@include wh(202upx, 72upx);
		font-size: 28upx;
		font-weight: 400;
		margin-left: 32upx;
		&.btn-refund {
			color: $primary-color;
			border: 1px solid $primary-color;
		}
		&.btn-refund-progress {
			color: #FFF;
			background: $primary-color;
		}
	}
}
</style>
