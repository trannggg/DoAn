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
     const [hoDan, setHoDan] = useState('');

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
        checkUser();
        async function getHoDan(){
            const response = await getMethod('/api/apartment/user/apartment-name')
            var result = await response.text();
            setHoDan(result)
        }

        getHoDan();

        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);
    if (!isCssLoaded) {
        return <></>
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


    return(
        <div class="d-flex" id="wrapper">
        <nav id="sidebar" class="bg-dark">
            <div class="sidebar-header p-3 text-white">
                <h5>Quản Lý Chung Cư <i class="fa fa-bars pointer" id="iconbaradmin" onClick={openClose}></i></h5> 
            </div>
            <ul class="list-unstyled components">
                <li className={isActive(["/user/thongtinchung"])}>
                    <a href="/user/thongtinchung" class="text-white text-decoration-none">
                        <i class="fa fa-home fa-fw"></i> Thông tin căn hộ
                    </a>
                </li>
                <li className={isActive(["/user/blog"])}>
                     <a href="/user/blog" class="text-white text-decoration-none">
                        <i class="fa-solid fa-bell fa-fw"></i> Thông báo bảo trì
                    </a>
                </li>
                <li className={isActive(["/user/dongphi"])}>
                     <a href="/user/dongphi" class="text-white text-decoration-none">
                        <i class="fa fa-money fa-fw"></i> Đóng chi phí
                    </a>
                </li>
                <li className={isActive(["/user/phidadong"])}>
                     <a href="/user/phidadong" class="text-white text-decoration-none">
                        <i class="fa fa-clock fa-fw"></i> Phí đã đóng
                    </a>
                </li>
                <li className={isActive(["/user/report"])}>
                     <a href="/user/report" class="text-white text-decoration-none">
                        <i class="fa fa-file fa-fw"></i> Phản ánh
                    </a>
                </li>
                <li className={isActive(["/user/doimatkhau"])}>
                     <a href="/user/doimatkhau" class="text-white text-decoration-none">
                        <i class="fa fa-key fa-fw"></i> Đổi mật khẩu
                    </a>
                </li>
                <li>
                    <a href="#" onClick={logout} class="text-white text-decoration-none">
                        <i class="fa fa-sign-out fa-fw"></i> Đăng xuất
                    </a>
                </li>
            </ul>
        </nav>

        <div id="page-content-wrapper" class="w-100">
            <nav id='navbarmain' class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div class="container-fluid">
                    <button class="btn btn-link" id="menu-toggle"><i class="fas fa-bars" onClick={openClose}></i></button>
                    <div class="dropdown ms-auto">
                        <strong>Xin chào hộ dân: {hoDan}</strong>
                    </div>
            
                    <div class="dropdown ms-3">
                        <a class="dropdown-toggle d-flex align-items-center text-decoration-none" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="navbar-text me-2">{user?.username}</span>
                            {/* <img src={user?.avatar} class="rounded-circle" alt="User Avatar"/> */}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            {/* <li><a class="dropdown-item" href="#">Update Info</a></li> */}
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

async function checkUser(){
    const response = await getMethod('/api/user/user/check-role-user')
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