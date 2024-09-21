from fastapi import Depends, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .models import Lawsuit, Donor
from .database import get_db, Base, engine
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:3000",  # Replace with your React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
def on_startup():
    # Create all tables in the database
    Base.metadata.create_all(bind=engine)

# Pydantic model for lawsuit data
class LawsuitCreate(BaseModel):
    owner: str
    title: str
    description: str

# Create a new lawsuit
@app.post("/lawsuit/")
def create_lawsuit(lawsuit: LawsuitCreate, db: Session = Depends(get_db)):
    db_lawsuit = Lawsuit(owner=lawsuit.owner, title=lawsuit.title, amount_collected=0, description=lawsuit.description)
    db.add(db_lawsuit)
    db.commit()
    db.refresh(db_lawsuit)
    return db_lawsuit

# Get all lawsuits
@app.get("/lawsuits/")
def get_lawsuits(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    lawsuits = db.query(Lawsuit).offset(skip).limit(limit).all()
    return lawsuits

# Get a specific lawsuit by ID
@app.get("/lawsuit/{lawsuit_id}")
def get_lawsuit(lawsuit_id: int, db: Session = Depends(get_db)):
    lawsuit = db.query(Lawsuit).filter(Lawsuit.id == lawsuit_id).first()
    if lawsuit is None:
        raise HTTPException(status_code=404, detail="Lawsuit not found")
    return lawsuit

# Pydantic model for lawsuit data
class DonationModel(BaseModel):
    lawsuit_id: int
    amount_donated: float
    wallet_id: str

# Donate to a lawsuit, increasing the amount collected, and creating a new donor
@app.put("/lawsuit/{lawsuit_id}/donate")
def donate_to_lawsuit(donor: DonationModel, db: Session = Depends(get_db)):
    lawsuit = db.query(Lawsuit).filter(Lawsuit.id == donor.lawsuit_id).first()
    if lawsuit is None:
        raise HTTPException(status_code=404, detail="Lawsuit not found")
    lawsuit.amount_collected += donor.amount
    # Save associated donor to database
    donor = Donor(wallet_id=donor.wallet_id, amount_donated=donor.amount_donated, lawsuit_id=donor.lawsuit_id)
    db.add(donor)
    db.commit()
    db.refresh(lawsuit)
    return lawsuit

# Deactivate a lawsuit
@app.put("/lawsuit/{lawsuit_id}/deactivate")
def deactivate_lawsuit(lawsuit_id: int, db: Session = Depends(get_db)):
    lawsuit = db.query(Lawsuit).filter(Lawsuit.id == lawsuit_id).first()
    if lawsuit is None:
        raise HTTPException(status_code=404, detail="Lawsuit not found")
    lawsuit.active = False
    db.commit()
    db.refresh(lawsuit)
    return lawsuit

# Get all donors for a specific lawsuit
@app.get("/lawsuit/{lawsuit_id}/donors")
def get_donors(lawsuit_id: int, db: Session = Depends(get_db)):
    lawsuit = db.query(Lawsuit).filter(Lawsuit.id == lawsuit_id).first()
    if lawsuit is None:
        raise HTTPException(status_code=404, detail="Lawsuit not found")
    return lawsuit.donors