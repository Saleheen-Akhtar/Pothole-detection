from sqlalchemy import Column, Integer, String, Float, DateTime
from database.database import Base
from datetime import datetime

class ImageMetadata(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    processed_image_path = Column(String) # Path to the annotated image
    pothole_count = Column(Integer, default=0)
    avg_confidence = Column(Float, default=0.0)

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer) # Foreign key to images table (conceptually)
    x1 = Column(Float)
    y1 = Column(Float)
    x2 = Column(Float)
    y2 = Column(Float)
    confidence = Column(Float)
    class_id = Column(Integer)
