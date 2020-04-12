pages = ['homePage', 'tablePage', 'orderPage', 'dishPage', 'createTablePage', 'editTablePage', 'createDishPage','editDishPage','createOrderPage']

let currentOrders = ""
function managePages(name) {
    pages.forEach((page) => {
        document.getElementById(page).style.display = "none";
    })
    document.getElementById(name).style.display = "block";
    if (name == pages[1])
    {
        loadTable()
    } else if (name == pages[3])
    {
        loadDish()
    } else if (name == pages[8])
    {
        loadOrders()
    }
}

managePages("homePage")

function loadOrders() {
    eel.getTablesAndDishes()(function (data) {
      
        tbStr = "";
         create_order_table_name = document.querySelector("#create_order_table_name")
        data.table.forEach((table) => {
            tbStr += `
                <option value="${table.id}">${table.name}</option>
            `
        });
        create_order_table_name.innerHTML = tbStr

        dishStr = "";
        create_order_dish_name = document.querySelector("#create_order_dish_name")
        data.dish.forEach((dish) => {
            dishStr += `
                <option value="${dish.id}">${dish.name}</option>
            `
        });
        create_order_dish_name.innerHTML = dishStr

    });
}

function loadTable() {
    eel.getAllTabel()(function (data) {
        tableStr = '';
        data.forEach((table) => {
            let con = table.status == 1 ?'success':'secondary'
            tableStr += `
             <tr>
                <td>${table.id}</td>
                <td>${table.name}</td>
                <td>
                <button class="btn btn-${con} btn-sm"
                onclick="updateTableStatus(${table.id},${table.status})">
                ${table.status}</button>
                 <button class="btn btn-info btn-sm"
                onclick="loadOrderByTable(${table.id})">
                See Ordres</button>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="getOneTable(${table.id})">
                    Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTable(${table.id})">
                    Delete</button>
                </td>
          </tr>
        `;
        });
        document.querySelector("#tableBodyData").innerHTML = tableStr
    });    
}

function loadDish() {
    eel.getDishes()(function (data) {
        dishStr = "";
        data.forEach((dish) => {
            let con = dish.status == 1 ? 'success' : 'secondary'
            dishStr += `
            <tr>
                <td>${dish.id}</td>
                <td>${dish.name}</td>
                <td>${dish.price}</td>
                <td>
                    <div class="btn btn-${con} btn-sm"
                    onclick="updateDishStatus(${dish.id},${dish.status})">${dish.status}</div>
                </td>
                <td>
                    <div class="btn btn-warning btn-sm" onclick="getOneDish(${dish.id})">
                    Edit</div>
                    <div class="btn btn-danger btn-sm" onclick="deleteDish(${dish.id})">
                    Delete</div>
                </td>

         </tr>
            `
        });
        document.querySelector("#dishBodyData").innerHTML = dishStr;

    })
}

function deleteTable(id) {
    eel.deleteTable(id)(function (data) {
        loadTable()
    })
}

create_table_btn = document.querySelector("#create_table_btn")
create_table_btn.addEventListener("click", function (event) {
    event.preventDefault()
    let table_name = document.querySelector("#create_table_name").value;
    eel.createTable(table_name)(function () {
        loadTable();
        managePages(pages[1])
        document.querySelector("#create_table_name").value = ""
    });
})

function getOneTable(id) {
    eel.getOneTable(id)((table) => {
        document.querySelector("#edit_table_name").value = table.name
        document.querySelector("#edit_table_id").value = table.id
        managePages(pages[5])
   })
}

edit_table_btn = document.querySelector("#edit_table_btn")
edit_table_btn.addEventListener('click', function (event) {
    event.preventDefault()
    let edit_table_name = document.querySelector("#edit_table_name").value;
    let edit_table_id = document.querySelector("#edit_table_id").value;
    eel.updateTable(edit_table_id, edit_table_name)(function (data) {
        loadTable()
        managePages(pages[1])
    });

})

function updateTableStatus(id, status) {
    status = status == 1 ? 0 : 1
        eel.updateTableStatus(id, status)(function () {
       loadTable() 
    });
}

create_dish_btn = document.querySelector("#create_dish_btn")
create_dish_btn.addEventListener("click", function (event) {
    event.preventDefault()
    let dish_name = document.querySelector("#create_dish_name").value
    let dish_price = document.querySelector("#create_dish_price").value
    eel.createDish(dish_name, dish_price)(function (data) {
        loadDish()
        managePages(pages[3])
        document.querySelector("#create_dish_name").value = ""
        document.querySelector("#create_dish_price").value = ""
    })
})

function getOneDish(id) {
    eel.getOneDish(id)(function (data) {
        document.querySelector("#edit_dish_name").value = data.name
        document.querySelector("#edit_dish_price").value = data.price
        document.querySelector("#edit_dish_id").value = data.id
        managePages(pages[7])
    })
}

edit_dish_btn = document.querySelector("#edit_dish_btn")
edit_dish_btn.addEventListener("click", function (event) {
    event.preventDefault()
    let name = document.querySelector("#edit_dish_name").value;
    let price = document.querySelector("#edit_dish_price").value;
    let id = document.querySelector("#edit_dish_id").value;
    eel.updateDish(id, name, price)(function (data) {
        loadDish()
        managePages(pages[3])
    })

})

function deleteDish(id) {
    eel.deleteDish(id)(function () {
        loadDish()
    })
}

function updateDishStatus(id, status) {
    status = status == 1 ? 0 : 1
    eel.updateDishStatus(id, status)(function () {
        loadDish()
    });
}



create_order_btn = document.querySelector("#create_order_btn")
create_order_btn.addEventListener("click", function (event) {
    event.preventDefault()
    let table_id = document.querySelector("#create_order_table_name").value
    let dish_id = document.querySelector("#create_order_dish_name").value
    let count = document.querySelector("#create_order_count").value
    eel.createOrder(dish_id, table_id, count)(function (tableId) {
        loadOrderByTable(tableId)
    });
    
})



function loadOrderByTable(id) {
    eel.getOrdersByTableId(id)(function (data) {
        orderTableBody = document.querySelector("#orderTableBody")
        orderStr = ""
        currentOrders = data
        let grandTotal = 0;
        data.forEach((order) => {
            grandTotal += order.count * order.price;

            orderStr += `
            <tr>
                <td>${order.id}</td>
                <td>${order.table_name}</td>
                <td>${order.dish_name}</td>
                <td>${order.price}</td>
                <td>${order.count}</td>
                <td>${order.count * order.price} </td>
            </tr>
            `
        });
        orderTableBody.innerHTML = orderStr
        document.querySelector("#grandTotal").innerHTML = grandTotal
        managePages(pages[2])

    });
}

function billOut() {
    window.print()
    // currentOrders.forEach((order) => {
    //     eel.updateOrderStatus(order.id)(function (data) {
    //         console.log("Bill out order are:" + order.id)
    //     });
    // });
    // managePages(pages[1])
}

