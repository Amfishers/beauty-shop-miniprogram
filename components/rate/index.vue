<template>
	<view class="b-rate">
		<view
			v-for="(star, index) in stars"
			:key="index" 
			:style="{ marginLeft: margin + 'px' }" 
			@click="_onClick(index)" 
			class="b-rate__icon"
		>
			<view 
				class="b-rate--offstar" 
				:style="{width: size+'px', height: size+'px'}"
			/>
			<view 
				:style="{ width: star.activeWitch.replace('%','')*size/100+'px', height: size+'px'}" 
				class="b-rate__icon-on b-rate--onstar"
			/>
		</view>
	</view>
</template>

<script>
/**
 * Rate 评分
 * @description 评分组件
 * @property {Number} value 当前评分
 * @property {Number} max 最大的评分
 * @property {Number} size 星星的大小
 * @property {Number} margin 星星的间距
 * @property {Boolean} disabled = [true|false] 是否为不可点击状态
 * @event {Function} change uniRate 的 value 改变时触发事件，e={value:Number}
 */
export default {
	name: "BRate",
	props: {
		size: {
			// 星星的大小
			type: [Number, String],
			default: 24
		},
		value: {
			// 当前评分
			type: [Number, String],
			default: 1.5
		},
		max: {
			// 最大评分
			type: [Number, String],
			default: 5
		},
		margin: {
			// 星星的间距
			type: [Number, String],
			default: 0
		},
		disabled: {
			// 是否可点击
			type: [Boolean, String],
			default: true
		}
	},
	data() {
		return {
			valueSync: ''
		};
	},
	computed: {
		stars() {
			const value = this.valueSync ? this.valueSync : 0;
			const starList = [];
			const floorValue = Math.floor(value);
			const ceilValue = Math.ceil(value);
			// console.log("ceilValue: " + ceilValue);
			// console.log("floorValue: " + floorValue);
			for (let i = 0; i < this.max; i++) {
				if (floorValue > i) {
					starList.push({
						activeWitch: "100%"
					});
				} else if (ceilValue - 1 === i) {
					starList.push({
						activeWitch: (value - floorValue) * 100 + "%"
					});
				} else {
					starList.push({
						activeWitch: "0"
					});
				}
			}
			return starList
		}
	},
	created() {
		this.valueSync = Number(this.value)
	},
	methods: {
		_onClick(index) {
			if (this.disabled) {
				return
			}
			this.valueSync = index + 1;
			this.$emit("change", {
				value: this.valueSync
			})
		}
	}
};
</script>

<style lang="scss">
.b-rate {
	display: flex;
	line-height: 0;
	font-size: 0;
	flex-direction: row;
	
	&__icon {
		position: relative;
		line-height: 0;
		font-size: 0;
	}
	
	&__icon-on {
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		line-height: 1;
		text-align: left;
	}
	&--offstar {
		background-image: url(../../static/star-disable.png);
		background-size: cover;
		background-repeat: no-repeat;
	}
	&--onstar {
		background-image: url(../../static/star.png);
		background-size: cover;
		background-repeat: no-repeat;
	}
}
</style>
