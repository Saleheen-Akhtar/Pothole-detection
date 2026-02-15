from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import ImageMetadata, Detection
import shutil
import os
from ultralytics import YOLO
import cv2
import numpy as np
import base64
from datetime import datetime
import uuid

router = APIRouter()

# Load model (lazy loading or at startup)
# Determine paths based on execution context (assuming run from backend dir)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # points to backend/
ROOT_DIR = os.path.dirname(BASE_DIR) # points to project root

model_path = os.path.join(ROOT_DIR, "ai-model", "weights", "best.pt")
if not os.path.exists(model_path):
    print(f"Warning: Trained model not found at {model_path}, using yolov8n.pt")
    model_path = "yolov8n.pt"

try:
    model = YOLO(model_path)
except Exception as e:
    print(f"Error loading model: {e}. Falling back to standard yolov8n.pt")
    model = YOLO("yolov8n.pt")

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
PROCESSED_DIR = os.path.join(BASE_DIR, "processed")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

@router.post("/detect")
async def detect_potholes(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Sanitize filename
    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    safe_filename = f"{uuid.uuid4()}{ext}"

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run Inference
    results = model(file_path)
    result = results[0] # Single image

    # Process detections
    detections = []
    total_confidence = 0.0
    count = 0

    # Create ImageMetadata record
    db_image = ImageMetadata(
        filename=file.filename, # Store original name for reference
        upload_timestamp=datetime.utcnow()
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    # Save annotated image
    annotated_frame = result.plot()
    processed_filename = f"processed_{safe_filename}"
    processed_path = os.path.join(PROCESSED_DIR, processed_filename)
    cv2.imwrite(processed_path, annotated_frame)

    db_image.processed_image_path = processed_path

    for box in result.boxes:
        count += 1
        conf = float(box.conf)
        total_confidence += conf
        x1, y1, x2, y2 = box.xyxy[0].tolist()

        db_detection = Detection(
            image_id=db_image.id,
            x1=x1, y1=y1, x2=x2, y2=y2,
            confidence=conf,
            class_id=int(box.cls)
        )
        db.add(db_detection)
        detections.append({
            "box": [x1, y1, x2, y2],
            "confidence": conf,
            "class": int(box.cls)
        })

    avg_conf = (total_confidence / count) if count > 0 else 0.0

    db_image.pothole_count = count
    db_image.avg_confidence = avg_conf
    db.commit()

    # Encode image to base64 for frontend display
    _, buffer = cv2.imencode('.jpg', annotated_frame)
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    return {
        "id": db_image.id,
        "filename": file.filename,
        "pothole_count": count,
        "avg_confidence": avg_conf,
        "detections": detections,
        "annotated_image": f"data:image/jpeg;base64,{encoded_image}"
    }

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    images = db.query(ImageMetadata).all()

    total_images = len(images)
    total_potholes = sum(img.pothole_count for img in images)
    overall_avg_conf = sum(img.avg_confidence for img in images) / total_images if total_images > 0 else 0

    # Daily trend (simplified)
    # In a real app, do aggregation in SQL
    dates = {}
    for img in images:
        date_str = img.upload_timestamp.strftime("%Y-%m-%d")
        if date_str not in dates:
            dates[date_str] = 0
        dates[date_str] += img.pothole_count

    daily_trend = [{"date": k, "count": v} for k, v in dates.items()]

    return {
        "total_images": total_images,
        "total_potholes": total_potholes,
        "average_confidence": overall_avg_conf,
        "daily_trend": daily_trend
    }
