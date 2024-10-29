<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">商品详情</block>
		</cu-custom>

		<view v-if="goodsDetail.name">
			<!-- swiper goods img -->
			<view class="swiper-container" v-if="goodsImgList">
				<swiper @change="swiperChange" circular>
					<swiper-item v-for="item in goodsImgList" :key="item">
						<view class="swiper-item">
							<image :src="item" class="swiper-img"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="dots">
					<text class="current">{{ current + 1 }}</text>
					/{{ goodsImgList ? goodsImgList.length : '' }}
				</view>
			</view>
			<!-- goods bar -->
			
			<!-- 秒杀 -->
			<template v-if="seckillData">
				<view class="seckill">
					<view class="seckill-left">
						<view class="title">
							秒杀价 <text class="origin">￥{{ seckillData.old_price }}</text>
						</view>
						<view class="content flex">
							<view class="price">
								￥ <text class="now_price">{{ seckillData.promotion_price }}</text>
							</view>
							<view class="limit">
								限量：{{ seckillData.stock }}件
							</view>
						</view>
					</view>
					<view class="seckill-right">
						<view class="soon">
							<template v-if="seckillStatus === 'unstart'">即将开始</template>
							<template v-if="seckillStatus === 'duration'">限时秒杀</template>
							<template v-if="seckillStatus === 'end'">限时秒杀</template>
						</view>
						<view class="time">
							{{ currTime }}
						</view>
					</view>
				</view>
				<view class="goods-bar section">
					<view class="flex align-center justify-between">
						<view class="name flex-sub">{{ goodsDetail.name }}</view>
						<!-- 分享按钮 -->
						<button class="share-btn" open-type="share"><BIcon icon="export" /></button>
					</view>
					<view>{{ goodsDetail.description }}</view>
				</view>
			</template>
			<template v-else>
				<!-- 原价 -->
				<view class="goods-bar section">
					<view class="flex align-center justify-between header solid-bottom">
						<view class="price flex-sub" v-if="isPlus && (goodsDetail.plus_price) < parseFloat(goodsDetail.price)">
							<text class="now"> ￥<text class="now_price">{{ goodsDetail.price }}</text></text>
							<text class="old third-color">￥{{ goodsDetail.plus_price }} </text>
							<image :src="image_path + '/plus/plus.png'" class="plus"></image>
							<text class="old"> <text>￥{{ goodsDetail.market_price }}</text> </text>
						</view>
						<view class="price flex-sub" v-else>
							<text class="now">￥ <text class="now_price">{{ goodsDetail.price }}</text></text>
							<text class="old" style="font-size: 26upx;"><text>￥{{ goodsDetail.market_price }}</text></text>
						</view>

					</view>
					<view class="name">{{ goodsDetail.name }}</view>
					<view class="flex align-center justify-between">
						<text>{{ goodsDetail.description }}</text>
						<view class="cu-tag round" v-if="isServiceGoods">已服务 {{ goodsDetail.total_sale }} 人</view>
					</view>
				</view>
			</template>
			
			<!-- 领券/之类说明 -->
			<view class="section option">
				<!-- 领券 -->
				<view class="option-item flex align-center">
					<label class="label">领券</label>
					<view class="content flex-sub flex align-center" @tap="openCouponsPopup">
						<template v-if="eableCoupons.length">
							<view class="flex-sub">
								<view v-for="coupons in eableCoupons" :key="coupons.id">
									<view class="get-coupons primary-btn">
										￥{{ coupons.amount }}
									</view>
								</view>
							</view>
							<view class="other" >
								<view class="other-icon">
									<BIcon class="iconfont" icon="omit" fontSize="6"/>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="flex-sub">
								暂无可领优惠券
							</view>
						</template>
					</view>
				</view>
				<!-- 发货 -->
				<view class="option-item flex align-center" v-if="isPhysicalGoods">
					<label class="label">发货</label>
					<view class="content flex-sub">
						<view class="flex align-center">
							<BIcon icon="location-outline" />{{ goodsDetail.supply_address }} | {{ goodsDetail.free_shipping ? '免运费' : '不包邮' }}
						</view>
					</view>
					<view class="other" v-if="goodsDetail.total_sale">
						已服务 {{ goodsDetail.total_sale }} 人
					</view>
				</view>
				<!-- 保障 -->
				<view class="option-item flex align-center">
					<label class="label">保障</label>
					<view class="content flex-sub">
						{{ isServiceGoods ? '· 正品保障 · 7天无理由' : '· 正规资质 · 随时退 · 无额外收费' }} 
					</view>
					<view class="other" v-if="isServiceGoods && goodsDetail.total_sale">
						已服务 {{ goodsDetail.total_sale }} 人
					</view>
				</view>
				<!-- 选择规格 -->
				<view class="option-item flex align-center" v-if="isPhysicalGoods" @tap="openSizePopup">
					<label class="label">已选</label>
					<view class="content flex-sub">
						{{ selectArr.some(item => Boolean(item)) ? selectArr.join(';') : '请选择规格'}}
					</view>
					<view class="other">
						<view class="other-icon">
							<BIcon class="iconfont" icon="right" font-size="14"/>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 适用门店  虚拟商品才有 -->
			<view class="section store" v-if="goodsStores.total && isServiceGoods">
				<view class="section_title flex align-center justify-between">
					<text class="title">适用机构( {{ goodsStores.total }} 家)</text>
					<more v-if="goodsStores.total > 1" :url="'/pages/store/list?product=' + goodsDetail.id + '&type=1'" moreText="查看更多" style="display: block;"/>
				</view>
				<view class="bg-white store_list">
					<view v-for="(store, sIndex) in showGoodsStores" :key="store.id" class="store-list__item">
						<CardServe
							:url="'/pages/store/store?type=1&id=' + store.id"
							:img="store.cover_pic"
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

			<!-- 用户评价 -->
			<view class="section comment">
				<view class="section_title">
					<text class="title">用户评价（{{ goodsComments.total_count || 0 }}）</text>
					<navigator url="/pages/goods/comment" v-if="goodsComments.total_count"><text class="subtitle">好评度 <text class="third-color">{{goodsComments.extra.good_comment_rate}}%</text></text></navigator>
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
						<view class="comment-box__content">{{ item.body }}</view>
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

			<!-- 大家问 -->
			<view class="section allask">
				<view class="section_title">
					<text class="title">大家问（{{ goodsConsult.total_count || 0 }}）</text>
				</view>
				
				<view class="allask-wrap">
					<template v-if="goodsConsultList.length">
						<view v-for="(ask, index) in goodsConsultList" :key="ask.id">
							<navigator url="/pages/goods/consult" hover-class="none">
								<view class="flex align-center justify-between allask-item">
									<view class="flex align-center allask_title">
										<view class="allask_title-icon">
											<BIcon icon="bubble" />
										</view>
										<text class="allask_title-text">{{  ask.ask }}</text>
									</view>
									<text class="allask_num">
										{{ ask.items_count }}个回答
									</text>
								</view>
							</navigator>
						</view>
					</template>
					<template v-else>
						<view class="text-center">
							暂无问答
						</view>
					</template>
				</view>
				
				<view class="morebtn">
					<navigator url="/pages/goods/consult" hover-class="none">
						<view class="morebtn_more">
							{{goodsConsultList.length ? '查看全部问答' : '去提问'}}
						</view>
					</navigator>
				</view>
			</view>
			<!-- 大家问 结束 -->
			
			<!-- 商品详情 -->
			<view class="panel details">
				<view class="section_title"><text class="title">商品详情</text></view>
				<view class="bg-white-heavy"><rich-text :nodes="goodsDetail.body | formatRichText" /></view>
			</view>
			
			<!-- 点击购买 -->
			<view :class="{'footer-opt': true, 'opt-bar': isPhysicalGoods}">
				<template v-if="isServiceGoods">
					<view class="buy-btn" @click="goBuy">
						立即购买
					</view>
				</template>
				<template v-else>
					<view v-if="seckillData" class="opt-bar__main opt-bar__seckill">
						<view class="opt-bar__btn flex justify-between align-center">
							<view v-if="seckillStatus === 'unstart'" class="common-btn btn tocart disabled">
								即将开始
							</view>
							
							<view v-if="seckillStatus === 'duration'" class="common-btn btn tocart" @click="goBuy('seckill')">
								立即抢购
							</view>
							
							<view v-if="seckillStatus === 'end'" class="common-btn btn tocart disabled">
								立即抢购
							</view>
							
							<view class="common-btn btn tobuy" @tap="goBuy">
								原价购买
							</view>
						</view>
					</view>
					<view v-else class="opt-bar__main flex justify-between align-center">
						<navigator url="/pages/cart/cart" open-type="switchTab" hover-class="none">
							<view class="cart_box flex justify-center align-center">
								<view class="cart_main">
									<view class="badge">{{ cartNum }}</view>
									<BIcon icon="cart" font-size="24"></BIcon>
									<text class="font">购物车</text>
								</view>
							</view>
						</navigator>
						<view class="opt-bar__btn flex align-center justify-between">
							<view class="common-btn btn tocart" @tap="addCart">
								加入购物车
							</view>
							<view class="common-btn btn tobuy" @tap="goBuy">
								立即购买
							</view>
						</view>
					</view>
				</template>
			</view>
			
			
			<!-- 优惠券 -->
			<uniPopup :mask-click="true" type="bottom" ref="couponsPopup">
				<view class="popup-main">
					<view class="popup-hd flex align-center justify-between">
						<text>可领优惠券 （领取后用于购买商品优惠）</text>
						<view class="" @tap="closeCpuponsPopup">
							<BIcon icon="cancel" font-size="20"/>
						</view>
					</view>
					<scroll-view scroll-y class="coupons-popup__bd">
						<view v-for="(coupons, index) in eableCoupons" :key="index">
							<view class="coupons-popup__item flex" :class="{'coupons-popup__item--received': coupons.received_count}">
								<view class="coupons-popup__item-type">
									<view class="price">
										¥ <text class="text">{{ coupons.amount }}</text>
									</view>
									<view class="condition text-center">{{ coupons.coupon.min_point > 0 ? '满' + coupons.coupon.min_point + '可用' : '无门槛' }}</view>
								</view>
								<view class="coupons-popup__item-info">
									<view class="name">{{ coupons.name }}</view>
									<view class="opt flex align-center justify-between">
										<text class="date">{{ coupons.start_time && timeHandler(coupons.start_time) }} - {{ coupons.end_time && timeHandler(coupons.end_time) }}</text>
										<text class="btn primary-btn" @tap="drawCoupons(coupons)">
											{{ coupons.received_count ? '已领取' : '立即领取'}}
										</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</uniPopup>

			<!-- 商品规格 -->
			<uniPopup :mask-click="true" type="bottom" ref="sizePopup">
				<view class="popup-size" :style="{height: phoneHeight * 0.75 + 'px'}">
					<view class="popup-size__cancel" @tap="closeSizePopup">
						<BIcon icon="cancel" font-size="20"/>
					</view>
					<view class="popup-size__main">
						<!-- 商品信息 -->
						<view class="popup-size__item popup-size__goods" :class="{ 'popup-size__virtual': isPhysicalGoods}">
							<view class="image">
								<image class="image-main" :src="currSelectDetail.cover_pic" mode=""></image>
							</view>
							<view class="popup-size__goods-info">
								<view class="price">
									¥ <text class="text">{{ currSelectDetail.price }}</text>
								</view>
								<view class="choose">
									<text class="text">已选择</text>
									<view class="name">
										{{ hasSelectedSize ? selectArr.join(';') : '请选择规格'}}
									</view>
								</view>
							</view>
						</view>
						<!-- 实物商品 -->
						<scroll-view scroll-y="true" style="height: calc(100% - 156upx);overflow: hidden;">
							<view class="popup-size__physical" v-if="isPhysicalGoods">
								<!-- 商品规格 -->
								<view class="popup-size__item popup-size__size" v-for="(produceItem, index) in sizeData" :key="index">
									<label class="label">{{ produceItem.name }}</label>
									<view 
										class="size-item" 
										v-for="(res, resIndex) in produceItem.item" 
										:key="resIndex" 
										@tap="selectItem(res.name,index,$event,resIndex)" 
										:class="[res.isShow ? '': 'disabled',subIndex[index] == resIndex? 'active' : '']"
									>
										{{ res.name }}
									</view>
								</view>
								<!-- 商品数量 -->
								<view class="popup-size__item popup-size__num">
									<label class="label">数量</label>
									<view class="text-right">
										<uniNumberBox :min="1" :value="buyNum" :max="currSelectDetail.stock" @change="numboxHandler" />
									</view>
								</view>
							</view>
							<view class="popup-size__virtual" v-else>
								<view class="popup-size__item state">
									<!-- <view class="text-bold label">项目说明</view>
									<view style="margin-top: 24upx;">
										<text>有效期</text>
										<text>2020-05-17-2020-12-31</text>
									</view> -->
									<view style="margin-top: 24upx;">
										<view class="text-bold label">
											服务说明：
										</view>
										<view class="" style="margin-top: 12upx;">
											· 提前1天预约
										</view>
										<view class="" style="margin-top: 12upx;">
											· 服务时长30-60分钟
										</view>
									</view>
								</view>
								<view v-if="false" class="popup-size__item flex justify-between align-center">
									<label class="label">数量</label>
									<view class="text-right">
										<uniNumberBox :min="1" :value="buyNum" :max="goodsDetail.stock" @change="numboxHandler" />
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					
					<!-- 确定 -->
					<button class="popup-size__submit buy-btn" :disabled="confirmLoading && hasSelectedSize" @tap="orderConfirm">
						确定
					</button>
				</view>
			</uniPopup>
			
			
			<!-- 二维码弹窗 -->
			<!-- <uni-popup ref="showQcCode" :mask-click="true">
				<view class="uni-image">
					<image class="image" src="/static/opt/qc_code.jpg" mode="scaleToFill" />
					<view class="uni-image-close" @click="cancel_popup"><uni-icons type="clear" color="#fff" size="30" /></view>
				</view>
			</uni-popup> -->
		</view>
		
		
		<view v-else><blank-item :type="'goods'" /></view>
	</view>
