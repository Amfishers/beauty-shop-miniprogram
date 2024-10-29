<template>
	<view class="index">
		<!-- store message -->
		<view class="store">
			<scroll-view scroll-x scroll-with-animation class="nav imgs" v-if="storeDetail.storeImgList">
				<image v-for="item in storeDetail.storeImgList" :key="item" :src="item" />
			</scroll-view>
			<view class="store-bar">
				<text class="name">{{ storeDetail.name }}</text>
				<view class="flex align-center justify-between" v-if="storeDetail.stars || storeDetail.serveds">
					<view class="flex align-center rate" v-if="storeDetail.stars">
						<BRate :value="parseFloat(storeDetail.stars)" size="16" /><text v-if="storeDetail.stars">{{storeDetail.stars}}分</text>
					</view>
					<view v-if="storeDetail.serveds > 0" class="cu-tag round tag-order">{{ storeDetail.serveds }}订购</view>
				</view>
				<view class="tag">
					<view v-if="storeDetail.info" class="cu-tag line-mc-primary round">{{storeDetail.info}}</view>
				</view>
				<view class="msg flex align-center justify-between">
					<view class="flex-sub">
						<view class="time flex align-start">
							<view>营业时间：</view>
							<text class="flex-sub">{{ storeDetail.service_start_time + ' ~ ' + storeDetail.service_end_time }}</text>
						</view>
						<view @click="openLocation(storeDetail)">地址：{{ storeDetail.detailed_address }} 
						<view class="safeguard">保障： 资质认证 · 健康认证 · 公安联网 </view>
						</view>
					</view>
					<view class="phone" :data-phone="storeDetail.phone" @click="makePhoneCall(storeDetail.phone)"></view>
				</view>
			</view>
		</view>

		<!-- goods -->
		<view class="goods">
			<scroll-view scroll-x scroll-with-animation class="bg-nav nav text-center bg-white">
				<view class="flex text-center">
					<view 
						v-for="(item, index) in tabnav"
						:key="index"
						class="cu-item flex-sub" 
						:class="index == TabCur ? 'nav-on' : ''" 
						@tap="tabSelect"
						:data-id="index"
					>
						<text class="text">{{ item.name }}</text>
					</view>
				</view>
			</scroll-view>
			
			<!-- 用户评价 -->
			<view class="section comment" v-if="TabCur == 3">
				<view class="section_title">
					<text class="title">用户评价（{{ goodsComments.total_count || 0 }}）</text>
					<navigator url="/pages/goods/comment"><text class="subtitle">好评度 <text class="third-color">{{goodsComments.extra.good_comment_rate}}%</text></text></navigator>
				</view>
				<view class="comment-main" v-if="goodsComments.total_count">
					<view class="comment-collect">
						<view class="comment-collect__item">有图({{goodsComments.extra.good_comment_count}}) </view>
						<view class="comment-collect__item">好评({{goodsComments.extra.had_pic_comment_count}}) </view>
					</view>
					<view class="comment-box" v-for="item in goodsCommentList" :key="item.id">
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
					
					<view class="morebtn" v-if="goodsComments.total_count > 2">
						<navigator url="/pages/goods/comment" hover-class="none">
							<view class="morebtn_more">
								查看全部评价
							</view>
						</navigator>
					</view>					
				</view>
				<view v-else>
					<view class="morebtn_more">
						暂无评论
					</view>
				</view>
			</view>
			<!-- 用户评价结束 -->

			<!-- 商品开始 -->
			<view class="grid col-2 justify-between goods-list" v-else>
				<view v-for="item in storeGoodsList" :key="item.id" class="store-item">
					<Card
						class="store-item__detail"
						:img="item.cover_pic"
						:name="item.name"
						:price="item.price"
						:originPrice="item.market_price"
						:url="'/pages/goods/goods?id=' + item.id +'&storeId='+storeId"
						:description="`${item.total_sale > 0 ? (item.total_sale + '人订购') : ''}`"
					/>
				</view>
			</view>
		</view>

		<view class="panel" v-if="storeNearest.items.length">
			<view class="header"><text>附近门店</text></view>
			<view class="panel-store">
				<view class="panel-store-item" v-for="store in storeNearest.items" :key="store.id">
					<CardServe
						:url="'/pages/store/store?type=' + storeDetail.store_type + '&id=' + store.id"
						:name="store.name"
						:rate="store.stars"
						:phone="store.phone"
						description=" · 资质认证 · 健康认证 · 公安联网 "
						:distance="`${store.distance/1000}km`"
						:location="store.detailed_address"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import BRate from '@/components/rate/index.vue'
