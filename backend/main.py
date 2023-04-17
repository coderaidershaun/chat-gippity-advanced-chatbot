# uvicorn main:app
# uvicorn main:app --reload

# Main imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from decouple import config
import openai


# Function imports
from func_ai import confirm_route, is_chat_analysis, clean_user_message, get_chat_response
from func_tasks import contruct_system_content

# Get Environment Vars
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")

# Initiate App
app = FastAPI()

# CORS - Origins
origins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:4174",
  "http://localhost:3000",
]

# CORS - Middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
  expose_headers=["Content-Disposition"]
)

# Message class
class IMessage(BaseModel):
  role: str
  content: str

# Execute class
class IExecute(BaseModel):
  routeId: int
  messages: list[IMessage]


# Check health
@app.get("/api/health")
async def check_health():
  return {"response": "healthy"}


# Route confirmation
@app.post("/api/router")
async def route_request(messages: List[IMessage]):

  # Structure messages and get last 5 messages for context
  message_input = [message.dict() for message in messages]
  if len(message_input) > 5:
    message_input = message_input[-5: ]

  # Handle no input text
  if (len(message_input)) == 0:
    raise HTTPException(status_code=400, detail="Too few words")
  
  # Handle too muchg input text
  if (len(message_input)) >= 500:
    raise HTTPException(status_code=400, detail="Too many words")
  
  # Identify chat type
  is_chat = is_chat_analysis(message_input)
  if is_chat == 2:
    raise HTTPException(status_code=400, detail="Error getting Chat")

  # Construct chat response
  chat_response = get_chat_response(message_input, is_chat)
  if chat_response == "":
    raise HTTPException(status_code=400, detail="Error getting chat response")

  # Early: Return early if just chat
  if is_chat == 1:
    return { "routing": [0, chat_response] }
  
  # Get task routing
  routing = confirm_route(message_input)
  if routing == "":
    raise HTTPException(status_code=400, detail="Failed to receive AI response")
  
  # Return routing
  return { "routing": [routing, chat_response] }


# Route confirmation
@app.post("/api/execute")
async def process_request(execution: IExecute):
  route_id = execution.routeId
  messages = [message.dict() for message in execution.messages]
  if route_id == 0:
    raise HTTPException(status_code=400, detail="RouteId should not be zero")

  # Get system content
  contruct_system_content(route_id, messages)
  return { "response": "Task complete" }
  # system_content, content_type, media_type, file_ext = contruct_system_content(route_id, messages)

  # # Return content type
  # if content_type == "f":
  #   return FileResponse(system_content, media_type="application/octet-stream", filename=f"file{file_ext}")
  # else:
  #   return { "response": "Task complete" }
