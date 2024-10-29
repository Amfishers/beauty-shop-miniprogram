<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">提交订单</block>
		</cu-custom>
		
		<view class="order-submit">
			<!-- 服务订单 - 选择门店 -->
			<template v-if="order_type == 2">
				<navigator :url="'/pages/store/list?type=2&product_id=' + productId">
					<view class="order-submit__detail order-submit__address flex align-center justify-between">
						<template v-if="JSON.stringify(orderSelectStore) !== '{}'">
							<image class="order-submit__address-img" :src="image_path + '/location.png'" mode=""></image>
							<view class="flex-sub flex align-center">
								<view class="order-submit__address-card">
									<view class="flex align-center justify-between">
										<text class="text-bold">{{ orderSelectStore.name }}</text>
									</view>
									<view class="address">
										{{ orderSelectStore.detailed_address }}
									</view>
								</view>
								<BIcon class="third-color" icon="right" font-size="14"></BIcon>
							</view>
						</template>
						<template v-else>
							<view class="order-submit__address-info flex align-center">
								<image class="order-submit__address-img" :src="image_path + '/location.png'" mode=""></image>
								请选择服务门店
							</view>
							<view class="order-submit__address-icon">
								<BIcon class="icon" icon="right"></BIcon>
							</view>
						</template>
					</view>
				</navigator>
			</template>
			<!-- 实物订单 -->
			<template v-else>
				<navigator url="/pages/my/address_list">
					<view class="order-submit__detail order-submit__address flex align-center justify-between">
						<template v-if="selectAddress">
							<image class="order-submit__address-img" :src="image_path + '/location.png'" mode=""></image>
							<view class="flex-sub flex align-center">
								<view class="order-submit__address-card">
									<view class="flex align-center justify-between">
										<text class="text-bold">{{ selectAddress.name }}</text>
										<text class="text-bold">{{ selectAddress.phone }}</text>
									</view>
									<view class="address">
										{{ selectAddress.detail_address }}
									</view>
								</view>
								<BIcon class="third-color" icon="right" font-size="14"></BIcon>
							</view>
						</template>
						<template v-else>
							<view class="order-submit__address-info flex align-center">
								<image class="order-submit__address-img" :src="image_path + '/location.png'" mode=""></image>
								请填写收货地址
							</view>
							<view class="order-submit__address-icon">
								<BIcon class="icon" icon="right"></BIcon>
							</view>
						</template>
					</view>
				</navigator>
			</template>
			
			<!-- 商品信息 -->
			<view class="order-submit__detail">
				<OrderItem 
					v-for="cart in carts" 
					:key="cart.store_id"
					:store="cart"
					:products="cart.goods_list"
					:isPlus="isPlus"
				/>
				<view class="order-submit__item">
					<label class="lable">优惠</label>
					<view class="info flex align-center">
						<view class="flex align-center" v-if="activeCoupon.length"  @tap="openCouponsPopup">
							<template v-if="selectCounpon">
								<view class="get-coupons primary-btn">
									￥{{ selectCounpon.amount }}
								</view>
								<BIcon icon="right" class="icon" font-size="14"></BIcon>
							</template>
							<template v-else>
								选择优惠券 <BIcon icon="right" class="icon" font-size="14"></BIcon>
							</template>
						</view>
						<template v-else>
							无可用优惠券
						</template>
					</view>
				</view>
				<view class="order-submit__item">
					<label class="lable">备注</label>
					<view class="info">
						<input class="input" v-model="desc" placeholder="请出入不超过50字" maxlength="50" />
					</view>
				</view>
			</view>
			
			<!-- 价格等详情 -->
			<view class="order-submit__detail">
				<view class="order-submit__item">
					<label class="lable">商品金额</label>
					<view class="info">¥{{calculation.total_goods_amount || 0 }}</view>
				</view>
				<view class="order-submit__item">
					<label class="lable">优惠</label>
					<view class="info">¥{{ calculation.total_coupon_amount || 0 }}</view>
				</view>
				<view class="order-submit__item">
					<label class="lable">运费</label>
					<view class="info">¥{{ calculation.total_freight_amount || 0 }}</view>
				</view>
				<view class="order-submit__item">
					<label class="lable">应付金额</label>
					<view class="info third-color">¥{{ calculation.total_order_amount || 0 }}</view>
				</view>
			</view>
			
			<!-- 开通会员 -->
			<view class="order-submit__detail" v-if="!cartSettleData.is_plus">
				<view class="order-submit__card">
					<view class="card">
						<view class="card__hd flex align-center justify-between">
							<text class="title">开通PLUS会员 (¥520/年)</text>
							<switch class="black" :checked="plusChecked" @change="switchHandler" />
						</view>
						<view class="card__bd flex align-center justify-between">
							<view>
								本单立减 <text class="third-color">￥{{ calculation.upgrade_plus_promotion_amount || 0 }}</text>
							</view>
							<navigator url="/pages/my/plus">
								<view>
									查看更多PLUS会员特权 <BIcon class="third-color" icon="right" fontSize="12"></BIcon>
								</view>
							</navigator>
						</view>
					</view>
				</view>
			</view>
		
			<!-- 去支付 -->
			<view class="order-submit__footer flex align-center justify-between">
				<view class="order-submit__footer-total">待支付：<text class="order-submit__footer-price third-color">¥{{ calculation.total_pay_amount || 0 }}</text></view>
				<view class="order-submit__footer-submit primary-btn" @tap="placeOrder">去支付</view>
			</view>
			
			<!-- 优惠券 -->
			<uniPopup :mask-click="true" type="bottom" ref="couponsPopup">
				<view class="popup-main">
					<view class="popup-hd flex align-center justify-between">
						<text>可领优惠券 （领取后用于购买商品优惠）</text>
						<view class="" @tap="closeCpuponsPopup">
							<BIcon icon="cancel" font-size="20"/>
						</view>
					</view>
					<scroll-view scroll-y class="coupons-popup__bd">
						<radio-group class="block">
							<view v-for="(coupons, index) in activeCoupon" :key="coupons.id">
								<view class="coupons-popup__item flex">
									<view class="coupons-popup__item-type">
										<view class="price">
											¥ <text class="text">{{ coupons.amount }}</text>
										</view>
										<view class="condition text-center">{{ coupons.coupon.min_point > 0 ? '满' + coupons.coupon.min_point + '可用' : '无门槛' }}</view>
									</view>
									<view class="coupons-popup__item-info">
										<view class="name">{{ coupons.coupon.name }}</view>
										<view class="opt flex align-center justify-between">
											<text class="date">{{ coupons.start_time && timeHandler(coupons.start_time) }} - {{ coupons.end_time && timeHandler(coupons.end_time) }}</text>
											<radio class="black" :checked="index == selectCounponIndex ? true : false" :value="index" @tap="radioTap(coupons, index)" />
										</view>
									</view>
								</view>
							</view>
						</radio-group>
					</scroll-view>
				</view>
			</uniPopup>			
			
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters  } from 'vuex'
import OrderItem from '@/components/order/orderItem.vue'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import Timer from '@/utils/time.js'
import { isAfterTime } from '@/utils/helper.js'

