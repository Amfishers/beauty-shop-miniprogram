<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">我的订单</block>
		</cu-custom>
				
		<view class="order-list">
			<view class="order-list__sticky" :style="{'top': `${customBar}px`}">
				<!-- 类型切换 -->
				<view class="order-list__tab">
					<view class="order-list__tab-main">
						<view v-for="(type, tIndex) in orderType" :key="type.type" :class="{'btn': true, 'active': tIndex == orderTypeIndex}" @tap="changeTab(tIndex)">
							{{ type.name }}
						</view>
					</view>
				</view>
				<!-- 订单类型 -->
				<view class="order-list__bar">
					<scroll-view scroll-x  :scroll-into-view="scrollinto" :scroll-with-animation="true">
						<view class="order-list__bar-nav" v-for="(tab, index) in tabList" :key="tab.type" :id="'tab'+ index" @click="changeType(index)">
							<view :class="tabIndex == index ? 'order-list__bar-nav--active' : ''"> {{tab.name}} </view>
						</view>
					</scroll-view>
				</view>
			
			</view>
			
			<!-- 订单列表 -->
			<view class="order-list__main" :style="{'margin-top': `${bodyMain}px`}">
						
						
				<view class="order-list" v-if="orderList && orderList.length">
					<order-item
						v-for="item in orderList"
						:key="item.id"
						:url="'/pages/order/order?id=' + item.id + '&type=' + currOrderType "
						:storeImg="image_path + '/store-s.png'"
						:storeName="item.store_name || '骄杨佳美店铺'"
						:orderItems="item.order_items || item.items"
						:status="getOrderStatus(item.status, currOrderType, item.return_status)"
						:orderType="currOrderType"
						:orderSub="(currOrderType==0)?item.items.availableTimes:''"
					>
						<block slot="btns">
							<!-- 退款部分 -->
							<!-- <block v-if="item.return_status === '1'">
								<button @click.stop="clickBtn(item.orderSn, item.id, 'refund')" class="cu-btn round line-mc">申请退款</button>
							</block> -->
							<block v-if="parseInt(item.status_return) > -1 && parseInt(item.status_return) < 3">
								<button @click.stop="clickBtn(item.order_sn, item.id, 'refund-detail')" class="cu-btn round line-mc">
									{{(parseInt(item.status_return) == 1)?"退款中":"退款详情"}}
								</button>
							</block>
							<block v-else>
							<!-- 订单部分 -->
								<button v-if="item.status == 0" @click.stop="clickBtn(item.order_sn, item.id, 'pay', item.pay_amount)" class="cu-btn round order-pay">去付款</button>
								<block v-else-if="item.status == 1">
									<button class="cu-btn round line-mc margin-left-lg" v-if="orderTypeIndex == 0" @click.stop="clickBtn(item.order_sn, item.id, 'service')">服务验证</button>
								</block>
								<block v-else-if="item.status == 2">
									<button class="cu-btn round line-mc-primary" v-if="orderTypeIndex == 1" @click.stop="clickBtn(item.order_sn, item.id, 'confirm')">确认收货</button>
									<button @click.stop="clickBtn(item.order_sn, item.id, 'confirm')" class="cu-btn round line-mc" v-else>服务验证</button>
								</block>
								<button class="cu-btn round line-mc-primary" v-else-if="item.status == 3" @click.stop="clickBtn(item.order_sn, item.id, 'evaluate')">去评价</button>
							</block>
						</block>
					</order-item>
					<view class="flex justify-center align-center" style="width: 100%;">
						<list-load-more :status="loadMore"></list-load-more>
					</view>
					
				</view>
				
				<blank-item :type="tabIndex == 4 ? 'evaluate-order' : 'order'" v-else />
			</view>
			
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BlankItem from '../../components/blank.vue'
import OrderItem from '@/components/order/order-item-origin.vue'


