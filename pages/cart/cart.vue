<template>
	<view class="cart">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">购物车</block>
		</cu-custom>
		
		<view class="cart-main">
			<view class="cart-hd fixed" :style="{'top': `${customBar}px`}">
				<view class="cart-hd__main flex align-center justify-between">
					<text class="text">购物车</text>
					<view class="default-btn" v-if="!disableSelectAll" @tap="isedit = !isedit">{{ isedit ? '完成' : '管理'}}</view>
				</view>
			</view>
			
			<view v-if="cartListData.length" class="cart-list__main">
				<view class="cart-list" v-for="(store, index) in cartListData" :key="index">
					<view class="cart-list__item">
						<label class="radio flex align-center" @tap="storeCheckHandler(store, index)">
							<checkbox class="checkbox" :value="store.id" :checked="store.check" />
							<text class="cart-list__store-name">{{ store.name }}</text>
						</label>
						
						<view class="cart-list__box">
							<view class="flex align-center" v-for="(item, cindex) in store.products" :key="cindex">
								<label @tap="itemCheckHandler(item, index)"><checkbox :checked="item.check" class="checkbox" ></checkbox></label>
								<view class="cart-item">
									<view class="cart-item__img">
										<image class="cart-item__img-main" :src="item.product_image" mode=""></image>
									</view>
									<view class="cart-item__info">
										<view class="cart-item__title">
											{{ item.product_name }}
										</view>
										<view class="cart-item__opt">
											<view class="cart-item__desc">
												<template v-if="item.descript && item.descript.length">
													已选：{{ (item.descript && item.descript.join(';')) || '-' }}
												</template>
											</view>
											<view class="flex align-center justify-between">
												<view class="cart-item__price">
													<template v-if="isPlus">
														¥<text class="cart-item__price-main">{{ item.product_plus_price }}</text>
														<text class="cart-item__originprice">¥{{ item.product_price }}</text>
													</template>
													<template v-else>
														¥<text class="cart-item__price-main">{{ item.product_price }}</text>
													</template>
												</view>
												<view class="cart-item__num">
													<template v-if="isedit"><uniNumberBox :min="0"  :value="item.product_num" :max="item.spec.stock" @change="changeNum($event,item,storeIndex)"/></template>
													<view v-else="!isedit">x {{ item.product_num }}</view>
												</view>
											</view>

										</view>
									</view>
								</view>
								
							</view>
						</view>
					</view>
				</view>
				
				<view class="cart-footer flex align-center justify-between">
					<view class="flex align-center">
						<label class="cart-footer__label flex align-center" @tap="checkAllHandler">
							<checkbox class="checkbox" :checked="isCheckedAll"></checkbox>
							<text class="text">全选</text>
						</label>
						<view v-if="!isedit" class="cart-footer__total">合计：<text class="cart-footer__price third-color">¥ {{  Number(totalPrice).toFixed(2) }}</text></view>
					</view>
					<template v-if="isedit"><view class="cart-footer__submit cart-delete" @tap="deleteCart">删除</view></template>
					<template v-else><view class="cart-footer__submit primary-btn" @tap="goBuy">结算</view></template>
				</view>
			</view>
		
			<view v-else class="flex align-center justify-center" >
				<!-- 购物车为空 -->
				<navigator class="cart-empty" url="/pages/index/index" open-type="switchTab" hover-class="none">购物车还是为空去逛逛</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters  } from 'vuex'
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import CartServices from '@/services/cart.js'

