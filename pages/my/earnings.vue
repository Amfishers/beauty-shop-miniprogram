<template>
	<view>
		<cu-custom isBack bgColor="bg-common">
			<block slot="content">累计收益</block>
		</cu-custom>
		
		<view class="earnings">
			<view class="earnings-bg"></view>
			<!-- 详情 -->
			<view class="earnings-box__main">
				<view class="earnings-box">
					<view class="earnings-box__title">销售奖励</view>
					<view class="earnings-box__col flex align-center justify-between">
						<view class="earnings-box__item">
							<view class="num"> {{ analyseDetail.new_uv || 0 }} </view>
							<view class="text"> 今日新增访问人数 </view>
						</view>
						<view class="earnings-box__item">
							<view class="num"> {{ analyseDetail.new_orders || 0 }} </view>
							<view class="text"> 今日新增订单数 </view>
						</view>
					</view>
					<view class="earnings-box__col flex align-center justify-between">
						<view class="earnings-box__item">
							<view class="num"> {{ analyseDetail.new_orders_amounts || 0 }} </view>
							<view class="text"> 今日新增订单金额(元) </view>
						</view>
						<view class="earnings-box__item">
							<view class="num"> {{ analyseDetail.new_incomes || 0 }} </view>
							<view class="text"> 今日新增预估收入(元) </view>
						</view>
					</view>
				</view>
			</view>
		
			<!-- 类型切换 -->
			<view class="earnings-list__tab">
				<view class="earnings-list__tab-main">
					<view v-for="(type, tIndex) in orderType" :key="type.id" :class="{'btn': true, 'active': type.id == orderTypeIndex}" @tap="changeTab(type, index)">
						{{ type.name }}
					</view>
				</view>
			</view>			
			
			<!-- 订单类型 -->
			<view class="earnings-list__bar bg-white">
				<scroll-view scroll-x  :scroll-into-view="scrollinto" :scroll-with-animation="true">
					<view class="earnings-list__bar-nav" v-for="(tab, index) in tabList" :key="tab.type" :id="'tab'+ index" @click="changeType(index)">
						<view :class="tabIndex == index ? 'earnings-list__bar-nav--active' : ''"> {{tab.name}} </view>
					</view>
				</scroll-view>
			</view>			
			
			<view class="earnings-list__main" :style="{'min-height': bodyMain}">
				
				<view v-if="analyseList && analyseList.length" style="margin-bottom: 32upx;">
					<view class="earnings-item" v-for="analyse in analyseList" :key="analyse.id">
						<view class="earnings-item__hd flex justify-between" v-for="item in analyse.items" :key="item.id">
							<image :src="item.product_pic" class="img" mode=""></image>
							<view class="info flex-sub">
								<view class="info-title flex align-center">
									<image :src="orderTypeIndex == 1 ? (image_path + '/earnings-p.png') : (image_path + '/earnings-s.png')" class="info-title__img" mode=""></image>
									<text class="text">{{ orderTypeIndex == 1 ? '实物商品' : '服务项目' }}</text>
								</view>
								<view class="info-desc">
									{{ item.product_name }}
								</view>
								<view class="info-status">
									<view class="cu-tag">
										{{ getOrderStatus(analyse.status, item.order_type, analyse.return_status) }} 
									</view>
								</view>
							</view>
						</view>
						<view class="earnings-item__data flex align-center">
							<view class="data">
								<view class="data-num">
									{{ analyse.pay_amount || 0 }}
								</view>
								<view class="data-text">
									付款金额(元)
								</view>
							</view>
							<view class="data">
								<view class="data-num">
									{{ analyse.estimated_income || 0 }}
								</view>
								<view class="data-text">
									付款预估收入(元)
								</view>
							</view>
							<view class="data">
								<view class="data-num">
									{{ analyse.commission_percentage }}%
								</view>
								<view class="data-text">
									提成
								</view>
							</view>
						</view>
						<view class="earnings-item__tip">
							{{ analyse.create_time || '' }} 提交订单
						</view>
					</view>
						
					<view class="flex justify-center align-center" style="width: 100%;">
						<list-load-more :status="loadMore"></list-load-more>
					</view>					
				</view>
				
				<blank-item :type="'order'" v-else />
			</view>			
			
		</view>
		
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters  } from 'vuex'
import BlankItem from '../../components/blank.vue'

