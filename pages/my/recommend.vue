<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">推荐二维码</block>
		</cu-custom>
		<view class="recommend flex align-center justify-center">
			<view class="recommend-content text-center">
				<view class="avatar flex align-center justify-center"><view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + userInfo.avatarUrl + ')' }" /></view>
				<view class="nickname">{{ currUser.nickname }}</view>
				<view class="wechat">微信扫码</view>
				
				<block v-if="currUser">
					<view class="">
						<image :src="currUser.share_code" class="qrscene"></image>
					</view>
				</block>
				<block v-else>
				<qrcode
					v-if="ifShow"
					cid="qrcode1"
					ref="qrcode"
					:val="set_path"
					:size="size"
					:unit="unit"
					:background="background"
					:foreground="foreground"
					:pdground="pdground"
					:icon="icon"
					:iconSize="iconsize"
					:lv="lv"
					:onval="onval"
					:loadMake="loadMake"
					:usingComponents="true"
					:showLoading="true"
				/>
				</block>
			</view>
		</view>
		
		<!-- <blank-page  v-else /> -->
		<!-- <view class="btnview flex flex-row justify-between" v-if="currUser.share_code">
			<view class="op">
				<button class="btn bg-white" @click=saveImg>保存</button>
			</view>
			<view class="op">
				<button class="btn paimary" open-type="share">分享</button>
			</view>
		</view> -->
	</view>
</template>

<script>
import qrcode from '@/components/qrcode/qrcode.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
	components: {
		qrcode
	},
	data() {
		return {
			ifShow: true,
			val: 'https://www.amhjmy.com/h5/#/', // 要生成的二维码值
			size: 300, // 二维码大小
			unit: 'upx', // 单位
			background: '#ffffff', // 背景色
			foreground: '#000000', // 前景色
			pdground: '#000000', // 角标色
			icon: '', // 二维码图标
			iconsize: 40, // 二维码图标大小
			lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
			onval: true, // val值变化时自动重新生成二维码
			loadMake: true, // 组件加载完成后自动生成二维码
			src: '' // 二维码生成后的图片地址或base64
		};
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			userInfo: state => state.user.userInfo,
			openId: state => state.user.openId,
		}),		
		
		// ...mapState('login', ['userInfo', 'openId', 'shareId']),
		set_path() {
			return `https://www.amhjmy.com/h5/#/?shareId=${this.userId}`;
		}
	},
	methods: {
		...mapActions({
			GET_CURR_USER: 'my/GET_CURR_USER',
		}),
		creatQrcode() {
			this.$refs.qrcode._makeCode();
		},
		saveQrcode() {
			this.$refs.qrcode._saveCode();
		},
		async __init(){
			uni.showLoading({
				title: '加载中...',
				mask: true
			});			
			await this.GET_CURR_USER()
			uni.hideLoading()
		},
		saveImg(){
			if(this.currUser.share_code){
				uni.getImageInfo({
					src:this.currUser.share_code,
					success: (res) => {
						const path  = res.path
						
						uni.saveImageToPhotosAlbum({
							filePath:path,
							success: (res) => {
								uni.showToast({
									title:'保存成功',
									icon:'success'
								})
							}
						})
					}
				})
			}else{
				uni.showToast({
					title:'保存失败',
					icon:'none'
				})
			}
		}
	},
	onShareAppMessage() {
		return {
			title: `你的好友向你推荐了恒基美业`,
			path: `/pages/index/index?shareId=${this.userId}`,
		};
	},
	async onLoad(option) {
		// this.$hasLogin(); // 检查登陆状态

		// this.$saveShareId(option)	// 保存分享者id
		// 初始化二维码
		await this.__init()
	},
};
</script>

<style lang="scss" scoped>
	.index {
		width: 100%;
		height: 100vh;
		background-color: $bg-color;
		display: flex;
		flex-direction: column;
	}
	.qrscene{
		width: 300upx;
		height: 300upx
	}
	.op{width: 48%;}
	.btnview {
		width: 100%;
		padding: 0 36upx;
	}
	.btn {
		width: 100%;
		height: 96upx;
		line-height: 96upx;
		border-radius: 48upx;
		font-size: 36upx;
	}
	.btn[disabled]{
		color: #999 !important;;
	}
	.btn.paimary{
		color: #fff;	
		background: linear-gradient(351deg, rgba(241, 71, 68, 1) 0%, rgba(252, 133, 131, 1) 100%);
		
	}
.recommend {
	flex: 1;
	@include wh(686upx, 877upx);
	background: $mc-white;
	border-radius: 16upx;
	margin: 80upx auto 80upx auto;
	.recommend-content {
		@include wh(508upx, 628upx);
		border: 8upx solid $primary-color;
		border-radius: 40upx;
		.avatar {
			@include wh(164upx, 164upx);
			margin-top: -82upx;
			background: $mc-white;
			margin-left: 166upx;
			.cu-avatar {
				@include wh(112upx, 112upx);
			}
		}
		.nickname {
			@include sc(40upx, $mc-grey);
			font-weight: 500;
			line-height: 28upx;
		}
		.wechat {
			@include sc($font-sm, #999999);
			font-weight: 400;
			line-height: 45upx;
			margin: 20upx 0 38upx 0;
		}
	}
}
</style>