</template>

<script>
import BRate from '@/components/rate/index.vue'
import CardServe from '@/components/card/cardserve.vue'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import { mapActions, mapState, mapMutations,mapGetters  } from 'vuex'
import uniNumberBox from "@/components/uni-ui/uni-number-box/uni-number-box.vue"
import Timer from '@/utils/time.js'
import CouponsServices from '@/services/coupons.js'
import GoodsServices from '@/services/goods.js'
import more from '@/components/more/index.vue'
import { isBeforeTime, isAfterTime } from '@/utils/helper.js'

export default {
	components: { 
		BRate,
		CardServe,
		uniPopup,
		uniNumberBox,
		more,
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			goodsDetail: state => state.goods.goodsDetail,
			goodsConsult: state => state.goods.goodsConsult,
			goodsComments: state => state.goods.goodsComments,
			goodsCoupons: state => state.goods.goodsCoupons,
			goodsTotalComments: state => state.goods.goodsTotalComments,
			goodsCommentRate: state => state.goods.goodsCommentRate,
			
			cartListData: state => state.cart.cartListData,
			
			couponsList: state => state.goods.couponsList,
			goodsStores: state => state.goods.goodsStores,
		}),
		isPlus() {
			return this.currUser.is_plus
		},
		isPhysicalGoods() {
			return this.goodsDetail.product_type == 0
		},
		isServiceGoods() {
			return this.goodsDetail.product_type == 1
		},
		// 能领取的优惠券
		eableCoupons() {
			if (!this.couponsList.items) return []
			
			return this.couponsList.items
		},
		// 是否有规格
		isHasSpec() {
			return this.goodsDetail.attribute_list && this.goodsDetail.attribute_list.length
		},
		goodsImgList() {
			return this.goodsDetail.img_list
		},
		goodsConsultList() {
			let consultList = this.goodsConsult && this.goodsConsult.items

			if (!consultList) return []
			if (!consultList.length) return []
			
			return [...consultList].slice(0, 2)
		},
		showGoodsStores() {
			if (!this.goodsStores && !!this.goodsStores.total) return []
			
			if (this.goodsStores.total > 1) {
				return this.goodsStores.items && this.goodsStores.items.slice(0, 1)
			}
			
			return this.goodsStores.items
		},
		goodsCommentList() {
			let commentList = this.goodsComments && this.goodsComments.items

			if (!commentList) return []
			if (!commentList.length) return []
			
			return [...commentList].slice(0, 2)
		},
		phoneHeight() {
			return this.PhoneHeight
		},
		currSelectDetail() {
			const selectArrStr = this.selectArr.join(',')
			const detail = this.shopItemInfo[selectArrStr]
			if (detail) {
				return detail
			}
			
			const { cover_pic, id, price, plus_price, stock } = this.goodsDetail
			
			return {
				cover_pic, id, price, plus_price, stock
			}
		},
		hasSelectedSize() {
			// 是否已经选中规格
			const select = this.selectArr
			let hasSelect = true
			for (let i = 0; i < this.sizeData.length; i++) {
				if (!select[i]) {
					hasSelect = false
					break
				}
			}
			return hasSelect
		},
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
		receivedCoupons() {
			if (!this.goodsCoupons.items) return []
			
			return this.goodsCoupons.items.map(item => {
				if (item.received_count > 0) {
					return item.id
				}
			})
		},
		// 秒杀
		seckillData() {
			if (this.goodsDetail && this.goodsDetail.seckill) {
				return this.goodsDetail && this.goodsDetail.seckill
			}
			return null
		},
		isSeckillBefore() {
			if (!this.seckillStart) return null
			return isBeforeTime(new Date(), this.seckillStart)
		},
		isSeckillDuration() {
			if (!this.seckillStart || !this.seckillEnd) return null
			const curr = new Date()
			return isAfterTime(curr, this.seckillStart) && isBeforeTime(curr, this.seckillEnd)
		},
		isSeckillEnd() {
			if (!this.seckillEnd) return null
			const curr = new Date()
			return isAfterTime(curr, this.seckillStart) && isAfterTime(curr, this.seckillEnd)
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
			scrollTop: 0,
			current: 0,
			cpage: 0,
			cpageSize: 5,
			productId: '',
			storeId: null,
			nearestStore: '',
			
			selectArr: [], // 存放被选中的值
			subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
			sizeData: [],
			shopItemInfo: {},
			buyNum: 1,
			action: '', // addcart buynow
			seckillStart: null,
			seckillEnd: null,
			currTime: '00:00:00',
			seckillStatus: 'unstart',  // 'unstart' 'end' 'duration'
			
			confirmLoading: false, // 弹出框防止多次点击
		};
	},
	methods: {
		...mapMutations({
			DRAW_COUPONS: 'goods/DRAW_COUPONS',
		}),
		...mapActions({
			GET_GOODS_DETAIL: 'goods/GET_GOODS_DETAIL',
			GET_GOODS_CONSULTS: 'goods/GET_GOODS_CONSULTS',
			GET_GOODS_COMMENTS: 'goods/GET_GOODS_COMMENTS',
			GET_GOODS_STORES: 'goods/GET_GOODS_STORES',
			
			GET_ALL_COUPONS: 'goods/GET_ALL_COUPONS',
			// 将商品加入购物车
			SET_GOODS_TO_CART: 'cart/SET_GOODS_TO_CART',
			GET_CART_LIST: 'cart/GET_CART_LIST',
			SETTLEMEN_GOODS: 'cart/SETTLEMEN_GOODS',
		}),
		shopItemInfoHandler() {
			// 规格数据处理
			let result = {}
			const attributeList = this.goodsDetail.attribute_list
			if (attributeList && attributeList[0]) {
				const listData = attributeList[0]
				
				listData.forEach(item => {
					let Arr = []
					item.specs.forEach(spec => {
						// 取键值对
						Object.keys(spec).forEach(v => {
							Arr.push(spec[v])
						})
					})
					
					let ArrStr = Arr.join(',')
					result[ArrStr] = item
				})
			}
			this.shopItemInfo = result
		},
		sizeDataHandler() {
			// 规格数据处理
			let arr = []
			const attributeList = this.goodsDetail.attribute_list
			if (attributeList && attributeList[0]) {
				const listData = attributeList[0]
				
				let size = {}
				listData.forEach(item => {
					item.specs.forEach(spec => {
						// 取键值对
						Object.keys(spec).forEach(v => {
							if (v in size) {
								if (size[v].indexOf(spec[v]) < 0) {
									size[v].push(spec[v])
								}
							}else {
								size[v] = []
							}
						})
					})
				})
				
				// 第二次处理
				for (let res in size) {
					let result = {}
					result.name = res
					result.item = []
					size[res].forEach(s => {
						result.item.push({'name': s})
					})
					// result.item = size[res]
					arr.push(result)
				}
				
			}
			
			this.sizeData = arr
		},
		// 商品规格
		selectItem(item, n, event, index) {
			if (this.selectArr[n] != item) {
				this.$set(this.selectArr, n, item)
				this.$set(this.subIndex, n, index)
			} else {
				this.$set(this.selectArr, n, '')
				this.$set(this.subIndex, n, -1)
			}
			this.checkItem()
		},
		checkItem() {
			const option = this.sizeData
			var result = [] //定义数组储存被选中的值
			for (var i in option) {
				result[i] = this.selectArr[i] ? this.selectArr[i] : ''
			}
			for (var i in option) {
				var last = result[i]; //把选中的值存放到字符串last去
				for (var k in option[i].item) {
					result[i] = option[i].item[k].name; //赋值，存在直接覆盖，不存在往里面添加name值
					option[i].item[k].isShow = this.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
				}
				result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
			}
			this.$forceUpdate(); //重绘
		},
		isMay(result) {
			for (var i in result) {
				if (result[i] == '') {
					return true; //如果数组里有为空的值，那直接返回true
				}
			}
			return this.shopItemInfo[result].stock == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
		},
		timeHandler(timeStr) {
			if (!timeStr) return ''
			
			const timeData = new Date(timeStr)
			
			return Timer.dateFormat(timeData, '{Y}.{MM}.{DD}')
		},			
		// 商品规格结束
		swiperChange(e) {
			this.current = e.target.current
		},
		cancel_popup() {
			this.$refs.showQcCode.close();
		},
		open_popup() {
			this.$refs.showQcCode.open();
		},
		// 打开领券弹窗
		openCouponsPopup() {
			this.$refs.couponsPopup.open();
		},
		closeCpuponsPopup() {
			this.$refs.couponsPopup.close();
		},
		// 打开选择规格
		openSizePopup() {
			this.$refs.sizePopup.open();
		},
		closeSizePopup() {
			this.$refs.sizePopup.close();
		},	
		numboxHandler(val) {
			if (val != this.buyNum) {
				this.buyNum = val
			}
		},
		addCart() {
			this.action = 'addcart'
			this.openSizePopup()
		},
		async postAddCart() {
			let hasChoose = this.hasSelectedSize			
			// 已选择尺寸
			const params = {
				product_num: this.buyNum,
				// store_id: this.goodsDetail.store_listing  // 从店铺进去的话就要把这个 store_id 存下来,因为一个商品是可以多个店铺同时卖的，如果直接访问的商品详情的话 就不传了
			}
			
			// 是否有规格
			if (this.isHasSpec) {
				params.spec_id = this.currSelectDetail.id
			}else {
				params.product_id = this.goodsDetail.id
			}
			
			// 没选中规格
			if (!hasChoose) {
				return uni.showToast({
					icon: 'none',
					title: '请选择规格',
					duration: 2000
				})
			}			
			
			// 禁止按钮点击
			this.confirmLoading = true
			try{
				await this.SET_GOODS_TO_CART(params)
				uni.showToast({
					icon: 'success',
					title: '商品在购物车等你',
					duration: 2000
				})
				this.GET_CART_LIST()
				this.closeSizePopup()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: '加入购物车失败',
					duration: 2000
				})
			}
			
			this.confirmLoading = false
		},
		goBuy(type) {
			this.action = type || 'buynow'
			this.openSizePopup()
		},
		// 点击商品弹出窗 规格/数量之后点击确定
		orderConfirm() {
			// 从加入购物车进来
			if (this.action == 'addcart') {
				return this.postAddCart()
			}
		
			
			// 从立即购买进来
			// 是否已选中内容
			let hasChoose = this.hasSelectedSize
			
			// 没选中规格
			if (!hasChoose) {
				return uni.showToast({
					icon: 'none',
					title: '请选择规格',
					duration: 2000
				})
			}
			
			// 禁止按钮点击
			this.confirmLoading = true
			
			const { id, product_id, store_id } = this.goodsDetail
			const params = {
				product_id: id,
				store_id: 1,
				product_num: this.buyNum,
				// address_id: 1,
				// coupon_item_id: this.receivedCoupons, //优惠券id
			}
			
			// 秒杀
			if (this.action == 'seckill' && this.seckillData) {
				params.seckill_id = this.seckillData.id
			}
			
			// 虚拟商品
			if (this.isServiceGoods) {
				delete params.product_num
				// 直接下单
				this.settlementGoods(id, params, 2)
			}
			// 实物商品
			if (this.isPhysicalGoods) {
				// 是否有规格，有规格就 spec_id 没有就product_id
				if (this.isHasSpec) {
					params.spec_id = this.currSelectDetail.id
				}
				// 直接下单
				this.settlementGoods(id, params, 1)
			}
			
			this.confirmLoading = false
		},
		// 直接购买商品
		async settlementGoods(id, data, orderType) {
			try{
				await this.SETTLEMEN_GOODS({id, data})
				uni.navigateTo({
					url: `/pages/cart/submit?settle=true&order_type=${orderType}`
				})
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		async getList() {
			const data = {
				page: this.cpage,
				pageSize: this.cpageSize,
				productId: this.productId
			};
			await this.getCommentList(data);
		},
		async getStore() {
			const data = {
				page: this.cpage,
				pageSize: 1,
				sortValue: '2',
				sortText: 'ASC',
				lonSort: 'ASC',
				longitude: this.ad_info.location.lng,
				latitude: this.ad_info.location.lat,
				productId: this.productId
			};
			await this.getStoreListData(data);
		},
		async drawCoupons(data) {
			if (!data.can_receive) return
			const id = data.id
			try{
				await CouponsServices.getCoupons(id)
				uni.showToast({
					icon: 'success',
					title: '领取成功',
					duration: 2000
				})
				this.GET_ALL_COUPONS()
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
		},
		// 秒杀倒计时
    countdownTime(startTime, endTime) {
	  	let interval = setInterval(() => {
				const now = new Date()
				const start = new Date(startTime)
				const end = new Date(endTime)
				
				// 还未开始
				if ((start - now) > 0) {
			    let time = (start - now) / 1000
			    // 获取时、分、秒,毫秒
			    let hou = parseInt((time % (60 * 60 * 24)) / 3600)<10?('0'+parseInt((time % (60 * 60 * 24)) / 3600)):parseInt((time % (60 * 60 * 24)) / 3600)
			    let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) / 60)):parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
			    let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) % 60)):parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
			    //that.ssec= parseInt(((date % (60 * 60 * 24)) % 3600) / 60)%10
					this.currTime = `${hou}:${min}:${sec}`
					this.seckillStatus = 'unstart'
				} else if ((now - end) > 0) {
					// 结束了
					this.currTime = `00:00:00`
					this.seckillStatus = 'end'
					clearInterval(interval)
				}else {
					// 正在开始
					let time = (end - now) / 1000
			    // 获取时、分、秒,毫秒
			    let hou = parseInt((time % (60 * 60 * 24)) / 3600)<10?('0'+parseInt((time % (60 * 60 * 24)) / 3600)):parseInt((time % (60 * 60 * 24)) / 3600)
			    let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) / 60)):parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
			    let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) % 60)):parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
					this.currTime = `${hou}:${min}:${sec}`
					this.seckillStatus = 'duration'
				}
  		},100)
  	},

	},
	filters: {
		/**
		 * 处理富文本里的图片宽度自适应
		 * 1.去掉img标签里的style、width、height属性
		 * 2.img标签添加style属性：max-width:100%;height:auto
		 * 3.修改所有style里的width属性为max-width:100%
		 * 4.去掉<br/>标签
		 * @param html
		 * @returns {void|string|*}
		 */
		formatRichText(html) {
			//控制小程序中图片大小
			let newContent =
				html &&
				html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
			newContent =
				newContent &&
				newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match && match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					return match;
				});
			newContent = newContent && newContent.replace(/<br[^>]*\/>/gi, '');
			newContent = newContent && newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10upx auto;"');
			return newContent;
		}
	},
	async onReachBottom() {
		if (this.goodsComments.length < this.goodsTotalComments) {
			this.cpage = this.cpage + 1;
			await this.getList();
		}
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});

		// this.$saveShareId(option); // 保存分享人ID
		if (option.storeId || option.scene || option.id) {
			// 识别传入的门店id参数
			if (option.scene) {
				// 扫码打开支付页面
				const scene = decodeURIComponent(option.scene);
				const wxArgs = this.$qs.parse(scene);
				console.log(wxArgs);
				if (wxArgs.storeId) {
					this.storeId = wxArgs.storeId;
				}
				if (wxArgs.productId) {
					this.productId = wxArgs.productId;
				}
				if (wxArgs.sid) {
					// 门店id——sid
					this.storeId = wxArgs.sid;
				}
				if (wxArgs.pid) {
					// 商品id--pid
					this.productId = wxArgs.pid;
				}
			} else {
				// 普通方式打开页面
				if (option.storeId) {
					this.storeId = option.storeId;
				}
				if (option.id) {
					this.productId = option.id;
				}
			}
		} else {
			// 传参错误则跳转首页
			uni.showToast({
				title: '参数错误，跳转首页',
				icon: 'none'
			});
			// return uni.reLaunch({
			// 	url: '/pages/index/index'
			// });
		}
		try{
			await Promise.all([
				this.GET_GOODS_DETAIL(this.productId),
				this.GET_GOODS_CONSULTS(this.productId),
				this.GET_GOODS_COMMENTS(this.productId),
				this.GET_ALL_COUPONS(),
				this.GET_GOODS_STORES({product_id: this.productId }),
				this.GET_CART_LIST(),
			])
			
			// 有秒杀
			if (this.seckillData) {
				const currT = new Date()
				this.seckillStart = this.seckillData.start_time || null
				this.seckillEnd = this.seckillData.end_time || null
				// 设置倒计时
				this.countdownTime(this.seckillStart, this.seckillEnd)
				
			}
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}
		
		// 处理商品sku数据
		this.sizeDataHandler()
		this.shopItemInfoHandler()
		this.checkItem()
		uni.hideLoading();
	},
	onShareAppMessage() {
		// 分享页面时，加入门店或者
		let path = `/pages/goods/goods?id=${this.productId}`;
		if (this.storeId) {
			path = path + `&storeId=${this.storeId}`;
		}
		path = path + `&shareId=${this.currUser.id}`;
		console.log(path);
		return {
			title: this.goodsDetail.name,
			path: path
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	}
};
</script>

