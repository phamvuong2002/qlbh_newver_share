// -----data input ------
const onePartnerCode = localStorage.getItem("onePartnerCode");
const type_detailPartner = localStorage.getItem("type_detailPartner");

// localStorage.removeItem("oneStaffCode");
const BASE_URL = "http://localhost:8082"
let url_Display = BASE_URL + "/staff/getonepartner/" + onePartnerCode
let update_button_status = "off"
update_button_status = localStorage.getItem("update_button_status")
// -----data input ------

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",localStorage.getItem("ACCCODE"))
    localStorage.setItem("type_detailStaff", "EDIT")
}

//update button
function update_button() {
    localStorage.setItem("update_button_status", "on")
    location.reload()
}

// Display form
async function form_Display(){
    console.log(update_button_status, type_detailPartner)
    // display alert
    if((update_button_status === "on") && (type_detailPartner === "VIEW")){ 
        localStorage.setItem("update_button_status", "off")
        const div = document.getElementById("alert-no-display")
        div.style = "display: block"
        div.innerHTML = "Bạn Đang Ở Chế Độ VIEW. Không Được Chỉnh Sửa Thông Tin Của Tài Khoản Khác!"
    }

    if(update_button_status === "on" && type_detailPartner !== "VIEW") {
        const display_div = document.getElementById("no-display")
        display_div.style = "display: inline"
    }

    //get data from database
    const response = await fetch(url_Display)
    const data = await response.json()

    //display
    let input = document.getElementsByTagName("input")
    console.log(input.length)
    const keys = Object.keys(data[0])
    for(let i = input.length - 1; i >= 0; i--){
        input[i].setAttribute("value", data[0][keys[i-1]])
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

