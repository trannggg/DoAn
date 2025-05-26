import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, uploadSingleFile, postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';



async function saveData(event) {
    event.preventDefault();
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var payload = {
        "id": id,
        "name": event.target.elements.name.value,
        "acreage": event.target.elements.acreage.value,
        "floor": event.target.elements.floor.value,
        "price": event.target.elements.price.value,
        "isSold": event.target.elements.isSold.checked,
    }
    const response = await postMethodPayload('/api/apartment/admin/create', payload)
    var result = await response.json();
    console.log(result)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'canho'
            }
        });
    } else {
        toast.error("Thêm/ sửa thất bại");
        document.getElementById("loading").style.display = 'none'
    }
}


const AdminAddCanHo = () => {
    const [item, setItem] = useState(null);
    useEffect(() => {
        const getItem = async () => {
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if (id != null) {
                var response = await getMethod('/api/apartment/all/findById?id=' + id);
                var result = await response.json();
                setItem(result)
            }
        };
        getItem();
    }, []);

    return (
        <div>
            <div class="col-sm-12 header-sps">
                <div class="title-add-admin">
                    <h4>Thêm/ cập nhật căn hộ</h4>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-add">
                    <form class="row" onSubmit={saveData} method='post'>
                        <div class="col-md-4 col-sm-12 col-12">
                            <label class="lb-form">Tên căn hộ</label>
                            <input required defaultValue={item?.name} name="name" type="text" class="form-control" />
                            <label class="lb-form">Diện tích</label>
                            <input required defaultValue={item?.acreage} type='number' name="acreage" class="form-control" />
                            <label class="lb-form">Tầng</label>
                            <input required defaultValue={item?.floor} type='number' min={1} name="floor" class="form-control" />
                            <label class="lb-form">Giá bán</label>
                            <input required defaultValue={item?.price} type='number' min={1} name="price" class="form-control" />
                            <label class="lb-form">Trạng thái</label>
                            <label class="checkbox-custom cateparent"> Đã bán
                                <input name='isSold' type="checkbox" />
                                <span class="checkmark-checkbox"></span>
                            </label>
                            <div id="loading">
                                <div class="bar1 bar"></div>
                            </div>
                            <br /><br /><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}



export default AdminAddCanHo;