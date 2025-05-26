import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { getMethod ,deleteMethod} from '../../services/request';


var size = 10;
var url = '';
const UserBlog = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [content, setContent] = useState('');
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
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách thông báo bảo trì</span>
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
                                        <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>setContent(item.content)} class="delete-btn"><i className='fa fa-eye'></i></button>
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

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Nội dung thông báo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div dangerouslySetInnerHTML={{__html:content}}></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserBlog;