import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,uploadSingleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';



async function saveData(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var month = uls.searchParams.get("month");
    var year = uls.searchParams.get("year");
    var payload = {
        "id": id,
        "month": month,
        "year": year,
        "checkPhiGuiXe": document.getElementById("thanhtoanguixe").checked,
        "checkPhiCanHo": document.getElementById("thanhtoancanho").checked,
        "checkPhiDienNuoc": document.getElementById("thanhtoandien").checked,
        "chiSoDien": document.getElementById("chisodien").value,
        "chiSoNuoc": document.getElementById("chisonuoc").value,
        "soDien": document.getElementById("sodien").value,
        "soNuoc": document.getElementById("sonuoc").value,
    }
    const response = await postMethodPayload('/api/fee/admin/update', payload)
    var result = await response.json();
    console.log(result)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'dongphi'
            }
        });
    } else {
        toast.error("Sửa thất bại");
    }
}


const AdminCapNhatDongPhi = ()=>{
    const [item, setItem] = useState(null);
    useEffect(()=>{
        const getItem= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            var month = uls.searchParams.get("month");
            var year = uls.searchParams.get("year");
            var response = await getMethod(`/api/fee/admin/detail?apartmentId=${id}&month=${month}&year=${year}`);
            var result = await response.json();
            console.log(result);
            
            setItem(result)
            document.getElementById("thanhtoancanho").checked = result.serviceFee.paidStatus
            document.getElementById("thanhtoanguixe").checked = result.vehicleFee.paidStatus
            document.getElementById("thanhtoandien").checked = result.utilityBill.paidStatus
        };
        getItem();
    }, []);

    function nhapChiSoDien() {
        var soDien = document.getElementById("chisodien").value
        if(item.utilityBill.electricityIndexPreMonth != null){
            var soDienDung = Number(soDien) - Number(item.utilityBill.electricityIndexPreMonth)
            document.getElementById("sodien").value = soDienDung
        }
        else{
            document.getElementById("sodien").value = soDien
        }
    }

    function nhapChiSoNuoc() {
        var soDien = document.getElementById("chisonuoc").value
        if(item.utilityBill.waterIndexPreMonth != null){
            var soDienDung = Number(soDien) - Number(item.utilityBill.waterIndexPreMonth)
            document.getElementById("sonuoc").value = soDienDung
        }
        else{
            document.getElementById("sonuoc").value = soDien
        }
    }

    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Cập nhật phí căn hộ {item?.apartment.name}, Tháng {item?.month} - {item?.year}</h4><br/>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveData} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Chỉ số điện trên công tơ</label>
                                <input onKeyUp={nhapChiSoDien} id='chisodien' defaultValue={item?.utilityBill.electricityIndex} type="text" class="form-control"/>
                                <label class="lb-form">Số điện</label>
                                <input defaultValue={item?.utilityBill.numElectricity} id='sodien' readOnly type='number' class="form-control"/>
                                <label class="lb-form">Chỉ số nước trên đồng hồ</label>
                                <input onKeyUp={nhapChiSoNuoc} defaultValue={item?.utilityBill.waterIndex} id='chisonuoc' type='number' min={1} class="form-control"/>
                                <label class="lb-form">Số nước</label>
                                <input defaultValue={item?.utilityBill.numWater} id='sonuoc' type='number' min={1} class="form-control"/>
                                <br/>
                                <button className='btn btn-primary form-control'>Cập nhật</button>
                            </div>
                            <div class="col-md-4 col-sm-12 col-12">
                                <h5>Chỉ số điện tháng trước: {item?.utilityBill.electricityIndexPreMonth}</h5>
                                <h5>Chỉ số nước tháng trước: {item?.utilityBill.waterIndexPreMonth}</h5><br/>
                                <label class="checkbox-custom cateparent"> Đã thanh toán tiền điện - nước
                                    <input id='thanhtoandien' type="checkbox" />
                                    <span class="checkmark-checkbox"></span>
                                </label>
                                <label class="checkbox-custom cateparent"> Đã thanh toán phí căn hộ
                                    <input id='thanhtoancanho' type="checkbox" />
                                    <span class="checkmark-checkbox"></span>
                                </label>
                                <label class="checkbox-custom cateparent"> Đã thanh toán phí gửi xe
                                    <input id='thanhtoanguixe' type="checkbox" />
                                    <span class="checkmark-checkbox"></span>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}



export default AdminCapNhatDongPhi;