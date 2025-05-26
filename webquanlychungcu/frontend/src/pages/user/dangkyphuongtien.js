import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,uploadSingleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';





const DangKyPhuongTien = ()=>{
    const [item, setItem] = useState(null);
    useEffect(()=>{
        const getItem= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/Vehicle/all/findById?id=' + id);
                var result = await response.json();
                setItem(result)
            }
        };
        getItem();
    }, []);

    async function saveData(event) {
        event.preventDefault();
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var payload = {
            "id": id,
            "licensePlate": event.target.elements.licensePlate.value,
            "vehicleType": event.target.elements.vehicleType.value,
        }
        if(checkBienSo == false){
            return;
        }
        const response = await postMethodPayload('/api/Vehicle/user/create', payload)
        var result = await response.json();
        console.log(result)
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thêm/cập nhật thành công!",
                preConfirm: () => {
                    window.location.href = '/user/thongtinchung'
                }
            });
        } else {
            toast.error("Thêm/ sửa thất bại");
        }
    }

    function checkBienSo(){
        if((document.getElementById("vehicleType").value == 2 || document.getElementById("vehicleType").value == 1)
            && document.getElementById("licensePlate").value == ""){
            toast.error("Xe máy và ô tô phải có biển số")
            return false;
        }
        return true;
    }

    return (
        <div>
             <div class="col-sm-12 header-sps">
                <div class="title-add-admin">
                    <h4>Thêm/ cập nhật phương tiện</h4>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-add">
                    <form class="row" onSubmit={saveData} method='post'>
                        <div class="col-md-4 col-sm-12 col-12">
                            <label class="lb-form">Loại xe</label>
                            <select id="vehicleType" name="vehicleType" class="form-control">
                                <option selected={item?.vehicleType == 2} value="2">Xe ô tô</option>
                                <option selected={item?.vehicleType == 1} value="1">Xe máy</option>
                                <option selected={item?.vehicleType == 0} value="0">Xe đạp</option>
                            </select>
                            <label class="lb-form">Biển số xe</label>
                            <input defaultValue={item?.licensePlate} name="licensePlate" type="text" class="form-control"/>
                            <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}



export default DangKyPhuongTien;