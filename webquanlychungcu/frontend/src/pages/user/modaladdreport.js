import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';


var description = '';
function AddReport(){
    const editorRef = useRef(null);
    const [user, setUser] = useState(null);
    const [noiDungPhanHoi, setNoiDungPhanHoi] = useState(["An ninh - Trật tự","Vệ sinh - Môi trường","Kỹ thuật - Hạ tầng","Phòng cháy chữa cháy"
        ,"Quản lý - Dịch vụ", "Giao thông - Bãi đỗ xe","Tiện ích chung","Nội dung khác"
    ]);
    const [selectedNoiDung, setSelectedNoiDung] = useState([]);
    useEffect(()=>{
        const getUser= async() =>{
            var response = await postMethod('/api/user/user/user-logged');
            var result = await response.json();
            setUser(result)
            
        };
        getUser();
    }, []);

    
    const setListCate = (selectedOptions) => {
        setSelectedNoiDung(selectedOptions);
    };

    const options = noiDungPhanHoi.map((item) => ({
        label: item,
        value: item
    }));

    async function guiBaoCao() {
        var arr = []
        for(var i=0; i< selectedNoiDung.length; i++){
            arr.push(selectedNoiDung[i].label)
        }
        var report = {
            "content": description,
            "fullName":document.getElementById("fullname").value,
            "email":document.getElementById("email").value,
            "phone":document.getElementById("phone").value,
            "reason":arr.join(', ')
        }
    
        const response = await postMethodPayload('/api/report/user/add',report)
        if(response.status < 300){
            Swal.fire({
                title: "Thông báo",
                text: "Gửi báo cáo thành công",
                preConfirm: () => {
                    window.location.reload();
                }
            });
        }
        else{
            toast.error("Gửi thất bại")
        }
    }

    
    function handleEditorChange(content, editor) {
        description = content;
    }
  
    return(
        <>
            <div class="modal fade" id="modalAddReport" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Phản ánh</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body modalphanhoi">
                        <label class="lb-form">Chọn nội dung phản hồi</label>
                        <Select
                            isMulti
                            value={selectedNoiDung}
                            onChange={setListCate}
                            options={options}
                            getOptionLabel={(option) => option.label} 
                            getOptionValue={(option) => option.value}    
                            closeMenuOnSelect={false}
                            name='category'
                            placeholder="Chọn danh mục báo cáo"
                        />
                        <label class="lb-form">Thông tin của bạn</label>
                        <input defaultValue={user?.fullName} class="form-control" id="fullname" placeholder="Họ và tên"/>
                        <input class="form-control lb-form" id="phone" placeholder="Số điện thoại"/>
                        <input defaultValue={user?.username} class="form-control lb-form" id="email" placeholder="Email"/>
                        <label class="lb-form">Nội dung phản hồi</label>
                        <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/xqhz0tu1vx2a47ob4qdhwpyz39c09mrs2mfilfeahlm42vwa/tinymce/6/tinymce.min.js'}
                                onInit={(evt, editor) => editorRef.current = editor} 
                                onEditorChange={handleEditorChange}/>
                    </div>
                    <div class="modal-footer">
                        <button onClick={guiBaoCao} class="btn btn-danger form-control">Gửi</button>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default AddReport;
