from sqlalchemy import create_engine #database se connection stablish krega 
from sqlalchemy.orm import sessionmaker, DeclarativeBase
#sessionmaker --> session bnane ke liye  Session -> data se baat krne ka manager
#declarativeBase --> Models banane ke liye base class
from dotenv import load_dotenv # --> .env se variables load krne ke liye
import os

load_dotenv() # .env file kholo 

engine = create_engine(os.getenv('DATABASE_URL'))
#Engine = Factory

SessionLocal = sessionmaker(bind=engine)
#session = Machine 

class Base(DeclarativeBase): # ye base class hai--> saare models isse inherit honge
    pass

def get_db(): #dabase session dega
    db = SessionLocal() #naya dabase session bnega --> andr a gye ab transaction kr skte ho 
    try:
        yield db #db session deta hai->endpoint use hota hai->vapas aata hai
    finally:
        db.close() #session close hota hai

# import psycopg2 --> python ki library hai psql se baat krne ko 
# import os --> env variables pdhne ke liye
# from dotenv import load_dotenv --> env file pdhne ke liye use hota hai 

# load_dotenv() --> .env file khol kr or uski values environment variables me load kro 

# def get_connection(): --> fastapi ka connection bnane ke liye database se 
#     return psycopg2.connect(os.getenv("DATABASE_URL")) //psql se connect kro is url ke through 