export default {
	components: {
		BlankItem
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			tabIndex: 0,
			scrollinto: 0,
			loadMore: "more",
	
			orderTypeIndex: 1,
			orderType: [
				{name: '服务订单', id: 2},
				{name: '实物订单', id: 1},
			],	
	
			page: 1,
			total: 0,
		}
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			customBar: state => state.customBar,

			analyseDetail: state => state.my.analyseDetail,
			analyseList: state => state.my.analyseList,
			analyseTotal: state => state.my.analyseTotal,			
		}),
		tabList() {
			// 订单状态：0->未完成，1->待出账单/待结算（订单状态：4），2->已出账单/已结算（出月账单的时候改变状态到已出账,3->已失效
			return [
				{ name: '全部订单', id: 4 }, 
				{ name: '待结算', id: 1 }, 
				{ name: '已结算', id: 2 }, 
				{ name: '已失效', id: 3 },
			]
		},
		queryData() {
			let params = {
				page: this.page,
				order_type: this.orderTypeIndex,  // 1：实物 2：服务
			}
			
			// 0->未完成，1->待出账单/待结算（订单状态：4），2->已出账单/已结算（出月账单的时候改变状态到已出账,3->已失效			
			const selectTab = this.tabList[this.tabIndex]
			if (selectTab.id < 4) {
				params.confirm_status = selectTab.id
			}

			return params
		},
		bodyMain() {
			return `calc(100vh - ${this.customBar + uni.upx2px(650)}px)`
		},
	},
	methods: {
		...mapActions({
			GET_USER_ANALYSE: 'my/GET_USER_ANALYSE'
		}),
		// 改变顶部 tab
		changeTab(type, index) {
			if (type.id !== this.orderTypeIndex) {
				this.orderTypeIndex = type.id
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
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			try{
				await this.GET_USER_ANALYSE(this.queryData)

				if (this.analyseList.length >= this.analyseTotal) {
					this.loadMore = 'noMore'
				}else{
					this.loadMore = 'loading'
				}				
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
			uni.hideLoading()
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
		async onReachBottom() {
			if (this.analyseList.length < this.analyseTotal) {
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
	},
	async onLoad(option) {
		try{
			await this.fetchData()
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})		
		}
	},
	// onPageScroll(res) {		
	// 	// 滚动
	// 	if (res.scrollTop > 45) {
	// 		this.navClass = 'bg-home'
	// 	} else {
	// 		this.navClass = 'bg-transparent'
	// 	}
	// },
}
</script>

<style lang="scss">
page {
	background: $bg-color;
}
.earnings {
	position: relative;
	&-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 378upx;
		background-color: $primary-color;
		z-index: -1;
	}
	&-box {
		width: 100%;
		height: 394upx;		
		background:linear-gradient(270deg,rgba(245,219,195,1) 0%,rgba(202,147,94,1) 100%);
		box-shadow:0px 8px 20px 0px rgba(202,147,94,0.31);
		border-radius:24px;
		color: #FFF;
		&__main {
			position: relative;
			padding: 32upx;
			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #FFF;
				z-index: -2;
			}			
		}
		
		&__title {
			padding: 32upx 32upx 8upx;
			font-size: 32upx;
			font-weight: 500;
		}
		
		&__col {
			
		}
		
		&__item {
			width: 50%;
			text-align: center;
			padding: 16upx;
			.num {
				padding: 4upx 0;
				font-size: 48upx;
				line-height: 58upx;
			}
			.text {
				font-size: 24upx;
			}
		}
	}
	
	&-list {
		// 顶部导航
		&__tab {
			padding: 20upx 0;
			text-align: center;
			font-size: 0;
			background-color: #FFF;
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
				width: 24%;
				display: inline-block;
				padding: 0 20upx;
				color: #666;
				font-size: 32upx;
				line-height: 88upx;
				text-align: center;
				
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
	}
	
	&-list__main {
		position: relative;
		padding: 0 32upx;
	}
	
	&-item {
		margin-top: 32upx;
		padding: 32upx;
		border-radius: 16upx;
		background-color: #FFF;
		&:last-child {
			margin-bottom: 24upx;
		}
		&__hd {
			.img {
				width: 160upx;
				height: 160upx;
				border-radius: 16upx;
			}
			.info {
				margin-left: 24upx;
				overflow: hidden;
				&-title {
					font-size: 32upx;
					font-weight: 500;
					line-height: 45upx;
					@include ellipsis;
					&__img {
						width: 40upx;
						height: 40upx;
					}
				}
				&-desc {
					margin: 10upx 0 20upx;
					color: #666;
					font-size: 24upx;
					line-height: 34upx;
					@include ellipsis;
				}
				&-status {
					.cu-tag {
						line-height: 48upx;
						color: #CA935E;
						border-radius: 24upx;
						background-color: rgba(202,147,94, 0.15);
					}
				}
			}
		}
		&__data {
			margin-top: 32upx;
			.data {
				&:first-child {
					padding-right: 10upx;
					width: 40%;
				}
				&:nth-child(2) {
					padding-right: 10upx;
					width: 40%;
				}
				&:last-child {
					width: 20%;
				}
				&-num {
					padding: 10upx 0;
					font-size: 32upx;
				}
				&-text {
					font-size: 24upx;
					color: #999;
				}
			}
		}
		&__tip {
			border-top: 1upx solid #E5E5E5;
			padding-top: 24upx;
			margin-top: 24upx;
			color: #999;
		}
	}
}
</style>
