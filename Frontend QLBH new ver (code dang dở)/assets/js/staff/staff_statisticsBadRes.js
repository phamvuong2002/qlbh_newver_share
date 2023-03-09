// -------data input---------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_displayTable = BASE_URL + "/staff/badrestaurants/" + MANV
let dataWidgets

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

//Display table
async function DisplayTable(){
    const spinner = document.getElementById("spinner"); //loader
    spinner.removeAttribute('hidden');//loader
    await fetch(url_displayTable).then((response) => {
        return response.json();
    }).then((data) =>{
        dataWidgets = data
        spinner.setAttribute('hidden', ''); //loader
        const tableBody = document.getElementById("tablebody")
        const table = document.getElementsByClassName("table table-striped table-bordered")
        table[0].setAttribute("id","bootstrap-data-table-export")

        for(let i = 0; i < data.length; i++){
            let oneData = data[i];
            
            const tr = document.createElement("tr")
            let keys = Object.keys(oneData)
        
            for(let i = 0; i < keys.length; i++){
                const td = document.createElement("td")
                if(i === 1){
                    const a = document.createElement("a")
                    a.href = "#"
                    a.onclick = () => {
                        localStorage.setItem("onePartnerCode",oneData[keys[1]])
                        localStorage.setItem("type_detailPartner","VIEW")
                        location.href = "detail/partner/"
                    }
                    a.innerHTML = oneData[keys[i]] 
                    td.appendChild(a)
                }
                else{
                    td.innerHTML = oneData[keys[i]]
                }
                tr.appendChild(td)
            }
            tableBody.appendChild(tr)
        }
    })

    // $('#bootstrap-data-table-export').DataTable();
    $(document).ready(function() {
        $('#bootstrap-data-table-export').DataTable( {
            lengthMenu: [[5, 20, 50, -1], [5, 20, 50, "All"]],
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'print'
            ],
        } );
    } );
}

function DisplayWidgets(data){
    // display
    let numofRes = data.length   
    let listpartners = []
    let averagePoint = 0
    for(let i = 0; i < data.length; i++){
        listpartners.push(data[i].MASOTHUE)
        averagePoint += parseInt(data[i].DANHGIA[0])
    }
    averagePoint = averagePoint / data.length

    const numRestaurants = document.getElementById("numRestaurants") // num of restaurants
    numRestaurants.setAttribute("class","count")
    numRestaurants.innerHTML = numofRes
    
    const numPartners = document.getElementById("numPartners") // num of partners
    numPartners.setAttribute("class","count")
    numPartners.innerHTML = new Set(listpartners).size

    const average = document.getElementById("average") // average
    average.innerHTML = averagePoint.toFixed(2)

    const staffcode = document.getElementById("staffcode") // staff code
    staffcode.innerHTML = MANV

    $(document).ready(function () {
        $('.count').each(function () {
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            }, {
                duration: 1000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
    });
    
}
// -------------MAIN-------------------
if (MANV === null) {
    location.href = "../page-login.html"
}
else {
    DisplayTable().then(() =>{
        DisplayWidgets(dataWidgets)
    })
}
