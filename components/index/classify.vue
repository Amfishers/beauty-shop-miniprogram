<template>
	<view class="">
		<view class="activity">
			<view class="giftbag">
				<view class="giftbag__bg" :style="{'background-image': url(image_path + '/index/new.png')}">
					<text class="giftbag__text">点击领取</text>
				</view>
			</view>
			<view class="subsidy">
				<view class="subsidy__title">百亿补贴</view>
				<view class="subsidy__main">
					<view class="subsidy__img">
						<view :style="{'background-image': url(image_path + '/index/subsidy.png')}"></view>
					</view>
					<view class="subsidy__img">
						<view :style="{'background-image': url(image_path + '/index/subsidy.png')}"></view>
					</view>
					<view class="subsidy__img">
						<view :style="{'background-image': url(image_path + '/index/subsidy.png')}"></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="classify">
			<view 
				class="classify__item" 
				v-for="(item, index) in classifyData"
				:key="index"
			>
				<view class="classify__item-img" :style="{'background-image': `url(${item.img})`}" />
				<view class="classify__item-btn primary-btn">
					{{ item.text }}
				</view>
			</view>
		</view>
	</view>
		
</template>

<script>
export default {
	props: {
		classifyData: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			image_path: this.$cfg.image_path,
		}
	},
}
</script>

<style lang="scss">

.activity {
	margin-top: 36upx;
	display: flex;
	justify-content: space-between;
	
	& > view {
		width: 50%;
	}
	
	.giftbag {
		position: relative;
		margin-right: 10upx;
		&__bg {
			width: 340upx;
			height: 216upx;
			background-size: cover;
		}
		&__text {
			@include absolute-t-r(135upx,90upx);
			width: 160upx;
			height: 50upx;
			text-align: center;
			font-size: 28upx;
			line-height: 50upx;
		}
	}
	.subsidy {
		background-color: rgba(245,219,195,0.12);
		border-radius: 16upx;
		text-align: center;
		margin-left: 10upx;
		
		&__title {
			position: relative;
			display: inline-block;
			margin: 12upx auto 0;
			font-size: 32upx;
			line-height: 45upx;
			
			&::before,
			&::after{ 
				content: "";
				position: absolute; 
				top: 50%;
				width: 20upx;
				height: 1px;
				background-color: $primary-color;
				transform: translate(0,50%);
			}
			&::before {
				left: -30upx;
			}
			&::after {
				right: -30upx;
			}
		}
		
		&__main {
			margin-top: 36upx;
			display: flex;
			align-items: center;
		}
		
		&__img {
			flex: 1;
			width: 33.333%;
			
			& > view {
				padding-top: 100%;
				background-size: contain;
			}
		}
	}
}

.classify {
	margin-top: 48upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	&__item {
		position: relative;
		margin: 0 7.5upx;
		
		&:first-child {
			margin-left: 0;
		}
		
		&:last-child {
			margin-right: 0;
		}

		&-img {
			@include wh(164upx, 240upx);
			background-size: cover;
		}
		
		&-btn {
			@include absolute-b-l(14upx, 30upx);
			width: 108upx;
			height: 32upx;
			line-height: 32upx;
			text-align: center;
			font-size: 22upx;
			border-radius: 16upx;
		}
	}
}


</style>
