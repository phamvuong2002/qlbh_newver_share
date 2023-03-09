// ------------Data input-------
const MADT = localStorage.getItem("ACCCODE") // MADT
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_display = BASE_URL + "/partner/managedishes/" + MADT

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
// display grid dishes
function Display_Dishes(data) {
    const grid = document.getElementsByClassName("grid")
    for(let i_ = 0; i_ < data.length; i_++) {
        let oneData = data[i_];
        //card cover
        const card = document.createElement("div")
        card.setAttribute("class","card")
        //image
        const img = document.createElement("img")
        img.setAttribute("class", "card__image") // image
        let nameImg = "dish" +  (Math.floor(Math.random() * 10) + 1).toString() + ".png"
        img.src = "../images/dishes/" + nameImg
        //card data
        const card_data = document.createElement("div")
        card_data.setAttribute("class", "card__data") //data

        //card info
        const card_info = document.createElement("div") // info
        card_info.setAttribute("class", "card__info")
        const h2 = document.createElement("h2") // name of dish
        h2.innerHTML = oneData.TENMON //"Tên Món" //
        const p = document.createElement("p") // description
        p.innerHTML = "Miêu tả món ăn: " + oneData.MIEUTA.substring(0,30) + "..."
        const p2 = document.createElement("p") // description
        p2.innerHTML = "Tình trạng: " + oneData.TINHTRANG
        const p3 = document.createElement("p") // description
        p3.innerHTML = "SL Đã Bán: " + oneData.SLDABAN
        card_info.appendChild(h2)
        card_info.appendChild(p)
        card_info.appendChild(p2)
        card_info.appendChild(p3)
        //h3
        const h3 = document.createElement("h3") //price 
        h3.setAttribute("class", "card__price")
        h3.innerHTML = oneData.GIA + " VNĐ"//"$7.50"
        //button
        const button = document.createElement("button") // updated button
        button.setAttribute("class", "card__add")
        button.onclick = function () {
            localStorage.setItem("oneDish",oneData.TENMON)
            localStorage.setItem("type_detail","EDIT")
            location.href = "./detail/dish/"
        }
        const i = document.createElement("i") // icon
        i.setAttribute("class", "fa fa-pencil")
        button.appendChild(i)

        card_data.appendChild(card_info)
        card_data.appendChild(h3)
        card_data.appendChild(button)
        // card appendchild
        card.appendChild(img)
        card.appendChild(card_data)

        // grid appendchild
        grid[0].appendChild(card)
    }
}

function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
        return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}
// display widgets
function Display_Widgets(data) {
    // partner-id
    document.getElementById('partner-id').innerHTML = MADT
    //num-dish
    const num_dish = document.getElementById('num-dishes')
    animateCounter(num_dish, 0, data, 1000);
}
// get data
async function Display_(){
    await fetch(url_display)
    .then((response) => {
        return response.json()
    }).then((data) => {
        // console.log(data);
        Display_Widgets(data.length)
        Display_Dishes(data)
        //pagination
        $(function () {
            var numberOfItems = $(".grid .card").length;
            var limitPerPage = 8; //How many card items visible per a page
            var totalPages = Math.ceil(numberOfItems / limitPerPage);
            var paginationSize = 7; //How many page elements visible in the pagination
            var currentPage;
        
            function showPage(whichPage) {
                if (whichPage < 1 || whichPage > totalPages) return false;
        
                currentPage = whichPage;
        
                $(".grid .card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
        
                $(".p-pagination li").slice(1, -1).remove();
        
                getPageList(totalPages, currentPage, paginationSize).forEach(item => {
                    $("<li>").addClass("p-page-item").addClass(item ? "p-current-page" : "p-dots")
                        .toggleClass("p-active", item === currentPage).append($("<a>")
                            .attr({ href: "javascript:void(0)" }).text(item || "...")).insertBefore(".p-next-page");
                });
        
                $(".p-previous-page").toggleClass("p-disable", currentPage === 1);
                $(".p-next-page").toggleClass("p-disable", currentPage === totalPages);
                return true;
            }
        
            $(".p-pagination").append(
                $("<li>").addClass("p-page-item").addClass("p-previous-page").append($("<a>").attr({ href: "javascript:void(0)" }).text("Prev")),
                $("<li>").addClass("p-page-item").addClass("p-next-page").append($("<a>").attr({ href: "javascript:void(0)" }).text("Next"))
            );
        
            $(".grid").show();
            showPage(1);
        
            $(document).on("click", ".p-pagination li.p-current-page:not(.p-active)", function () {
                return showPage(+$(this).text());
            });
        
            $(".p-next-page").on("click", function () {
                return showPage(currentPage + 1);
            });
        
            $(".p-previous-page").on("click", function () {
                return showPage(currentPage - 1);
            });
        });
    })
}

//
function addDishes() {
    localStorage.setItem("onePartnerCode", MADT)
    location.href = "../../partner/add/dishes"
}
// ---------- MAIN ------------
if (MADT === null) {
    location.href = '../page-login.html'
}
else {
    Display_()
}
