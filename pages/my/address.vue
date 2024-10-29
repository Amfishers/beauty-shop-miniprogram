<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">{{ addrId ? '编辑' : '新增' }}收货地址</block>
		</cu-custom>
		<view class="address solid-top">
			<view class="cu-form-group form-item">
				<view class="title">收货人</view>
				<input v-model="name" placeholder="请输入收货人姓名" name="input" />
			</view>
			<view class="cu-form-group form-item">
				<view class="title">联系电话</view>
				<input v-model="phone" type="number" placeholder="请输入收货人联系方式" name="input" />
			</view>
			<view class="cu-form-group form-item" @click="openLocation">
				<view class="title">所在地区</view>
				<!-- <picker
          mode="multiSelector"
          @change="MultiChange"
          @columnchange="MultiColumnChange"
          :value="multiIndex"
          :range="multiArray"
        > -->
				<view class="picker text-right flex-sub">
					{{ address }}
					<!-- {{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}} -->
				</view>
				<BIcon icon="right" font-size="14"></BIcon>
				<!-- </picker> -->
			</view>
			<view class="cu-form-group form-textarea">
				<!-- <view class="title">文本框</view> -->
				<textarea v-model="detailAddr" maxlength="-1" :disabled="modalName != null" @input="textareaBInput" placeholder="请输入详细地址"></textarea>
			</view>
			<view class="cu-form-group  form-set">
				<view class="title">设为默认地址</view>
				<switch class="black" @change="setDefault" :class="isDefault ? 'checked' : ''" :checked="isDefault ? true : false" ></switch>
			</view>
			<button class="cu-btn common-btn round save" :disabled="loading" @click="saveAddress">保存</button>
		</view>
		<view class="cu-modal" :class="showModal ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ modalTitle }}</view>
					<view class="action" @tap="hideModal"><BIcon icon="cancel"></BIcon></view>
				</view>
				<view class="padding-xl">{{ modalContent }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
	data() {
		return {
			loading: false,
			isDefault: false,
			location: '',
			name: '',
			phone: '',
			address: '请选择所在地区',
			detailAddr: '',
			showModal: false,
			modalTitle: '保存失败',
			modalContent: '输入错误',
			addrId: '',
			addAddrMode: 'show'
		};
	},
	computed: {
		...mapState('login', ['serverUserInfo']),
		...mapState('user', ['addrList']),
	},
	methods: {
		...mapActions({
			'CHOOSE_LOCATION': 'address/CHOOSE_LOCATION',
			'GET_ADDRESS_TO_LOCATION': 'address/GET_ADDRESS_TO_LOCATION',
			'SAVE_ADDRESS': 'address/SAVE_ADDRESS',
			'GET_ADDRESS_DETAIL': 'address/GET_ADDRESS_DETAIL',
			'UPDATE_ADDRESS_DETAIL': 'address/UPDATE_ADDRESS_DETAIL',
			// 'getAddrById': 'address/getAddrById',
			'GET_USER_LOCTION_WITH_IP': 'user/GET_USER_LOCTION_WITH_IP',
		}),
		setDefault(e) {
			this.isDefault = e.detail.value;
		},
		async checkAuthAddress() {
			let hasAuth = false
			await uni.getSetting({
				success(gres) {
					if (gres.authSetting['scope.userLocation']) {
						hasAuth = true
					} else {
						uni.showModal({
							title: '地址获取失败',
							content: '请授权获取位置信息',
							confirmText: '去授权',
							success(sres) {
								if (sres.confirm) {		// 点击确认
									uni.openSetting({
										success: res => {
											
											if (res.authSetting['scope.userLocation']) {
												hasAuth =  true
											}
										}
									});
								}
							}
						});
					}
				}
			});
			console.log(hasAuth);
			return hasAuth
		},

		async openLocation() {
			if(!this.checkAuthAddress()){
				uni.showToast({
					title:'请授权位置',
					icon:'none'
				})
				return
			}
			const cl = await this.CHOOSE_LOCATION()
			console.log('cl', cl)
			this.detailAddr = cl.address + cl.name
			const ldata = {
				latitude: cl.latitude,
				longitude: cl.longitude
			}
			const { data: adInfo } = await this.GET_USER_LOCTION_WITH_IP(ldata)
			this.location = adInfo
			this.address = adInfo.province + adInfo.city + adInfo.region
		},

		hideModal() {
			this.showModal = false;
		},
		async saveAddress() {
			this.loading = true;
			let msg = '';
			if (!this.name) {
				msg = '请填写收货人';
			}else if (!/^[1]([3-9])[0-9]{9}$/.test(this.phone)) {
				msg = '请填写联系电话';
			}else if (!this.location.city) {
				msg = '请填写详细城市'
			}else if (!this.location.region) {
				msg = '请填写详细地区'
			}else if (!this.detailAddr) {
				msg = '请填写详细地址';
			}
			
			if (msg) {
				this.showModal = true;
				this.modalContent = msg;
				this.loading = false
				return;
			}
			const data = {
				name: this.name,
				phone: this.phone,
				province: this.location.province,
				city: this.location.city,
				region: this.location.region,
				detail_address: this.detailAddr,
				isDefault: this.isDefault ? '1' : '0'
			};

			uni.showToast({
				title: '保存中...',
				icon: 'none',
				mask: true
			});
			
			if (this.addrId) {
				// data['id'] = this.addrId;
				await this.UPDATE_ADDRESS_DETAIL({ id: this.addrId, data })
			}else {
				await this.SAVE_ADDRESS(data);
			}

			uni.hideToast();
			this.loading = false;
			
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 前一个页面
			uni.navigateBack({
				success() {
					beforePage.onLoad() // 执行前一个页面的onLoad方法
				}
			});
		}
	},
	async onLoad(option) {
		// this.$hasLogin(); // 检查登陆状态
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		const { id, type } = option;		

		if (id) {
			// edit
			this.addrId = id
			const addr = await this.GET_ADDRESS_DETAIL(id)
			this.name = addr.name;
			this.phone = addr.phone;
			this.address = addr.province + addr.city + addr.region
			this.isDefault = addr.is_default == 1 ? true : false;
			this.location = {
				city: addr.city,
				region: addr.region,
				detail_address: addr.detail_address,
				province: addr.province,
			}
			this.detailAddr = addr.detail_address;
		} else {
			if (this.serverUserInfo) {
				this.phone = this.serverUserInfo.phone;
			}
		}
		if (type === 'select') {
			this.addAddrMode = 'select';
		}
		if(this.addrList && this.addrList.length==0){
			this.isDefault = true
		}
		uni.hideLoading()
	}
};
</script>

