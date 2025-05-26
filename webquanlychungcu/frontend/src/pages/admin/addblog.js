import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,uploadSingleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';



var description = '';
async function saveBlog(event) {
    event.preventDefault();
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var blog = {
        "id": id,
        "title": event.target.elements.title.value,
        "maintenanceDate": event.target.elements.maintenanceDate.value,
        "expectedCompletionDate": event.target.elements.expectedCompletionDate.value,
        "completed": event.target.elements.completed.checked,
        "content": description,
    }
    console.log(blog)
    const response = await postMethodPayload('/api/maintenance/admin/create', blog)
    var result = await response.json();
    console.log(result)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'blog'
            }
        });
    } else {
        toast.error("Thêm/ sửa bài viết thất bại");
        document.getElementById("loading").style.display = 'none'
    }
}


const AdminAddBlog = ()=>{
    const editorRef = useRef(null);
    const [item, setItem] = useState(null);
    useEffect(()=>{
        const getItem= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/maintenance/all/findById?id=' + id);
                var result = await response.json();
                setItem(result)
                description = result.content;
            }
        };
        getItem();
    }, []);

    function handleEditorChange(content, editor) {
        description = content;
    }

    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Thêm/ cập nhật thông báo bảo trì</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveBlog} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Tiêu đề thông báo</label>
                                <input defaultValue={item?.title} name="title" type="text" class="form-control"/>
                                <label class="lb-form">Ngày sửa</label>
                                <input defaultValue={item?.maintenanceDate} type='datetime-local' name="maintenanceDate" class="form-control"/>
                                <label class="lb-form">Ngày dự kiến hoàn thành</label>
                                <input defaultValue={item?.expectedCompletionDate} type='datetime-local' name="expectedCompletionDate" class="form-control"/>
                                <label class="lb-form">Trạng thái</label>
                                <label class="checkbox-custom cateparent"> Đã hoàn thành
                                    <input name='completed' type="checkbox" />
                                    <span class="checkmark-checkbox"></span>
                                </label>
                                <div id="loading">
                                    <div class="bar1 bar"></div>
                                </div>
                                <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-8 col-sm-12 col-12">
                                <label class="lb-form lbmotadv">Nội dung bài viết</label>
                                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/xqhz0tu1vx2a47ob4qdhwpyz39c09mrs2mfilfeahlm42vwa/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={item==null?'':item.content}
                                        onEditorChange={handleEditorChange}/>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}



export default AdminAddBlog;