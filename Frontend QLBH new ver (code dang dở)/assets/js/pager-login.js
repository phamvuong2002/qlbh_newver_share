// -----------------input data-------------------
let ACCOUNTCODE = localStorage.getItem("ACCCODE")
console.log(ACCOUNTCODE)
// const BASE_URL = "http://172.29.87.174:8082"
let BASE_URL = readTextFile("../../assets/data_local.txt")
let url_Signin = BASE_URL + "/account/signin"

function Routes(ID){
    if(ID.substring(0,2) === "NV"){
        // console.log("Nhân Viên")
        localStorage.setItem("ACCCODE",ID)
        location.href = "/staff/"
    }
    else if(ID.substring(0,2) === "TX"){
        // console.log("Tài Xế")
        localStorage.setItem("ACCCODE",ID)
        location.href = "/driver/"
    }
    else if(ID.substring(0,3) === "TAX"){
        // console.log("Đối tác")
        localStorage.setItem("ACCCODE",ID)
        location.href = "/partner/"
    }
    else {
        return
    }
}

async function fetch_SigninData(data){
    await fetch(url_Signin, {
        method: "POST",
        body: JSON.stringify(data),
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
            Routes(data[0][keys[0]])
        }
    });
}

function sign_in(){
    document.getElementById("dataForm").addEventListener("submit", async function (e){
        e.preventDefault();
        var form = new FormData(e.target)
        dataSignin = Object.fromEntries(form)
        fetch_SigninData(dataSignin)
        // Routes("NV174318I")
    })
}
// ----------------MAIN---------------
if (ACCOUNTCODE !== null) {
    Routes(ACCOUNTCODE)
}


