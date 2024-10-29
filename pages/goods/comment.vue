<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">全部评价</block>
		</cu-custom>
			
		<view class="comment">
			<view class="section_title">
				<view class="subtitle flex align-center">综合评分 <BRate :value="commentData.extra.overall_rating" size="16"/></view>
				<text class="subtitle">好评度 <text class="third-color">{{commentData.extra.good_comment_rate}}%</text></text>
			</view>
			<view class="comment-main">
				<view class="comment-collect">
					<view class="comment-collect__item">有图({{commentData.extra.good_comment_count}}) </view>
					<view class="comment-collect__item">好评({{commentData.extra.had_pic_comment_count}}) </view>
				</view>
				<scroll-view scroll-y="true">
					<view class="comment-box" v-for="item in commentList" :key="item.id">
						<view class="flex align-center justify-between">
							<view class="flex align-center">
								<view
									class="cu-avatar round"
									:style="{
										backgroundImage: item.user_avatar ? 'url(' + item.user_avatar + ')' : ''
									}" />
								<text class="comment-box__nickname">{{ item.nickname }}</text>
							</view>
							<BRate :value="item.star" size="16"/>
						</view>
						<view class="comment-box__content">{{ item.title }}</view>
						<view-scroll v-if="item.img_pic" scroll-x class="comment-box__img">
							<image v-for="src in item.img_pic.split(',')" :key="src" :src="src" class="comment-box__img-item" />
						</view-scroll>
						<view class="comment-box__time">{{ (item.create_time && item.create_time.split(' ')[0]) || ' '}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations,mapGetters  } from 'vuex';
import GoodsServices from '@/services/goods.js'
import BRate from '@/components/rate/index.vue'

export default {
	comments: {
		BRate
	},
	computed: {
		...mapState({
			goodsDetail: state => state.goods.goodsDetail,
			goodsComments: state => state.goods.goodsComments,
		}),
	},
	data() {
		return {
			commentData: {},
			commentList: [],
			page: 1,
			total_page: 0,
		}
	},
	onLoad() {
		this.fetchComment()
	},
	methods: {
		async fetchComment() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			const goodsId = this.goodsDetail.id || 1
			try{
				const resData = await GoodsServices.getGoodsComments(goodsId)
				const { data } = resData
				this.commentData = data
				this.commentList = [...this.commentList, ...data.items]
				uni.hideLoading()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			uni.hideLoading()
		},
		
	}
}
</script>

<style lang="scss">
.section_title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 36upx 24upx;
	
	.subtitle {
		color: $primary-color;
		font-size: 28upx;
		font-weight: 400;
	}
}

.comment {
	border-top: 24upx solid #F7F7F7;
	
	&-collect {
		padding: 36upx 0 12upx;
		margin: 0 24upx;
		border-top: 1px solid #F2F2F2;
		&__item {
			display: inline-block;
			margin-right: 28upx;
			background-color: #F7F7F7;
			border-radius: 28upx;
			line-height: 52upx;
			padding: 0 24upx;
			color: $primary-color;
		}
	}
	
	&-box {
		padding: 24upx;
		border-bottom: 24upx solid #F7F7F7;
		
		&__nickname {
			margin-left: 12upx;
			font-size: 26upx;
		}
		&__content {
			margin-top: 36upx;
			color: #666666;
			font-size: 26upx;
		}
		&__img {
			margin-top: 24upx;
			white-space: nowrap;
			&-item {
				display: inline-block;
				width: 218upx;
				height: 218upx;
			}
		}
		&__time {
			margin-top: 24upx;
			color: #999999;
			font-size: 22upx;
		}
	}
}
</style>
