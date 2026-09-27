import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# We default to sqlite if DATABASE_URL is missing, to not break completely if pg is missing, 
# but user requested Postgres. For postgres, ensure DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./satquery.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
