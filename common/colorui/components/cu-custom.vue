<template>
	<view>
		<view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="BackHome" v-else-if="isHome">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" @tap="BackUrl" v-else-if="isUrl">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" v-else-if="isBackTwo">
					<slot name="backText"></slot>
				</view>

				<view class="content" :style="[{ top: StatusBar + 'px' }]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				console.log('CustomBar', CustomBar)
				console.log('StatusBar', StatusBar)
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
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
