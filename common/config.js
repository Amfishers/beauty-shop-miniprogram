const image_path = "https://jelyon-1302252586.cos.ap-guangzhou.myqcloud.com/shop/wxapp/static"
let api_path = "https://wx.conia.com.cn/api/v1" // 生产环境

// if (process.env.NODE_ENV === 'development') {
// 	api_path = "https://api.test.amhjmy.com" // 开发环境
// 	uni.showToast({
// 		title: process.env.NODE_ENV,
// 		icon: 'none'
// 	})
// }
// console.log(api_path);

export default {
	//默认图片地址
	api_path: api_path,
	image_path: image_path,

	default_qc_code: `${image_path}/qccode/hjmini.jpg`,
	default_wx_code: `${image_path}/qccode/hjminiwx.jpg`,
	default_bg_coupon: `${image_path}/bg/bg_coupon.png`,
	order_status_img: [
		`${image_path}/order/00.png`,
		`${image_path}/order/01.png`,
		`${image_path}/order/02.png`,
		`${image_path}/order/03.png`,
		`${image_path}/order/04.png`,
		`${image_path}/order/05.png`,
		`${image_path}/order/06.png`,
	],
	order_service_status_img: `${image_path}/order/11.png`,

	// 默认分页数
	page_size: 20,
	reg: { // 常用正则
		amount: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
		phone: /^1[0-9]{10,10}$/,
		password: /^.{6,16}$/,
	},

	// 获取客户端类型，目前仅支持H5和微信小程序
	get_client() {
		let $client
		uni.getProvider({
			service: 'oauth',
			success: (res) => {
				console.log(res);
				console.log(res.provider.indexOf('weixin'));
				if (res.provider.includes('weixin')) { // 当前为小程序环境
					$client = "weixin"
				} else { // 当前为H5环境
					$client = "h5"
				}
			}
		});
		return $client
	},
	isWechat() { // 判断当前环境是否为微信公众号环境
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	// 订单状态信息
	getOrderStatusMsg(order_type, order_status) {
		let orderMsg = [{
				order_type: [1, 2],
				order_status: 0, //实物订单付款
				status: '待付款',
				notice: '订单已提交', // ，剩余付款时间 59：10
				info: '已下单，待支付' //状态说明
			},
			{
				order_type: [1],
				order_status: 1, //实物订单付款
				status: '待发货',
				notice: '订单已接收，将尽快发货～',
				info: '实物订单已下单，待发货'
			},
			{
				order_type: [2],
				order_status: 1, //服务订单付款
				status: '待服务',
				notice: '门店已接单，等待到店服务～',
				info: '服务订单已下单，等待到店扫码验证'
			},
			{
				order_type: [1],
				order_status: 2,
				status: '待收货',
				notice: '订单已发货，请注意查收～',
				info: '已发货，待收货'
			},
			{
				order_type: [2],
				order_status: 2,
				status: '服务中',
				notice: '订单服务中，请到店服务～',
				info: '已服务1次或以上，还有未完成服务次数，可多次验证'
			},
			{
				order_type: [1, 2],
				order_status: 3,
				status: '待评价',
				notice: '您的建议是对我们最大支持哦～',
				info: '服务完成或已确认收货'
			},
			{
				order_type: [1, 2],
				order_status: 4,
				status: '已完成',
				notice: '订单已完成，欢迎再次购买～',
				info: '订单完成，进入返利和账单队列'
			},
			{
				order_type: [1, 2],
				order_status: 5,
				status: '已关闭',
				notice: '超时未支付，订单自动关闭～',
				info: '超时订单自动关闭，无效订单'
			},
			{
				order_type: [1, 2],
				order_status: 6,
				status: '退款订单',
				notice: '该订单已失效～',
				info: '已申请退款，并处理完成的订单'
			}
		]
		let item = orderMsg.filter(v => (v.order_type.includes(parseInt(order_type)) && v.order_status == parseInt(
			order_status)))
		if (item.length > 0) {
			return item[0]
		} else {
			return false
		}
	},
	// 订单退款状态信息
	getOrderRefoundMsg(order_type, order_status) {
		let refoundMsg = [{
				order_type: [0],
				order_status: 0, //实物订单退款
				status: '已申请退款',
				notice: '退款申请已提交，等待平台确认',
				info: '实物订单由平台进行审核，超时1天自动确认退款'
			},
			{
				order_type: [1],
				order_status: 0, //服务订单退款
				status: '已申请退款',
				notice: '退款申请已提交，等待门店确认～',
				info: '用户申请退款后，由门店确认退款，超时1天自动确认退款'
			},
			{
				order_type: [0],
				order_status: 1,
				status: '退货中',
				notice: '平台已审核，请注意审核说明～',
				info: '平台审核订单后，需将商品邮寄到备注信息中指定的地址'
			},
			{
				order_type: [1],
				order_status: 1,
				status: '待平台确认',
				notice: '门店已审核，等待平台确认～',
				info: '门店已审核后，由平台处理退款确认'
			},
			{
				order_type: [0, 1],
				order_status: 2,
				status: '已退款',
				notice: '平台处理退款已完成，资金到位可能会有延迟～',
				info: '平台处理退款确认，并将资金原路返回到用户支付账户'
			}
		]
		let item = orderMsg.filter(v => (v.order_type.includes(parseInt(order_type)) && v.order_status == parseInt(
			order_status)))
		if (item.length > 0) {
			return item[0]
		} else {
			return false
		}
	},
	getCouponMsg() {
		let couponMsg = [{
				amountType: [0, 1], // 优惠券=0，红包=1
				canReceive: 2,
				status: "不可领取",
				notice: '已经领完啦...',
				image: `${image_path}/font/order_status/has_pack.png`
			},
			{
				amountType: [0], // 优惠券=0，红包=1
				canReceive: 1,
				status: "可领取",
				notice: '红包已领完',
				image: `${image_path}/font/order_status/has_pack.png`
			},
			{
				amountType: [1], // 优惠券=0，红包=1
				canReceive: 1,
				status: "可领取",
				notice: '拼手气红包，金额随机',
				image: `${image_path}/font/order_status/has_pack.png`
			},
		]
	}
}
