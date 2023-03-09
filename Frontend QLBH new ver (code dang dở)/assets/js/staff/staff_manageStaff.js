// -------- data input
const MANV = localStorage.getItem("ACCCODE");
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_TableData = BASE_URL + "/staff/managestaff/" + MANV
let url_DeleteStaff = BASE_URL + "/staff/deletestaff"

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

//couter animation
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

// Display table
async function Table_Display(){
    const spinner = document.getElementById("spinner");
    spinner.removeAttribute('hidden');

    // delete button
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

    //display table
    await fetch(url_TableData).then((response) => {
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
                localStorage.setItem("oneStaffCode",oneStaff.MANV)
                localStorage.setItem("type_detailStaff","VIEW")
            }
            const img = document.createElement("img")
            img.setAttribute("class", "rounded-circle")
            img.setAttribute("src", "../images/avatar/"+(no_%5 + 1).toString()+".jpg")
            a.appendChild(img)
            div.appendChild(a)
            tdava.appendChild(div)
            tr.appendChild(tdava)

            // information of staff
            for (let i = 0; i < 5; i++) {
                const keys = Object.keys(oneStaff)
                const td = document.createElement("td")
                if(i === 2 || i === 3){
                    const id = "counter" + i.toString() + oneStaff.MANV
                    td.setAttribute("id",id)
                }
                else{
                    td.innerHTML = oneStaff[keys[i]]
                }
                // td.innerHTML = oneStaff[keys[i]] // counter
                tr.appendChild(td)
            }
            const tdbutton = document.createElement("td")

            // delete button
            const a_delete = document.createElement("a")
            a_delete.setAttribute("href", "#")
            a_delete.onclick = function(){
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
        for(let i = 0; i < data.length; i++) {
            const id2 = "counter2" + data[i].MANV
            const id3 = "counter3" + data[i].MANV
            const counter2 = document.getElementById(id2)
            const counter3 = document.getElementById(id3)
            animateCounter(counter2,0,data[i].SLDTQL,1000)
            animateCounter(counter3,0,data[i].SLNVQL,1000)
        }
    })
}
// ---------MAIN ---------------
if(MANV === null){
    location.href = '../page-login.html'
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