<style lang="scss">
page {
	position: relative;
}

.seckill {
	display: flex;
	width: 100%;;
	height: 140upx;
	&-left {
		padding: 0 24upx;
		position: relative;
		width: 70%;
		height: 100%;
		background-color: $primary-color;
		.title {
			margin-top: 16upx;
			margin-left: 32upx;
			font-size: 28upx;
			color: rgba(249,249,249,1);
			.origin {
				margin-left: 18upx;
				color: #999;
				text-decoration: line-through;
			}
		}
		.content {
			margin-top: 5upx;
			height: 68upx;
			.price {
				color: #F5DBC3;
				font-size: 28upx;
				.now_price {
					font-size: 48upx;
					line-height: 68upx;
				}
			}
			.limit {
				margin-left: 24upx;
				margin-top: 20upx;
				padding: 0 12upx;
				line-height: 34upx;
				height: 34upx;
				border-radius: 18upx;
				font-size: 24upx;
				background: #CA935E;
				color: #FFF;
			}
		}
	}
	&-right {
		padding: 0 0 0 35upx;
		position: relative;
		width: 30%;
		height: 100%;
		text-align: center;
		background:linear-gradient(90deg, #eac09a 0%,rgba(202,147,94,1) 100%);
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			border-top: 70upx solid transparent;
			border-left: 35upx solid $primary-color;
			border-bottom: 70upx solid transparent;
		}
		.soon {
			margin-top: 20upx;
			font-weight: 500;
			font-size: 38upx;
			color: #FFF;
		}
		.time {
			margin-top: 14upx;
			font-size: 24upx;
			color: #FFF;
		}
		
	}
}

