import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, uploadSingleFile, postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';
import Select from 'react-select';


// var linkbanner = '';
const AdminAddCuDan = () => {
    const [item, setItem] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [apartment, setApartment] = useState(null);
    useEffect(() => {
        const getItem = async () => {
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if (id != null) {
                var response = await getMethod('/api/resident/all/findById?id=' + id);
                var result = await response.json();
                setItem(result)
                setApartment(result.apartment)
                // linkbanner = result.image
                document.getElementById("isHouseholdHead").checked = result.isHouseholdHead
            }
        };
        getItem();
        const getApartment = async () => {
            var response = await getMethod('/api/apartment/admin/findAll-list');
            var result = await response.json();
            setApartments(result)
        };
        getApartment();
    }, []);


    async function saveData(event) {
        event.preventDefault();
        document.getElementById("loading").style.display = 'block'
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var userId = uls.searchParams.get("userId");

        // var ims = await uploadSingleFile(document.getElementById("imgbanner"))
        // if(ims != null){
        //     linkbanner = ims
        // }

        var payload = {
            "id": id,
            "email": event.target.elements.username.value,
            "fullName": event.target.elements.fullName.value,
            "bod": event.target.elements.bod.value,
            "phone": event.target.elements.phone.value,
            // "image": linkbanner,
            "cic": event.target.elements.cic.value,
            "isHouseholdHead": event.target.elements.isHouseholdHead.checked,
            "apartmentId": apartment.id,
            "userId": userId,
            "username": event.target.elements.username.value,
            "password": event.target.elements.password.value,
        }
        const response = await postMethodPayload('/api/resident/admin/create', payload)
        var result = await response.json();
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thêm/cập nhật thành công!",
                preConfirm: () => {
                    window.location.href = 'cudan'
                }
            });
        }
        if (response.status == 417) {
            toast.error(result.defaultMessage);
            document.getElementById("loading").style.display = 'none'
        }
    }


    return (
        <div>
            <div class="col-sm-12 header-sps">
                <div class="title-add-admin">
                    <h4>Thêm/ cập nhật cư dân</h4>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-add">
                    <form class="row" onSubmit={saveData} method='post'>
                        <div class="col-md-4 col-sm-12 col-12">
                            <label class="lb-form">Họ tên</label>
                            <input required defaultValue={item?.fullName} name="fullName" type="text" class="form-control" />
                            <label class="lb-form">Ngày sinh</label>
                            <input defaultValue={item?.bod} type='date' name="bod" class="form-control" />
                            <label class="lb-form">Số điện thoại</label>
                            <input required defaultValue={item?.phone} name="phone" class="form-control" />
                            <label class="lb-form">Số căn cước công dân</label>
                            <input defaultValue={item?.cic} name="cic" class="form-control" />
                            <label class="lb-form">Chọn căn hộ</label>
                            <Select
                                onChange={setApartment}
                                options={apartments}
                                value={apartment}
                                getOptionLabel={(option) => option.name + `${option.isSold == true ? '- Đã bán' : ''}`}
                                getOptionValue={(option) => option.id}
                                placeholder="Chọn căn hộ"
                            />
                            <div id="loading">
                                <div class="bar1 bar"></div>
                            </div>
                            <br /><br /><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                        </div>
                        <div class="col-md-4 col-sm-12 col-12">
                            <label class="lb-form">Chủ hộ</label>
                            <label class="checkbox-custom">Là chủ hộ
                                <input type="checkbox" id='isHouseholdHead' name='isHouseholdHead' />
                                <span class="checkmark-checkbox"></span>
                            </label>
                            <label class="lb-form">Email đăng nhập</label>
                            <input defaultValue={item?.user.username} name="username" class="form-control" />
                            <label class="lb-form">Mật khẩu {item && <span>(Bỏ trống để sử dụng mật khẩu cũ)</span>}</label>
                            <input name="password" class="form-control" id='password' type='password' placeholder='*****' />
                            {/* <label class="lb-form">Ảnh cư dân</label>
                                <input id="imgbanner" type="file" class="form-control"/> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}



export default AdminAddCuDan;