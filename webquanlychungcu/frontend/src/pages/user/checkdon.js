import { useState, useEffect } from 'react'
import { getMethod ,deleteMethod, postMethod, postMethodPayload} from '../../services/request';

async function createInvoice() {
    var uls = new URL(document.URL)
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark

    var payload = window.localStorage.getItem("chiphidongdon");
    payload = JSON.parse(payload)
    payload.urlVnpay = urlVnpay
    payload.vnpOrderInfo = vnpOrderInfo
    const res = await postMethodPayload('/api/fee/user/check-pay-other', payload)
    if (res.status < 300) {
        window.localStorage.removeItem("chiphidongdon")
        window.location.href = '/user/dongphi'
    }
    else{
        window.alert("Thanh toán thất bại")
        window.localStorage.removeItem("chiphidongdon")
        window.location.href = '/user/dongphi' 
    }
}

function CheckDon(){
    useEffect(()=>{
        createInvoice();
    }, []);
    return(
        <></>
    );
}
export default CheckDon;