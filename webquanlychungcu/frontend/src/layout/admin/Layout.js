import lich from '../../assest/images/lich.png'
import avatar from '../../assest/images/user.svg'
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { getMethod, postMethod, urlGlobal } from '../../services/request';

function Header({ children }){
     // Ensure useLocation is called at the top level of the component
     const location = useLocation();
     const [message, setMessage] = useState('');
     const [chatMessages, setChatMessages] = useState([]);
     const [client, setClient] = useState(null);
     const [countNoti, setCountNoti] = useState(0);
     const [topNoti, setTopNoti] = useState([]);

     // Function to check if the current path matches the given pathname
     const isActive = (pathname) => {
         for(var i=0; i<pathname.length; i++){
            if(location.pathname === pathname[i]){
                return 'activenavbar';
            }
         }
         return '';
     };
     
    const [isCssLoaded, setCssLoaded] = useState(false);
    useEffect(()=>{
        checkAdmin();
        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);
    if (!isCssLoaded) {
        return <></>
    }

    async function getCountNoti() {
        var response = await getMethod("/api/notification/all/count-noti");
        var result = await response.text();
        setCountNoti(result)

        var response = await getMethod("/api/notification/all/top-noti");
        var result = await response.json();
        setTopNoti(result)
    }

    var user = window.localStorage.getItem("user")
    if(user != null){
        user = JSON.parse(user);
    }

    function openClose(){
        document.getElementById("sidebar").classList.toggle("toggled");
        document.getElementById("page-content-wrapper").classList.toggle("toggled");
        document.getElementById("navbarmain").classList.toggle("navbarmainrom");
    }

    async function markNoti() {
        var con = window.confirm("Xác nhận hành động?");
        if (con == false) {
            return;
        }
        const response = await postMethod('/api/notification/all/mark-read')
        if (response.status < 300) {
            getCountNoti();
        } else {
            toast.error("Thất bại");
        }
    }

    return(
        <div class="d-flex" id="wrapper">
        <nav id="sidebar" class="bg-dark">
            <div class="sidebar-header p-3 text-white">
                <h5>Quản Lý Chung Cư <i class="fa fa-bars pointer" id="iconbaradmin" onClick={openClose}></i></h5> 
            </div>
            <ul class="list-unstyled components">
                <li className={isActive(["/admin/user"])}>
                    <a href="#coltaikhoan" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-user fa-fw"></i> Tài khoản
                    </a>
                    <ul class="collapse list-unstyleds" id="coltaikhoan">
                        <li class="nav-item">
                            <a href="user" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách tài khoản</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm tài khoản</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/admin/canho", "/admin/add-canho","/admin/thongtincanho"])}>
                    <a href="#specialty" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-home fa-fw"></i> Quản lý căn hộ
                    </a>
                    <ul class="collapse list-unstyleds" id="specialty">
                        <li class="nav-item">
                            <a href="canho" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách căn hộ</a>
                        </li>
                        <li class="nav-item">
                            <a href="add-canho" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm căn hộ</a>
                        </li>
                    </ul>
                </li>
                 <li className={isActive(["/admin/cudan", "/admin/add-cudan"])}>
                    <a href="#dashboardSubmenu" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-users fa-fw"></i> Quản lý cư dân
                    </a>
                    <ul class="collapse list-unstyleds" id="dashboardSubmenu">
                        <li class="nav-item">
                            <a href="cudan" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách cư dân</a>
                        </li>
                        <li class="nav-item">
                            <a href="add-cudan" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm cư dân</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/admin/blog", "/admin/add-blog"])}>
                    <a href="#colbaiviet" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-bell fa-fw"></i> Thông báo
                    </a>
                    <ul class="collapse list-unstyleds" id="colbaiviet">
                        <li class="nav-item">
                            <a href="blog" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách thông báo</a>
                        </li>
                        <li class="nav-item">
                            <a href="add-blog" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm thông báo</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/admin/report"])}>
                    <a href="report" class="text-white text-decoration-none">
                        <i class="fa fa-list fa-fw"></i> Quản lý phản ánh
                    </a>
                </li>
                <li className={isActive(["/admin/phiguixe", "/admin/dongphi"])}>
                    <a href="#dichvukham" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-money fa-fw"></i> Quản lý đóng phí
                    </a>
                    <ul class="collapse list-unstyleds" id="dichvukham">
                        <li class="nav-item">
                            <a href="dongphi" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách đóng phí</a>
                        </li>
                        <li class="nav-item">
                            <a href="phiguixe" class="text-white text-decoration-none ps-4"><i class="fa fa-car"></i> Phí gửi xe</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/admin/thongke"])}>
                    <a href="#dashboardSubmenu1" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa-solid fa-chart-line fa-fw"></i> Thống kê
                    </a>
                    <ul class="collapse list-unstyleds" id="dashboardSubmenu1">
                        <li class="nav-item">
                            <a href="thongke" class="text-white text-decoration-none ps-4"><i class="fa fa-chart-line"></i> Thống kê</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#" onClick={logout} class="text-white text-decoration-none">
                        <i class="fa fa-sign-out"></i> Đăng xuất
                    </a>
                </li>
            </ul>
        </nav>

        <div id="page-content-wrapper" class="w-100">
            <nav id='navbarmain' class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div class="container-fluid">
                    <button class="btn btn-link" id="menu-toggle"><i class="fas fa-bars" onClick={openClose}></i></button>
                    <div class="dropdown ms-auto">
                        <a class="nav-link dropdown-toggle position-relative" href="#" role="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-bell"></i>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {countNoti}
                            </span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                            {topNoti.map((item=>{
                                return <li className='lithongbao'>
                                        <a class="dropdown-item thongbaonhanh" href={item.link == null || item.link == ""?"#":item.link}>{item.title}
                                            <span className='timethongbaonhanh'>{(item.createdDate).split("T").join(", ")}</span>
                                        </a>
                                        <hr className='hrthongbao'/>
                                    </li>
                            }))}
                            <div className='bottomthongbao'>
                                <li><a onClick={markNoti} class="dropdown-item" href="#"><i className='fa fa-check'></i> Đánh dấu tất cả là đã đọc</a></li>
                                <li><a class="dropdown-item" href="thong-bao"><i className='fa fa-eye'></i> Xem tất cả thông báo</a></li>
                            </div>
                        </ul>
                    </div>
            
                    <div class="dropdown ms-3">
                        <a class="dropdown-toggle d-flex align-items-center text-decoration-none" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="navbar-text me-2">{user?.username}</span>
                            {/* <img src={user?.avatar} class="rounded-circle" alt="User Avatar"/> */}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="#">Update Info</a></li>
                            <li onClick={logout}><a class="dropdown-item" href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container-fluid py-4" id='mainpageadmin'>
                {children}
            </div>
        </div>
    </div>
    );
}

async function checkAdmin(){
    const response = await getMethod('/api/user/admin/check-role-admin')
    if (response.status > 300) {
        window.location.replace('../login')
    }
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login')
}

export default Header;