<style lang="scss">
.index {
	background-color: $mc-white;
}
.address {
	color: $mc-grey;
	border-top: 1rpx solid #e5e5e5;
	.form-item {
		@include wh(686upx, 120upx);
		margin: 0 auto;
		padding: 1rpx;
		border-color: #e5e5e5;
		font-size: 30upx;
		input {
			text-align: right;
		}
	}
	.form-textarea {
		@include wh(686upx, 200upx);
		margin: 0 auto;
		border-color: #e5e5e5;
		padding: 1rpx;
		font-size: 30upx;
	}
	.form-set {
		@include wh(750upx, 120upx);
		border-bottom: 1upx solid #e5e5e5;
		position: relative;
		margin-top: 28upx;
		padding: 1rpx 32rpx;
		font-size: 30upx;
		&::before {
			content: '';
			width: 100%;
			height: 28upx;
			display: block;
			background-color: #f2f2f2;
			position: absolute;
			left: 0;
			top: -28upx;
		}
	}
}
.title .picker {
}
.save {
	@include wh(686upx, 96upx);
	font-size: 36upx;
	font-weight: 500;
	margin: 64upx 32upx;
	background-color: $primary-color!important;
	color: $secondary-color!important;
}
input::placeholder,
textarea::placeholder {
	@include sc(30upx, #cccccc);
	font-weight: 400;
}
</style>
