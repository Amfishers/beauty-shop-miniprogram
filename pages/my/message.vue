<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content">消息通知</block>
		</cu-custom>
		<view class="message">
			<view class="title padding-bottom-lg solid-bottom text-center">{{ msgDetail.title }}</view>
			<view class="margin-bottom-sm"><rich-text :nodes="msgDetail.content" /></view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapState('user', ['msgDetail'])
	},
	methods: {
		...mapActions('user', ['getMsgDetail'])
	},
	onReady() {
		uni.hideLoading();
	},
	onLoad(option) {
		// this.$hasLogin(); // 检查登陆状态
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.getMsgDetail({ messageId: option.id });
	}
};
</script>

<style lang="scss">
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
		margin-bottom: 25upx;
	}
}
</style>
