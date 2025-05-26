import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod, postMethod} from '../../services/request';
import { formatMoney} from '../../services/money';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // Hoặc chọn theme khác
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import { Vietnamese } from 'flatpickr/dist/l10n/vn';


var size = 10;
var url = '';
const AdminDongPhi = ()=>{
    const [items, setItems] = useState([]);
    const [date, setDate] = useState(new Date());
    useEffect(()=>{
        getData(null, null);
    }, []);

    const getData= async(month, year) =>{
        const now = new Date();
        const selectedMonth = month ?? now.getMonth() + 1; 
        const selectedYear = year ?? now.getFullYear();
        
        var response = await getMethod(`/api/fee/admin/all?month=${selectedMonth}&year=${selectedYear}`);
        var result = await response.json();
        
        setItems(result)
    };


    async function getDuLieu() {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        getData(month, year)
    }

    async function taoDongPhi() {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const response = await postMethod(`/api/fee/admin/create?month=${month}&year=${year}`)
        var result = await response.json();
        if (response.status < 300) {
            toast.success("Taọ yêu cầu đóng phí thành công");
            getData(month, year);
        } 
        if(response.status == 417) {
            toast.error(result.defaultMessage);
        }
    }


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Đóng Phí</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <Flatpickr
                        options={{
                            locale: Vietnamese,plugins: [new monthSelectPlugin({shorthand: false, dateFormat: "m/Y", altFormat: "F Y",}),],allowInput: true,
                        }}
                        value={date}
                        onChange={([selectedDate]) => setDate(selectedDate)}
                        className="border pointer rounded px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button onClick={()=>getDuLieu()} className='btn btn-primary ms-2'><i className='fa fa-filter'></i> Lọc</button>
                    <button onClick={()=>taoDongPhi()} className='btn btn-primary ms-2'>Gửi yêu cầu đóng phí</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách đóng phí</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Căn hộ</th>
                                <th>Phí căn hộ</th>
                                <th>Phí gửi xe</th>
                                <th>Phí điện nước</th>
                                <th>Phí còn lại chưa đóng</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const conlai = [];

                                if (item.serviceFee.paidStatus == false) {
                                    conlai.push(<div key="sv" className="phichuadong">Phí dịch vụ</div>);
                                }
                                if (item.vehicleFee.paidStatus == false) {
                                    conlai.push(<div key="vf" className="phichuadong">Phí gửi xe</div>);
                                }
                                if (item.utilityBill.paidStatus == false) {
                                    conlai.push(<div key="ub" className="phichuadong">Phí điện nước</div>);
                                }

                                return <tr key={item.id}>
                                    <td>{item.apartment.name}</td>
                                    <td>{formatMoney(item.serviceFee.fee)}</td>
                                    <td>{formatMoney(item.vehicleFee.fee)}</td>
                                    <td>
                                        {item.utilityBill.fee == null ? (
                                        <span className="error">Chưa nhập đủ số điện, nước</span>
                                        ) : (
                                        formatMoney(item.utilityBill.fee)
                                        )}
                                    </td>
                                    <td className='d-flex'>{conlai}</td>
                                    <td className="sticky-col">
                                        <a href={`capnhatdongphi?id=${item.apartment.id}&month=${item.month}&year=${item.year}`} className="edit-btn"><i className="fa fa-edit"></i></a>
                                    </td>
                                </tr>
                            })}

                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default AdminDongPhi;