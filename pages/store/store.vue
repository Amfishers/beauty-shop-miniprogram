<template>
	<view>
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">{{ storeDetail.name || '店铺详情'}}</block>
		</cu-custom>
				
		<VirtualStore v-if="type == 1" :sid.sync="storeId" />
		<PhysicalStore v-else :sid.sync="storeId" />
	</view>
</template>

<script>
import VirtualStore	from '@/components/store/virtualstore.vue'
import PhysicalStore	from '@/components/store/physicalstore.vue'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
	components: {
		VirtualStore,
		PhysicalStore
	},
	data() {
		return {
			storeId: null,
			type: ''  //0：实物 1：虚拟
		}
	},
	computed: {
		...mapState({
			storeDetail: state => state.stores.storeDetail,
			locationInfo: state => state.user.locationInfo,
		}),
	},
	async onLoad(option) {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		
		const { id, type} = option 
		this.storeId = id
		this.type = type

		// 设置当前 store id
		this.SET_STORE_ID(this.storeId)
		if (this.type == 1) {
			// 获取 store 详情
			await this.GET_STORE_DETAIL()
			
			// 	获取门店商品
			const parms = {
				store_id: this.storeId
			}
			await this.GET_STORE_GOODS(parms)
			
			const locationParams = {
				...this.locationInfo,
				order_by: 'distance:asc'
			}
			await this.GET_STORE_NEAREST(locationParams)
		}else {
			// 获取 store 详情
			await this.GET_STORE_DETAIL()
			// 	获取门店商品
			const parms = {
				store_id: this.storeId,
			}
			await this.GET_STORE_GOODS(parms)
		}

		uni.hideLoading()
	},
	methods: {
		...mapActions({
			GET_STORE_DETAIL: 'stores/GET_STORE_DETAIL',
			GET_STORE_GOODS: 'stores/GET_STORE_GOODS',
			GET_STORE_NEAREST: 'stores/GET_STORE_NEAREST',
		}),		
		...mapMutations({
			SET_STORE_ID: 'stores/SET_STORE_ID',
		}),
	},
}
</script>

<style lang="scss">
page {
	background-color: $bg-color;
}
</style>