export default {
	components: {
		OrderItem,
		uniPopup,
	},	
	computed: {
		...mapState({
			wxCode: state => state.user.wxCode,
			shareId: state => state.user.shareId,
			cartSettleData: state => state.cart.cartSettleData,
			
			addressList: state => state.address.addressList,
			
			orderSelectAddr: state => state.address.orderSelectAddr,
			orderSelectStore: state => state.stores.orderSelectStore,
			// 已领取优惠券列表
			receivedCouponList: state => state.my.receivedCouponList,
		}),
		...mapGetters({
			isPlus: 'my/isPlus',
			selectedList: 'cart/selectedList',
		}),
		calculation() {
			return this.cartSettleData.calculation
		},
		carts() {
			return this.cartSettleData.carts
		},
		activeCoupon() {
			if (!this.receivedCouponList && !this.receivedCouponList.length) return []
			
			return this.receivedCouponList.filter(item => item.use_status == 0 && isAfterTime(item.end_time, new Date()))
		},
		defaultAddress() {
			if (this.addressList.length) {
				const defaultAddr = this.addressList.find(address => address.is_default == 1)
				if (!defaultAddr) {
					return this.addressList[0]
				}
				return defaultAddr
			}
			return null
		},
		selectAddress() {
			if (JSON.stringify(this.orderSelectAddr) != "{}") return  this.orderSelectAddr
			
			return this.defaultAddress
		},
		productId() {
			return this.carts && this.carts[0] && this.carts[0].goods_list && this.carts[0].goods_list[0] && this.carts[0].goods_list[0].product_id
		}, 
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			plusChecked: false,
			desc: '', // 备注
			settle: false, //是否直接下单
			selectCounponIndex: null, 
			selectCounpon: null,
			order_type: 1,  // 1实物 2虚拟
		}
	},
	watch: {
		selectCounponIndex(newVal, oldVal) {
			if (newVal == null) return this.selectCounpon = null
			
			this.selectCounpon = this.activeCoupon[newVal]
		},
	},
	methods: {
		...mapMutations({
			SET_ORDER_SUBMIT_PAGE_STATUS: 'order/SET_ORDER_SUBMIT_PAGE_STATUS',
		}),
		...mapActions({
			GET_ADDRESS_LIST: 'address/GET_ADDRESS_LIST',
			SETTLE_CART: 'cart/SETTLE_CART',
			PLACE_ORDER: 'order/PLACE_ORDER',
			WECHAT_PAY: 'order/WECHAT_PAY',
			
			SETTLEMEN_GOODS: 'cart/SETTLEMEN_GOODS',
			GET_USER_RECEIVED_COUPINS: 'my/GET_USER_RECEIVED_COUPINS',
		}),
		async switchHandler(e) {
			this.plusChecked = e.detail.value
			
			let idArr = this.selectedList.map(item => item.id)
			let product_id
			const data = { carts: idArr, upgrade_plus: (this.plusChecked ? 1 : 0) }

			if (this.selectCounpon && this.selectCounpon.coupon_id) {
				data.coupon_item_id = this.selectCounpon.coupon_id
			}
			
			if (this.settle) {
				delete data.carts
				let productDetail = this.carts[0]
				product_id = productDetail.goods_list[0].product_id
				data.product_id = product_id
				data.product_num = productDetail.goods_list[0].product_num
				data.store_id = productDetail.store_id
			}						
			
			try{
				this.settle ? await this.SETTLEMEN_GOODS({id: product_id, data}) : await this.SETTLE_CART(data)
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		async radioTap(coupon, index) {

			let curr = index == this.selectCounponIndex ? null : index
			
			let idArr = this.selectedList.map(item => item.id)
			const data = { carts: idArr }
			// 立即下单
			let product_id
			
			if (!this.isPlus) {
				data.upgrade_plus = this.plusChecked ? 1 : 0
			}
			
			if (curr != null) {
				const selected = this.activeCoupon[curr]
				data.coupon_item_id = selected.coupon_id
			}
			
			if (this.settle) {
				delete data.carts
				let productDetail = this.carts[0]
				product_id = productDetail.goods_list[0].product_id
				data.product_id = product_id
				data.product_num = productDetail.goods_list[0].product_num
				data.store_id = productDetail.store_id
			}			
			
			try{
				this.settle ? await this.SETTLEMEN_GOODS({id: product_id, data}) : await this.SETTLE_CART(data)
				this.selectCounponIndex = curr
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}			
			
			this.closeCpuponsPopup()
		},
		timeHandler(timeStr) {
			if (!timeStr) return ''
			
			const timeData = new Date(timeStr)
			
			return Timer.dateFormat(timeData, '{Y}.{MM}.{DD}')
		},
		// 去支付
		async placeOrder() {
			// carts id 数组
			let cartsArr = this.selectedList.map(item => item.id)
			
			const data = {
				order_way: 'carts',
				order_type: this.order_type,
				code: this.wxCode,
				// address_id: this.defaultAddress.id,
				carts: cartsArr,
				note: this.desc,
			}
			// coupon_item_id 优惠券id
			// promotion_name 促销名称
			// integration_deduction 是否积分抵扣
			
			if (this.plusChecked) {
				data.upgrade_plus = 1
			}
			
			if (this.cartSettleData.seckill_id) {
				data.seckill_id = this.cartSettleData.seckill_id
			}
			
			// 分享下单
			if (this.shareId) {
				data.share_id = this.shareId
			}
			
			if (this.order_type == 1) {
				if (!(this.selectAddress && this.selectAddress.id)) {
					return uni.showToast({
						icon: 'none',
						title: '清选择收货地址',
					})
				}
				data.address_id = this.selectAddress.id
			}
			
			// 服务商品选择门店
			if (this.order_type == 2) {
				if (!this.orderSelectStore.id) {
					return uni.showToast({
						icon: 'none',
						title: '请选择服务门店',
					})
				}
				data.store_id = this.orderSelectStore.id
			}
		
			if (this.selectCounpon && this.selectCounpon.coupon_id) {
				data.coupon_item_id = this.selectCounpon.coupon_id
			}
			
			if (this.settle) {
				delete data.carts
				data.order_way = 'product'
				data.order_type = this.order_type
				data.product_id = this.carts[0].goods_list[0].product_id
				data.spec_id = this.carts[0].goods_list[0].spec_id
			}
			
			try {
				const resData = await this.PLACE_ORDER(data)
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
		// 打开领券弹窗
		openCouponsPopup() {
			this.$refs.couponsPopup.open();
		},
		closeCpuponsPopup() {
			this.$refs.couponsPopup.close();
		},		
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		const { settle, order_type } = option
		if (settle) this.settle = settle  // 直接下单
		if (order_type) this.order_type = order_type // 商品类型
		
		try{
			await this.GET_ADDRESS_LIST()
			await this.GET_USER_RECEIVED_COUPINS()
			this.SET_ORDER_SUBMIT_PAGE_STATUS(true)
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		
		uni.hideLoading()
	},
	onUnload() {
		this.SET_ORDER_SUBMIT_PAGE_STATUS(false)
	},
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}	
.order-submit {
	padding: 32upx 32upx 120upx 32upx;
	&__detail {
		background-color: #FFF;
		border-radius: 16upx;
		margin-bottom: 24upx;
	}
	
	&__address {
		padding: 42upx 28upx;
		&-info {
			font-size: 30upx;
		}
		&-img {
			margin-right: 12upx;
			width: 64upx;
			height: 64upx;
		}
		&-icon {
			.icon {
				display: block;
				color: #666;
			}
		}
		&-card {
			padding: 0 16upx;
			flex: 1;
			.address {
				margin-top: 20upx;
				font-size: 26upx;
			}
		}
	}
	// 通用左右栏目
	&__item {
		padding: 24upx 28upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		.input {
			text-align: right;
			width: 480upx;
		}
	}
	
	// 开通会员
	&__card {
		padding: 24upx 28upx;
		.card {
			&__hd {
				margin-bottom: 24upx;
				.title {
					font-size: 28upx;
					font-weight: 500;
				}
			}
			&__bd {
				font-size: 24upx;
				color: #666;
			}
		}
	}
	
	// 去支付
	&__footer {
		position: fixed;
		padding: 20upx 32upx;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120upx;
		width: 100%;
		background-color: #FFF;
		z-index: 2;
		
		&-total {
			font-size: 32upx;
		}
		
		&-submit  {
			width: 192upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			font-size: 30upx;
			border-radius: 40upx;
		}
	}	
}

.popup {
	&-main {
		background-color: $bg-color;
	}
	&-hd {
		padding: 28upx 32upx;
		background-color: #FFF;
	}
}	

.coupons {
	&-popup {
		&__bd {
			padding: 0 32upx;
			min-height: 700upx;
			max-height: 800upx;
			&-main {
				overflow-y: auto;
			}
		}
		&__item {
			margin-bottom: 40upx;
			height: 194upx;
			background-color: #FFF;
			overflow: hidden;
			// filter: grayscale(100%);
			&:first-child {
				margin-top: 40upx;
			}
			&:last-child {
				margin-bottom: 40upx;
			}
			
			&-type {
				position: relative;
				width: 188upx;
				background-color: $primary-color;
				text-align: center;
				&::before {
					content: '';
					position: absolute;
					top: -10upx;
					right: -10upx;
					border-left: 20upx solid #FFF;
					border-bottom: 20upx solid #FFF;
					border-radius: 100%;
				}
				&::after {
					content: '';
					position: absolute;
					bottom: -10upx;
					right: -10upx;
					border-left: 20upx solid #FFF;
					border-top: 20upx solid #FFF;
					border-radius: 100%;
				}
				.price {
					margin-top: 32upx;
					color: #FFF;
					font-size: 28upx;
					.text {
						font-size: 52upx;
						line-height: 70upx;
					}
				}
				.condition {
					display: inline-block;
					text-align: center;
					margin: 12upx 12upx 0;
					padding: 0 12upx;
					line-height: 40upx;
					font-size: 24upx;
					color: $primary-color;
					background:linear-gradient(90deg,rgba(245,219,195,1) 0%,rgba(202,147,94,1) 100%);
					@include ellipsis;
				}
			}
			
			&-info {
				flex: 1;
				padding: 28upx;
				.name {
					height: 90upx;
					line-height: 45upx;
					@include ellipsisMultiline(2);
				}
				.date {
					color: #999;
					font-size: 24upx;
				}
				.btn {
					padding: 0 12upx;
					display: inline-block;
					line-height: 48upx;
					border-radius: 24upx;
					font-size: 24upx;
				}
			}
			
			// 已领取
			&--received {
				.coupons-popup__item-type {
					background: linear-gradient(328deg,rgba(177,187,196,1) 0%,rgba(209,216,222,1) 100%);
					.condition {
						background: #FFF;
					}
				}
				.coupons-popup__item-info {
					.btn {
						color: #FFF;
						background: linear-gradient(328deg,rgba(177,187,196,1) 0%,rgba(209,216,222,1) 100%);
					}
				}
			}
			
			// 已使用
			&--disabled {
				
			}	
		}
	}
}
	
.get-coupons {
	margin: 4upx 40upx 4upx 0;
	position: relative;
	display: inline-block;
	padding: 0 16upx;
	border-radius: 6upx;
	line-height: 40upx;
	font-size: 22upx;
	overflow: hidden;
	
	&::after,
	&::before {
		content: '';
		width: 16upx;
		height: 16upx;
		border-radius: 100%;
		background-color: #FFF;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	
	&::after {
		right: -8upx;
	}
	&::before {
		left: -8upx;
	}
}
</style>
