// ---------data input --------------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_TableData = BASE_URL + "/staff/listapprovaldriver"
let url_ApproveDriver = BASE_URL + "/staff/approvedriver"
let url_DeleteDriver = BASE_URL + "/staff/deletedriver"

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

//Display table 
async function Table_Display() {
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');
    // approve 
    async function approvalFunction(admin, driver) {
        let dataRep = {
            "manv": admin,
            "matx": driver
        }
        await fetch(url_ApproveDriver, {
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
                    text: "Tài Xế " + data[0][keys[0]] + " Đã Được Duyệt Bởi Nhân Viên " + data[0][keys[1]],
                    icon: "success",
                    button: "Click me!"
                }).then(function () {
                    location.reload();
                }
                );
            }
        });
    }

    //delete 
    async function deleteFunction(admin, driver) {
        let dataRep = {
            "manv": admin,
            "matx": driver
        }
        await fetch(url_DeleteDriver, {
            method: "POST",
            body: JSON.stringify(dataRep),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            return response.json()
        }).then((data) => {
            const keys = Object.keys(data[0])
            // console.log("respone:", keys[0]);
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
            const table = document.getElementsByClassName("table table-striped table-bordered")
            table[0].setAttribute("id", "bootstrap-data-table")
            const tableBody = document.getElementById("tablebody")
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")

                let no_ = i + 1
                let oneData = data[i]
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
                a.setAttribute("href", "detail/driver")
                a.onclick = () => {
                    localStorage.setItem("oneDriverCode", oneData.MATX)
                    localStorage.setItem("type_detailDriver", "VIEW")
                }
                const img = document.createElement("img")
                img.setAttribute("class", "rounded-circle")
                img.setAttribute("src", "../images/avatar/" + (Math.floor(Math.random() * 5) + 1).toString() + ".jpg")
                a.appendChild(img)
                div.appendChild(a)
                tdava.appendChild(div)
                tr.appendChild(tdava)

                // information of driver
                const keys = Object.keys(oneData)
                for (let i = 0; i < keys.length; i++) {
                    const td = document.createElement("td")
                    if(i === 0 ){
                        const a = document.createElement("a")
                        a.setAttribute("href","#")
                        a.innerHTML = oneData[keys[i]]
                        a.onclick = () =>{
                            localStorage.setItem("oneDriverCode",oneData[keys[0]])
                            localStorage.setItem("type_detailDriver","VIEW")
                            location.href = "detail/driver/"
                        }
                        td.appendChild(a)
                    }
                    else{
                        td.innerHTML = oneData[keys[i]]
                    }   
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
                        text: "Bạn Có Chắc Muốn Duyệt Tài Xế "+  oneData.MATX +"!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            approvalFunction(MANV, oneData.MATX) 
                        } else {
                            swal("Tài Xế " +  oneData.MATX +" Chưa Được Duyệt!")
                        }
                      });
                }
                a_approval.setAttribute("class", "btn btn-outline-success btn-block")
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
                        text: "Bạn có Chắc Muốn Xoá Tài Xế " + oneData.MATX +"!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            deleteFunction(MANV, oneData.MATX) 
                        } else {
                          swal("Tài Xế " + oneData.MATX +" Chưa Bị Xoá!")
                        }
                      });
                }
                a_delete.setAttribute("class", "btn btn-outline-danger btn-block")
                const i_close = document.createElement("i")
                i_close.setAttribute("class", "ti-close")
                a_delete.appendChild(i_close)
                a_delete.appendChild(document.createTextNode(" Xoá"))
                tdbutton.appendChild(a_delete)
                tr.appendChild(tdbutton)
                tableBody.appendChild(tr)
            }
            table[0].appendChild(tableBody)
        })

        // date table init
        $(document).ready(function() {
            $('#bootstrap-data-table').DataTable( {
                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                columnDefs: [{
                    "defaultContent": "-",
                    "targets": "_all"
                  }]
            } );
        } );
}

//----------MAIN------------
if (MANV === null) {
    location.href = "../page-login.html"
} else {
    Table_Display()
}