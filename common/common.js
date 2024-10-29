//公共方法

function mapUrl(item) {
	if (item.page_type === 'product') {
		return `/pages/goods/goods?id=${item.page_id}`;
	} else if (item.page_type === 'store') {
		return `/pages/store/store?id=${item.page_id}`;
	} else if (item.page_type === 'special') {
		return `/pages/index/special?id=${item.page_id}`;
	} else if (item.page_type === 'coupon') {
		return `/pages/index/coupon?id=${item.page_id}`;
	} else if (item.page_type === 'article') {
		return `/pages/index/article?id=${item.page_id}`;
	} else if (item.page_type === 'meeting') {
		return `/pages/index/meeting?id=${item.page_id}`;
	} else if (item.page_type === 'link') { // 自定义连接样式直接跳转页面
		return item.page_id;
	} else {
		return `/pages/index/index`;
	}
}


function mapSellerUrl(item){
	if(item.id == '1'){
		return `/seller/fodderCenter?id=${item.id}`;
	}else if(item.id == '6'){
		return `/seller/handSlap/index?id=${item.id}`;
	}else if(item.id == '11'){
		return `/seller/conference/index?id=${item.id}`;
	}
}

function encodeImgUrl(url) {
	return encodeURI(url);
}

function con(url) {
	console.log(url);
}

function formatAmount(amount){
	return Math.round(amount*100)/100
}


export default {
	mapUrl,
	encodeImgUrl,
	con,
	mapSellerUrl,
	formatAmount
}
