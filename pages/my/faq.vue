<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content">常见问题</block>
		</cu-custom>
		<view class="message">
			<view class="title padding-bottom-lg solid-bottom text-center">{{ faqsDetail.ask || '常见问题' }}</view>

			<rich-text :nodes="faqsDetail.answer" />
			<!-- <view class="subtitle margin-top-lg">一、常见问题</view>
      <view class="margin-top-sm">
        常见问题
      </view> -->
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {};
	},
	computed: {
		...mapState('my', ['faqsDetail'])
	},
	methods: {
		...mapActions('my', ['GET_USER_FAQS_DETAIL']),
		async fetchData(id) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			
			try{
				await this.GET_USER_FAQS_DETAIL(id)
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
	async onLoad(option) {
		const { id } = option
		await this.fetchData(id)
	},
};
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.message {
	width: 686upx;
	margin: 32upx;
	background: $mc-white;
	border-radius: 16upx;
	padding: 40upx 36upx;
	@include sc(28upx, $mc-greylight);
	line-height: 40upx;
	font-weight: 400;
	.title {
		@include sc($font-lg, $mc-grey);
		font-weight: 500;
		line-height: 45upx;
		border-bottom: 1upx solid rgba(229,229,229,.5);
		margin-bottom: 40upx;
	}
	.subtitle {
		@include sc(30upx, $mc-grey);
	}
}
</style>
