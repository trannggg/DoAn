import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { getMethod ,deleteMethod, postMethod, postMethodPayload} from '../../services/request';
import AddReport from './modaladdreport';
import {toast } from 'react-toastify';
import { formatMoney } from '../../services/money';

const UserPhiDaDong = ()=>{
    const [fee, setFee] = useState(null);
    const [vehicleFee, setVehicleFee] = useState([]);
    useEffect(()=>{
        getData();
        getInfor();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/fee/user/phi-da-dong');
        var result = await response.json();
        setFee(result)
    };

    const getInfor= async() =>{
        var response = await getMethod('/api/VehicleServiceFee/all/findAll');
        var list = await response.json();
        setVehicleFee(list)
    };

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Các Chi Phí Bạn Đã Đóng</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <button class="btn btn-danger ms-2">Tổng tất cả {formatMoney(fee?.total)}</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách phí đã đóng</span>
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
                            </tr>
                        </thead>
                        <tbody>
                            {fee?.vehicleFees.map((item=>{
                                    return  <tr>
                                    <td>{item.month} - {item.year}</td>
                                    <td>Phí gửi xe</td>
                                    <td><strong>{formatMoney(item.fee)}</strong></td>
                                    <td><span className='success'>Đã thanh toán</span></td>
                                    <td>
                                        {vehicleFee.map((item, index)=>{
                                            return <span>Phí gửi {item.name}: <span class="price"></span> {formatMoney(item.fee)} /tháng, </span>
                                        })}
                                    </td>
                                </tr>
                            }))}
                            {fee?.serviceFees.map((item=>{
                                    return  <tr>
                                    <td>{item.month} - {item.year}</td>
                                    <td>Phí dịch vụ căn hộ</td>
                                    <td><strong>{formatMoney(item.fee)}</strong></td>
                                    <td><span className='success'>Đã thanh toán</span></td>
                                    <td>13.000đ/ m2</td>
                                </tr>
                            }))}
                            {fee?.utilityBills.map((item=>{
                                    return  <tr>
                                    <td>{item.month} - {item.year}</td>
                                    <td>Phí điện nước</td>
                                    <td><strong>{formatMoney(item.fee)}</strong></td>
                                    <td><span className='success'>Đã thanh toán</span></td>
                                    <td>Số nước: {item.numWater}<br/>Số điện: {item.numElectricity}</td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default UserPhiDaDong;