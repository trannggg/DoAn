import { useState, useEffect } from 'react'
import { getMethod ,deleteMethod, postMethod, postMethodPayload} from '../../services/request';

async function createInvoice() {
    var uls = new URL(document.URL)
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark

    var payload = {
        "urlVnpay":urlVnpay,
        "vnpOrderInfo":vnpOrderInfo
    }
    const res = await postMethodPayload('/api/fee/user/check-pay-all', payload)
    if (res.status < 300) {
        window.location.href = '/user/dongphi'
    }
    else{
        window.alert("Thanh toán thất bại")
        window.location.href = '/user/dongphi' 
    }
}

function CheckPayAll(){
    useEffect(()=>{
        createInvoice();
    }, []);
    return(
        <></>
    );
}
export default CheckPayAll;