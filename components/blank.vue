<template>
  <view class="blank bg-white flex flex-direction align-center justify-center">
    <image
      class="blank-img"
      :src="image_path+'/blank/'+ blankData[type].icon + '.png'"
    />
    <text class="blank-text">{{blankData[type].name}}</text>
  </view>
</template>

<script>
export default {
  name: "blank-item",
  props: {
    type: {
      type: String,
      default: 'data'
    }
  },
  data() {
    return {
	image_path: this.$cfg.image_path,
      blankData: {
        'data': {
          name: '暂无数据',
          icon: 'data'
        },
        'data-2': {
          name: '暂无数据',
          icon: 'data-2'
        },
        'message': {
          name: '暂无消息',
          icon: 'message'
        },
        'order': {
          name: '暂无相关订单',
          icon: 'order'
        },
        'evaluate': {
          name: '暂无评价',
          icon: 'evaluate'
        },
        'evaluate-order': {
          name: '暂无可评价订单',
          icon: 'evaluate-order'
        },
        'goods': {
          name: '暂无商品',
          icon: 'goods'
        },
        'after-sale': {
          name: '没有申请售后',
          icon: 'after-sale'
        },
        'service': {
          name: '客服已休息',
          icon: 'service'
        },
        'service': {
          name: '客服已休息',
          icon: 'service'
        },
        'add-goods': {
          name: '点击按钮添加商品',
          icon: 'add-goods'
        },
        'red-package': {
          name: '暂无可用红包',
          icon: 'red-package'
        },
        'income': {
          name: '暂无可用收益',
          icon: 'income'
        },
        'address': {
          name: '暂无收货地址',
          icon: 'address'
        },
        'more-goods': {
          name: '没有更多商品',
          icon: 'more-goods'
        },
        'load': {
          name: '加载失败',
          icon: 'load'
        },
      }
    };
  }
};
</script>

<style lang="scss">
.blank {
  @include wh(100%, 100%);
  position: absolute;
  left: 0;
  top: 0;
  .blank-img {
    @include wh(240upx, 240upx);
  }
  .blank-text {
    @include sc($font-base, $primary-color);
    font-weight: 400;
    margin-top: 28upx;
  }
}
</style>
