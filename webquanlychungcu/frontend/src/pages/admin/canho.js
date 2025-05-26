import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod} from '../../services/request';
import { formatMoney} from '../../services/money';
import Swal from 'sweetalert2';


var size = 8;
var url = '';
const AdminCanHo = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/apartment/admin/findAll?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/apartment/admin/findAll?size='+size+'&sort=id,desc&page='
    };


    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa căn hộ này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/apartment/admin/delete?id='+id)
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
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Căn Hộ</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <a href='add-canho' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách căn hộ</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tên căn hộ</th>
                                <th>Diện tích</th>
                                <th>Tầng</th>
                                <th>Giá bán</th>
                                <th>Trạng thái</th>
                                <th>Số cư dân</th>
                                <th>Số phương tiện</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.name}</td>
                                    <td>{item.acreage} m&sup2;</td>
                                    <td>{item.floor}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td>{item.isSold == false?<span className='error'>Chưa bán</span>:<span className='success'>Đã bán</span>}</td>
                                    <td>{item.residents.length}</td>
                                    <td>{item.vehicles.length}</td>
                                    <td class="sticky-col">
                                        <a href={"add-canho?id="+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <button onClick={()=>deleteData(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                        <a href={"thongtincanho?id="+item.id} class="edit-btn" title='Thông tin căn hộ'><i className='fa fa-eye'></i></a>
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

export default AdminCanHo;