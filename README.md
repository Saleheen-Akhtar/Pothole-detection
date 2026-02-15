# RoadGuard AI – Intelligent Image-Based Pothole Detection System

A premium AI-powered web application that detects potholes from uploaded road images using deep learning (YOLOv8) and provides analytics & reporting.

## 🚀 Features

- **AI-Powered Detection**: Detects multiple potholes per image with bounding boxes and confidence scores using a custom trained YOLOv8 model.
- **Premium UI**: Dark theme, glassmorphism cards, smooth animations, and interactive charts built with Next.js and Tailwind CSS.
- **Analytics Dashboard**: Tracks detection frequency, confidence scores, and total images processed.
- **Reporting**: Export detailed reports to CSV or PDF.

## 🛠️ Tech Stack

- **AI Model**: YOLOv8 (Ultralytics) trained on a custom Pothole dataset.
- **Backend**: FastAPI (Python) + SQLite (SQLAlchemy) + OpenCV.
- **Frontend**: Next.js (React) + Tailwind CSS + Framer Motion + Recharts.

## 📂 Project Structure

```
roadguard-ai/
│
├── backend/            # FastAPI Backend
│   ├── main.py         # Entry point
│   ├── routes/         # API Routes
│   ├── models/         # Database Models
│   ├── database/       # DB Connection
│   └── uploads/        # Temp upload storage
│
├── frontend/           # Next.js Frontend
│   ├── app/            # Pages & Layouts
│   ├── components/     # UI Components
│   └── public/         # Static assets
│
├── ai-model/           # AI Training & Inference
│   ├── dataset/        # Training Data
│   ├── runs/           # Training Runs
│   ├── weights/        # Trained Models
│   └── train.py        # Training Script
```

## ⚡ Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy ultralytics opencv-python-headless python-multipart pandas reportlab
```

Run the backend server:

```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Model Training (Optional)

If you wish to retrain the model:

```bash
cd ai-model
python3 train.py
```

## 📝 Usage

1.  Go to the **Detect** page.
2.  Upload an image of a road.
3.  View the detected potholes with bounding boxes and confidence scores.
4.  Visit the **Analytics** page to see usage statistics and export data.

## 📄 License

MIT
