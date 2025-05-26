import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { getMethod ,deleteMethod, postMethod, postMethodPayload} from '../../services/request';
import AddReport from './modaladdreport';
import {toast } from 'react-toastify';
import { formatMoney } from '../../services/money';

const UserDongPhi = ()=>{
    const [fee, setFee] = useState(null);
    const [vehicleFee, setVehicleFee] = useState([]);
    useEffect(()=>{
        getData();
        getInfor();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/fee/user/remain-fee');
        var result = await response.json();
        setFee(result)
    };

    const getInfor= async() =>{
        var response = await getMethod('/api/VehicleServiceFee/all/findAll');
        var list = await response.json();
        setVehicleFee(list)
    };
    
    async function payAll() {
        var payload = {
            "returnUrl":"http://localhost:3000/user/checkpayall",
        }
        var response = await postMethodPayload('/api/fee/user/pay-all', payload);
        if(response.status < 300){
            var link = await response.text();
            window.location.href = link
        }
        else{
            toast.error("Có lỗi xảy ra");
        }
    }


    async function payOther(type, id) {
        var payload = {
            "id":id,
            "returnUrl":"http://localhost:3000/user/checkdon",
            "type":type
        }
        var response = await postMethodPayload('/api/fee/user/pay-other', payload);
        if(response.status < 300){
            window.localStorage.setItem("chiphidongdon", JSON.stringify(payload))
            var link = await response.text();
            window.location.href = link
        }
        else{
            toast.error("Có lỗi xảy ra");
        }
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Các Chi Phí Bạn Còn Nợ</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <button onClick={()=>payAll()} class="btn btn-danger ms-2">Đóng tất cả {formatMoney(fee?.total)}</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách phí còn lại phải đóng</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tháng</th>
                                <th>Tên phí</th>
                                <th>Chi phí</th>
                                <th>Trạng thái thanh toán</th>
                                <th>Mô tả</th>
                                <th>Thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fee?.vehicleFees.map((item=>{
                                    return  <tr>
                                    <td>{item.month} - {item.year}</td>
                                    <td>Phí gửi xe</td>
                                    <td><strong>{formatMoney(item.fee)}</strong></td>
                                    <td>Chưa thanh toán</td>
                                    <td>
                                        {vehicleFee.map((item, index)=>{
                                            return <span>Phí gửi {item.name}: <span class="price"></span> {formatMoney(item.fee)} /tháng, </span>
                                        })}
                                    </td>
                                    <td class="sticky-col"><button  onClick={()=>payOther('GUIXE', item.id)} class="btn btn-primary">thanh toán</button></td>
                                </tr>
                            }))}
                            {fee?.serviceFees.map((item=>{
                                    return  <tr>
                                    <td>{item.month} - {item.year}</td>
                                    <td>Phí dịch vụ căn hộ</td>
                                    <td><strong>{formatMoney(item.fee)}</strong></td>
                                    <td>Chưa thanh toán</td>
                                    <td>13.000đ/ m2</td>
                                    <td class="sticky-col"><button onClick={()=>payOther('SERVICE', item.id)} class="btn btn-primary">thanh toán</button></td>
                                </tr>
                            }))}
                            {fee?.utilityBills.map((item=>{
                                    return  <tr>
                                    <td>{item.month} - {item.year}</td>
                                    <td>Phí điện nước</td>
                                    <td><strong>{formatMoney(item.fee)}</strong></td>
                                    <td>Chưa thanh toán</td>
                                    <td>Số nước: {item.numWater}<br/>Số điện: {item.numElectricity}</td>
                                    <td class="sticky-col"><button onClick={()=>payOther('DIENNUOC', item.id)} class="btn btn-primary">thanh toán</button></td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default UserDongPhi;