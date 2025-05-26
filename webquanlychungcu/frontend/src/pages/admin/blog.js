import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod} from '../../services/request';
import Swal from 'sweetalert2';


var size = 10;
var url = '';
const AdminBlog = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/maintenance/all/findAll?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/maintenance/all/findAll?size='+size+'&sort=id,desc&page='
    };


    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa thông báo này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/maintenance/admin/delete?id='+id)
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
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Thông Báo Bảo Trì</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <a href='add-blog' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách thông báo</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>tiêu đề</th>
                                <th>ngày tạo</th>
                                <th>Người tạo</th>
                                <th>ngày sửa chữa</th>
                                <th>ngày dự kiến hoàn thành</th>
                                <th>Trạng thái</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.title}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.createdBy.fullName}</td>
                                    <td>{item.maintenanceTime}, {item.maintenanceDate}</td>
                                    <td>{item.expectedCompletionTime}, {item.expectedCompletionDate}</td>
                                    <td>{item.completed == false?<span className='error'>Chưa hoàn thành</span>:<span className='success'>Đã hoàn thành</span>}</td>
                                    <td class="sticky-col">
                                        <a href={"add-blog?id="+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
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

export default AdminBlog;