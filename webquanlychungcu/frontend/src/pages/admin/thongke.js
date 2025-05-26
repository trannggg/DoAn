import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod} from '../../services/request';
import {formatMoney} from '../../services/money';
import Chart from "chart.js/auto";
import { Pie } from 'react-chartjs-2';



const AdminThongKe = ()=>{
    const [thongKe, setThongKe] = useState(null);
    const [dates, setDate] = useState([]);
    const [doanhThuThang, setdoanhThuThang] = useState(0);
    useEffect(()=>{
        getGiaTri();
        const year = new Date().getFullYear();
        var arr = []
        for(var i= year; i> Number(year) - Number(10); i--){
            arr.push(i)
        }
        console.log(arr);
        
        setDate(arr);
        revenueYear(2025)
        function getMauSac(){
            var arr = ['#4e73df','#1cc88a','#36b9cc','#eb9534','#ed00c6','#edd500']
            var act = document.getElementsByClassName("border-left");
            var lbcard = document.getElementsByClassName("lbcard");
            for(var i=0; i<act.length; i++){
                act[i].style.borderLeft = '.25rem solid '+arr[i]
            }
            for(var i=0; i<lbcard.length; i++){
                lbcard[i].style.color = arr[i]
            }
        }
        getMauSac();
    }, []);

    const getGiaTri = async() =>{
        var response = await getMethod('/api/statistic/admin/thongke')
        var result = await response.json();
        console.log(result);
        
        setThongKe(result)
    };

    async function revenueYear(nam) {
    if (nam < 2000) {
        nam = new Date().getFullYear();
    }

    const response = await getMethod('/api/statistic/admin/revenue-year?year=' + nam);
    const list = await response.json(); // list gồm 12 object như bạn đã gửi

    // Khởi tạo 3 mảng doanh thu theo từng loại phí
    const phiGuiXe = [];
    const phiDienNuoc = [];
    const phiDichVu = [];

    for (let i = 0; i < 12; i++) {
        const item = list[i] || {};

        phiGuiXe.push(item.phiGuiXe ?? 0);
        phiDienNuoc.push(item.phiDienNuoc ?? 0);
        phiDichVu.push(item.phiDichVu ?? 0);
    }

    const lb = 'Doanh thu năm ' + nam;

    document.getElementById("canvas").innerHTML = `<canvas id="chart"></canvas>`;
    const ctx = document.getElementById("chart").getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
                "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
                "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            datasets: [
                {
                    label: 'Phí gửi xe',
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: phiGuiXe,
                },
                {
                    label: 'Phí điện nước',
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: phiDienNuoc,
                },
                {
                    label: 'Phí dịch vụ',
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    data: phiDichVu,
                },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: false,
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return formatMoney(value);
                        }
                    }
                }
            },
        }
    });
}

    
    function loadByNam() {
        var nam = document.getElementById("nams").value;
        revenueYear(nam);
    }
    

    
    return (
        <>
            <div class="thongke">
                <div class="row">
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left shadow h-100 py-2">
                            <span class="lbcard">Số lượng căn hộ</span>
                            <span className='solieudoanhthu'>{thongKe?.soCanHo}</span>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left shadow h-100 py-2">
                            <span class="lbcard">Số căn hộ còn trống</span>
                            <span className='solieudoanhthu'>{thongKe?.soCanHoTrong}</span>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left shadow h-100 py-2">
                            <span class="lbcard">Số lượng cư dân</span>
                            <span className='solieudoanhthu'>{thongKe?.soCuDan}</span>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left shadow h-100 py-2">
                            <span class="lbcard">Số lượng phương tiện</span>
                            <span className='solieudoanhthu'>{thongKe?.soPhuongTien}</span>
                        </div>
                    </div>
                </div>
            </div>
            <br/><br/>
            <h5>Phí thu 12 tháng trong năm</h5>
            <div class="col-sm-12 header-sp row ">
                <div class="col-md-3">
                    <p class="loctheongay">Chọn năm cần xem</p>
                    <select id="nams" class="form-control">
                        {dates.map((item=>{
                        return <option value={item}>{item}</option>
                        }))}
                    </select>
                </div>
                <div class="col-md-2">
                    <p class="loctheongay" dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></p>
                    <button onClick={()=>loadByNam()} class="btn btn-primary form-control"><i class="fa fa-filter"></i> Lọc</button>
                </div>
            </div>
            <div class="col-sm-12 divtale">
                <div class="card chart-container divtale" id='canvas'>
                    <canvas id="chart"></canvas>
                </div>
            </div>
        </>
    );
}

export default AdminThongKe;