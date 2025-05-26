import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { getMethod ,deleteMethod, postMethod} from '../../services/request';
import {toast } from 'react-toastify';
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Table } from "antd";
import Swal from 'sweetalert2';

var size = 10;
var url = '';
const { RangePicker } = DatePicker;
const AdminReport = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [content, setContent] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var uls = `/api/report/admin/all?size=${size}&sort=id,desc`
        if(from != '' && to != ''){
            uls += '&start='+from+'&end='+to
        }
        uls += '&page=';
        var response = await getMethod(uls+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = uls;
    };

    function onDateChange(dates, dateStrings){
        setFrom(dateStrings[0])
        setTo(dateStrings[1])
    }


    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    async function checkedReport(id) {
        const response = await postMethod('/api/report/admin/checked?id='+id)
        var result = await response.json();
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Đã gửi phản hồi xử lý thành công!",
                preConfirm: () => {
                    window.location.reload();
                }
            });
        } else {
            toast.error("Thất bại");
        }
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Báo Cáo Phản Hồi</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <RangePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        placeholder={["Từ ngày", "Đến ngày"]}
                        onChange={onDateChange}
                    />
                    <button onClick={()=>getData()} className='btn btn-primary ms-2'><i class="fa fa-search"></i> </button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách báo cáo</span>
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
                                <th>Tài khoản</th>
                                <th>Trạng thái</th>
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
                                    <td>
                                        Mã TK: <strong>{item.user.id}</strong><br/>
                                        Email: <strong>{item.email}</strong>
                                    </td>
                                    <td>
                                        <label class="checkbox-custom cateparent"> Đã xử lý
                                            <input checked={item.checked} onChange={()=>checkedReport(item.id)} type="checkbox"/>
                                            <span class="checkmark-checkbox"></span>
                                        </label>
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

export default AdminReport;