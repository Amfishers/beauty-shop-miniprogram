<template>
	<view class="search">
		<cu-custom isBack bgColor="bg-white-heavy">
			<block slot="content">搜索</block>
		</cu-custom>
				
		<view class="search-bar">
			<view class="search-input">
				<BIcon icon="search" />
				<input 
					type="text" 
					v-model="search" 
					placeholder-class="input-placeholder"
					class="search-input__input"
					:placeholder="placeholder"
					@confirm="searchConfirm"
					:focus="inputfocus"
					confirm-type="search"
				/>
			</view>
			<view class="search-cancel" @tap="cancelSearch">取消</view>
		</view>
		<!-- 首次进入搜索页，出现该页面，否则进入搜索页 -->
		<view class="main-pad">
			<view class="search-recommend search-history">
				<view class="search-title">
					<text class="title">历史搜索</text>
					<BIcon @tap="resetHistory" icon="delete-outline" font-size="18" />
				</view>
				<view class="search-item">
					<template v-if="history.length">
						<view 
							class="item"
							v-for="(his, index) in history"
							:key="his"
							@tap="linkToSearch(his)"
						>
							{{ his }}
						</view>
					</template>
					<view v-else class="search-empty">
						暂无搜索记录~
					</view>
				</view>
			</view>
			<view class="search-recommend">
				<view class="search-title">
					<text class="title">推荐搜索</text>
				</view>
				<view class="search-item">
					<template v-if="recommend.length">
						<view 
							class="item"
							v-for="(rec, index) in recommend"
							:key="rec"
							@tap="linkToSearch(rec)"
						>
							{{ rec }}
						</view>
					</template>				
					<view v-else class="search-empty">
						暂无推荐内容~
					</view>
				</view>
			</view>
		
		</view>
	</view>
</template>

<script>
import searchServive from '@/services/search.js'
import { getStorage, setStorage, unique } from '@/utils/helper.js'

export default {
	props: {
		placeholder: {
			type: String,
			default: '搜索关键词'
		},
	},
	data() {
		return {
			inputfocus: false,
			storageKey: '_BEAUTY_SEARCH_HISTORY',
			search: '',
			history: [],
			recommend: [],
			firstLoad: true,
			tabsData: {},
			currKeyword: '',
		}
	},
	onLoad() {
		// 获取历史搜索记录
		let searchHistory = getStorage(this.storageKey)
		searchHistory = searchHistory ? searchHistory : []
		this.history = searchHistory
		// 获取推荐关键词
		this.getHotKeywords()
		this.$nextTick(function(){
			this.inputfocus = true
		})
	},
	methods: {
		async getHotKeywords() {
			try{
				const resData = await searchServive.getSearchByKeyword()
				const { data } = resData
				this.recommend = data ? data.items : []
			}catch(e){
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			}
		},
		linkToSearch(keyword) {
			// 记录上一次搜索
			this.setSearchStorage(keyword)
			
			uni.navigateTo({
				url: '/pages/index/search_list?keyword=' + keyword
			})
		},
		setSearchStorage(value) {
			if (!value) return
			// 最大储存搜索的个数
			const maxNum = 14
			let searchHistory = this.history
			let storageData = [...searchHistory]
			
			// 添加并去重
			storageData.unshift(value)
			storageData = unique(storageData)
			
			if (storageData.length > maxNum) {
				// 获取最新搜索的历史
				storageData = storageData.splice(0, maxNum)
			}

			setStorage(this.storageKey, storageData)
			this.history = storageData
		},
		resetHistory() {
			this.history = []
			setStorage(this.storageKey, [])
		},
		searchConfirm() {
			uni.hideKeyboard()
			this.linkToSearch(this.search)
		},
		cancelSearch() {
			this.search = ''
			// this.firstLoad = true
			// uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
			// 	delta: 1
			// })
		},
	},
}
</script>

<style lang="scss">
.search {
	
	&-bar {
		padding: 0 32upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	&-cancel {
		padding-left: 40upx;
		line-height: 68upx;
		font-size: 30upx;
	}
	
	&-input {
		flex: 1;
		position: relative;
		padding-left: 84upx;
		background-color: $bg-color;
		border-radius: 34upx;
		height: 68upx;
		
		.iconfont {
			@include absolute-t-l(50%,28upx);
			transform: translateY(-50%);
			color: #999999;
		}
		
		&__input {
			line-height: 68upx;
			height: 68upx;
		}
	}
	
	&-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		line-height: 45upx;
		
		.title {
			font-weight: 500;
		}
		
		.iconfont {
			color: #999;
		}
	}
	
	&-recommend {
		margin-top: 48upx;
	}
	
	&-item {
		font-size: 0;
		margin-top: 28upx;
		margin-left: -48upx;
		
		.item {
			display: inline-block;
			padding: 0 30upx;
			background-color: $bg-color;
			border-radius: 26upx;
			line-height: 52upx;
			margin: 14upx 0 14upx 48upx;
			font-size: 26upx;
		}
	}
	
	&-empty {
		margin-left: 48upx;
		color: #999999;
		font-size: 24upx;
		text-align: center;
	}
	
	// 搜索结果
	&-result {
		.tab-nav {
			margin-top: 24upx;
		}
		.tab-nav__main {
			padding: 0 32upx;
		}
	}
}

.input-placeholder {
	color: #CCCCCC;
	font-size: 24upx;
}
</style>
