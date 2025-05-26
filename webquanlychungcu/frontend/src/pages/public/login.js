import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        username: event.target.elements.username.value,
        password: event.target.elements.password.value
    };
    const res = await postMethodPayload('/api/user/login/email', payload);
    
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        if (result.errorCode == 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
                preConfirm: () => {
                    window.location.href = 'confirm?email=' + event.target.elements.username.value
                }
            });
        } else {
            toast.warning(result.defaultMessage);
        }
    }
    if(res.status < 300){
        processLogin(result.user, result.token)
    }
};

async function processLogin(user, token) {
    toast.success('Đăng nhập thành công!');
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (user.authorities.name === "ROLE_ADMIN") {
        window.location.href = 'admin/user';
    }
    if (user.authorities.name === "ROLE_USER") {
        window.location.href = '/user/thongtinchung';
    }
}


function login(){

    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divctlogin">
                    <p class="labeldangnhap">Đăng Nhập Hệ Thống Quản Lý Chung Cư</p>
                    <form onSubmit={handleLogin} autocomplete="off">
                        <label class="lbform">Tên tài khoản</label>
                        <input required name='username' id="username" class="inputlogin"/>
                        <label class="lbform">Mật khẩu</label>
                        <input required name='password' type="password" id="password" class="inputlogin"/>
                        <button class="btndangnhap form-control">ĐĂNG NHẬP</button>
                    </form><br/><br/><br/>
                    <hr/>
                    <a href="forgot" class="lbquenmk">Quên mật khẩu ?</a>
                </div>
            </div>
        </div>
    </div>
    );
}
export default login;