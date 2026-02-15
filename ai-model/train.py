from ultralytics import YOLO
import os

def train():
    # Load a model
    # Use standard model if custom weights don't exist yet
    model = YOLO('yolov8n.pt')

    # Get absolute path to this script's directory
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct absolute path to data.yaml
    # This ensures it works regardless of where the script is called from
    data_path = os.path.join(base_dir, 'dataset', 'data.yaml')

    # Check if data file exists
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data config not found at: {data_path}")

    # Train the model
    results = model.train(
        data=data_path,
        epochs=5,
        imgsz=320,
        batch=4,
        project=os.path.join(base_dir, 'runs'),
        name='pothole_v8_nano',
        exist_ok=True,
        device='cpu', # Force CPU
        workers=1 # Avoid multiprocessing issues in some environments
    )

    print("Training complete.")
    # Fix: results.best might not be available directly on DetMetrics or similar
    # Access the save directory directly
    print(f"Results saved to: {results.save_dir}")

if __name__ == '__main__':
    train()
