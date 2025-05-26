import layoutAdmin from "../layout/admin/Layout";
import layoutLogin from "../layout/user/loginlayout/login";

//admin
import userAdmin from '../pages/admin/user'
import AdminBlog from '../pages/admin/blog'
import AdminAddBlog from '../pages/admin/addblog'
import AdminCanHo from '../pages/admin/canho'
import AdminAddCanHo from '../pages/admin/addcanho'
import AdminCuDan from '../pages/admin/cudan'
import AdminAddCuDan from '../pages/admin/addcudan'
import ThongTinCanHo from '../pages/admin/thongtincanho'
import AdminReport from '../pages/admin/report'
import AdminPhiGuiXe from '../pages/admin/phiguixe'
import AdminDongPhi from '../pages/admin/dongphi'
import AdminCapNhatDongPhi from '../pages/admin/capnhatdongphi'
import AdminThongKe from '../pages/admin/thongke'

//public
import login from "../pages/public/login";
import forgotPage from '../pages/public/forgot'
import datLaiMatKhauPage from '../pages/public/datlaimatkhau'

//user
import ThongTinChung from "../pages/user/thongtinchung";
import DangKyPhuongTien from "../pages/user/dangkyphuongtien";
import UserBlog from "../pages/user/blog";
import UserReport from "../pages/user/report";
import UserDongPhi from "../pages/user/dongphi";
import CheckDon from "../pages/user/checkdon";
import CheckPayAll from "../pages/user/checkpayall";
import UserPhiDaDong from "../pages/user/phidadong";
import DoiMatKhau from "../pages/user/doimatkhau";


const publicRoutes = [
    {path: "/", component: login, layout: layoutLogin},
    {path: "/login", component: login, layout: layoutLogin},
    { path: "/forgot", component: forgotPage, layout: layoutLogin },
    { path: "/datlaimatkhau", component: datLaiMatKhauPage, layout: layoutLogin },
];

const userRoutes = [
    {path: "/user/thongtinchung", component: ThongTinChung},
    {path: "/user/dangkyphuongtien", component: DangKyPhuongTien},
    {path: "/user/blog", component: UserBlog},
    {path: "/user/report", component: UserReport},
    {path: "/user/dongphi", component: UserDongPhi},
    {path: "/user/checkdon", component: CheckDon},
    {path: "/user/checkpayall", component: CheckPayAll},
    {path: "/user/phidadong", component: UserPhiDaDong},
    {path: "/user/doimatkhau", component: DoiMatKhau},
];


const adminRoutes = [
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/blog", component: AdminBlog, layout: layoutAdmin },
    { path: "/admin/add-blog", component: AdminAddBlog, layout: layoutAdmin },
    { path: "/admin/canho", component: AdminCanHo, layout: layoutAdmin },
    { path: "/admin/add-canho", component: AdminAddCanHo, layout: layoutAdmin },
    { path: "/admin/cudan", component: AdminCuDan, layout: layoutAdmin },
    { path: "/admin/add-cudan", component: AdminAddCuDan, layout: layoutAdmin },
    { path: "/admin/thongtincanho", component: ThongTinCanHo, layout: layoutAdmin },
    { path: "/admin/report", component: AdminReport, layout: layoutAdmin },
    { path: "/admin/phiguixe", component: AdminPhiGuiXe, layout: layoutAdmin },
    { path: "/admin/dongphi", component: AdminDongPhi, layout: layoutAdmin },
    { path: "/admin/capnhatdongphi", component: AdminCapNhatDongPhi, layout: layoutAdmin },
    { path: "/admin/thongke", component: AdminThongKe, layout: layoutAdmin },
];





export {publicRoutes, adminRoutes, userRoutes};
