from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from routes import api, export

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoadGuard AI", description="Pothole Detection API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")
app.include_router(export.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "RoadGuard AI Backend Running"}
