<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">大家问</block>
		</cu-custom>
	
		<view class="consult_goods">
			<view class="consult_goods-img">
				<image class="consult_goods-img-main" :src="goodsDetail.cover_pic" mode=""></image>
			</view>
			<view class="consult_goods-info">
				<view class="consult_goods-title">{{ goodsDetail.name }}</view>
				<view class="consult_goods-consult">共{{goodsConsult.total_count}}个问题</view>
			</view>
		</view>		
		
		<scroll-view class="consult" scroll-y>
			<!-- 提问 -->
			<template v-if="!showDetail">
				<view class="consult-card" v-for="(ask, index) in goodsConsultList" :key="ask.id">
					<view class="flex align-center consult-card_col consult-card_ask">
						<view class="consult-icon">
							<BIcon icon="bubble" />
						</view>
						<text class="consult-card_title">{{ ask.ask }}</text>
					</view>
					<view class="consult-card_answer">
						<template v-if="ask.consult_items.length">
							<view v-for="(item, aindex) in ask.consult_items" :key="item.create_time">
								<view class="flex align-center consult-card_col" v-if="aindex === 0">
									<view class="consult-icon">
										<BIcon icon="bubble" />
									</view>
									<text class="consult-card_title">{{ item.answer }}</text>
								</view>
								<view class="flex align-center consult-card_col" v-if="aindex === 1">
									<view class="consult-icon">
										<BIcon icon="bubble" />
									</view>
									<text class="consult-card_title">{{ item.answer }}</text>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="consult-card_title">
								暂无回答
							</view>
						</template>
					</view>
					<view class="flex align-center justify-between consult-card_more">
						<view class="consult-card_link" v-show="ask.consult_items.length > 2"  @tap="showDetailHandler(ask)">
							<text>全部{{ ask.consult_items.length }}个回答</text>
							<BIcon class="consult-card_link-icon" icon="right" font-size="12"/>
						</view>
						<view class="consult-card_date">
							{{ (ask.create_time&&ask.create_time.split(' ')[0]) || ''}}
						</view>
					</view>
					
				</view>
			</template>
		
			<!-- 详情 -->
			<view class="consult-card consult-list_card" v-else>
				<view class="consult-list_card-main" v-for="(detail, dindex) in detailData" :key="detail.id">
					<view class="consult-list_card-hd flex align-center justify-between">
						<view 
							class="cu-avatar consult-list_card-avatar" 
							:style="{
								backgroundImage: detail.user_avatar ? 'url(' + detail.user_avatar + ')' : ''
							}"
						/>
						<view class="consult-list_card-title flex-sub flex align-center justify-between">
							<text class="consult-list_card-user flex-sub">{{detail.nickname}}</text>
							<text class="consult-list_card-date">{{(detail.create_time&&detail.create_time.split(' ')[0]) || ''}}</text>
						</view>
					</view>
					<view class="consult-list_card-bd">
						{{detail.answer}}
					</view>
				</view>
			</view>		
		</scroll-view>
		
		<view class="consult-commit flex align-center justify-between">
			<input class="consult-commit_input" maxlength="30" v-model="consultValue" @confirm="confirmHandler" placeholder="请小伙伴提问吧（4-30个字）" :adjust-position="true" />
			<button class="consult-commit_btn" type="plan" @tap="inputCancel">取消</button>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations,mapGetters  } from 'vuex';
import GoodsServices from '@/services/goods.js'

