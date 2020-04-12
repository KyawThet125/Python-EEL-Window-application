from db import *
from sqlalchemy.orm import sessionmaker
Session = sessionmaker(bind=engine)

session = Session()

def Create(obj):
    session.add(obj)
    session.commit()

def All(obj):
    return session.query(obj).all()

def getById(obj, id):
    return session.query(obj).get(id)

def update():
    session.commit()

def delete(obj):
    session.delete(obj)
    session.commit()

def search(obj, id):
    return session.query(obj).filter(obj.table_id==id,obj.status == 1).all()

