// -----data input ------
const onePartnerCode = localStorage.getItem("onePartnerCode");
const type_role = localStorage.getItem("type_role") // staff or partner 
// localStorage.getItem("type_role");

// localStorage.removeItem("oneStaffCode");
const BASE_URL = "http://localhost:8082"
let url_Display = BASE_URL + "/staff/getcontract/" + onePartnerCode
let button_status = null

button_status = localStorage.getItem("button_status")
// -----data input ------

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",localStorage.getItem("ACCCODE"))
    localStorage.setItem("type_detailStaff", "EDIT")
}

//Display form
async function form_Display(){
    // display alert
    // if((update_button_status === "on") && (type_role === "VIEW")){ 
    //     localStorage.setItem("update_button_status", "off")
    //     const div = document.getElementById("alert-no-display")
    //     div.style = "display: block"
    //     div.innerHTML = "Bạn Đang Ở Chế Độ VIEW. Không Được Chỉnh Sửa Thông Tin Của Tài Khoản Khác!"
    // }

    // if(update_button_status === "on" && type_role !== "VIEW") {
    //     const display_div = document.getElementById("no-display")
    //     display_div.style = "display: inline"
    // }

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
    //
}
// ----------------MAIN ----------------
if(onePartnerCode === null){
    location.href = '../../page-login.html'
}else{
    form_Display()
}
// if(localStorage.getItem("ROLE_STAFF") === "Nhân Viên"){
//     swal({
//         title: "WARNING!",
//         text: "Bạn Không Phải Là NVQL",
//         icon: "info",
//         button: "Quay Lại!"
//     }).then(function () {
//         location.href = "../../";
//     });
// }
// else{
//     form_Display()
// }

