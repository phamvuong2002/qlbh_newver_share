// -----data input ------
const onePartnerCode = localStorage.getItem("ACCCODE");

// localStorage.removeItem("oneStaffCode");
const BASE_URL = "http://localhost:8082"
let url_Display = BASE_URL + "/staff/getcontract/" + onePartnerCode
let url_StaffInfo = BASE_URL + "/staff/getonestaff/" 
let button_status = null

button_status = localStorage.getItem("button_status")
// -----data input ------

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",localStorage.getItem("ACCCODE"))
    localStorage.setItem("type_detailStaff", "EDIT")
}
//request extension of contract
async function requestExtension() {
    await Swal.fire({
        title: 'Yêu Cầu Gia Hạn Hợp Đồng ',
        html:
            '<label >Gia Hạn Thêm (Tháng): &nbsp</label>' +
            '<input id="extension" class="swal2-input" type = "number"  min = 3> </br></br>' +
            '<p>Thời gian gia hạn thêm phải trên 3 tháng.   </p>',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Yêu Cầu Gia Hạn',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            if(document.getElementById('extension').value !== undefined){
                let dataUpdate = {
                    "madt": onePartnerCode,
                    "giahan": document.getElementById('extension').value
                }
                // console.log(dataUpdate)
            }
        },
    })
}
// view staff info
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
//Display form
async function form_Display(){
    //get data from database
    const response = await fetch(url_Display)
    const data = await response.json()
    const partnerEmail = data[0].EMAIL
    delete data[0].EMAIL

    //display
    let input = document.getElementsByTagName("input")
    console.log(input.length)
    const keys = Object.keys(data[0])
    for(let i = input.length - 1; i >= 0; i--){
        input[i].setAttribute("value", data[0][keys[i-1]])
        if(i === keys.length -1 ){
            const contractstatus = document.getElementById("contractstatus")
            const strong = document.createElement("strong")
            if(data[0][keys[i]] > 0 && data[0][keys[i]] <= 30){
                strong.innerHTML = "Sắp Hết Hạn! Thời Gian Còn Lại: " + data[0][keys[i]].toString() + " ngày"
                contractstatus.appendChild(strong)
                const a = document.createElement("a")
                a.setAttribute("href", "#")
                a.setAttribute("class","btn btn-outline-warning ")
                a.onclick = () => {
                    if(button_status === null || button_status !== data[0].MASOTHUE){
                        swal({
                            title: "SUCCESS!",
                            text: "Đã Gửi Thông Báo Gia Hạn Hợp Đồng Đến Email: " + partnerEmail,
                            icon: "success",
                            button: "Click Me!"
                        }).then(function () {
                            localStorage.setItem("button_status", data[0].MASOTHUE)
                            location.reload()
                        });
                    }
                    else {
                        swal({
                            title: "WARNING!",
                            text: "Bạn Đã Gửi Thông Báo Gia Hạn Rồi!",
                            icon: "warning",
                            button: "Click Me!"
                        }).then(function () {
                            location.reload()
                        });
                    }
                }
                const i = document.createElement("i")
                i.setAttribute("class", "ti-announcement")
                i.innerHTML =  `<strong> Gửi Thông Báo Gia Hạn </strong>`
                a.appendChild(i)
                contractstatus.appendChild(a)
            }
            else if(data[0][keys[i]] > 30){
                strong.innerHTML = "Thời Gian Còn Lại " + data[0][keys[i]].toString() + " ngày"
                contractstatus.appendChild(strong)
            }
            else {
                strong.innerHTML = "Đã Hết Hạn!  " 
                contractstatus.appendChild(strong)
                const a = document.createElement("a")
                a.setAttribute("href", "#")
                a.setAttribute("class","btn btn-outline-warning ")
                a.onclick = () => {
                    if(button_status === null || button_status !== data[0].MASOTHUE){
                        swal({
                            title: "SUCCESS!",
                            text: "Đã Gửi Thông Báo Gia Hạn Hợp Đồng Đến Email: " + partnerEmail,
                            icon: "success",
                            button: "Click Me!"
                        }).then(function () {
                            localStorage.setItem("button_status", data[0].MASOTHUE)
                            location.reload()
                        });
                    }
                    else {
                        swal({
                            title: "WARNING!",
                            text: "Bạn Đã Gửi Thông Báo Gia Hạn Rồi!",
                            icon: "warning",
                            button: "Click Me!"
                        }).then(function () {
                            location.reload()
                        });
                    }
                }
                const i = document.createElement("i")
                i.setAttribute("class", "ti-announcement")
                i.innerHTML =  `<strong> Gửi Thông Báo Gia Hạn </strong>`
                a.appendChild(i)
                contractstatus.appendChild(a)
            }
            
        }
    }
    //set up for view staff info
    const viewinfo = document.getElementById('viewinfo')
    viewinfo.onclick = () => {
        viewStaffInfo()
    }
}
// ----------------MAIN ----------------
if(onePartnerCode === null){
    location.href = '../../../page-login.html'
}else{
    form_Display()
}

