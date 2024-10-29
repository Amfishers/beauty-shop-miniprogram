<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">订单评价</block>
		</cu-custom>

		<view class="evaluation solid-top">
			<view class=""  v-for="(item, index) in orderDetail.items" :key="item.id">
				<view class="goods flex flex-sub solid-bottom">
					<image :src="item.product_pic"></image>
					<view class="flex flex-sub flex-direction align-start justify-between">
						<view class="name">{{ item.product_name }}</view>
						<view class="gery-text">
							{{ item.product_price }}
							x
							<text>{{ item.product_quantity }}</text>
						</view>
					</view>
				</view>
				<form class="bg-white-heavy form">
					<view class="evaluate flex align-center solid-bottom">
						<text>评分</text>
						<rate :value="evaluateData[index].star" :disabled="false" size="16" @change="getStar($event, index)" />
					</view>
					<textarea v-model="evaluateData[index].evaluateText" placeholder="快来写下你的感受吧～" placeholder-style="color: #CCC;" maxlength="500" />
					<view class="cu-form-group">
						<view class="grid col-4 grid-square flex-sub visible">
							<view class="bg-img visible" v-for="(img, imgindex) in evaluateData[index].imgList" :key="imgindex" @tap="ViewImage" :data-url="img.url">
								<image class="visible" :src="img.url" mode="aspectFill"></image>
								<view class="close-wrap" @tap.stop="DelImg($event, index)" :data-index="imgindex"><image class="close-icon" src="../../static/close.png" mode=""></image></view>
							</view>
							<view class="solids" @tap="ChooseImage(index)" v-if="evaluateData[index].imgList.length < 6">
								<BIcon class="icon" icon="camera" font-size="24"></BIcon>
								<view class="text">最多6张</view>
							</view>
						</view>
					</view>
					<view class="secret solid-top" @click="chooseSecret(index)">
						<label class="flex align-center">
							<radio class="black" :checked="evaluateData[index].isSecret ? true : false"></radio>
							<view class="secret-text">
								匿名评价
								<text>勾选后评价将以匿名方式展现</text>
							</view>
						</label>
					</view>

					<button class="cu-btn round btn" :class="!evaluateText ? 'disabled' : 'bg-primary'" :disabled="disabled" @click="evalute">发表评价</button>
				</form>	
			</view>

		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import rate from '@/components/rate/index.vue';
import config from '@/common/config.js'