.get-coupons {
	margin: 4upx 40upx 4upx 0;
	position: relative;
	display: inline-block;
	padding: 0 16upx;
	border-radius: 6upx;
	line-height: 40upx;
	font-size: 22upx;
	overflow: hidden;
	
	&::after,
	&::before {
		content: '';
		width: 16upx;
		height: 16upx;
		border-radius: 100%;
		background-color: #FFF;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	
	&::after {
		right: -8upx;
	}
	&::before {
		left: -8upx;
	}
}

.share-btn {
	background-color: transparent;

	&::after {
		display: none;
	}
}

.swiper-container {
	position: relative;
	z-index: 1;

	.dots {
		position: absolute;
		z-index: 2;
		bottom: 40upx;
		right: 32upx;
		@include sc(27upx, $mc-greylight);
		font-weight: 400;
		letter-spacing: 2upx;

		.current {
			@include sc(33upx, $mc-grey);
		}
	}
}

swiper,
.swiper-item,
.swiper-img {
	@include wh(750upx, 750upx);
}

.footer-opt {
	position: fixed;
	bottom: 12px;
	left: 0;
	right: 0;
	z-index: 10;
	&.opt-bar {
		bottom: 0;
	}
}
.opt-bar {
	background: #FFF;
	border-top: 1upx solid #F2F2F2;
	&__main {
		.cart {
			&_box {
				position: relative;
				width: 176upx;
				padding: 16upx 14upx;
				margin-right: 48upx;
				&::after {
					content: '';
					position: absolute;
					top: 38upx;
					bottom: 38upx;
					right: 0;
					width: 1px;
					height: calc(100% - 38upx - 38upx);
					background: #CCCCCC;
				}
			}
			&_main {
				position: relative;
				text-align: center;
				.font {
					display: block;
					font-size: 20upx;
					color: #666666;
				}
				.badge {
					position: absolute;
					top: -8upx;
					right: -8upx;
					background: $primary-color;
					padding: 0 8upx;
					height: 32upx;
					border-radius: 16upx;
					text-align: center;
					white-space: nowrap;
					font-size: 24upx;
					color: #F5DBC3;
					line-height: 32upx;
				}
			}
		}
	}
	&__seckill {
		.opt-bar__btn {
			margin: 0 48upx;
			.btn {
				width: 315upx;
			}
		}
	}
	&__btn {
		margin-right: 24upx;
		flex: 1;
		.btn {
			margin: 16upx 0;
			width: 240upx;
			height: 88upx;
			line-height: 88upx;
			font-size: 30upx;
			border-radius: 44upx;
			&.tobuy {
				background-color: #CA935E;
				color: #fff;
			}
			&.disabled {
				background: rgba(29,29,29,.5);
				color: rgba(245,219,195,1);
			}
		}
	}
}
		
.buy-btn {
	margin: 0 48upx;
	height: 98upx;
	line-height: 98upx;
	text-align: center;
	color: $secondary-color;
	background-color: $primary-color;
	font-weight: 400;
	border-radius: 54upx;
	&[disabled] {
		background: rgba(29,29,29,.5)!important;
		color: rgba(245,219,195,1)!important;
	}
}

.goods-bar {
	background: $mc-white;
	padding: 32upx;
	@include sc(26upx, #999999);
	font-weight: 400;

	.header {
		padding-bottom: 24upx;
	}

	.price {
		.now {
			font-size: 32upx;
			color: $primary-color;

			.now_price {
				font-size: 64upx;
				font-weight: 500;
			}

			margin-right: 25upx;
		}

		.old {
			text {
				text-decoration: line-through;
			}
		}
	}

	.name {
		@include sc(33upx, #020202);
		font-weight: 500;
		line-height: 46upx;
		margin: 30upx 0 28upx 0;
	}
}

.panel {
	margin-bottom: 24upx;
	width: 100%;

	.header {
		height: 112upx;
		line-height: 112upx;
		background: $mc-white;

		text {
			@include sc(34upx, #020202);
			font-weight: 500;
			vertical-align: middle;

			&::before,
			&::after {
				content: '';
				display: inline-block;
				@include wh(32upx, 2upx);
				border-bottom: 2upx solid #999999;
				margin: 0 12upx;
				vertical-align: middle;
			}
		}
	}

}

.details {
	padding-bottom: 132upx;
}


/* 弹窗二维码 */
.uni-image {
	position: relative;
	width: 400upx;
	height: 400upx;
}

.uni-image .image {
	width: 100%;
	height: 100%;
}

.uni-image-close {
	margin-top: 20px;
	text-align: center;
}
.store-item {
	box-shadow: none !important;
	margin-top: 0 !important;
	// border-top: 1upx solid rgba($color: #000000, $alpha: 0.1);
}
.plus{
	width: 76upx;
	height: 30upx;
	margin: 0 12upx;
}

// 操作
.option {
	&-item {
		position: relative;
		padding: 12upx 24upx;
		min-height: 112upx;
		font-size: 26upx;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			right: 0;
			left: calc(24upx + 76upx);
			height: 1px;
			background-color: #F2F2F2;
		}
		&:last-child::after {
			display: none;
		}
		.label {
			width: 76upx;
			line-height: 64upx;
			color: #999;
		}
		.content {
			color: #999;
		}
		.other {
			color: #666;
			&-icon {
				width: 48upx;
				height: 64upx;
				line-height: 64upx;
				.iconfont {
					display: block;
					width: 100%;
				}
			}
		}
	}
}

// 店铺
.store {
	padding: 0 24upx 12upx;
	background-color: $bg-color;
	.section_title {
		padding: 12upx 0 36upx;
		.more {
			margin-top: 0;
			.more-text {
				font-size: 28upx;
				color: #666;
			}
		}
	}
	&-list {
		&__item {
			border-radius: 24upx;
			border-bottom: 32upx solid $bg-color;
			
			&:last-child {
				border-bottom-width: 0;
			}
		}
	}
}

// 大家问
.allask {
	padding: 0 0 36upx;
	color: #666;
	font-size: 26upx;
	line-height: 40upx;
	
	&-wrap {
		margin: 0 24upx;
	}
	
	&-item {
		padding: 6upx 0;
		line-height: 42upx;
	}
	
	&_title {
		max-width: 70%;
		
		&-text {
			flex: 1;
			@include ellipsis;
		}
		
		&-icon {
			position: relative;
			margin-right: 6upx;
			
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
	}
	&_num {
		max-width: 25%;
		@include ellipsis;
	}
	.morebtn {
		margin-bottom: 0;
	}
}

// 评论
.comment {
	padding: 0 0 36upx;
	
	&-collect {
		padding: 36upx 0 12upx;
		margin: 0 24upx;
		border-top: 1px solid #F2F2F2;
		&__item {
			display: inline-block;
			margin-right: 28upx;
			background-color: $bg-color;
			border-radius: 28upx;
			line-height: 52upx;
			padding: 0 24upx;
			color: $primary-color;
		}
	}
	
	&-box {
		padding: 24upx;
		border-bottom: 24upx solid $bg-color;
		
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

.section {
	border-bottom: 24upx solid $bg-color;
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

// 优惠券
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
					margin-top: 32upx;
					color: #FFF;
					font-size: 28upx;
					.text {
						font-size: 52upx;
						line-height: 70upx;
					}
				}
				.condition {
					display: inline-block;
					text-align: center;
					margin: 12upx 12upx 0;
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
				.name {
					height: 90upx;
					line-height: 45upx;
					@include ellipsisMultiline(2);
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
	
.popup {
	&-main {
		background-color: $bg-color;
	}
	&-hd {
		padding: 28upx 32upx;
		background-color: #FFF;
	}
}	

.popup-size {
	position: relative;
	height: 75%;
	background-color: #FFF;
	&__main {
		position: relative;
		height: 100%;
		padding-bottom: 156upx;
	}
	&__item {
		position: relative;
		margin-left: 32upx;
		padding: 40upx 32upx 48upx;
		&::after {
			content: '';
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			background-color: #F2F2F2;
		}
		&.popup-size__virtual {
			&::after {
				display: none;
			}
		}
		.label {
			position: absolute;
			top: 40upx;
			left: 0;
			font-weight: bold;
			color: $primary-color;
			font-size: 28upx;
			line-height: 40upx;
		}
	}
	
	&__goods {
		padding-left: 278upx;
		.image {
			position: absolute;
			top: -32upx;
			left: 0;
			width: 246upx;
			height: 246upx;
			
			&-main {
				display: block;
				max-width: 100%;
				max-height: 100%;
			}
		}
		
		&-info {
			.price {
				font-size: 20upx;
				.text {
					padding-left: 6upx;
					font-size: 34upx;
					line-height: 48upx;
				}
			}
			.choose {
				margin-top: 10upx;
				.text {
					color: #999;
				}
				.name {
					margin-top: 8upx;
					height: 76upx;
					line-height: 38upx;
					@include ellipsisMultiline(2);
				}
			}
		}
	}
	
	&__size {
		position: relative;
		padding-left: 80upx;
		font-size: 0;
		.label {
			top: 52upx;
			line-height: 52upx;
		}
		.size-item {
			display: inline-block;
			padding: 0 28upx;
			margin: 12upx;
			line-height: 52upx;
			background-color: $bg-color;
			font-size: 26upx;
			color: $primary-color;
			border-radius: 26upx;
			&.active {
				background-color: $primary-color;
				color: #F5DBC3;
			}
			&.disabled {
				color: #999;
			}
		}
	}
	
	&__num {
		position: relative;
		padding-left: 80upx;
	}
	
	&__cancel {
		position: absolute;
		top: 28upx;
		right: 32upx;
		z-index: 9;
	}
	
	&__submit {
		position: absolute;
		bottom: 24upx;
		left: 0;
		right: 0;
	}
	
	&__physical {
		
	}
	
	&__virtual {
		.popup-size__item {
			margin-left: 0;
			padding: 40upx 32upx 48upx;			
			&::after {
				display: none;
			}
			.label {
				position: relative;
				top: 0;
			}
			&.state {
				color: #666;
				font-size: 26upx;
			}
		}
	}
	&__phybtn {
		padding: 0 32upx;
		margin-right: 0;
		.btn {
			width: 48%;
		}
	}
}

.morebtn {
	margin: 20upx 0;
	&_more {
		margin: 0 auto;
		width: 220upx;
		height: 64upx;
		line-height: 64upx;
		border: 1px solid #CCCCCC;
		border-radius: 35upx;
		color: #666;
		text-align: center;
	}
}
</style>
