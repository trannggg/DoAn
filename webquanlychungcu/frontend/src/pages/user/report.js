import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { getMethod ,deleteMethod} from '../../services/request';
import AddReport from './modaladdreport';
import {toast } from 'react-toastify';

var size = 10;
var url = '';
const UserReport = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [content, setContent] = useState('');
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/report/user/my-report?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/report/user/my-report?size='+size+'&sort=id,desc&page='
    };


    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa báo cáo này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/report/all/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getData();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Báo Cáo Phản Hồi</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <button data-bs-toggle="modal" data-bs-target="#modalAddReport" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách báo cáo của bạn</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Mục báo cáo</th>
                                <th>Ngày báo cáo</th>
                                <th>Nội dung báo cáo</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.fullName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.createdDate}</td>
                                    <td><div dangerouslySetInnerHTML={{__html:item.content}}></div></td>
                                    <td class="sticky-col">
                                        <button onClick={()=>deleteData(item.id)} class="delete-btn"><i className='fa fa-trash-alt'></i></button>
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

            <AddReport/>
        </>
    );
}

export default UserReport;