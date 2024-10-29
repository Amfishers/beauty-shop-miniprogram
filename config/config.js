let api_path = "https://manage.jelyon.cn/api/v1" // 生产环境

// if (process.env.NODE_ENV === 'development') {
// 	api_path = 'https://wx.conia.com.cn/api/v1' // 开发环境
// 	uni.showToast({
// 		title: process.env.NODE_ENV,
// 		icon: 'none'
// 	})
// }

const env = {
	debug: true,
	baseURL: api_path
}


export default env
