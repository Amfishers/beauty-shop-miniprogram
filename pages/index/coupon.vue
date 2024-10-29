<template>
	<view class="full-page">
		<view class="flex flex-column flex-nowrap">
			<cu-custom bgColor="bg-white-heavy" :isBack="true">
				<block slot="content">{{ couponData.name || title }}</block>
			</cu-custom>

			<view v-if="couponData" class="flex flex-column flex-nowrap">
				<view class="banner" :style="{ backgroundImage: 'url(../../static/invite.png)' }"></view>
				<view class="bg-white">
					<view class="info">
						<view class="text-cut">
							<text>礼券名称：</text>
							<text>{{ couponData.name }}</text>
						</view>
						<view class="text-cut">
							<text>礼券类型：</text>
							<text>{{ couponData.amount_type == 0 ? '优惠券' : '红包' }}</text>
						</view>
						<view class="text-cut">
							<text>使用条件：</text>
							<text>{{ usedInfo }}</text>
						</view>
						<view class="text-cut" v-if="parseInt(couponData.per_limit) > 0">
							<text>可领次数：</text>
							<text>{{ couponData.per_limit }}张</text>
						</view>
						<view class="text-cut">
							<text>有效期：</text>
							<text>{{ couponData.start_time && timeHandler(couponData.start_time) }} - {{ couponData.end_time && timeHandler(couponData.end_time) }}</text>
						</view>
						<view v-if="couponData.note">
							<text>使用说明：</text>
							<text>{{ couponData.note }}</text>
						</view>
					</view>
				</view>
				
				<view class="bg-white">
					<view class="bottom flex justify-between flex-column align-center">
						<view class="qccode" v-if="hasGet"><image :src="default_qc_code"></image></view>
						<view class="scan" v-if="hasGet"><text>点击分享，给好友送一张</text></view>
						<view class="btnview">
							<button class="btn" v-if="!hasGet" :disabled="loading" @click="getCoupon">{{ btnWord }}</button>
							<button class="btn" v-if="hasGet" open-type="share">分享</button>
						</view>
					</view>
				</view>
			</view>

			<blank-page v-else />
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import CounponService from '@/services/coupons.js'
import Timer from '@/utils/time.js'

export default {
	computed: {
		...mapState('login', ['openId', 'shareId', 'userId', 'token', 'serverUserInfo']),
		usedInfo() {
			if (parseFloat(this.couponData.min_point) > 0) {
				return `订单满${this.couponData.min_point}元可用`;
			} else {
				return '无门槛';
			}
		},
		checkStatus() {
			return this.couponData.can_receive
		},
		btnWord() {
			return this.couponData.can_receive ? '立即领取' : '已领完'
		}
	},
	data() {
		return {
			title: '恒基礼券',
			couponData: '',
			couponId: '',
			default_qc_code: this.$cfg.default_qc_code,
			default_bg_coupon: this.$cfg.default_bg_coupon,
			hasGet: false,
			loading: false,
		};
	},
	onLoad(option) {
		this.$saveShareId(option); // 保存分享人ID
		if (option.id || option.scene) {
			// 识别传入的id参数
			if (option.scene) {
				// 扫码打开页面
				const scene = decodeURIComponent(option.scene);
				const wxArgs = this.$qs.parse(scene);
				if (wxArgs.couponId) {
					this.couponId = wxArgs.couponId;
				}
				if (wxArgs.cid) {	// cid 优惠券id
					this.couponId = wxArgs.cid;
				}
			} else if (option.id) {
				this.couponId = option.id;
			} else {
				// 传参错误则跳转首页
				uni.showToast({
					title: '参数错误，跳转首页',
					icon: 'none'
				});
				return uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	},
	onShow() {
		this.__init()
	},
	methods: {
		async __init() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
				
			try{
				const restData = await CounponService.getCouponsDetail(this.couponId)
				this.couponData = restData.data
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			uni.hideLoading();
		},
		async getCoupon(e) {		// 领取优惠券
			if (!this.checkStatus) return 
			
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			this.loading = true
			
			try{
				await CounponService.getCoupons(this.couponId)
				// this.getShareCode()
				this.hasGet = true
				uni.showToast({
					title:'领取成功!',
					icon:'success',
				})				
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
			
			uni.hideLoading()
			this.loading = false
		},
		// getShareCode(){		// 领取成功获取优惠券分享码
		// 	this.$http.post('/center/getCouponQrCode',{ couponId: this.couponId }, { token: true }).then(res=>{
		// 		if(res.code==200){
		// 			this.default_qc_code = res.data.qrCode
		// 		}
		// 	})
		// }
		timeHandler(timeStr) {
			if (!timeStr) return ''
			
			const timeData = new Date(timeStr)
			
			return Timer.dateFormat(timeData, '{Y}.{MM}.{DD}')
		},				
	},
	onShareAppMessage() {
		// 分享专题页
		let pack_type = this.couponData.amountType == '0' ? '优惠券' : '红包'
		let content = `你的好友${this.serverUserInfo.nickname}送你一张${pack_type}`
		let path = `/pages/index/coupon?id=${this.couponId}`;
		path = path + `&shareId=${this.userId}`;
		console.log(path);
		return {
			title: content,
			path: path,
			imageUrl:this.default_qc_code
		};
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.banner {
	width: 100%;
	height: 415upx;
	background-size: 100% 100%;
}
.info {
	padding: 36upx;
	color: rgba(102, 102, 102, 1);
	line-height: 1.7em;
}
.bottom {
	padding: 36upx;
}
.qccode image {
	width: 300upx;
	height: 300upx;
}
.scan {
	font-size: 30upx;
	height: 100upx;
	line-height: 100upx;
}
.btnview {
	width: 100%;
}
.btn {
	width: 100%;
	color: $secondary-color;
	background-color: $primary-color;
	height: 96upx;
	line-height: 96upx;
	border-radius: 48upx;
	font-size: 36upx;
	color: #fff;	
}
.btn[disabled]{
	color: #999 !important;;
}
</style>
