from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import pickle
import uvicorn
from pathlib import Path
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
MODEL_PATH = Path("model.pkl")
model = None

def load_model():
    global model
    try:
        if not MODEL_PATH.exists():
            print(f"❌ Error: Model file not found at {MODEL_PATH.absolute()}")
            return False
            
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print("✅ Model loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

# Define emotion labels
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

@app.post("/detect-emotion")
async def detect_emotion(file: UploadFile = File(...)):
    try:
        if model is None:
            if not load_model():
                raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Read image file
        contents = await file.read()
        
        # Convert bytes to numpy array
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image")
            
        # Resize and preprocess
        img = cv2.resize(img, (48, 48))
        img = img.astype('float32') / 255.0
        img = img.reshape(1, 48, 48, 1)
        
        # Make prediction
        predictions = model.predict(img)[0]
        emotion_idx = np.argmax(predictions)
        
        return {
            "emotion": EMOTIONS[emotion_idx],
            "confidence": float(predictions[emotion_idx]),
            "all_emotions": {e: float(p) for e, p in zip(EMOTIONS, predictions)}
        }
        
    except Exception as e:
        print(f"Error in detect_emotion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "model_loaded": model is not None
    }

if __name__ == "__main__":
    # Copy model file if it exists in src/assets/models
    src_model = Path("../src/assets/models/model.pkl")
    if src_model.exists() and not MODEL_PATH.exists():
        import shutil
        shutil.copy(src_model, MODEL_PATH)
        print(f"✅ Copied model from {src_model} to {MODEL_PATH}")
    
    # Load model
    if not load_model():
        print("❌ Failed to load model. Please check the error above.")
        input("Press Enter to exit...")
        exit(1)
    
    # Start server
    print("🚀 Starting backend server at http://localhost:8000")
    print("📡 Endpoints:")
    print("  - GET  /health")
    print("  - POST /detect-emotion")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)