import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,postMethodPayload} from '../../services/request';
import { formatMoney} from '../../services/money';
import Swal from 'sweetalert2';


const AdminPhiGuiXe = ()=>{
    const [items, setItems] = useState([]);
    const [item, setItem] = useState(null);
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/VehicleServiceFee/all/findAll');
        var result = await response.json();
        setItems(result)
    };

    
    async function saveData() {
        var payload = {
            "id": item.id,
            "name": item.name,
            "fee": document.getElementById("fee").value,
        }
        const response = await postMethodPayload('/api/VehicleServiceFee/admin/update', payload)
        var result = await response.json();
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Cập nhật thành công!",
                preConfirm: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Thêm/ sửa thất bại");
        }
    }


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Phí Gửi Xe</strong>
                <div class="search-wrapper d-flex align-items-center">
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách phí gửi xe</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Loại xe</th>
                                <th>Phí gửi</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.fee)}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>setItem(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" class="edit-btn"><i className='fa fa-edit'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cập nhật giá gửi {item?.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input id='fee' defaultValue={item?.fee} className='form-control' />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button onClick={()=>saveData()} type="button" class="btn btn-primary">Lưu</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPhiGuiXe;