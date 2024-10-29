<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<!-- <block slot="backText">返回</block>-->
			<block slot="content">消息通知</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav solid-bottom">
			<view class="text-center flex">
				<view
					v-for="(item, index) in tabnav"
					:key="index"
					class="cu-item flex-sub nav-item"
					:class="index == TabCur ? 'nav-on text-mc-primary' : ''"
					@tap="tabSelect"
					:data-id="index"
				>
					{{ item.name }}
				</view>
			</view>
		</scroll-view>

		<!-- <view class="cu-list menu-avatar message-list" v-if="msgList && msgList.length">
			<navigator :url="'/pages/user/msgdetail?id=' + item.id" class="cu-item message-list-item" v-for="item in msgList" :key="item.id">
				<image class="cu-avatar round message-icon" :src="item.msgType === '1' ? image_path + '/mine/icon_.png' : image_path + '/mine/icon_tx.png'" />
				<view class="content">
					<view class="text-black title">{{ item.title }}</view>
					<view class="flex">
						<view class="text-cut subtitle">{{ item.content || ' ' }}</view>
					</view>
				</view>
				<view class="action">
					<view>{{ item.createTime }}</view>
				</view>
			</navigator>
		</view> -->
		
		<view class="msg-list" v-if="msgList && msgList.length">
			<navigator  :url="'/pages/user/msgdetail?id=' + item.id" v-for="(item,index) in msgList" :key="index" class="msg-item">
				<view class="msg-left">
					<image :src="item.msgType === '1' ? image_path + '/mine/icon_.png' : image_path + '/mine/icon_tx.png'" mode="widthFix"></image>
				</view>
				
				<view class="msg-main">
					<view class="msg-mid">
						<view class="m-title">{{ item.action || item.title }}</view>
						<view class="m-time">{{ item.createTime }}</view>
					</view>
					<view class="msg-right text-cut">
						<text class="m-content">{{ item.title}} {{ item.content || "" }}</text>
					</view>
					
				</view>
			</navigator>
		</view>
		
		<blank-item :type="'message'" v-else />
	</view>
</template>

<script>
import blankItem from '@/components/blank.vue';
import { mapActions, mapState } from 'vuex';
export default {
	components: {
		blankItem
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			TabCur: 0,
			scrollLeft: 0,
			loadMore:"noMore",
			tabnav: [
				{
					name: '全部消息',
					id: 0
				},
				{
					name: '系统消息',
					id: 1
				},
				{
					name: '我的消息',
					id: 2
				}
			]
		};
	},
	computed: {
		...mapState('user', ['msgList'])
	},
	methods: {
		...mapActions('user', ['getMsgList']),
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.getMessageList();
		},
		getMessageList() {
			this.getMsgList({
				msgType: this.TabCur
			});
		}
	},
	onReady() {
		uni.hideLoading()
	},
	onLoad() {
		this.$hasLogin(); // 检查登陆状态
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		this.getMessageList();
	}
};
</script>

<style lang="scss">
.index {
	background-color: $mc-white;
}
.nav-item {
	position: relative;
	&.nav-on {
		&::after {
			content: '';
			display: inline-block;
			width: 80upx;
			height: 4upx;
			background: $mc-primary;
			position: absolute;
			bottom: 0;
			left: 50%;
			margin-left: -40upx;
		}
	}
}
.cu-list.menu-avatar > .cu-item {
	height: 186upx;
	.content {
		left: 176upx;
		width: calc(100% - 300upx);
		line-height: 1;
		.title {
			@include sc($font-lg, $mc-grey);
			font-weight: 500;
			margin-bottom: 16upx;
		}
		.subtitle {
			@include sc(26upx, #999999);
			font-weight: 500;
		}
	}
	.action {
		width: 124upx;
		@include sc(22upx, #999999);
	}
}
.message-icon {
	@include wh(112upx, 112upx);
	left: 32upx;
}
.cu-list.menu-avatar > .cu-item::after,
.cu-list.menu > .cu-item::after {
	width: calc(200% - 176upx) !important;
	left: 176upx;
}
.msg-list{
	display: flex;
	flex-direction: column;
	padding-bottom: 16upx;
	background: $mc-white;
	
	.msg-item{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 32upx;
		border-bottom: 1px #f2f2f2 solid;
	}
	.msg-left{
		padding-right: 32upx;
		image{
			width: 112upx;
			height: 112upx;
		}
	}
	.msg-main{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
	}
	.msg-mid{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items:center;
	}
	.m-title{font-size: 32upx;font-weight: 600;color: #333;}
	.m-time{font-size: 22upx;color: #999999;}
	.m-content{font-size: 26upx;color: #999999;}
}
</style>