import Card from '@/components/card/card.vue'
import CardServe from '@/components/card/cardserve.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
	components: {
		BRate,
		Card,
		CardServe,
	},
	computed: {
		...mapState({
			storeDetail: state => state.stores.storeDetail,
			storeId: state => state.stores.storeId,
			storeGoods: state => state.stores.storeGoods,
			storeNearest: state => state.stores.storeNearest,
			locationInfo: state => state.user.locationInfo,
		}),
		storeGoodsList() {
			const itemList = this.storeGoods.items
			if (!itemList) return []
			
			const currId = this.TabCur
			
			if (currId == 1) {
				return itemList.filter(item => item.product_type == currId)
			}
			
			if (currId == 2) {
				return itemList.filter(item => item.product_type == 0)
			}
			
			return itemList
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			scrollTop:0,
			TabCur: 0,
			tabnav: [{
					name: '全部',
					id: 0
				},
				{
					name: '服务项目',
					id: 1
				},
				{
					name: '实物商品',
					id: 2
				},
				// {
				// 	name: '真实评价',
				// 	id: 3
				// }
			],
			cpage: 0,
			cpageSize: this.$cfg.page_size,
			
			goodsComments: {
				extra: {
					good_comment_rate: 100,
					good_comment_count: 2,
					had_pic_comment_count: 2,
				},
				total_count: 2,
			},
			goodsCommentList: [
				{
					id: 1,
					user_avatar: '',
					nickname: 'fisher',
					star: 5,
					title: '好阿秒啊好阿秒啊好阿秒啊好阿秒啊好阿秒啊',
					img_pic: '',
					create_time: '2020-07-08 24:00:00',
				},
				{
					id: 2,
					user_avatar: '',
					nickname: 'fisher',
					star: 5,
					title: '好阿秒啊好阿秒啊好阿秒啊好阿秒啊好阿秒啊',
					img_pic: '',
					create_time: '2020-07-08 24:00:00',
				}
			]
		};
	},
	methods: {
		...mapActions({
			GET_STORE_DETAIL: 'stores/GET_STORE_DETAIL',
			GET_STORE_GOODS: 'stores/GET_STORE_GOODS',
			GET_STORE_NEAREST: 'stores/GET_STORE_NEAREST',
		}),		
		...mapMutations({
			SET_STORE_ID: 'stores/SET_STORE_ID',
		}),
		// ...mapMutations('login', ['set_ShareId']),
		tabSelect(e) {
			const id = e.currentTarget.dataset.id;
			this.TabCur = id;
		},
		makePhoneCall(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// async getList() {
		// 	await this.getCommentList({
		// 		page: this.cpage,
		// 		pageSize: this.cpageSize,
		// 		storeId: this.storeId
		// 	});
		// },
		// async getStoreGoodsList() {
		// 	const type = this.TabCur;
		// 	let data = {
		// 		page: 0,
		// 		pageSize: this.$cfg.page_size,
		// 		sortText: 'ASC',
		// 		sortValue: '0',
		// 		storeId: this.storeId
		// 	};
		// 	if (type === 1) {
		// 		data = {
		// 			...data,
		// 			productType: '1'
		// 		};
		// 	} else if (type === 2) {
		// 		data = {
		// 			...data,
		// 			productType: '0'
		// 		};
		// 	} else if (type === 3) {
		// 		data = {
		// 			...data,
		// 			sortValue: '2'
		// 		};
		// 	}
		// 	this.getGoodsList(data);
		// },
		// async showMoreComments() {
		// 	if (this.storeCommentList.length < this.storeTotalComments) {
		// 		this.cpage = this.cpage + 1;
		// 		await this.getList();
		// 	}
		// },
		openLocation (value) {
			uni.openLocation({
				longitude: Number(value.longitude),
				latitude: Number(value.latitude),
				name: value.name,
				address: value.detailedAddress
			})
		}
	},
	// onLoad(option) {
	// 	console.log(option);
	// 	uni.showLoading({
	// 		title: '加载中...',
	// 		mask: true
	// 	});
		// this.$saveShareId(option); // 保存分享人ID			
		// if (option.id || option.scene) {		// 识别传入的门店id参数
		// 	if (option.scene) { // 扫码打开支付页面
		// 		const scene = decodeURIComponent(option.scene)
		// 		const wxArgs = this.$qs.parse(scene)
		// 		if (wxArgs.storeId) {
		// 			this.storeId = wxArgs.storeId
		// 		}
		// 		if (wxArgs.sid) {
		// 			this.storeId = wxArgs.sid
		// 		}
		// 	} else if (option.id) {
		// 		this.storeId = option.id
		// 	} else { // 传参错误则跳转首页
		// 		uni.showToast({
		// 			title: '参数错误，跳转首页',
		// 			icon: 'none'
		// 		});
		// 		return uni.reLaunch({
		// 			url: '/pages/index/index'
		// 		});
		// 	}
		// }
		// this.GET_STORE_DETAIL();
		// this.getStoreGoodsList();
		
		
		// this.getList();
		// this.getGoodComment({
		// 	id: this.storeId,
		// 	type: '10'
		// });
	// },
	async mounted() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		console.log('virtualstore')
		// // 设置当前 store id
		// this.SET_STORE_ID(this.sid)
		// // 获取 store 详情
		// await this.GET_STORE_DETAIL()
		
		// // 	获取门店商品
		// const parms = {
		// 	store_id: this.sid,
		// }
		// this.GET_STORE_GOODS(parms)
		
		// const locationParams = {
		// 	...this.locationInfo,
		// 	order_by: 'distance:asc'
		// }
		// this.GET_STORE_NEAREST(locationParams)
		uni.hideLoading()
	},
	onShareAppMessage() {
		let path = `/pages/store/detail?id=${this.storeId}`;
		path = path + `&shareId=${this.userId}`;
		return {
			path: path,
			title:this.storeDetail.name
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	}
}
</script>