export default {
	data() {
		return {
			showDetail: false,
			consultValue: '',
			detailData: [], // 详情
		}
	},
	computed: {
		...mapState({
			goodsDetail: state => state.goods.goodsDetail,
			goodsConsult: state => state.goods.goodsConsult,
		}),
		goodsConsultList() {
			let consultList = this.goodsConsult && this.goodsConsult.items

			if (!consultList) return []
			if (!consultList.length) return []
			
			return consultList
		},
	},
	async onLoad(option) {
		const {id, detail} = option
		if (id && detail) {
			const detailItem = this.goodsConsultList.find(item => item.id == id)
			this.detailData = detailItem.consult_items
			this.showDetail = true
		}else {
			this.showDetail = false
		}
	},
	methods: {
		showDetailHandler(data) {
			uni.navigateTo({
					url: `/pages/goods/consult?id=${data.id}&detail=true`
			});
		},
		async fetchDetail(id) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			
			try{
				await GoodsServices.getGoodsIdConsults(id)
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
		async confirmHandler(event) {
			const value = event.detail.value
			const product_id = this.goodsDetail.id
			if (value) {
				const data = {
					ask: value,
					product_id
				}
				try{
					await GoodsServices.postGoodsConsults(product_id, data)
					this.inputCancel()
					uni.showToast({
						icon: 'success',
						title: '提交成功'
					})
				}catch(e){
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}
			}
		},
		inputCancel() {
			this.consultValue = ''
		},
	}
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.consult {
	padding: 24upx;
	
	&_goods {
		margin: 24upx 24upx 0 24upx;
		display: flex;
		&-img {
			@include wh(80upx, 80upx);
			background-color: #FFF;
			margin-right: 16upx;
			&-main {
				display: block;
				@include wh(100%, 100%);
			}
		}
		&-info {
			flex: 1;
			overflow: hidden;
		}
		&-title {
			width: 100%;
			color: $primary-color;
			font-size: 28upx;
			line-height: 34upx;
			@include ellipsis;
		}
		&-consult {
			margin-top: 16upx;
			display: block;
			color: #666666;
			font-size: 22upx;
			line-height: 30upx;
		}
	}

	&-card {
		padding: 36upx 28upx;
		margin-bottom: 24upx;
		background-color: #FFF;
		border-radius: 16upx;
		
		&_col {
			padding: 6upx 0;
		}
		&_title {
			color: $primary-color;
		}
		&_answer {
			margin-top: 20upx;
			
			.consult-icon {
				&::after {
					color: #FFF;
				}
				.iconfont {
					color: #CA935E;
				}
			}
			.consult-card_title {
				color: #666666;
				font-size: 26upx;
			}
		}
		&_more {
			margin-left: 48upx;
			margin-top: 40upx;
			line-height: 24upx;
		}
		
		&_link {
			color: #CA935E;
			font-size: 24upx;
			&-icon {
				margin-left: 6upx;
			}
		}
		
		&_date {
			color: #999999;
			font-size: 24upx;
		}		
	}
	
	&-icon {
		position: relative;
		margin-right: 12upx;
		
		&::after {
			content: '问';
			@include absolute-t-l(0,0);
			@include wh(100%, 100%);
			line-height: 40upx;
			font-size: 22upx;
			text-align: center;
			color: $secondary-color;
		}
		
		.iconfont {
			color: $primary-color;
			font-size: 36upx;
		}
	}	

	&-commit {
		width: 100%;
		height: 120upx;
		padding: 24upx;
		box-sizing: border-box;
		background-color: #FFF;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		
		&_input {
			flex: 1;
			height: 68upx;
			background-color: #F7F7F7;
			line-height: 68upx;
			border-radius: 34upx;
			padding: 0 28upx;
		}
		&_btn {
			margin-left: 20upx;
			width: 140upx;
			height: 68upx;
			line-height: 68upx;
			background-color: #CA935E;
			color: #FFF;
			border-radius: 34upx;
			font-size: 28upx;
		}
	}

	&-list {
		&_card {
			&-main {
				margin-bottom: 40upx;
				&:last-child {
					margin-bottom: 0;
				}
			}
			&-avatar {
				@include wh(60upx, 60upx);
				border-radius: 100%;
				margin-right: 16upx;
			}
			&-user {
				color: $primary-color;
				line-height: 60upx;
				@include ellipsis;
			}
			&-date {
				color: #999999;
				font-size: 24upx;
			}
			&-bd {
				margin-top: 8upx;
				margin-left: 96upx;
				color: #666666;
				font-size: 26upx;
				line-height: 38upx;
			}
		}
	}
}
</style>
