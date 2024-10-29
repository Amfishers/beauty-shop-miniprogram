<template>
	<view>
		<cu-custom bgColor="bg-white-heavy" isBack>
			<block slot="content">购买记录</block>
		</cu-custom>
		
		<view class="plus-record">
			<template v-if="plusListData.length">
				<view class="plus-record__item" v-for="item in plusListData" :key="item.id">
					<view class="title">
						购买有效期：{{ item.plus_start_time }}-{{ item.plus_end_time }}
					</view>
					<view class="bd flex justify-between align-center">
						<text class="time">下单时间：{{ item.create_time && item.create_time.split(' ')[0] }}</text>
						<text class="text" :class="{ 'active': item.use_status == 1, 'done': item.use_status == 2 }">{{ item.use_status == 0 ? '未生效' : item.use_status == 1 ? '生效中' : '已完成' }}</text>
					</view>
				</view>
				<view class="flex justify-center align-center" style="width: 100%;">
					<list-load-more :status="loadMore"></list-load-more>
				</view>
			</template>
			<blank-item type="data" v-else />
		</view>
	</view>
</template>

<script>
import blankItem from '@/components/blank.vue'
import UserService from '@/services/user.js'

export default {
	components: {
		blankItem,
	},
	data() {
		return {
			loadMore:"more",
			plusListData: [],
			page: 1,
			total: 0,
		}
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})		
		await this.getPlusList()
		uni.hideLoading()
	},
	methods: {
		async getPlusList() {
			const params = {
				page: this.page,
			}
			try{
				const resData = await UserService.getUserPlusList(params)
				this.plusListData = resData.data.items
				this.total = resData.data.total_page
				
				if (this.plusListData.length >= this.total) {
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
		},
	},
	async onReachBottom() {
		if (this.plusListData.length < this.total) {
			this.page = this.page + 1
			await this.getPlusList()
		}
	},	
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.plus-record {
	padding: 0 32upx;
	&__item {
		margin-top: 32upx;
		padding: 32upx;
		background-color: #FFF;
		border-radius: 16upx;
		.title {
			color: $primary-color;
			font-size: 30upx;
			font-weight: 500;
			line-height: 42upx;
		}
		.bd {
			margin-top: 18upx;
			color: #666;
			font-size: 28upx;
		}
	}
}
</style>
