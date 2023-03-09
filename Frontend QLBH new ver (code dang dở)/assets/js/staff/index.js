//-------data input------
// let MANV = "NV174318I"//"NV011554R"//"NV080595U"// from login page
// localStorage.setItem("ACCCODE",MANV)
const MANV = localStorage.getItem("ACCCODE")
var role_staff  
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_WidgetsData = BASE_URL + "/staff/getstaffbyid/" + MANV
let urt_TableData = BASE_URL + "/staff/topfivenewstaff"
let url_ApproveStaff = BASE_URL + "/staff/approvestaff"
let url_DeleteStaff = BASE_URL + "/staff/deletestaff"

//-------data input------

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

// animation
function animateCounter(obj, initVal, lastVal, duration) {
    let startTime = null;

    //get the current timestamp and assign it to the currentTime variable
    let currentTime = Date.now();

    //pass the current timestamp to the step function
    const step = (currentTime) => {

        //if the start time is null, assign the current time to startTime
        if (!startTime) {
            startTime = currentTime;
        }

        //calculate the value to be used in calculating the number to be displayed
        const progress = Math.min((currentTime - startTime) / duration, 1);

        //calculate what to be displayed using the value gotten above
        obj.innerHTML = Math.floor(progress * (lastVal - initVal) + initVal);

        //checking to make sure the counter does not exceed the last value (lastVal)
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            window.cancelAnimationFrame(window.requestAnimationFrame(step));
        }
    };
    //start animating
    window.requestAnimationFrame(step);
}


// WIDGETS 
async function Widgets_Display(){
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');
    // ------- get data for Widgets ------------
    await fetch(url_WidgetsData).then((response) => {
        return response.json();
    }).then((data)=> {
        spinner.setAttribute('hidden', '');
        //--Display
        const staffcode = document.getElementById("staffcode") //Staff code
        staffcode.innerHTML = MANV

        const fullname = document.getElementById("fullname") // Full name
        fullname.innerHTML = data[0].HOTEN

        const span_numEmployees = document.getElementById("numEmployees") // Number of employees
        animateCounter(span_numEmployees, 0, data[0].SLNVQL, 1000); 
        
        const span_phonenumber = document.getElementById("phonenumber") // Phonenumber
        span_phonenumber.innerText = data[0].SDT

        const span_email = document.getElementById("email") // Email
        span_email.innerText = data[0].EMAIL

        const span_role = document.getElementById("role") // role
        span_role.innerText = data[0].VAITRO
        role_staff = data[0].VAITRO
    })
    
}

async function Table_Display() {
    async function approvalFunction(admin, staff){
        if(role_staff === "Nhân Viên"){
            swal({
                title: "WARNING!",
                text: "Bạn Không Phải Là NVQL",
                icon: "info",
                button: "Click me!"
            }).then(function () {
                // location.reload();
            }
            );
        }
        else{
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
    }

    async function deleteFunction(admin, staff){
        if(role_staff === "Nhân Viên"){
            swal({
                title: "WARNING!",
                text: "Bạn Không Phải Là NVQL",
                icon: "info",
                button: "Click me!"
            }).then(function () {
                // location.reload();
            });
        }
        else {
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
    }

    const response = await fetch(urt_TableData)
    const data = await response.json()

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
            localStorage.setItem("oneStaffCode",oneStaff.MANV)
            localStorage.setItem("type_detailStaff","VIEW")
        }
        const img = document.createElement("img")
        img.setAttribute("class", "rounded-circle")
        img.setAttribute("src", "../images/avatar/"+no_.toString()+".jpg")
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
}

// ------- MAIN ------------
if(localStorage.getItem("ACCCODE") === null){
    location.href = '../page-login.html'
}
else {
    Widgets_Display().then(() => {
        Table_Display().then(() => {
            localStorage.setItem("ROLE_STAFF",role_staff)
        })
    })    
}


