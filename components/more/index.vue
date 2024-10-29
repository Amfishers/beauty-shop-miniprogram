<template>
  <view class="more flex align-center justify-center" @click="_navigate(url)">
    <text class="more-text">{{ moreText }}</text>
    <image class="more-img" :src="image_path+'/more.png'"></image>
  </view>
</template>

<script>
export default {
  name: "more-item",
  props: {
    url: {
      type: String
    },
    moreText: {
      type: String,
      default: "查看更多"
    }
  },
  data() {
    return {
		image_path:this.$cfg.image_path
	};
  },
  methods: {
    _navigate(url) {
      if (url) {
        uni.navigateTo({
          url
        });
      } else {
        this.$emit("moreAction");
      }
    }
  }
};
</script>

<style lang="scss">
.more {
  width: 100%;
  margin-top: 43upx;
  .more-text {
    font-size: 28upx;
    font-weight: 400;
    color: #333;
    vertical-align: middle;
  }

  .more-img {
    width: 28upx;
    height: 28upx;
    margin-left: 12upx;
    vertical-align: middle;
  }
}
</style>
