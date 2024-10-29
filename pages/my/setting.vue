<template>
	<view class="index">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">设置</block>
		</cu-custom>
		
		<view class="list solid-top">
			<view class="cu-list menu">
				<view class="cu-item arrow">
					<view class="content"><text>头像</text></view>
					<view class="action"><view class="cu-avatar round" :style="{ backgroundImage: 'url(' + userInfo.avatarUrl + ')' }"></view></view>
				</view>
				<view class="cu-item arrow">
					<view class="content"><text>手机号</text></view>
					<view class="action">
						<text>{{ currUser.phone || '' }}</text>
					</view>
				</view>
				<view class="cu-item arrow" @click="showNickNameModal">
					<view class="content"><text>昵称</text></view>
					<view class="action">
						<text>{{ currUser.nickname || '' }}</text>
					</view>
				</view>
				<view class="cu-item arrow">
					<view class="content"><text>生日</text></view>
					<view class="action">
						<picker mode="date" @change="modifyBirthday">
							<view class="picker">{{ currUser.format_birthday || '未知' }}</view>
						</picker>
						<text></text>
					</view>
				</view>
				<view class="cu-item arrow">
					<view class="content"><text>性别</text></view>
					<view class="action">
						<picker @change="modifySex" :value="index" :range="pickerSex">{{ currUser.sex === '1' ? '男' : currUser.sex === '2' ? '女' : '保密' }}</picker>
					</view>
				</view>
			</view>
		</view>
		<button class="cu-btn round logout" @click="logout">退出登录</button>

		<!-- modal -->
		<view class="cu-modal nickname-modal" :class="showNickNameMOdal ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end nickname-header flex-direction">
					<view class="nickname-header-title">请输入昵称</view>
					<view class="nickname-header-subtitle">起个好听的名字，让自己成为焦点！</view>
					<!-- <view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view> -->
				</view>
				<view class="padding-xl bg-white-heavy"><input class="nickname-input" type="text" v-model="modifyNickName" maxlength="12" /></view>
				<view class="cu-bar bg-white justify-end solid-top">
					<view class="action space-between flex-sub">
						<button class="modal-btn cu-btn bg-white-heavy flex-sub solid-right" @tap="hideModal">取消</button>
						<button class="modal-btn cu-btn bg-white-heavy flex-sub text-mc-primary" @tap="updateNickName">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import UserService from '@/services/user.js'

export default {
	data() {
		return {
			showNickNameMOdal: false,
			modifyNickName: '',
			index: 0,
			pickerSex: ['保密', '男', '女']
		};
	},
	computed: {
		...mapState({
			currUser: state => state.my.currUser,
			userInfo: state => state.user.userInfo,
		}),
	},
	methods: {
		...mapActions({
			GET_CURR_USER: 'my/GET_CURR_USER',
			PATCH_CURR_USER: 'my/PATCH_CURR_USER',
		}),			
		hideModal() {
			this.showNickNameMOdal = false;
		},
		sex() {
			if (this.currUser.sex === 0) return '保密';
			else if (this.currUser.sex === 1) return '男';
			else if (this.currUser.sex === 2) return '女';
			else return '未知';
		},
		showNickNameModal() {
			this.showNickNameMOdal = true;
		},
		async modifyBirthday(e) {
			const date = e.detail.value
			try {
				await this.PATCH_CURR_USER({
					birthday: date
				});
			}	catch(e) {
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		async modifySex(e) {
			const value = e.detail.value;
			if (value !== this.currUser.sex) {
				try{
					await this.PATCH_CURR_USER({
						sex: value
					});
				} catch(e) {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}
			}
		},
		async updateNickName() {
			if (this.modifyNickName !== this.currUser.nickname) {
				try {
					await this.PATCH_CURR_USER({
						nickname: this.modifyNickName
					});
				}	catch(e) {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				}					
			}
			this.hideModal();
		},
		async logout() {
			await UserService.userLogout()
			uni.clearStorageSync();
			uni.switchTab({
				url: '/pages/index/index'
			});
		}
	},
	async onLoad() {
		// this.$hasLogin(); // 检查登陆状态
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		try{
			await this.GET_CURR_USER()
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: e.message,
				duration: 2000
			})
		}		
		uni.hideLoading()
	}
};
</script>

<style lang="scss">
.index {
	background-color: $mc-white;
}
.list {
	padding-left: 32upx;
}
.cu-list.menu > .cu-item {
	padding-left: 0;
	padding-right: 54upx;
	&:last-child::after {
		border-bottom: 1upx solid #dddddd;
	}
}
.logout {
	width: 686upx;
	height: 96upx;
	background: $primary-color!important;
	color: $secondary-color!important;
	border-radius: 48upx;
	margin: 64upx 32upx;
	@include sc(36upx, $mc-white);
}
.nickname-modal {
	@include sc(36upx, #000);
	// @include wh(590upx, 400upx);
	font-weight: 400;
	.nickname-header {
		height: 160upx;
		.nickname-header-subtitle {
			@include sc($font-sm, #999999);
			margin-top: 24upx;
		}
	}
	.nickname-input {
		background-color: #f5f5f5;
		height: 72upx;
		@include sc($font-base, $mc-grey);
	}
	.modal-btn {
		font-size: 36upx;
	}
}
.uni-picker-container .uni-picker-action.uni-picker-action-confirm {
	color: $mc-primary;
}
</style>
