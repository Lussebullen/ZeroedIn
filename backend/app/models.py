from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Lawsuit(Base):
    __tablename__ = "lawsuit"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, index=True)
    title = Column(String, index=True)
    amount_collected = Column(Integer, index=True)
    description = Column(String, index=True)
    active = Column(Boolean, default=True)

    # Define a relationship with the Donor model
    donors = relationship("Donor", back_populates="lawsuit")


class Donor(Base):
    __tablename__ = "donor"

    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(String, index=True)
    amount_donated = Column(Integer)
    lawsuit_id = Column(Integer, ForeignKey("lawsuit.id"))  # ForeignKey to the Lawsuit table

    # Define a back-reference to the Lawsuit model
    lawsuit = relationship("Lawsuit", back_populates="donors")
