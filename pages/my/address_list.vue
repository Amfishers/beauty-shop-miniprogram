<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">我的收货地址</block>
		</cu-custom>
		
		<view class="address" v-if="addressList && addressList.length">
			<radio-group class="block" @change.stop="RadioChange">
				<view class="address-list flex flex-direction" v-for="(item, index) in addressList" :key="item.id" @tap="selectAddr(item)">
					<view class="contact flex align-center justify-between">
						<view>{{ item.name }}</view>
						<view>{{ item.phone }}</view>
					</view>
					<view class="location solid-bottom">{{ item.detail_address }}</view>
					<view class="operation flex align-center justify-between">
						<view class="operation-radio">
							<label class="flex align-center">
								<radio class="black" :class="item.is_default == 1 ? 'checked' : ''" :checked="item.is_default == 1 ? true : false" :value="index" />
								<text>设为默认</text>
							</label>
						</view>
						<view class="flex">
							<view class="operations flex align-center" @click.stop="editAddr(item.id)">
								<BIcon class="icon" icon="edit" fontSize="18" />
								<text>编辑</text>
							</view>
							<view class="operations flex align-center" @click.stop="deleteAddr(item.id)">
								<BIcon class="icon" icon="delete" fontSize="18" />
								<text>删除</text>
							</view>
						</view>
					</view>
				</view>
			</radio-group>
		</view>

		<blank-item :type="'address'" v-else />
		<!-- 点击购买 -->
		<view class="footer-opt">
			<button class="common-btn add-btn" @tap="addAddr">
				新增收货地址
			</button>
		</view>
	</view>
</template>

<script>
import blankItem from '../../components/blank.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
export default {
	components: {
		blankItem
	},
	data() {
		return {
			addrMode: 'show'
		};
	},
	computed: {
		...mapState({
			addressList: state => state.address.addressList,
			addressTotal: state => state.address.addressTotal,
			
			orderSubmit: state => state.order.orderSubmit,  // 是否在提交订单页面
		}),
	},
	methods: {
		...mapMutations('address', ['SET_CART_SELECT_ADDR']),
		...mapActions('address', ['GET_ADDRESS_LIST', 'DELETE_ADDRESS', 'UPDATE_ADDRESS_DETAIL']),
		async RadioChange(e) {
			const index = e.detail.value;
			const item = this.addressList[index]
			if (item.is_default == 0) {
				const id = item.id
				await this.UPDATE_ADDRESS_DETAIL({id, data: {is_default: 1 }})
				await this.GET_ADDRESS_LIST()
			}
		},
		addAddr() {
			// if(this.type === 'select') {
			//   uni.redirectTo({
			//     url: `/pages/user/addaddress?type=select`
			//   })
			// } else {
			//   }
			uni.navigateTo({
				url: '/pages/my/address'
			});
		},
		editAddr(id) {
			uni.navigateTo({
				url: `/pages/my/address?id=${id}`
			});
		},
		async deleteAddr(id) {
			try {
				await this.DELETE_ADDRESS(id)
				uni.showToast({
					icon: 'success',
					title: '删除成功',
					duration: 2000,
				})
				await this.GET_ADDRESS_LIST()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		selectAddr(item) {
			if (this.orderSubmit) {
				this.SET_CART_SELECT_ADDR(item)
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
		if (type && type == 'select') {
			this.addrMode = 'select'
		}
		
		await this.GET_ADDRESS_LIST()
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
		min-height: 288upx;
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
