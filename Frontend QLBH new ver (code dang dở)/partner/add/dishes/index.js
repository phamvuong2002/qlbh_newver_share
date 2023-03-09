// -----data input ------
const MADT = localStorage.getItem("onePartnerCode");
const BASE_URL = "http://localhost:8082"
let url_Add = BASE_URL + "/partner/adddishes"
// -----data input ------

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",localStorage.getItem("ACCCODE"))
    localStorage.setItem("type_detail", "EDIT")
}

 
//fetch add data
async function FetchData(dataRep){
    await fetch(url_Add, {
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
                text: data[0][keys[0]],
                icon: "success",
                buttons: {
                  cancel: "Thêm Món Mới",
                  back: "Quay Lại Menu",
                }
              })
              .then((value) => {
                switch (value) {
               
                  case "back":
                    location.href = "../../partner_manageDishes.html";
                    break;
               
                  default:
                    location.reload();
                }
              });
        }
    });
}

function getData(requireFields) {
    var elements = document.getElementById("dataForm").elements;
    var obj ={};
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        obj[item.name] = item.value;
    }
    for(let i = 0; i < requireFields.length; i++){
        if(obj[requireFields[i]].length === 0){
            return null
        }
    }
    return obj
}

//click update button
function submit_button() {
    let requireFields = ["tenmon", "mieuta", "gia", "tinhtrang"]
    let dataAdd =  getData(requireFields)
    if(dataAdd !== null){
        //turn sending button on
        const sending = document.getElementById("payment-button-sending")
        sending.style.display = "inline-block"
        const update = document.getElementById("payment-button-amount")
        update.style.display = "none"
        //fetch data
        dataAdd["madt"] = MADT;
        FetchData(dataAdd)
        // console.log(dataAdd)
    }
}


// ----------------MAIN ----------------
if( MADT === null){
    location.href = '../../../page-login.html'
}

