# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import jwt
import datetime
import json

app = FastAPI(title="HearthChat API")

# Allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your Vercel domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SECRETS (Use .env in production) ---
SECRET_KEY = "ghibli_cozy_secret_key"

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        # Maps conversation_id -> list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, conversation_id: str):
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = []
        self.active_connections[conversation_id].append(websocket)

    def disconnect(self, websocket: WebSocket, conversation_id: str):
        self.active_connections[conversation_id].remove(websocket)

    async def broadcast(self, message: str, conversation_id: str):
        for connection in self.active_connections.get(conversation_id, []):
            await connection.send_text(message)

manager = ConnectionManager()

# --- ROUTES ---
@app.post("/auth/magic-link")
async def request_magic_link(email: str):
    # In production, send email via SendGrid here.
    # For now, we mock generating a token.
    token = jwt.encode(
        {"sub": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
        SECRET_KEY, algorithm="HS256"
    )
    return {"message": "Magic link sent!", "mock_token": token}

@app.websocket("/ws/chat/{conversation_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: str):
    await manager.connect(websocket, conversation_id)
    try:
        while True:
            data = await websocket.receive_text()
            # In production: Save message to PostgreSQL here using SQLAlchemy
            message_payload = json.dumps({"text": data, "timestamp": str(datetime.datetime.now())})
            await manager.broadcast(message_payload, conversation_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, conversation_id)
        await manager.broadcast(json.dumps({"system": "A user left the hearth."}), conversation_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)