export default {
	components: {
		uniNumberBox,
	},
	data() {
		return {
			isedit: false,
			disableSelectAll: false,
			total: 0,
		}
	},
	computed: {
		...mapState({
			cartListData: state => state.cart.cartListData,
			customBar: state => state.customBar,
		}),
		...mapGetters({
			isCheckedAll: 'cart/isCheckedAll',
			totalPrice: 'cart/totalPrice',
			selectedList: 'cart/selectedList',
			isPlus: 'my/isPlus',
		}),
		// 购物车数量
		cartNum() {
			let num = 0
			if (this.cartListData.length) {
				this.cartListData.forEach(store => {
					store && store.products.length && store.products.forEach(pro => num++)
				})
			}
			return num
		},
	},
	methods: {
		...mapMutations({
			'SET_STORE_CHECK': 'cart/SET_STORE_CHECK',
			'SET_ALLCHECK': 'cart/SET_ALLCHECK',
			'SET_ITEM_CHECK': 'cart/SET_ITEM_CHECK',
		}),
		...mapActions({
			GET_CART_LIST: 'cart/GET_CART_LIST',
			PATCH_CART_NUM: 'cart/PATCH_CART_NUM',
			SETTLE_CART: 'cart/SETTLE_CART',
		}),
		storeCheckHandler(store, index) {
			// 店铺点击之后，整单选中
			this.SET_STORE_CHECK({store, index})
		},
		checkAllHandler() {
			// 全选
			this.SET_ALLCHECK(this.isCheckedAll)
		},
		itemCheckHandler(item, storeIndex) {
			// 某个产品单选
			// item 当前产品
			// storeIndex 店铺的索引值
			this.SET_ITEM_CHECK({item, storeIndex})
		},
		async changeNum(e, item, storeIndex){
			if (item.product_num == e) return
			let carts = []
			carts.push({
				id: item.id,
				product_num: e
			})
			try{
				await this.PATCH_CART_NUM({ carts })
				await this.GET_CART_LIST()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		// 删除
		async deleteCart() {
			
			if (this.selectedList.length) {
				let carts = []
				this.selectedList.forEach(item => {
					carts.push({
						id: item.id,
						product_num: 0
					})
				})
				
				try {
					await this.PATCH_CART_NUM({carts})
					await this.GET_CART_LIST()
				}catch(e) {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}
			}
			
			this.isedit = false
		},
		// 结算
		async goBuy() {
			if (!this.selectedList.length) {
				return uni.showToast({
					icon: 'none',
					title: '请勾选商品',
					duration: 2000
				})
			}
			let idArr = this.selectedList.map(item => item.id)
			const data = { carts: idArr }
			
			try{
				await this.SETTLE_CART(data)
				uni.navigateTo({
					url: '/pages/cart/submit'
				})
				
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
	},
	async onLoad(option) {
		// 隐藏底部导航栏
		uni.hideTabBar()
		
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
				
		try{
			await this.GET_CART_LIST()
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
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
.cart {
	&-main {
		
	}
	
	&-empty {
		padding-top: 300upx;
		text-align: center;
		font-size: 28upx;
		color: #666;
	}
	
	&-hd {
		padding: 24upx;
		width: 100%;
		background-color: #F7F7F7;
		z-index: 1024;
		
		&__main {
			.text {
				color: #666;
				font-size: 28upx;
				line-height: 44upx;
			}
			.default-btn {
				height: 44upx;
				width: 104upx;
				border: 1px solid #CA935E;
				color: #CA935E;
				line-height: 44upx;
				font-size: 28upx;
				border-radius: 22upx;
				text-align: center;
			}
		}
	}
	
	&-list {
		margin-bottom: 24upx;
		border: 16upx;
		&__main {		
			padding: 92upx 24upx 144upx;
		}
		&__store {
			padding: 0 24upx;
			&-name {
				padding-left: 24upx;
				@include ellipsis;
			}
		}
		&__item {
			padding: 24upx;
			background-color: #FFF;
			border-radius: 16upx;
		}
	}
	
	// 卡片
	&-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24upx;
		border-radius: 24upx;
		&__img {
			position: relative;
			width: 180upx;
			height: 180upx;
			
			&-main {
				@include absolute-t-l(0,0);
				width: 100%;
				height: 100%;
			}
		}
		
		&__info {
			width: calc(100% - 180upx);
			padding-left: 20upx;
			background-color: #FFF;
		}
		
		&__title {
			font-size: 28upx;
			line-height: 40upx;
			height: 80upx;
			@include ellipsisMultiline(2);
		}
		
		&__badge {
			display: inline-block;
			vertical-align: 2px;		
			padding: 0 4px;
			margin-right: 6upx;		
			border-radius: 14upx;
			line-height: 28upx;
			font-size: 16upx;
		}
		
		&__opt {
			margin-top: 22upx;
		}
		
		&__price {
			font-size: 20upx;
			line-height: 28upx;
			&-main {
				font-size: 34upx;
				line-height: 48upx;	
			}
		}
		
		&__originprice {
			padding-left: 16upx;
			text-decoration: line-through;
			color: #999999;
			font-size: 24upx;
			line-height: 34upx;
		}
		
		&__desc {
			color: #999999;
			font-size: 24upx;
			line-height: 34upx;
			@include ellipsisMultiline(1);
		}
	}	
	
	&-delete {
		height: 80upx;
		width: 192upx;
		border: 1px solid $primary-color;
		border-radius: 40upx;
		color: $primary-color;
		line-height: 80upx;
		text-align: center;
	}
	
	// 底部
	&-footer {
		position: fixed;
		padding: 20upx 24upx;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120upx;
		width: 100%;
		background-color: #FFF;
		z-index: 1024;
		
		&__label {
			font-size: 28upx;
			.text {
				margin-left: 8upx;
			}
		}
		
		&__total {
			margin-left: 32upx;
			font-size: 32upx;
		}
		
		&__submit  {
			width: 192upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			font-size: 30upx;
			border-radius: 40upx;
		}
	}
	.checkbox .wx-checkbox-input{
		width: 40upx!important;
		height: 40upx!important;
	}	
}
</style>
