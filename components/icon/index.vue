<template>
  <text
    class="iconfont"
    :class="iconName"
    :style="style"
  />
</template>

<script>
import './iconfont/iconfont.css'
	
export default {
	name: 'BIcon',
	props: {
		icon: {
			type: String, 
			default: '' ,
		},
		color: { 
			type: String, 
			default: '' ,
		},
		fontSize: { 
			type: [String, Number], 
			default: '' ,
		}
	},
	computed: {
    iconName() {
      return `icon-${this.icon}`
    },
    style() {
      const fontSize = this.fontSize ? `font-size: ${Number(this.fontSize)}px;` : ''
      const color = this.color ? `color: ${this.color};` : ''

      return `${fontSize}${color}`
    },		
	}
}
</script>

<style lang="scss">
</style>
