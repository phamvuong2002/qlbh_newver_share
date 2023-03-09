// -------data input---------
const MANV = localStorage.getItem("ACCCODE")
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_displayTable = BASE_URL + "/staff/statistcisalldriver/" + MANV
let url_search = BASE_URL + "/staff/statisticsdriver"
let dataWidgets

//My profile
function myProfile(){
    localStorage.setItem("oneStaffCode",MANV)
    localStorage.setItem("type_detailStaff", "EDIT")
}

// init chart
function chartInit(chart, chartLabels, chartName, chartData ) {
    chart.height = 150;
    var myChart = new Chart(chart, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: chartName,
                    data: chartData,
                    borderColor: "rgba(0, 194, 146, 0.9)",
                    borderWidth: "1",
                    backgroundColor: "rgba(0, 194, 146, 0.5)"
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function DisplayChart(chartLabels, chartName, chartData){
    //remove old chart
    const oldChart = document.getElementById("singelBarChart");
    if(oldChart !== null){
        oldChart.remove()
    }
    
    // hidden table
    const table = document.getElementById("display-table");
    table.style = "display: none"

    //display chart
    const chart = document.getElementById("chart");
    chart.removeAttribute('hidden');

    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "singelBarChart");
    chart.appendChild(canvas)

    var ctx = document.getElementById("singelBarChart");
    chartInit(ctx, chartLabels, chartName, chartData )
}

function getData(){
    const formData = $("form").serializeArray()
    let data = {}
    for (let i = 0; i < formData.length; i++){
        if(formData[i].value.length === 0){
            data[formData[i].name] = null
        }
        else{
            data[formData[i].name] = formData[i].value
        }
        
    }
    return data
}

async function statisticsButton(type){
    const spinner = document.getElementById("spinner"); //loader
    spinner.removeAttribute('hidden');//loader

    //data request
    let dataReq = getData()
    dataReq["manv"] = MANV

    //type
    if(type === "ALL"){
        dataReq["type"] = "ALL"
    }
    else if(type === "YEAR"){
        dataReq["type"] = "YEAR"
    }
    else if(type === "MONTH"){
        dataReq["type"] = "MONTH"
    }
    else if(type === "DAY"){
        dataReq["type"] = "DAY"
    }
    else {
        dataReq["type"] = null
    }

    await fetch(url_search, {
        method: "POST",
        body: JSON.stringify(dataReq),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response.json()
    }).then((data) => {
        spinner.setAttribute('hidden', ''); //loader
        if(data.length === 0) {
            swal({
                title: "ANNOUNCE!",
                text: "Không có dữ liệu về doanh số của tài xế " + dataReq.matx +" trong thời gian tìm kiếm!" ,
                icon: "info",
                button: "Click me!"
            })
            return
        }
        const keys = Object.keys(data[0])
        if (keys[0] === "ERROR") {
            swal({
                title: "ERROR!",
                text: data[0][keys[0]],
                icon: "error",
                button: "Click me!"
            })
        }
        else{
            //set atributes of chart
            let chartData = [] 
            let chartLabels = []
            for(let i = 0; i< data.length; i++) {
                if(type === "ALL"){
                    chartLabels.push(data[i].NAM)
                }
                else if(type === "YEAR"){
                    chartLabels.push("Tháng " + (data[i].THANG))
                }
                else if(type === "MONTH"){
                    chartLabels.push("Ngày " + (data[i].NGAY))
                }
                else {
                    chartLabels.push((data[i].KHUNGGIO) + " Giờ")
                }
                chartData.push(data[i].DOANHTHU)
            }

            //set name of chart
            const chartname = document.getElementById("chart-name")
            if(type === "ALL"){
                
                chartname.innerHTML = "Đồ Thị Doanh Thu Theo Các Năm Từ " + chartLabels[0] + " Đến Năm " + chartLabels[chartLabels.length - 1] + " Của Tài Xế " + dataReq.matx
            }
            else if(type === "YEAR"){
                chartname.innerHTML = "Đồ Thị Doanh Thu Theo Năm Được Tìm Kiếm Của Tài Xế " + dataReq.matx
            }
            else if(type === "MONTH"){
                chartname.innerHTML = "Đồ Thị Doanh Thu Theo Tháng Của Năm Được Tìm Kiếm Của Tài Xế " + dataReq.matx
            }
            else {
                chartname.innerHTML ="Đồ Thị Doanh Thu Trong Ngày " + dataReq.date + " Của Tài Xế " + dataReq.matx
            }

            let chartName = "Doanh Số Đối tác " + dataReq.matx
            //display chart
            DisplayChart(chartLabels, chartName, chartData)
        }
    });
}

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
                if(i === 0){
                    const a = document.createElement("a")
                    a.href = "#"
                    a.onclick = () => {
                        localStorage.setItem("oneDriverCode",oneData[keys[0]])
                        localStorage.setItem("type_detailDriver","VIEW")
                        location.href = "detail/driver/"
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
    // format number
    var floor=Math.floor, abs=Math.abs, log=Math.log, round=Math.round, min=Math.min;
    var abbrev = ['k', 'Mil', 'Bil']; // abbreviations in steps of 1000x; extensible if need to edit

    function rnd(n, precision) {
        var prec = 10**precision;
        return round(n*prec)/prec;
    }

    function formatNumber(n) {
        var base = floor(log(abs(n))/log(1000));
        var suffix = abbrev[min(abbrev.length-1, base-1)];
        base = abbrev.indexOf(suffix) + 1;
        return suffix ? rnd(n/1000**base,2)+suffix : ''+n;
    }

    // display
    let numofDrivers = data.length
    let sumRevenue = 0
    let sumNumBills = 0    
    for(let i = 0; i < data.length; i++){
        sumRevenue += parseInt(data[i].DOANHTHU)
        sumNumBills += parseInt(data[i].SLDH)
    }
    const revenue = document.getElementById("revenue") // Revenue
    revenue.innerHTML = formatNumber(sumRevenue)
    
    const numBills = document.getElementById("numBills") // numBills
    numBills.setAttribute("class","count")
    numBills.innerHTML = sumNumBills

    const numPartners = document.getElementById("numDrivers") // number of Drivers
    numPartners.setAttribute("class","count")
    numPartners.innerHTML = numofDrivers

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
