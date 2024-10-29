<template>
	<view>
		<view class="cu-custom" :style="[{ height: customBar + 'px' }]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<BIcon icon="left"></BIcon>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="BackHome" v-else-if="isHome">
					<BIcon icon="left"></BIcon>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="BackUrl" v-else-if="isUrl">
					<BIcon icon="left"></BIcon>
					<slot name="backText"></slot>
				</view>
				<view class="action" v-else-if="isBackTwo">
					<slot name="backText"></slot>
				</view>

				<view class="content" :style="[{ top: statusBar + 'px' }]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	
	export default {
		name: 'cu-custom',		
		data() {
			return {
				// StatusBar: this.StatusBar,
				// CustomBar: this.CustomBar
				statusBarHeight: 0,
				customBarHeight: 0,
			}
		},
		computed: {
			...mapState({
				statusBar: state => state.statusBar,
				customBar: state => state.customBar,
			}),
			style() {
				var bgImage = this.bgImage;
				var style = `height:${this.customBar}px;padding-top:${this.statusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style;
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			isHome: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			isUrl: {
				type: String,
				default: ''
			},
		},
		created() {
			
			let statusBar = uni.getSystemInfoSync()['statusBarHeight']
			let custom = wx.getMenuButtonBoundingClientRect()
			let customHeight = custom.bottom + custom.top - statusBar
			this.customBarHeight = customHeight
			this.statusBarHeight = statusBar
		
			this.$store.commit('SET_CUSTOM_BAR', customHeight)
			this.$store.commit('SET_STATUS_BAR', statusBar)
		},
		methods: {
			BackPage() {
				// console.log(getCurrentPages());
				// console.log(__wxConfig);
				// 重写返回规则，如果直接扫码进入某个页面，则直接返回首页
				// #ifdef MP-WEIXIN
				if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
					let url = '/' + __wxConfig.pages[0];
					if (getCurrentPages().length == 1) {
						return uni.switchTab({
							url
						});
					} else {
						return uni.redirectTo({
							url
						});
					}
				}
				// #endif

				// #ifdef H5
				if (getCurrentPages().length == 1) {
					return uni.reLaunch({
						url: '/pages/index/index'
					})
				}
				// #endif
				uni.navigateBack({
					delta: 1
				});
			},
			BackHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			BackUrl() {
				uni.navigateTo({
					url: this.isUrl
				})
			}
		}
	};
</script>

<style>
.bg-plus{
	background-color: rgb(49,46,54);
	color: #ffffff;
}
</style>
