// -----data input ------
const onePartnerCode = localStorage.getItem("onePartnerCode");
const type_detail = localStorage.getItem("type_detail");
// localStorage.removeItem("oneStaffCode");
const BASE_URL = "http://localhost:8082"
let url_Display = BASE_URL + "/partner/getinfo/" + onePartnerCode
let url_Update = BASE_URL + "/partner/updateinfo"
let url_ChangePass = BASE_URL + "/partner/changepassword"
let url_StaffInfo = BASE_URL + "/staff/getonestaff/" 
let update_button_status = "off"
update_button_status = localStorage.getItem("update_button_status")
// -----data input ------

//My profile
function myProfile() {
    location.reload()
}

//update button
function update_button() {
    localStorage.setItem("update_button_status", "on")
    location.reload()
}


function getData(form) {
    var formData = new FormData(form);
    //console.log(Object.fromEntries(formData));
    return Object.fromEntries(formData)
}
async function viewStaffInfo(){
    const MANV = document.getElementById('manv').value
    url_StaffInfo += MANV
    await fetch(url_StaffInfo)
    .then((response) => {
        return response.json()
    }).then((data) =>{
        // console.log(data[0])
        const l_staffCode = `<label style='float: left'>${MANV.toString()}</label>`;
        const l_staffName = `<label style='float: left'> ${data[0].HOTEN} </label>`;
        const l_staffEmail = `<label style='float: left'> ${data[0].EMAIL} </label>`;
        const l_staffPhone = `<label style='float: left'> ${data[0].SDT} </label>`;
        
        
        Swal.fire({
            title: 'Thông Tin Nhân Viên',
            html:
            '<label style="float: left" > <strong> Mã Nhân Viên: &nbsp </strong></label>' + l_staffCode  + '</br> </br>'+
            '<label style="float: left"><strong> Tên Nhân Viên:  &nbsp </strong></label>' + l_staffName + '</br> </br>'+
            '<label >---Thông Tin Liên Lạc--- </label> </br> </br>'+
            '<label style="float: left"><strong>SĐT: &nbsp</strong></label>' + l_staffPhone + '</br> </br>'+
            '<label style="float: left"><strong>Email: &nbsp</strong></label>' + l_staffEmail ,
            confirmButtonText: 'OK',  
        }).then(function() {
            location.reload();
        })
    })  
}
async function changePassword() {
    await Swal.fire({
        title: 'Đổi Mật Khẩu',
        html:
        '<label style="float: left">Mật Khẩu Cũ </label>'+
        '<input id="oldpass" class="swal2-input" type = "password">' +
        '<label style="float: left">Mật Khẩu Mới </label>'+
        '<input id="newpass" class="swal2-input" type = "password">' +
        '<label style="float: left">Nhập Lại Mật Khẩu Mới </label>'+
        '<input id="againNewpass" class="swal2-input" type = "password">',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Thay Đổi',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            let dataUpdate = {
                "madt" : onePartnerCode,
                "mk" : document.getElementById('oldpass').value,
                "mkmoi" : document.getElementById('newpass').value,
                "mknhaplai" : document.getElementById('againNewpass').value
            }
            if(dataUpdate.mknhaplai !== dataUpdate.mkmoi){
                return 1
            }
            else{
            return fetch(url_ChangePass, {
                method: "POST",
                body: JSON.stringify(dataUpdate),
                headers: {
                    "Content-Type": "application/json",
        },
            })
                .then(response => {
                    
                    // console.log(dataupdate, response.json())
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })}
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value !== undefined) {

            if(result.value === 1 ){
                Swal.fire(
                    'Mật Khẩu Nhập Lại Không Trùng Với Mật Khẩu Mới!',
                    'Vui lòng thực hiện lại!',
                    'error'
                )
            }
            else{
                const keys = Object.keys(result.value[0])
                if (keys[0] === "ERROR") {
                    Swal.fire(
                        result.value[0][keys[0]],
                        'Vui lòng thực hiện lại!',
                        'error'
                    )
                }
                else{
                    Swal.fire(
                        result.value[0][keys[0]],
                        'Vui lòng thực hiện lại!',
                        'success'
                    )
                }
            }
            
        }
    })
}
//fetch update data
async function updateData(dataRep) {
    await fetch(url_Update, {
        method: "POST",
        body: JSON.stringify(dataRep),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response.json();
    }).then((data) => {
        const keys = Object.keys(data[0])
        // console.log("respone:", keys[0]);
        if (keys[0] === "ERROR") {
            //alert error
            Swal.fire({
                title: "ERROR!",
                text: data[0][keys[0]],
                icon: "error",
                button: "Click me!"
            }).then(function () {
                location.reload();
            }
            );
        }
        else {
            //alert success
            Swal.fire({
                title: "SUCCESS!",
                text: data[0][keys[0]],
                icon: "success",
                button: "Click me!"
            }).then(function () {
                location.reload();
            }
            );
        }
    });
}

//click update button
function submit_button() {
    const sending = document.getElementById("payment-button-sending")
    sending.style.display = "inline-block"
    const update = document.getElementById("payment-button-amount")
    update.style.display = "none"

    document.getElementById("dataForm").addEventListener("submit", function (e) {
        e.preventDefault();
        let dataUpdate = getData(e.target);
        delete dataUpdate.nvql
        delete dataUpdate.mk
        delete dataUpdate.slcn
        // console.log(dataUpdate)

        updateData(dataUpdate)
    })
}

async function form_Display() {
    // display alert
    if ((update_button_status === "on") && (type_detail === "VIEW")) {
        localStorage.setItem("update_button_status", "off")
        const div = document.getElementById("alert-no-display")
        div.style = "display: block"
        div.innerHTML = "Bạn Đang Ở Chế Độ VIEW. Không Được Chỉnh Sửa Thông Tin Của Tài Khoản Khác!"
    }

    if (update_button_status === "on" && type_detail !== "VIEW") {
        const display_div = document.getElementById("no-display")
        display_div.style = "display: inline"
    }

    //get data from database
    const response = await fetch(url_Display)
    const data = await response.json()

    //display
    let input = document.getElementsByTagName("input")
    const keys = Object.keys(data[0])
    for (let i = input.length - 1; i >= 0; i--) {
        if (i === 1 || i === 2 || i === 7 || i === 12) {
            input[i] = input[i].setAttribute("readonly", "")
        }
        input[i].setAttribute("value", data[0][keys[i - 1]])
    }
    //set up for change password button
    const changepass = document.getElementById('changepass')
    changepass.onclick = () => {
        changePassword()
    }
    //set up for view staff info
    const viewinfo = document.getElementById('viewinfo')
    viewinfo.onclick = () => {
        viewStaffInfo()
    }
}
// ----------------MAIN ----------------
if (onePartnerCode === null) {
    location.href = '../../../page-login.html'
}
else {
    form_Display()
}

