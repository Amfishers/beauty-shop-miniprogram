<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">银行卡列表</block>
		</cu-custom>
		
		<view class="address" v-if="bankcardList && bankcardList.length">
			<view class="address-list flex flex-direction" v-for="(item, index) in bankcardList" :key="item.id" @click="selectCard(item)">
				<view class="contact flex align-center justify-between">
					<view>{{ item.account_name }}</view>
					<view class="sub-text">{{ item.bank_name }}</view>
				</view>
				<view class="location solid-bottom">{{ item.bank_card }}</view>
				<view class="operation flex align-center">
					<view class="operations flex align-center" @click.stop="editCard(item.id)">
						<BIcon class="icon" icon="edit" fontSize="18" />
						<text>编辑</text>
					</view>
					<view class="operations flex align-center" @click.stop="deleteCard(item.id)">
						<BIcon class="icon" icon="delete" fontSize="18" />
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>

		<blank-item type="bankcard" v-else />
		<!-- 点击购买 -->
		<view class="footer-opt">
			<button class="common-btn add-btn" @tap="addCard">
				新增银行卡
			</button>
		</view>
	</view>
</template>

<script>
import blankItem from '../../components/blank.vue'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
	components: {
		blankItem
	},
	data() {
		return {
			cardMode: 'show'
		};
	},
	computed: {
		...mapState({
			bankcardList: state => state.bankcard.bankcardList,
			bankcardTotal: state => state.bankcard.bankcardTotal,
			
			cashSubmit: state => state.bankcard.cashSubmit,  // 是否在提现页面
		}),
	},
	methods: {
		...mapMutations('bankcard', ['SET_SELECTED_BANKCARD']),
		...mapActions('bankcard', ['GET_BANKCARD_LIST', 'DELETE_BANKCARD', 'UPDATE_ADDRESS_DETAIL']),
		addCard() {
			// if(this.type === 'select') {
			//   uni.redirectTo({
			//     url: `/pages/user/addaddress?type=select`
			//   })
			// } else {
			//   }
			uni.navigateTo({
				url: '/pages/my/bankcard'
			});
		},
		editCard(id) {
			uni.navigateTo({
				url: `/pages/my/bankcard?id=${id}`
			});
		},
		async deleteCard(id) {
			try {
				await this.DELETE_BANKCARD(id)
				uni.showToast({
					icon: 'success',
					title: '删除成功',
					duration: 2000,
				})
				await this.GET_BANKCARD_LIST()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		selectCard(item) {
			if (this.cashSubmit) {
				this.SET_SELECTED_BANKCARD(item)
				uni.navigateBack()
			}
		}
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		// this.$hasLogin(); // 检查登陆状态
		const type = option && option.type
		if (type && type === 'select') {
			this.cardMode = 'select'
		}
		
		await this.GET_BANKCARD_LIST()
		uni.hideLoading()		
	}
};
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}	
.address {
	margin: 28upx 32upx 124upx 32upx;
	.address-list {
		width: 686upx;
		min-height: 200upx;
		@include sc($font-lg, $mc-grey);
		background-color: $mc-white;
		padding: 28upx;
		font-weight: 500;
		line-height: 37upx;
		border-radius: 16upx;
		margin-bottom: 28upx;
		.location {
			font-size: 26upx;
			font-weight: 400;
			padding-bottom: 24upx;
			margin: 24upx 0;
		}
		.operation {
			flex-direction: row-reverse;
		}
		.operation-radio {
			radio {
				.wx-radio-input {
					width: 40upx!important;
					height: 40upx!important;
				}	
			}
			text {
				@include sc($font-sm, $mc-greylight);
				margin-left: 12upx;
			}
		}
		.operations {
			margin-left: 64upx;
			image {
				@include wh(36upx, 36upx);
				margin-right: 12upx;
			}
			text {
				@include sc($font-sm, $mc-greylight);
			}
			.iconfont {
				display: inline-block;
				margin-right: 12upx;
			}
		}
		.sub-text {
			font-size: 28upx;
			color: #999;
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
