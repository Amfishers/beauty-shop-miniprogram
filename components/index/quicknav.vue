<template>
	<view class="quick-nav">
		<view 
			v-for="(item, index) in listData" 
			:key="index"
			class="quick-nav__item"
		>
			<image class="quick-nav__img" :src="item.img" mode="aspectFit"></image>
			<text class="quick-nav__text">{{ item.text }}</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		listData: {
			type: Array,
			default: () => []
		},
	}
}
</script>

<style lang="scss">
@import '@/assets/mixin';

.quick-nav {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	
	&__item {
		width: 25%;
		padding: 12upx;
		text-align: center;
		box-sizing: border-box;
	}
	
	&__img {
		width: 90upx;
		height: 90upx;
	}
	
	&__text {
		display: block;
		color: $primary-color;
		font-size: 14px;
		@include ellipsis();
	}
}
</style>
