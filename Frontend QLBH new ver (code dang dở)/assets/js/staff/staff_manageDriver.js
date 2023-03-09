// -------data input---------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_ManageDriver = BASE_URL + "/staff/managedriver/" + MANV
let url_DeleteDriver = BASE_URL + "/staff/deletedriver"

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

// DISPLAY
async function Table_Display() {
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');

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
                });
            }
            else {
                swal({
                    title: "SUCCESS!",
                    text: data[0][keys[0]],
                    icon: "success",
                    button: "Click me!"
                }).then(function () {
                    location.reload();
                });
            }
        });
    }

    await fetch(url_ManageDriver).then((response) => {
        return response.json();
    }).then((data) => {
        spinner.setAttribute('hidden', '');
        const tableBody = document.getElementById("tablebody")
        const table = document.getElementsByClassName("table table-striped table-bordered")
        table[0].setAttribute("id", "bootstrap-data-table-export")
        for (let i = 0; i < data.length; i++) {
            let oneData = data[i];

            const tr = document.createElement("tr")
            let keys = Object.keys(oneData)

            for (let i = 0; i < keys.length; i++) {
                const td = document.createElement("td")
                if (i === 0) {
                    const a = document.createElement("a")
                    a.href = "#"
                    a.onclick = () => {
                        localStorage.setItem("oneDriverCode", oneData[keys[0]])
                        localStorage.setItem("type_detailDriver", "VIEW")
                        location.href = "detail/driver/"
                    }
                    a.innerHTML = oneData[keys[i]]
                    td.appendChild(a)
                }
                else {
                    td.innerHTML = oneData[keys[i]]
                }
                tr.appendChild(td)
            }

            // delete button
            const tdbutton = document.createElement("td")
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

    // $('#bootstrap-data-table-export').DataTable();
    $(document).ready(function () {
        $('#bootstrap-data-table-export').DataTable({
            lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'print'
            ],
        });
    });
}
// -------MAIN----------------
if (MANV === null) {
    location.href = "../page-login.html"
}
else {
    Table_Display()
}