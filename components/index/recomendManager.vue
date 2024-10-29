<template>
	<view class="reco-manager">
		<view class="main-title reco-manager__title">
			<text class="title">店长推荐</text>
			<text class="subtitle">亲身体验 好评不断</text>
		</view>
		
		<view class="reco-manager__main">
			<view class="reco-manager__box total">
				<view class="box">
					<!--<image src="../../static/index/reco-1.png" mode=""></image>-->
				</view>
			</view>
			<view class="reco-manager__box half">
				<view class="box">
					<!--<image src="../../static/index/reco-2.png" mode=""></image>-->
				</view>
				<view class="box">
					<!--<image src="../../static/index/reco-3.png" mode=""></image>-->
				</view>
			</view>
		</view>
	</view>
</template>

<script>

</script>

<style lang="scss">
.reco-manager {
	&__title {
		.title {
			display: inline-block;
			padding-left: 20upx;
			font-size: 32upx;
			line-height: 45upx;
		}
		.subtitle {
			padding-left: 16upx;
			color: #999999;
			font-size: 24upx;
		}
	}
	
	&__main {
		position: relative;
		margin-top: 20upx;
	}
	
	&__box {
		width: 50%;
		
		image {
			display: block;
			width: 100%;
			max-width: 100%;
			max-height: 100%;
		}
		
		&.total .box {
			margin-right: 10upx;
			// @include wh(338upx, 378upx);
			// overflow: hidden;
		}
		
		&.half {
			position: absolute;
			top: 0;
			right: 0;
			width: 50%;
			height: 100%;
		}
		
		&.half .box {
			width: 100%;
			height: calc(50% - 5upx);
			
			&:first-child {
				margin-bottom: 10upx;
			}
		}
	}
}
</style>
