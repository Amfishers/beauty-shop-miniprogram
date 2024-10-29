<template>
	<view class="reco-you">
		<view class="main-title reco-you__title">
			<text class="title">为您推荐</text>
			<text class="subtitle">精彩不断</text>
		</view>
		
		<view class="reco-you__card">
			<view class="reco-you__card-bg"></view>
			<view class="reco-you__card--grid">
				<view 
					class="reco-you__card--grid-item" 
					v-for="(item, index) in cardData" 
					:key="item + 'grid'"
				>
					<Card
						:img="item.img"
						badge="活动价"
						:title="item.title"
						:price="item.price"
						:originPrice="item.originPrice"
						:description="item.description"
					/>
				</view>
			</view>
			<view class="reco-you__card--list">
				<view 
					class="reco-you__cardlist-item" 
					v-for="(item, index) in cardData" 
					:key="index + 'line'"
				>
					<CardLine
						:img="item.img"
						badge="活动价"
						:title="item.title"
						:price="item.price"
						:originPrice="item.originPrice"
						:description="item.description"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Card from '../card/card'
import CardLine from '../card/cardline'
export default {
	components: {
		Card,
		CardLine
	},
	data() {
		return {
			cardData: [
				{
					img: require('@/static/index/reco-you.png'),
					title: '威古氏【床上用品】舒适自然洁净威古氏【床上用品】舒适自然洁净',
					price: 6.9,
					originPrice: 8.8,
					description: '123人订购'
				},
				{
					img: require('@/static/index/reco-you.png'),
					title: '威古氏【床上用品】舒适自然洁净威古氏【床上用品】舒适自然洁净',
					price: 6.9,
					originPrice: 8.8,
					description: '123人订购'
				},
			]
		}
	}
}
</script>

<style lang="scss">
.reco-you {
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
	
	&__card {
		position: relative;
		
		&--grid {
			position: relative;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			
			&-item {
				width: 50%;
			}
		}
		
		&-bg {
			@include absolute-t-l(0,-32upx);
			right: -32upx;
			bottom: 0;
			background-color: $bg-color;
			z-index: -1;
		}
	}
		
}
</style>
