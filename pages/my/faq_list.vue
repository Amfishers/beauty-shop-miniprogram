<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content">常见问题</block>
		</cu-custom>
		<view class="qa-list">
			<view class="cu-list menu">
				<view hover-class="none" class="cu-item arrow" v-for="(item, index) in faqsList" :key="item.id" @click="goPbDetail(item)">
					<view class="content">
						<text class="qa-title">{{ item.ask }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			page: 1,
		};
	},
	computed: {
		...mapState('my', ['faqsList', 'faqsTotal'])
	},
	methods: {
		...mapActions('my', ['GET_USER_FAQS']),
		goPbDetail(item) {
			uni.navigateTo({
				url: `/pages/my/faq?id=${item.id}`
			});
		},
		queryData() {
			let data = {
				page: this.page,
				client: 1
			}
			
			return data
		},		
		async fetchData() {
			const data = this.queryData()
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			
			try{
				await this.GET_USER_FAQS(data)
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
			uni.hideLoading()
		},
		async onReachBottom() {
			if (this.faqsList.length < this.faqsTotal) {
				this.page = this.page + 1;
				await this.fetchData();
			}
		},		
	},
	onLoad() {
		this.fetchData();
	}
};
</script>

<style lang="scss">
.index {
	background-color: $mc-white;
}
.qa-list {
	padding-left: 32upx;
	.cu-list.menu > .cu-item {
		height: 125upx;
		padding-left: 0;
		&:last-child::after {
			border-bottom: 1upx solid #dddddd;
		}
	}
}
</style>
