function formatMoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

function formatPrice(price){
    if(price == 0){
      return "Giá thỏa thuận";
    }
    if(price.toString().length <= 9){
        return price / 1000000 + " triệu";
    }
    if(price.toString().length > 9){
        return price / 1000000000 + " tỷ";
    }
}

export {formatMoney,formatPrice}