from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from pydantic import BaseModel
from typing import Optional, Dict, Any
from agents.orchestrator import Orchestrator

app = FastAPI(title="Inkle Tourism AI")

# CORS - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()

class ChatRequest(BaseModel):
    message: str
    preferences: Optional[Dict[str, Any]] = None

@app.get("/")
async def root():
    return {"message": "Inkle Tourism AI Backend is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = await orchestrator.process_query(request.message, request.preferences)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
