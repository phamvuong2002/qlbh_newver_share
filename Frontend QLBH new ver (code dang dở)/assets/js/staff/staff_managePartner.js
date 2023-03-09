// -------data input---------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_ManagePartner = BASE_URL + "/staff/managepartner/" + MANV 

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

// DISPLAY
async function Table_Display(){
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');
    await fetch(url_ManagePartner).then((response) => {
        return response.json();
    }).then((data) =>{
        spinner.setAttribute('hidden', '');
        const tableBody = document.getElementById("tablebody")
        const table = document.getElementsByClassName("table table-striped table-bordered")
        table[0].setAttribute("id","bootstrap-data-table-export")
        for(let i = 0; i < data.length; i++){
            let onePartner = data[i];
        
            const tr = document.createElement("tr")
            let keys = Object.keys(onePartner)
        
            for(let i = 0; i < keys.length; i++){
                const td = document.createElement("td")
                if(i === 0){
                    const a = document.createElement("a")
                    a.href = "#"
                    a.onclick = () => {
                        localStorage.setItem("onePartnerCode",onePartner[keys[0]])
                        localStorage.setItem("type_detailPartner","VIEW")
                        location.href = "detail/partner/"
                    }
                    a.innerHTML = onePartner[keys[i]] 
                    td.appendChild(a)
                }
                else if( i === 4 || i === 5 || i === 6){
                    const a = document.createElement("a")
                    a.href = "#"
                    a.onclick = () => {
                        localStorage.setItem("onePartnerCode",onePartner[keys[0]])
                        localStorage.setItem("type_role","STAFF")
                        location.href = "detail/contract/"
                    }
                    a.innerHTML = onePartner[keys[i]]
                    td.appendChild(a)
                }
                else{
                    td.innerHTML = onePartner[keys[i]]
                }
                tr.appendChild(td)
            }
            tableBody.appendChild(tr)
        }
    })
    
        // $('#bootstrap-data-table-export').DataTable();
        $(document).ready(function() {
            $('#bootstrap-data-table-export').DataTable( {
                lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'csv', 'excel', 'print'
                ],
            } );
        } );
}
// -------MAIN----------------
if (MANV === null) {
    location.href = "../page-login.html"
}
else{
    Table_Display()
}