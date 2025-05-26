import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethodPayload} from '../../services/request';
import {formatMoney} from '../../services/money';
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as React from 'react';



function ThongTinChung(){
    const [vehicleFee, setVehicleFee] = React.useState([]);
    const [apartment, setApartment] = React.useState(null);
    const [numOto, setNumOto] = React.useState(0);
    const [numXeMay, setNumXeMay] = React.useState(0);
    const [numXeDap, setNumXeDap] = React.useState(0);
    const [phiGuiXe, setPhiGuiXe] = React.useState(0);

    useEffect(()=>{
        getInfor();
    }, []);

    const getInfor= async() =>{
        var response = await getMethod('/api/VehicleServiceFee/all/findAll');
        var list = await response.json();
        setVehicleFee(list)
        var response = await getMethod('/api/apartment/user/my');
        var result = await response.json();
        setApartment(result)
        var oto = 0
        var xemay = 0
        var xedap = 0
        for(var i=0; i<result.vehicles.length; i++){
            if(result.vehicles[i].vehicleType == 2){
                ++oto
            }
            if(result.vehicles[i].vehicleType == 1){
                ++xemay
            }
            if(result.vehicles[i].vehicleType == 0){
                ++xedap
            }
        }
        setNumOto(oto)
        setNumXeMay(xemay)
        setNumXeDap(xedap)

        var giaOto = list.find(v => v.id === 1);
        var giaXeMay = list.find(v => v.id === 2);
        var giaXeDap = list.find(v => v.id === 3);
        
        var tongTien = giaOto.fee * oto + giaXeMay.fee * xemay + giaXeDap.fee * xedap
        
        setPhiGuiXe(tongTien)
    };



    return(
    <>
        <h4>Thông tin căn hộ của bạn</h4>
         <div class="col-sm-8">
            <table class="table">
                <tr>
                    <th>Tên căn hộ</th>
                    <td>{apartment?.name}</td>
                </tr>
                <tr>
                    <th>Số tầng</th>
                    <td>{apartment?.floor}</td>
                </tr>
                <tr>
                    <th>Diện tích</th>
                    <td>{apartment?.acreage} m&sup2;</td>
                </tr>
                <tr>
                    <th>Số thành viên</th>
                    <td><span>{apartment?.residents.length}</span></td>
                </tr>
                <tr>
                    <th>Số phương tiện</th>
                    <td>
                        <i class="fa fa-car"></i> Ô tô: <span>{numOto}</span> -
                        <i class="fa fa-motorcycle"></i> Xe máy: <span>{numXeMay}</span> -
                        <i class="fa fa-bicycle"></i> Xe đạp: <span>{numXeDap}</span>
                    </td>
                </tr>
                <tr>
                    <th>Phí dịch vụ căn hộ (13.000đ/ m2)</th>
                    <td><strong>{formatMoney(apartment?.acreage * 13000)}/tháng</strong></td>
                </tr>
                <tr>
                    <th>Phí gửi xe</th>
                    <td><strong>{formatMoney(phiGuiXe)}/tháng</strong></td>
                </tr>
            </table>
        </div><br/>
        <h4>Thông tin cư dân trong căn hộ <span></span></h4>
        <table class="table" id="example">
            <thead>
                <tr>
                    <th>STT</th>
                    {/* <th>Ảnh</th> */}
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Ngày sinh</th>
                    <th>Số điện thoại</th>
                    <th>Số căn cước</th>
                    <th>Chủ căn hộ</th>
                </tr>
            </thead>
            <tbody>
                {apartment?.residents.map((item, index)=>{
                    return <tr>
                        <td>{++index}</td>
                        {/* <td><img src={item.image} class="imgtable"/></td> */}
                        <td>{item.fullName}</td>
                        <td>{item.user.username}</td>
                        <td>{item.bod}</td>
                        <td>{item.phone}</td>
                        <td>{item.cic}</td>
                        <td>
                            {item.isHouseholdHead == false?'':<span className='success'>Là chủ hộ</span>}
                        </td>
                    </tr>
                })}
            </tbody>
        </table><br/>
        <h4>Thông tin phương tiện</h4>
        <a href="/user/dangkyphuongtien" class="btn btn-primary">Đăng ký thêm phương tiện</a>
        <span class="luuythongtin">Lưu ý (Mỗi hộ dân chỉ được đăng ký 1 xe ô tô), 
            {vehicleFee.map((item, index)=>{
                return <span>Phí gửi {item.name}: <span class="price"></span> {formatMoney(item.fee)} /tháng, </span>
            })}
        </span>
        <br/><br/><br/>
        <table class="table" id="examples">
            <thead>
            <tr>
                <th>STT</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Biển số xe</th>
                <th>Loại phương tiện</th>
                <th>Xóa</th>
            </tr>
            </thead>
            <tbody>
                {apartment?.vehicles.map((item, index)=>{
                    return <tr>
                        <td>{++index}</td>
                        <td>{item.createdDate}</td>
                        <td>{item.updateDate}</td>
                        <td>{item.licensePlate}</td>
                        <td>
                            {item.vehicleType == 2 && <span><i class="fa fa-car"></i> Ô tô</span>}
                            {item.vehicleType == 1 && <span><i class="fa fa-motorcycle"></i> Xe máy</span>}
                            {item.vehicleType == 0 && <span><i class="fa fa-bicycle"></i> Xe đạp</span>}
                        </td>
                        <td>
                            <a class="delete-btn"><i class="fa fa-trash" ></i></a>
                            <a href={'/user/dangkyphuongtien?id='+item.id} class="edit-btn"><i class="fa fa-edit" ></i></a>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </>
    );
}
  
export default ThongTinChung;