export default {
	components: {
		OrderItem,
		BlankItem
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			loadMore: "more",
			scrollinto: 0,
			orderTypeIndex: 1,
			orderType: [
				{name: '服务订单', type: 'xuni'},
				{name: '实物订单', type: 'shiwu'},
			],
			tabIndex: 0,
	
			page: 1,
			total: 0,
		}
	},
	computed: {
		...mapState({
			orderList: state => state.order.orderList,
			orderTotal: state => state.order.orderTotal,
			customBar: state => state.customBar,
			wxCode: state => state.user.wxCode,
		}),
		bodyMain() {
			return this.customBar + uni.upx2px(172 / 2)
		},
		currOrderType() {
			return this.orderTypeIndex == 0 ? parseInt(2) : parseInt(1)
 		},
		tabList() {
			// 订单状态：0->待付款； 1->已付款 / 待发货； 2->已发货； 3->已收货 / 待评价； 4->已完成（下单15天自动完成）； 5->已关闭； 6->无效订单（退款订单）
			if (this.orderTypeIndex == 0) {
				// 服务订单
				return [
					{ name: '全部订单', id: 7 },
					{ name: '待付款', id: 0 }, 
					{ name: '待服务', id: 1 }, 
					{ name: '服务中', id: 2 }, 
					{ name: '待评价', id: 3 }, 
					{ name: '已完成', id: 4 }, 
					{ name: '已关闭', id: 5 }, 
					{ name: '售后/退款', id: 6 },
				]
			}
			
			return [
				{ name: '全部订单', id: 7 }, 
				{ name: '待付款', id: 0 }, 
				{ name: '待发货', id: 1 }, 
				{ name: '收货中', id: 2 }, 
				{ name: '待评价', id: 3 }, 
				{ name: '已完成', id: 4 }, 
				{ name: '已关闭', id: 5 }, 
				{ name: '售后/退款', id: 6 },
			]
		},
		queryData() {
			let params = {
				page: this.page,
				order_type: this.currOrderType,
			}
			
			const selectTab = this.tabList[this.tabIndex]
			if (selectTab.id < 7) {
				params.status = selectTab.id
			}
			return params
		},
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		
		const { orderindex, tabindex } = option
		
		if (orderindex) {
			// 服务 or 实物订单
			this.orderTypeIndex = orderindex
		}
		
		if (tabindex) {
			// 订单类型
			this.tabIndex = tabindex
			this.scrollinto = 'tab' + tabindex
		}
		
		try {
			await this.fetchData()
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		uni.hideLoading()
	},
	methods: {
		...mapActions({
			GET_ORDER_LIST: 'order/GET_ORDER_LIST',
			
			ORDER_PAY: 'order/ORDER_PAY',
			WECHAT_PAY: 'order/WECHAT_PAY',		
			ORDER_RECEIPT: 'order/ORDER_RECEIPT',	
		}),
		// 改变顶部 tab
		changeTab(index) {
			if (index !== this.orderTypeIndex) {
				this.orderTypeIndex = index
				this.page = 1
				this.fetchData()
			}
		},
		// 改变订单类型
		changeType(index) {
			if (index !== this.tabIndex) {
				this.scrollinto = 'tab'+index
				this.tabIndex = index
				this.page = 1
				this.fetchData()
			}
		},
		async fetchData() {
			try{
				await this.GET_ORDER_LIST(this.queryData)
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		async onReachBottom() {
			if (this.orderList.length < this.orderTotal) {
				this.page = this.page + 1
				this.loadMore = 'loading'
				this.fetchData()
			}
		},
		async onPullDownRefresh(){
			// 下拉重新加载
			uni.showLoading({
				title:'加载中'
			})
			await this.fetchData()
			uni.stopPullDownRefresh()
			uni.hideLoading()
		},	

		async clickBtn(sn, id, type, payamount) {
			const orderType = this.currOrderType
			if (type === 'pay') {
				this.orderPay(id, orderType)
				// uni.navigateTo({
				// 	url: `/pages/order/order?order=${sn}&id=${id}&amount=${payamount}&type=${ this.currOrderType }`
				// });
			} else if (type === 'refund') {
				uni.navigateTo({ url: `/pages/order/refund?order=${sn}&id=${id}&type=${ orderType }` });
			} else if (type === 'refund-detail') {
				uni.navigateTo({ url: `/pages/order/refund_list?order=${sn}&id=${id}&type=${ orderType }` });
			} else if (type === 'evaluate') {
				uni.navigateTo({ url: `/pages/order/evaluate?order=${sn}&id=${id}&type=${ orderType }` });
			} else if (type === 'confirm') {
				// 确认收货
				let data = {
					order_type: orderType
				}
				try{
					await this.ORDER_RECEIPT({ id, data })
					await this.fetchData()
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
			} else if (type === 'service') {
				uni.navigateTo({ url: `/pages/order/detail?order=${sn}&id=${id}&type=${ this.currOrderType }` });
			}
		},
		getOrderStatus(status, type, returnStatus="0") {
			returnStatus = '' + returnStatus
			status = '' + status
			
			
			switch(returnStatus){
				case '2':
					return '退款中';
				case '3':
					return '已退款';
			}
			switch (status) {
				case '0':
					return '待付款';
				case '1':
					if (type == 2) return '待服务';
					return '待发货';
				case '2':
					if (type == 2) return '服务中';
					return '待收货';
				case '3':
					return '待评价';
				case '4':
					return '已完成';
				case '5':
					return '已关闭';
				case '6':
					return '已失效';
				default:
					return '已失效';
			}
		},
		async getList() {
			const data = {
				page: this.page,
				pageSize: this.pageSize
			};
			if (this.TabCur - 1 > -1) {
				data['status'] = String(this.TabCur - 1);
			}
			await this.getOrderList(data);
			if (this.orderList.length >= this.orderTotals) {
				this.loadMore = 'noMore'
			}else{
				this.loadMore = 'loading'
			}
		},
		// 订单支付
		async orderPay(id, orderType) {
			const data = {
				order_type: parseInt(orderType),
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
	}
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.order-list {
	&__sticky {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 10;
		background-color: $bg-color;
	}
	// 顶部导航
	&__tab {
		padding: 20upx 0;
		text-align: center;
		font-size: 0;
		&-main {
			display: flex;
			width: 360upx;
			height: 64upx;
			margin: 0 auto;
			border: 1px solid $primary-color;
			border-radius: 32upx;
			overflow: hidden;
		}
		.btn {
			flex: 1;
			height: 64upx;
			line-height: 64upx;
			font-size: 28upx;
			text-align: center;
			&.active {
				background-color: $primary-color;
				color: #F5DBC3;
			}
		}
	}
	
	// 列表
	&__bar {
		width: 100%;
		height: 88upx;
		white-space: nowrap;
		background-color: #FFF;
		&-nav {
			position: relative;
			display: inline-block;
			padding: 0 20upx;
			color: #666;
			font-size: 32upx;
			line-height: 88upx;
			
			&--active {
				font-weight: 500;
				color: $primary-color;
				&::before {
					content: '';
					@include absolute-b-l(0, 50%);
					@include wh(40upx, 6upx);
					background-color: $primary-color;
					transform: translateX(-50%);
					border-radius: 6upx;
				}
			}		
		}
	}
	
	// 订单列表
	&__main {
		padding: 24upx 32upx;
		.cu-btn {
			font-size: 26upx;
			font-weight: 400;
		}
	}
	
	&__item {
		display: block;
		margin-bottom: 24upx;
	}
}

.order-pay {
	background-color: $third-color!important;
	color: #FFF;
}
</style>