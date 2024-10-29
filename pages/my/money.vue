<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">余额</block>
		</cu-custom>
		
		<view class="balance">
			<view class="balance-box flex justify-between align-center">
				<image :src="image_path + '/withdraw.png'" mode="" class="img"></image>
				<view class="balance-box__count">
					<view class="num">
						¥ <text class="price">{{ balance || 0 }}</text>
					</view>
					<view class="desc">
						可用余额
					</view>
				</view>
				<view class="balance-box__count">
					<view class="num">
						¥ <text class="price">{{ earnings  || 0}}</text>
					</view>
					<view class="desc">
						累计收益
					</view>
				</view>
			</view>
			<view class="balance-btn">
				<button class="cu-btn common-btn round btn" :disabled="!balance" @tap="moneyHandler">提现</button>
			</view>
		</view>
		
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations,mapGetters  } from 'vuex'

export default {
	data() {
		return {
			image_path: this.$cfg.image_path,
		}
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
		}),
		balance() {
			return this.currUser.available_amounts || 0
		},
		earnings() {
			return this.currUser.analyse.total_incomes || 0
		},
	},
	methods: {
		moneyHandler() {
			uni.navigateTo({
				url: '/pages/my/cash_out'
			})
		},
	}
}
</script>

<style lang="scss">
.balance {
	border-top: 1upx solid #E5E5E5;
	padding: 64upx 32upx;
	
	&-box {
		width: 100%;
		height: 300upx;
		padding: 90upx 60upx;
		border-radius: 40upx;
		background: linear-gradient(90deg, rgba(236,197,160,1) 0%,rgba(202,147,94,1) 100%);
		
		.img {
			width: 96upx;
			height: 96upx;
		}
		
		&__count {
			color: #FFF;
			text-align: center;
			.num {
				font-size: 24upx;
			}
			.price {
				font-size: 40upx;
			}
			.desc {
				margin-top: 14upx;
				font-size: 26upx;
			}
		}
	}
	
	&-btn {
		margin-top: 60upx;
		.btn {
			width: 100%;
			height: 96upx;
			border-radius: 5000upx;
			line-height: 96upx;
			font-size: 32upx;
			font-weight: 400;
			background-color: $primary-color!important;
			color: $secondary-color!important;
		}
	}
}
</style>
