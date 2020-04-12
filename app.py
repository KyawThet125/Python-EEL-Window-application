# python -m pip install --upgrade pip

import eel
from helper import *
import sqlalchemy.ext.baked

eel.init("web")


@eel.expose
def doIt():
    # billOut(2)
    return "Hey what do u need"



#************For Order Object**********
@eel.expose
def getTablesAndDishes():
    obj = {"table": getAllTabel(), "dish": getDishes()}
    return obj

@eel.expose
def createOrder(dish_id, table_id, order_count):
    dish = getById(Dish,dish_id)
    Create(Order(dish_id=dish_id, table_id=table_id, price=dish.price, order_count=order_count))
    return table_id
    


@eel.expose
def getOrdersByTableId(id):
    resultList = list()
    results = search(Order, id)
    for result in results:
        x = {"id": result.id, "table_name": result.table.name, "dish_name": result.dish.name, "price": result.price, "count": result.order_count, "status": result.status}
        resultList.append(x)
    return resultList
 
 
@eel.expose
def updateOrderStatus(id):
    obj = getById(Order, id)
    obj.status = 0
    update()

def billOut(table_id):
    results = search(Order, table_id)
    total = 0
    for result in results:
        total += result.price * result.order_count
    
    print(f"Total bill is {total} ")
    









#************For Table Object**********
@eel.expose
def createTable(name):
    Create(Table(name=name))

@eel.expose
def updateTable(id,name):
    currentObj = getById(Table, id)
    currentObj.name = name
    update()

@eel.expose
def updateTableStatus(id,status):
    currentObj = getById(Table, id)
    currentObj.status = status
    update()

@eel.expose
def getAllTabel():
    results = All(Table)
    tableList = []
    for result in results:
        table = {"id": result.id, "name": result.name, "status": result.status}
        tableList.append(table)
    return tableList


@eel.expose
def getOneTable(id):
    result = getById(Table,id)
    return {"id": result.id, "name": result.name, "status": result.status}

@eel.expose
def deleteTable(id):
    obj = getById(Table, id)
    delete(obj)

    

#************For Dish Object**********
@eel.expose
def createDish(name, price):
     Create(Dish(name=name, price=price))

@eel.expose
def getDishes():
    results = All(Dish)
    resultList = []
    for result in results:
        x = {"id": result.id, "name": result.name, "price": result.price, "status": result.status}
        resultList.append(x)
    return resultList
        

@eel.expose
def getOneDish(id):
    result = getById(Dish, id)
    return {"id": result.id, "name": result.name, "price": result.price, "status": result.status}

@eel.expose
def updateDish(id,name,price):
    currentDish = getById(Dish, id)
    currentDish.name = name
    currentDish.price = price
    update()

@eel.expose
def deleteDish(id):
    currentDish = getById(Dish, id)
    delete(currentDish)

@eel.expose
def updateDishStatus(id,status):
    currentObj = getById(Dish, id)
    currentObj.status = status
    update()



    


eel.start("index.html")

