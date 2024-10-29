<template>
	<view>
		<cu-custom bgColor="bg-white-heavy" :isBack="false"><block slot="content">商品分类</block></cu-custom>

		<view class="VerticalBox" :style="{'top': customBar + 'px;'}">
			<scroll-view class="VerticalNav nav bg-white" scroll-y scroll-with-animation :scroll-top="verticalNavTop" :style="styleList">
				<view class="cu-item" :class="index == tabCur ? ' text-main cur' : ''" v-for="(item, index) in page_data" :key="index" @tap="TabSelect" :data-id="index">
					<view class="cu-item-text">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>

			<scroll-view class="VerticalMain" scroll-y scroll-with-animation :style="styleList" :scroll-into-view="'main-' + mainCur" @scroll="VerticalMain">
				<view class="VerticalMain-item" v-for="(item, index) in page_data" :key="index" :id="'main-' + index">
					<view class="cu-bar">
						<view class="action">
							{{ item.name }}
						</view>
					</view>
					<view class="cate-item  bg-white">
						<view class="flex flex-wrap flex-row justify-start">
							<navigator
								:url="'/pages/goods/list?type=' + cate.show_status + '&keyword=' + cate.name"
								v-for="(cate, sort) in item.childs"
								:key="sort"
								class="g3 flex flex-column justify-center cinfo"
							>
								<view class="flex flex-row justify-center"><image class="pic" :src="cate.cover_pic" mode="widthFix"></image></view>
								<view class="catename">
									<text>{{ cate.name }}</text>
								</view>
							</navigator>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	
		<TabBar pageCur="category" />
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters  } from 'vuex'	
import network from '@/utils/network'
import TabBar from '@/components/tabbar/index.vue'

export default {
	components: {
		TabBar,
	},
	data() {
		return {
			list: [],
			tabCur: 0,
			mainCur: 0,
			verticalNavTop: 0,
			load: true,
			page_data: []
		};
	},
	computed: {
		...mapState({
			customBar: state => state.customBar,
		}),
		styleList() {
			return `height:calc(100vh - ${this.customBar}px - 100rpx - env(safe-area-inset-bottom) / 2);`
		},
	},
	onLoad() {
		uni.hideTabBar()
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		let list = [{}];
		for (let i = 0; i < 26; i++) {
			list[i] = {};
			list[i].name = String.fromCharCode(65 + i);
			list[i].id = i;
		}
		this.list = list;
		this.listCur = list[0];
		this.__init();
	},
	onReady() {
		uni.hideLoading();
	},
	methods: {
		async __init() {
			try{
				const resData = await network.get('/shop/category')
				this.page_data = resData.data;
			}catch(e){
				//TODO handle the exception
			}
		},
		TabSelect(e) {
			this.tabCur = e.currentTarget.dataset.id;
			this.mainCur = e.currentTarget.dataset.id;
			this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50;
		},
		VerticalMain(e) {
			// #ifdef MP-ALIPAY
			return false; //支付宝小程序暂时不支持双向联动
			// #endif
			let that = this;
			let tabHeight = 0;
			if (this.load) {
				for (let i = 0; i < this.list.length; i++) {
					let view = uni.createSelectorQuery().select('#main-' + this.list[i].id);
					view.fields(
						{
							size: true,
							 scrollOffset: true
						},
						data => {
							console.log("得到节点信息" + JSON.stringify(data));
							if(data){
								this.list[i].top = tabHeight;
								tabHeight = tabHeight + data.height;
								this.list[i].bottom = tabHeight;
							}
						}
					).exec();
				}
				this.load = false;
			}
			let scrollTop = e.detail.scrollTop + 10;
			for (let i = 0; i < this.list.length; i++) {
				if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
					this.verticalNavTop = (this.list[i].id - 1) * 50;
					this.tabCur = this.list[i].id;
					return false;
				}
			}
		}
	}
};
</script>

<style lang="scss">
page {
	overflow: hidden;
}
.text-main {
	color: $mc-primary;
}
.cate-item {
	padding: 0 0 36upx;
	text-align: center;
}
.pic {
	width: 90upx;
	height: 90upx;
}
.catename {
	line-height: 34upx;
	margin-top: 12upx;
	color: #666;
	font-size: 24upx;
	@include ellipsis;
}
.cinfo {
	margin: 14upx 0;
}
.g3 {
	width: 33.333333%;
	text-align: center;
	height: 33.333333%;
}
.fixed {
	position: fixed;
	z-index: 99;
}

.VerticalNav.nav {
	width: 200upx;
	white-space: initial;
}

.VerticalNav.nav .cu-item {
	width: 100%;
	text-align: center;
	background-color: #fff;
	margin: 0;
	border: none;
	height: 50px;
	position: relative;
}

.VerticalNav.nav .cu-item.cur {

}

.VerticalNav.nav .cu-item.cur .cu-item-text {
	margin: 6px auto;
	background-color: $primary-color;
	border-radius: 28px;
	color: $secondary-color;
	line-height: 38px;
}

.VerticalBox {
	position: absolute;
	left: 0;
	right: 0;
	bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
	display: flex;
	height: 100%;
}

.VerticalMain {
	background-color: $bg-color;
	flex: 1;
}

.VerticalMain-item {
	margin: 24upx;
	background-color: #FFF;
	border-radius: 16upx;
	overflow: hidden;
}

.cu-bar .action {
	color: $primary-color;
	font-size: 32upx;
	font-weight: 500;
}
</style>