export default {
	components: {
		rate
	},
	data() {
		return {
			disabled: false,
			isSecret: false,
			imgList: [],
			evaluateText: '',
			star: 5,
			evaluateData: [],
			orderId: ''
		};
	},
	computed: {
		...mapState({
			orderDetail: state => state.order.orderDetail,
			
			openId: state => state.user.openId,
		}),
	},
	methods: {
		...mapActions({
			GET_ORDER_DETAIL: 'order/GET_ORDER_DETAIL',
			ORDER_COMMENT: 'order/ORDER_COMMENT',
			UPLOAD_IMG: 'user/UPLOAD_IMG',
		}),
		...mapActions('order', ['uploadImage', 'commentOrder']),
		...mapActions('user', ['uploadImage']),
		chooseSecret(index) {
			this.evaluateData[index].isSecret = !this.evaluateData[index].isSecret;
		},
		getStar(val, index) {
			this.evaluateData[index].star = val.value;
		},
		async evalute() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			const id = this.orderDetail.id
			const data = {
				order_type: this.orderDetail.order_type
			}
			let comments = []
			this.orderDetail.items.forEach((item, index) => {
				let imglist = this.evaluateData[index].imgList.length ? this.evaluateData[index].imgList.map(img => img.url) : []
				comments.push({
					body: this.evaluateData[index].evaluateText,
					img_pic: imglist.join(','),
					star: this.evaluateData[index].star,
					product_id: item.product_id
				})
			})
			data.comments = comments
			
			let bodycomplete = data.comments.some(item => Boolean(item.body))
			
			if (!bodycomplete) {
				return uni.showToast({
					icon: 'none',
					title: '请填写评论',
					duration: 2000
				})
			}
			
			try{
				await this.ORDER_COMMENT({id, data})
				uni.navigateTo({
					url: `/pages/cart/result?orderId=${this.orderId}&result=${encodeURIComponent(JSON.stringify({ msg: '评价成功', icon: 'success' }))}`
				});
			}catch(e){
				uni.navigateTo({
					url: `/pages/order/result?orderId=${this.orderId}&result=${encodeURIComponent(JSON.stringify({ msg: '评价失败', icon: 'fail' }))}`
				})
			}
			
			uni.hideLoading()
		},
		ChooseImage(index) {
			uni.chooseImage({
				count: 6, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: async res => {
					uni.showLoading({
						title: '图片上传中'
					})
					
					Promise.all(res.tempFilePaths.map(item => this.UPLOAD_IMG(item))).then(data => {
						uni.hideLoading();
						if (this.imgList.length != 0) {
							this.evaluateData[index].imgList = this.evaluateData[index].imgList.concat(data);
						} else {
							this.evaluateData[index].imgList = data;
						}
					});			
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e, index) {
			uni.showModal({
				title: '',
				content: '确定要删除这张图片吗？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.evaluateData[index].imgList.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		}
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		const { order, id, type } = option;
		this.orderId = id
		if (id && type) {
			const resData = await this.GET_ORDER_DETAIL({id, type})
			if (resData && resData.items) {
				let initData = []
				resData.items.forEach(item => {
					initData.push({
						isSecret: false,
						imgList: [],
						evaluateText: '',
						star: 0,
					})
				})
				this.evaluateData = initData
			}
		}	
	},
	onReady() {
		uni.hideLoading()
	}
};
</script>

<style lang="scss">
.evaluation {
	background-color: #f2f2f2;
	.visible {
		overflow: visible!important;
	}
}
.goods {
	padding: 40upx 32upx;
	font-size: $font-base;
	font-weight: 400;
	background-color: #FFF;
	border-bottom: 24upx solid #F7F7F7;
	image {
		@include wh(160upx, 160upx);
		margin-right: 24upx;
	}
	.num {
		color: $mc-greylight;
		margin-left: 28upx;
	}
}
.form {
	display: block;
}
.evaluate {
	padding: 28upx 32upx;
	@include sc(30upx, $mc-greylight);
	text {
		margin-right: 12upx;
	}
}
.grid.grid-square .cu-tag {
	padding: 7upx 8upx;
	border-radius: 50%;
}
textarea {
	min-height: 260upx;
	padding: 28upx 32upx;
	width: 100%;
}
.solids {
	width: 138upx;
	height: 138upx;
	text-align: center;
	color: #999;
	.icon {
		display: inline-block;
		color: #999;
		margin-top: 30upx;
	}
	.text {
		margin-top: 10upx;
		font-size: 22upx;
	}
}
.secret {
	padding: 26upx 32upx;
	margin-bottom: 72upx;
	radio {
		transform: scale(0.7);
		margin-right: 12upx;
	}
	.secret-text {
		display: inline-block;
		font-size: $font-base;
		text {
			@include sc(22upx, #999999);
			margin-left: 20upx;
		}
	}
}
.btn {
	@include wh(686upx, 96upx);
	font-size: 32upx;
	font-weight: 400!important;
	background: $primary-color!important;
	color: #F5DBC3;
	font-weight: 500;
	margin: 0 32upx;
}
.btn.disabled {
	color: rgba(245,219,195,0.5) !important;
}
.close-wrap {
	position: absolute;
	top: -15upx;
	right: -15upx;
	width: 32upx;
	height: 32upx;	
}
.close-icon {
	position: relative;
	width: 32upx;
	height: 32upx;
	opacity: .5;
}
</style>
