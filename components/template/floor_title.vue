<template>
	<view>
		<view class="bg-white">
			<view class="floor-header">
				<view class="floor-name">
					{{ title }}
					<text>{{ sub_title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
		},
		sub_title: {
			type: String,
		},
	}
};
</script>

<style lang="scss">
.floor-header {
	padding-left: 32upx;
	height: 100upx;
	display: flex;
	flex-direction: row;
	align-items: flex-end;
}
.floor-name {
	@include sc(40upx, $mc-grey);
	font-weight: 600;
	padding-bottom: 26upx;
	text {
		font-size: 26upx;
		font-weight: 400;
		line-height: 37upx;
		padding-left: 16upx;
	}
}
</style>