<style lang="scss">
	.store {
		background-color: $mc-white;

		.imgs {
			padding: 40upx 0 40upx 32upx;

			image {
				@include wh(600upx, 350upx);
				margin-right: 32upx;
			}
		}

		.tag-order {
			@include sc($font-base, #999999);
		}

		.store-bar {
			padding: 32upx 32upx 40upx 32upx;
			margin-bottom: 24upx;

			.name {
				@include sc(34upx, #020202);
				font-weight: 500;
				line-height: 48upx;
			}
			
			.rate {
				margin-top: 10upx;
			}

			.tag {
				margin: 19upx 0 40upx 0;
			}

			.msg {
				.time {
					@include sc(26upx, #999999);
					font-weight: 400;
					line-height: 37upx;
					margin-bottom: 16upx;

					text {
						font-size: $font-base;
						line-height: 34upx;
					}
				}
				
				.safeguard {
					margin-top: 24upx;
				}

				@include sc(24upx, $mc-greylight);
				font-weight: 300;
				line-height: 33upx;

				.phone {
					@include wh(64upx, 64upx);
					margin-left: 92upx;
					background: url(../../static/phone.png) center no-repeat;
					background-size: cover;
				}
			}
		}
	}

	.goods {
		
		.nav {
			.text {
				position: relative;
				line-height: 54upx;
				font-size: 32upx;
			}
			.nav-on  {
				.text{
					font-weight: 500;
					color: $primary-color;
					&::before {
						content: '';
						@include absolute-b-l(-14upx, 50%);
						@include wh(40upx, 6upx);
						background-color: $primary-color;
						transform: translateX(-50%);
						border-radius: 6upx;
					}
				}
			}
		}
		.goods-list {
			padding: 36upx 12upx 0upx 12upx;
			
			.store-item {
				display: block;
				margin-bottom: 24upx;
				.store-item__detail {
					display: block;
					margin: 0 12upx;
				}
			}
		}
	}

	.panel {
		margin-bottom: 24upx;
		padding: 0 24upx 24upx;

		.header {
			line-height: 45upx;
			padding: 24upx 0;
			
			text {
				@include sc(34upx, $primary-color);
				font-weight: 500;
				vertical-align: middle;
			}
		}

		.comment-header {
			background: $mc-white;
			border-top: 1upx solid #e5e5e5;
			border-bottom: 1upx solid #e5e5e5;
			@include wh(686upx, 120upx);
			@include sc(30upx, $mc-greylight);
			font-weight: 500;

			.comment-good {
				font-weight: 400;

				text {
					@include sc($font-lg, #ff681d);
					margin: 0 12upx;
				}

				.cuIcon-right {
					display: inline-block;
				}
			}
		}
	}

	.moreComment {
		margin-top: -20upx;
		padding: 1upx 0 32upx 0;
	}

	// 评论
	.comment {
		padding: 0 0 36upx;
		background-color: #FFF;
		
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
			
			&:last-child {
				border-bottom-width: 0;
			}
			
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

	.panel-store {
		padding: 10upx 0 32upx 0;
	}
	.panel-store-item {
		display: block;
		margin-bottom: 24upx;
	}
	.section {
		border-bottom: 24upx solid #F7F7F7;
		&_title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 36upx 24upx;
			.title {
				font-size: 500;
				color: $primary-color;
				font-size: 32upx;
			}
			.subtitle {
				color: $primary-color;
				font-size: 28upx;
				font-weight: 400;
			}
		}	
	}
</style>
