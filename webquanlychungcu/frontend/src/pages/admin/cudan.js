import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod} from '../../services/request';
import Swal from 'sweetalert2';


var size = 10;
var url = '';
const AdminCuDan = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var search = document.getElementById("search").value
        var response = await getMethod(`/api/resident/admin/findAll?size=${size}&sort=id,desc&search=${search}&page=`+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = `/api/resident/admin/findAll?size=${size}&sort=id,desc&search=${search}&page=`
    };


    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa cư dân này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/resident/admin/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getData();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Cư Dân</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <input id='search' onKeyUp={getData} className='form-control' placeholder="Tìm kiếm thông tin"/>
                    <a href='add-cudan' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách cư dân</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                {/* <th>Ảnh</th> */}
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Ngày sinh</th>
                                <th>Số CCCD/ CMND</th>
                                <th>Chủ hộ</th>
                                <th>Căn hộ</th>
                                <th>Mã tài khoản</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    {/* <td><img src={item.image} className='imgtable'/></td> */}
                                    <td>{item.fullName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.bod}</td>
                                    <td>{item.cic}</td>
                                    <td>{item.isHouseholdHead == false?'':<span className='success'>Là chủ hộ</span>}</td>
                                    <td>{item.apartment.name}</td>
                                    <td>{item.user.id}</td>
                                    <td class="sticky-col">
                                        <a href={"add-cudan?id="+item.id+'&userId='+item.user.id} class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <button onClick={()=>deleteData(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
            </div>

        </>
    );
}

export default AdminCuDan;