import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import ImageMetadata

router = APIRouter()

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    images = db.query(ImageMetadata).all()
    data = [{
        "id": img.id,
        "filename": img.filename,
        "timestamp": img.upload_timestamp,
        "potholes": img.pothole_count,
        "confidence": img.avg_confidence
    } for img in images]

    df = pd.DataFrame(data)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = StreamingResponse(iter([stream.getvalue()]),
                                 media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=report.csv"
    return response

@router.get("/export/pdf")
def export_pdf(db: Session = Depends(get_db)):
    images = db.query(ImageMetadata).all()

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "RoadGuard AI Detection Report")

    p.setFont("Helvetica", 12)
    y = height - 80
    p.drawString(50, y, f"Total Images Processed: {len(images)}")
    y -= 20

    p.drawString(50, y, "Recent Detections:")
    y -= 20

    for img in images[-10:]: # Last 10
        text = f"ID: {img.id} | Date: {img.upload_timestamp} | Potholes: {img.pothole_count} | Conf: {img.avg_confidence:.2f}"
        p.drawString(50, y, text)
        y -= 15
        if y < 50:
            p.showPage()
            y = height - 50

    p.save()

    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report.pdf"})
