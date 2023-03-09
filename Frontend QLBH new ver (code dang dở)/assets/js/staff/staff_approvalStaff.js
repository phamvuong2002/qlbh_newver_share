// ---------data input --------------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_TableData = BASE_URL + "/staff/listapprovalstaff"
let url_ApproveStaff = BASE_URL + "/staff/approvestaff"
let url_DeleteStaff = BASE_URL + "/staff/deletestaff"

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

// ---------- Table Display --------------------
async function Table_Display() {
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');
    // approve staff
    async function approvalFunction(admin, staff) {
        let dataRep = {
            "nvduyet": admin,
            "nv": staff
        }
        await fetch(url_ApproveStaff, {
            method: "POST",
            body: JSON.stringify(dataRep),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            const keys = Object.keys(data[0])
            console.log("respone:", keys[0]);
            if (keys[0] === "ERROR") {
                //alert error
                swal({
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
                swal({
                    title: "SUCCESS!",
                    text: "Nhân viên " + data[0][keys[0]] + " đã được duyệt bởi " + data[0][keys[1]],
                    icon: "success",
                    button: "Click me!"
                }).then(function () {
                    location.reload();
                }
                );
            }
        });

    }

    //delete staff
    async function deleteFunction(admin, staff) {
        let dataRep = {
            "nvql": admin,
            "nv": staff
        }
        await fetch(url_DeleteStaff, {
            method: "POST",
            body: JSON.stringify(dataRep),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            return response.json()
        }).then((data) => {
            const keys = Object.keys(data[0])
            console.log("respone:", keys[0]);
            if (keys[0] === "ERROR") {
                swal({
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
                swal({
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

    //DISPLAY TABLE
    await fetch(url_TableData)
        .then((response) => {
            return response.json()
        }).then((data) => {
            spinner.setAttribute('hidden', '');
            const tableBody = document.getElementById("tablebody")
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")

                let no_ = i + 1
                let oneStaff = data[i]
                // no
                const tdnum = document.createElement("td")
                tdnum.setAttribute("class", "serial")
                tdnum.innerHTML = no_.toString() + '.'
                tr.appendChild(tdnum)

                // avatar
                const tdava = document.createElement("td")
                tdava.setAttribute("class", "avatar")
                const div = document.createElement("div")
                div.setAttribute("class", "round-img")
                const a = document.createElement("a")
                a.setAttribute("href", "detail/staff/")
                a.onclick = () => {
                    localStorage.setItem("oneStaffCode", oneStaff.MANV)
                    localStorage.setItem("type_detailStaff", "VIEW")
                }
                const img = document.createElement("img")
                img.setAttribute("class", "rounded-circle")
                img.setAttribute("src", "../images/avatar/" + (Math.floor(Math.random() * 5) + 1).toString() + ".jpg")
                a.appendChild(img)
                div.appendChild(a)
                tdava.appendChild(div)
                tr.appendChild(tdava)

                // information of staff
                for (let i = 0; i < 5; i++) {
                    const keys = Object.keys(oneStaff)
                    const td = document.createElement("td")
                    td.innerHTML = oneStaff[keys[i]]
                    tr.appendChild(td)
                }
                const tdbutton = document.createElement("td")

                // approval button
                const a_approval = document.createElement("a")
                //a_approval.setAttribute("href", "./staff_manageStaff.html")
                a_approval.setAttribute("href", "#")
                a_approval.onclick = function () { 
                    swal({
                        title: "Are you sure?",
                        text: "Bạn Có Chắc Muốn Duyệt Nhân Viên "+  oneStaff.MANV +"!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            approvalFunction(MANV, oneStaff.MANV)  
                        } else {
                            swal("Nhân Viên " +  oneStaff.MANV +" Chưa Được Duyệt!")
                        }
                      });
                }
                a_approval.setAttribute("class", "btn btn-outline-success btn-sm")
                const i_check = document.createElement("i")
                i_check.setAttribute("class", "ti-check")
                a_approval.appendChild(i_check)
                a_approval.appendChild(document.createTextNode(" Duyệt"))
                tdbutton.appendChild(a_approval)

                tdbutton.appendChild(document.createTextNode(" "))
                // delete button
                const a_delete = document.createElement("a")
                a_delete.setAttribute("href", "#")
                a_delete.onclick = function () { 
                    swal({
                        title: "Are you sure?",
                        text: "Bạn Có Chắc Muốn Xoá Nhân Viên "+  oneStaff.MANV +"!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            deleteFunction(MANV, oneStaff.MANV)   
                        } else {
                            swal("Nhân Viên " +  oneStaff.MANV +" Chưa Bị Xoá!")
                        }
                      });
                }
                a_delete.setAttribute("class", "btn btn-outline-danger btn-sm")
                const i_close = document.createElement("i")
                i_close.setAttribute("class", "ti-close")
                a_delete.appendChild(i_close)
                a_delete.appendChild(document.createTextNode(" Xoá"))
                tdbutton.appendChild(a_delete)
                tr.appendChild(tdbutton)

                tableBody.appendChild(tr)
            }
        })
}
// ----------MAIN --------------------
if (MANV === null) {
    location.href = "../page-login.html"
}
if(localStorage.getItem("ROLE_STAFF") === "Nhân Viên"){
    swal({
        title: "WARNING!",
        text: "Bạn Không Phải Là NVQL",
        icon: "info",
        button: "Quay Lại!"
    }).then(function () {
        location.href = "../staff/";
    });
}
else{
    Table_Display()
}
