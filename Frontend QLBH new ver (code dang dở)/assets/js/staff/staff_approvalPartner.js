// ---------data input --------------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_TableData = BASE_URL + "/staff/getapprovalcontracts"
let url_ApproveContract = BASE_URL + "/staff/approvecontract"
let url_DeleteContract = BASE_URL + "/staff/deletecontract"

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

// Display table
async function Table_Display() {
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');
    // approve 
    async function approvalFunction(admin, partner) {
        let dataRep = {
            "manv": admin,
            "mahd": partner
        }
        
        await fetch(url_ApproveContract, {
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
                    text: "Hợp Đồng " + data[0][keys[0]] + " của đối tác "+ data[0][keys[1]] + " đã được duyệt bởi nhân viên " + data[0][keys[2]],
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
    async function deleteFunction(admin, partner) {
        let dataRep = {
            "manv": admin,
            "mahd": partner
        }
        await fetch(url_DeleteContract, {
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
            const table = document.getElementsByClassName("table table-striped table-bordered ")
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

                // information of partner
                const keys = Object.keys(oneData)
                for (let i = 0; i < keys.length; i++) {
                    const td = document.createElement("td")
                    if(i === 0 || i === 1){
                        const a = document.createElement("a")
                        a.setAttribute("href","#")
                        a.innerHTML = oneData[keys[i]]
                        if(i === 0){
                            a.onclick = () =>{
                                localStorage.setItem("onePartnerCode",oneData.MASOTHUE)
                                localStorage.setItem("type_role","STAFF")
                                location.href = "detail/contract/"
                            }
                        }
                        else{
                            a.onclick = () =>{
                                localStorage.setItem("onePartnerCode",oneData.MASOTHUE)
                                localStorage.setItem("type_role","STAFF")
                                location.href = "detail/partner/"
                            }
                        }
                        
                        td.appendChild(a)
                    }
                    else if(i === 4){
                        td.setAttribute("class", "count")
                        td.innerHTML = oneData[keys[i]]
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
                        text: "Bạn Có Chắc Muốn Duyệt Hợp Đồng "+  oneData.MAHOPDONG +"!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            approvalFunction(MANV, oneData.MAHOPDONG) 
                        } else {
                            swal("Hợp Đồng " +  oneData.MAHOPDONG +" Chưa Được Duyệt!")
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
                        text: "Bạn Có Chắc Muốn Xoá Hợp Đồng "+  oneData.MAHOPDONG +"!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            deleteFunction(MANV, oneData.MAHOPDONG) 
                        } else {
                            swal("Hợp Đồng " +  oneData.MAHOPDONG +" Chưa Bị Xoá!")
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