<template>
	<view class="bg-white">
		<floor_title v-if="resdata.title" :title="resdata.title" :sub_title="resdata.sub_title" />
		
		<view class="padding-bottom">
			
			<block v-for="(item, index) in resdata.item_data" :key="index">
				<navigator class="box-shadow store" :url="'/pages/store/store?id=' + item.id">
					<view class="right-main">
						<view class="pic"><image :src="item.cover_pic"></image></view>
						<view class="info">
							<view class="store-name text-cut">
								<text>{{ item.name }}</text>
							</view>
							<view class="star"><rate :score="item.stars" disabled></rate></view>
							<view class="serveds text-black" v-show="item.serveds >= 0">已服务：{{ item.serveds }}人次</view>
							<view class="distance text-gray">
								距您
								<text>{{ shoDistance(item.longitude,item.latitude) }}</text>
							</view>
						</view>
					</view>
					<view class="address text-cut">
						<text>地址：</text>
						<text>{{ item.address }}</text>
					</view>
				</navigator>
			</block>
			<more :url="'/pages/store/list'" />
		</view>
	</view>
</template>

<script>
import lib from '@/common/common.js';
import rate from '../../components/rate.vue';
import floor_title from '@/components/template/floor_title.vue';
import { mapState, mapActions } from 'vuex';
import more from '@/components/more/index.vue';
export default {
	components: {
		floor_title,
		rate,more
	},
	props: {
		resdata: [Array, Object],
	},
	data() {
		return {
			distance: '距离您2公里'
		};
	},
	computed: {
		...mapState('user', ['ad_info']),
		shoDistance(){
			return (lng,lat)=> {
				const l2 = this.ad_info.location;
				if (!lng) return '';
				if (!lat) return '';
				if (!l2.lat) return '';
				if (!l2.lng) return '';
				const distance = this.getDistance({
					lat1: lat,
					lng1: lng,
					lat2: l2.lat,
					lng2: l2.lng
				});
				if (distance < 1) return distance * 1000 + ' m';
				return distance + ' km';
			}
		},
		getStoreDistance(lng,lat) {
			const l2 = this.ad_info.location;
			if (!lng) return '';
			if (!lat) return '';
			if (!l2.lat) return '';
			if (!l2.lng) return '';
			const distance = this.getDistance({
				lat1: lat,
				lng1: lng,
				lat2: l2.lat,
				lng2: l2.lng
			});
			if (distance < 1) return distance * 1000 + ' m';
			return distance + ' km';
		}
	},
	methods: {
		mapUrl(item) {
			return lib.mapUrl(item);
		},
		getDistance({ lat1, lng1, lat2, lng2 }) {
		  const radLat1 = (lat1 * Math.PI) / 180.0;
		  const radLat2 = (lat2 * Math.PI) / 180.0;
		  const a = radLat1 - radLat2;
		  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
		  let s =
		    2 *
		    Math.asin(
		      Math.sqrt(
		        Math.pow(Math.sin(a / 2), 2) +
		          Math.cos(radLat1) *
		            Math.cos(radLat2) *
		            Math.pow(Math.sin(b / 2), 2)
		      )
		    );
		  s = s * 6378.137; // EARTH_RADIUS;
		
		  return s.toFixed(3); // km
		}
	}
};
</script>

<style lang="scss">
.box-shadow {
	box-shadow: 0 0 30upx rgba(0, 0, 0, 0.2);
	box-shadow: 0 0 30upx 2upx rgba(0, 0, 0, 0.08);
}
.store {
	border-radius: 32upx;
	margin: 0 32upx 32upx 32upx;
	padding: 24upx;
}
.right-main {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}
.store-name {
	color: #333333;
	font-weight: 600;
	font-size: 28upx;
	height: 40upx;
	margin-bottom: 10upx;
}
.star,
.serveds {
	height: 40upx;
	margin-bottom: 10upx;
	font-size: 24upx;
}
.distance {
	height: 40upx;
	margin-top: 10upx;
	font-size: 24upx;
}

.pic {
	image {
		width: 200upx;
		height: 200upx;
	}
}
.info {
	height: 200upx;
	padding-left: 24upx;
	width: 416upx;
}
.address {
	color: #666;
}
</style>
