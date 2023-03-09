// ------------Data input-------
const MADT = localStorage.getItem("ACCCODE") // MADT
let BASE_URL = readTextFile("../../../assets/data_local.txt")
let url_display = BASE_URL + "/partner/managerestaurants/" + MADT


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
function Display_Restaurant(data) {
    // console.log(data)
    const grid = document.getElementsByClassName("grid")
    for(let i = 0; i<data.length; i++){
        let oneData = data[i]

        const container = document.createElement("div")
        container.setAttribute('id', 'container-Rcard')

        //----------------------product details---------------------------
        const productDetails = document.createElement("div")
        productDetails.setAttribute('class', 'product-details')
        // h1
        const h1 = document.createElement("h1")
        h1.innerHTML = oneData.TENQUAN
        // span
        const span = document.createElement("span")
        span.setAttribute('class', 'hint-star star')
        for(let i = 0; i< oneData.DANHGIA; i++) {
            const star = document.createElement("i")
            star.setAttribute('class', 'fa fa-star')
            star.setAttribute('aria-hidden', 'true')
            span.appendChild(star)
        }
        for(let i = 0; i < 5 - oneData.DANHGIA; i++) {
            const nostar = document.createElement("i")
            nostar.setAttribute('class', 'fa fa-star-o')
            nostar.setAttribute('aria-hidden', 'true')
            span.appendChild(nostar)
        }
        //p
        const p = document.createElement('p')
        p.setAttribute('class', 'information')
        p.innerHTML = oneData.MOTA.substring(0,150) + '...'

        // button
        const conntrol = document.createElement('div')
        conntrol.setAttribute('class', 'control-res')
        const button = document.createElement('button')
        button.setAttribute('class', 'btn-res')
        button.onclick = () => {
            localStorage.setItem("oneRestaurant",oneData.MACUAHANG)
            localStorage.setItem("type_detail","EDIT")
            location.href = "./detail/restaurant/"
        }

        //btn_span 1
        const btn_span_price = document.createElement('span')
        btn_span_price.setAttribute('class', 'price')
        // btn_span_price.innerHTML = "250"

        //icon1
        const btn_i_1 = document.createElement('i')
        btn_i_1.setAttribute('class', 'fa fa-eye')
        btn_i_1.setAttribute('aria-hidden','true')
        btn_span_price.appendChild(btn_i_1)

        //btn_span 2
        const btn_span_shopping = document.createElement('span')
        btn_span_shopping.setAttribute('class', 'shopping-cart')

        //icon2
        const btn_i_2 = document.createElement('i')
        btn_i_2.setAttribute('class', 'fa fa-pencil-square-o')
        btn_i_2.setAttribute('aria-hidden','true')
        btn_span_shopping.appendChild(btn_i_2)
        // span details
        const btn_span = document.createElement('span')
        btn_span.setAttribute('class', 'buy')
        btn_span.innerHTML = "Chi Tiết"

        button.append(btn_span_price)
        button.appendChild(btn_span_shopping)
        button.appendChild(btn_span)
        conntrol.appendChild(button)

        productDetails.appendChild(h1)
        productDetails.appendChild(span)
        productDetails.appendChild(p)
        productDetails.appendChild(conntrol)

        //----------------------product image---------------------------
        const productImage = document.createElement('div')
        productImage.setAttribute('class', 'product-image')

        // image 
        const img = document.createElement('img')
        img.setAttribute('src','../images/restaurants/' + 'res_'+ (Math.floor(Math.random() * 12) + 1).toString() +'.jpg')
        img.setAttribute('alt','')
        //description
        const info =  document.createElement('div')
        info.setAttribute('class', 'info')
        //h2
        const h2 = document.createElement('h2')
        h2.innerHTML = 'Thông Tin Chung'
        //ul - li
        const ul = document.createElement('ul')
        //li 1
        const li_1 = document.createElement('li')
        const strong_1 = document.createElement('strong')
        strong_1.innerHTML = 'Mã Cửa Hàng: '
        li_1.appendChild(strong_1)
        li_1.appendChild(document.createTextNode(oneData.MACUAHANG))
        ul.appendChild(li_1)
        //li 2
        const li_2 = document.createElement('li')
        const strong_2 = document.createElement('strong')
        strong_2.innerHTML = 'Giờ Mở Cửa: '
        li_2.appendChild(strong_2)
        li_2.appendChild(document.createTextNode(oneData.GIOMOCUA))
        ul.appendChild(li_2)
        //li 3
        const li_3 = document.createElement('li')
        const strong_3 = document.createElement('strong')
        strong_3.innerHTML = 'Giờ Đóng Cửa: '
        li_3.appendChild(strong_3)
        li_3.appendChild(document.createTextNode(oneData.GIODONGCUA))
        ul.appendChild(li_3)

        //li 4
        const li_4 = document.createElement('li')
        const strong_4 = document.createElement('strong')
        strong_4.innerHTML = 'Địa Chỉ: '
        li_4.appendChild(strong_4)
        li_4.appendChild(document.createTextNode(oneData.DIACHI))
        ul.appendChild(li_4)

        info.appendChild(h2)
        info.appendChild(ul)

        productImage.appendChild(img)
        productImage.appendChild(info)
        // -----------------------------------------------------------
        container.appendChild(productDetails)
        container.appendChild(productImage)
        grid[0].appendChild(container)
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
        Display_Restaurant(data)
        //pagination
        $(function () {
            var numberOfItems = $(".grid #container-Rcard").length;
            var limitPerPage = 4; //How many card items visible per a page
            var totalPages = Math.ceil(numberOfItems / limitPerPage);
            var paginationSize = 7; //How many page elements visible in the pagination
            var currentPage;
        
            function showPage(whichPage) {
                if (whichPage < 1 || whichPage > totalPages) return false;
        
                currentPage = whichPage;
        
                $(".grid #container-Rcard").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
        
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

async function addRestaurant(){
    localStorage.setItem("onePartnerCode", MADT)
    location.href = "../../partner/add/restaurant"
}
// ---------- MAIN ------------
if (MADT === null) {
    location.href = '../page-login.html'
}
else {
    Display_()
}
