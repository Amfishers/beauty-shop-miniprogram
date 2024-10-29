<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">提现记录</block>
		</cu-custom>
		
		<view class="cashout-list">
			
			<view class="cashout-list__hd fixed" :style="{'top': `${customBar}px`}">
				<view class="flex align-center justify-between">
					<text class="text">日期</text>
					<text class="text">结余（元）</text>
				</view>
			</view>
			
			<view class="cashout-list__main">
				<template v-if="JSON.stringify(cashoutList) == '{}'"><blank-item type="order" /></template>
				<template v-else>
					<view class="cashout-list__box" v-for="(list,key,index) in cashoutList" :key="key">
						<view class="cashout-list__box-hd">
							{{ key }}
						</view>
						<view class="cashout-list__box-bd flex align-center justify-between" v-for="item in list" :key="item.id">
							<text class="date">{{ timeHandler(item.create_time) }}</text>
							<text class="content">提现： <text class="green">-{{item.payable}}</text></text>
							<text class="balance">{{item.amount}}</text>
						</view>
					</view>
				</template>
				<!-- <view class="search-more">
					<LoadMore :status="loadMore"/>
				</view> -->
			</view>
			
		</view>
		
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters  } from 'vuex'
import CashoutService from '@/services/cash.js'
import BlankItem from '../../components/blank.vue'

export default {
	components: {
		BlankItem
	},
	computed: {
		...mapState({
			customBar: state => state.customBar,
		}),	
	},
	data() {
		return {
			cashoutList: {},
			cashoutTotal: 0,
			page: 1,
			loadMore:"more",
		}
	},
	methods: {
		timeHandler(time) {
			if (!time) return ''
			
			return `${new Date(time).getDate()}日`
		},
		queryData() {
			let data = {}
			
			data.page = this.page
			
			return data
		},		
		async fetchData() {
			const data = this.queryData()
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			try{
				const resData = await CashoutService.getCashoutList(data)
				
				// this.cashoutTotal = resData.data.total_count
				this.cashoutList = resData.data
					
				// if (this.cashoutList.length >= this.cashoutTotal) {
				// 	this.loadMore = 'noMore'
				// }else{
				// 	this.loadMore = 'loading'
				// }				
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
	onLoad(option) {
		this.fetchData()
	},
	onPullDownRefresh(){
		// 下拉重新加载
		uni.showLoading({
			title:'加载中'
		})
		this.fetchData();
		uni.stopPullDownRefresh();
		uni.hideLoading()
	},	
	// async onReachBottom() {
	// 	if (this.cashoutList.length < this.cashoutTotal) {
	// 		this.page = this.page + 1
	// 		await this.fetchData();
	// 	}
	// },
}
</script>

<style lang="scss">
.cashout-list {
	&__hd {
		left: 0;
		right: 0;
		width: 100%;
		padding: 38upx 32upx;
		height: 124upx;
		border-top: 1upx solid #F2F2F2;
		background-color: #FFF;
		.text {
			height: 45upx;
		}
	}
	
	&__main {
		padding-top: 124upx;
	}
	
	&__box {
		&-hd {
			height: 64upx;
			line-height: 64upx;
			background-color: #F2F2F2;
			text-align: center;
			font-size: 28upx;
		}
		&-bd {
			margin-left: 32upx;
			padding-right: 32upx;
			line-height: 104upx;
			font-size: 28upx;
			height: 104upx;
			border-bottom: 1upx solid #E5E5E5;
			&:last-child {
				border-bottom-width: 0;
			}
			.date {
				width: 110upx;
				@include ellipsis;
			}
			.content {
				flex: 1;
				color: #999;
			}
			.green {
				color: #2CA95A;
			}
			.balance {
				text-align: right;
				width: 130upx;
				@include ellipsis;
			}
		}
	}
}
</style>