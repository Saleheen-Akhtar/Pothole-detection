from ultralytics import YOLO
import os

def train():
    # Load a model
    model = YOLO('yolov8n.pt')  # load a pretrained model (recommended for training)

    # Train the model
    results = model.train(
        data='ai-model/dataset/data.yaml',
        epochs=5,
        imgsz=320,
        batch=4,
        project='ai-model/runs',
        name='pothole_v8_nano',
        exist_ok=True,
        device='cpu', # Force CPU
        workers=1 # Avoid multiprocessing issues in some environments
    )

    print("Training complete.")
    print(f"Best model saved at: {results.best}")

if __name__ == '__main__':
    train()
