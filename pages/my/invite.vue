<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">邀请有礼</block>
		</cu-custom>
		
		<view class="invite">
			<image class="banner" src="../../static/invite.png" mode=""></image>
			
			<view class="invite-content">
				
				<view v-for="(coupons, index) in couponsList" :key="index">
					<view class="coupons-popup__item flex">
						<view class="coupons-popup__item-type  text-center">
							<view class="price">
								¥ <text class="text">{{ coupons.amount }}</text>
							</view>
							<view class="condition">
								{{ coupons.min_point > 0 ? '满' + coupons.min_point + '可用' : '无门槛' }}
							</view>
						</view>
						<view class="coupons-popup__item-info">
							<view class="coupon-header">
								<text class="cu-tag" :class="coupons.use_status > 0 ? 'expired' : 'line-mc-primary'">{{ coupons.amount_type == 0 ? '优惠券' : '红包' }}</text>
								<text class="name">{{ coupons.name }}</text>
							</view>
							<view class="note">
								{{ coupons.note }}
							</view>
							<view class="opt flex align-center justify-between">
								<text class="date">{{ coupons.start_time && timeHandler(coupons.start_time) }} - {{ coupons.end_time && timeHandler(coupons.end_time) }}</text>
								<!-- <text class="btn primary-btn" @tap="drawCoupons(coupons)">
									{{ coupons.received_count ? '已领取' : '立即领取'}}
								</text> -->
							</view>
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="footer-opt">
				<button class="common-btn add-btn" open-type="share" >
					给我朋友发福利
				</button>
			</view>

		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters  } from 'vuex'
import counponService from '@/services/coupons.js'
import Timer from '@/utils/time.js'

export default {
	data() {
		return {
			image_path: this.$cfg.image_path,
			couponsList: [],
			page: 1,
			total: 0,
		};
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			userInfo: state => state.user.userInfo,
		}),
		...mapGetters({
			userId: 'my/userId',
		}),
	},
	methods: {
		async getCouponList() {
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			
			const data = {
				type: 'register'
			}
			
			try{
				const resData = await counponService.getCouponsList(data)
				this.couponsList = resData.data.items
				this.page = resData.data.curr_page
				this.total = resData.data.total_count
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
			uni.hideLoading()
		},		
		timeHandler(timeStr) {
			if (!timeStr) return ''
			
			const timeData = new Date(timeStr)
			
			return Timer.dateFormat(timeData, '{Y}.{MM}.{DD}')
		},		
	},
	onLoad(){
		// this.$hasLogin(); // 检查登陆状态
		this.getCouponList()
	},
	onShareAppMessage() {
		let path = `/pages/index/coupon?shareId=${this.userId}`
		
		if (this.couponsList && this.couponsList.length) {
			path += `&id=${this.couponsList[0].id}`
		}
		// 暂时只有一张券，所以分享出 id 
		return {
			path
		};
	}
};
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.invite {
	.banner {
		display: block;
		width: 100%;
	}
	
	&-content {
		padding: 32upx;
	}
	
	.coupons {
		&-popup {
			&__bd {
				padding: 0 32upx;
				min-height: 700upx;
				max-height: 800upx;
				&-main {
					overflow-y: auto;
				}
			}
			&__item {
				margin-bottom: 40upx;
				height: 194upx;
				background-color: #FFF;
				overflow: hidden;
				// filter: grayscale(100%);
				&:first-child {
					margin-top: 40upx;
				}
				&:last-child {
					margin-bottom: 40upx;
				}
				
				&-type {
					position: relative;
					width: 188upx;
					background-color: $primary-color;
					text-align: center;
					&::before {
						content: '';
						position: absolute;
						top: -10upx;
						right: -10upx;
						border-left: 20upx solid #FFF;
						border-bottom: 20upx solid #FFF;
						border-radius: 100%;
					}
					&::after {
						content: '';
						position: absolute;
						bottom: -10upx;
						right: -10upx;
						border-left: 20upx solid #FFF;
						border-top: 20upx solid #FFF;
						border-radius: 100%;
					}
					.price {
						margin-top: 25upx;
						color: #FFF;
						font-size: 28upx;
						.text {
							font-size: 72upx;
							line-height: 60upx;
						}
					}
					.condition {
						display: inline-block;
						text-align: center;
						margin: 24upx 12upx 0;
						padding: 0 12upx;
						line-height: 40upx;
						font-size: 24upx;
						color: $primary-color;
						background:linear-gradient(90deg,rgba(245,219,195,1) 0%,rgba(202,147,94,1) 100%);
						@include ellipsis;
					}
				}
				
				&-info {
					flex: 1;
					padding: 28upx;
					overflow: hidden;
					.coupon-header {
						height: 80upx;
						@include ellipsisMultiline(2);
						.cu-tag {
							vertical-align: 2upx;
							height: 40upx;
							padding: 0 8upx;
							margin-right: 8upx;
							&::after {
								border-radius: 50upx;
							}
						}
						.name {
							font-size: 32upx;
							line-height: 40upx;
							font-weight: 500;
						}						
					}
					.note {
						font-size: 24upx;
						color: #D41F14;
						line-height: 38upx;
						@include ellipsis;
					}
					.date {
						color: #999;
						font-size: 24upx;
					}
					.btn {
						padding: 0 12upx;
						display: inline-block;
						line-height: 48upx;
						border-radius: 24upx;
						font-size: 24upx;
					}
				}
				
				// 已领取
				&--received {
					.coupons-popup__item-type {
						background: linear-gradient(328deg,rgba(177,187,196,1) 0%,rgba(209,216,222,1) 100%);
						.condition {
							background: #FFF;
						}
					}
					.coupons-popup__item-info {
						.btn {
							color: #FFF;
							background: linear-gradient(328deg,rgba(177,187,196,1) 0%,rgba(209,216,222,1) 100%);
						}
					}
				}
				
				// 已使用
				&--disabled {
					
				}	
			}
		}
	}


	.invite-btn {
		@include wh(620upx, 130upx);
		background-color: $mc-white;
		border-radius: 16upx;
		margin-top: 28upx;
		button {
			@include wh(540upx, 77upx);
			background: rgba(250, 121, 118, 0.06);
			border-radius: 16upx;
			@include sc($font-sm, $mc-primary);
		}
	}
}

.footer-opt {
	position: fixed;
	bottom: 12px;
	left: 0;
	right: 0;
	z-index: 10;
}
.add-btn {
	margin: 0 32upx;
	height: 98upx;
	line-height: 98upx;
	text-align: center;
	color: $secondary-color;
	background-color: $primary-color;
	font-weight: 400;
	border-radius: 54upx;
}

</style>
