<template>
	<view style="margin-top: 160px;">
		
		<view 
			v-for="(item, index) in cardStore" 
			:key="item.id"
		>
			<CardStore
				:name="item.name"
				:rate="item.rate"
				:storeImg="item.storeImg"
			/>
		</view>
	</view>
</template>

<script>
import CardServe from '@/components/card/cardserve'
import CardStore from '@/components/card/cardstore'

export default {
	components: {
		CardServe,
		CardStore,
	},
	data() {
		return {
			cardData: [],
			cardStore: [],
		}
	},
	methods: {
		
	},
}
</script>

<style lang="scss">
page {
	background-color: #FCF7E9;
}
</style>
