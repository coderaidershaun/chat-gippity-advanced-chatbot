# uvicorn main:app
# uvicorn main:app --reload

# Main imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Any
from pydantic import BaseModel
from decouple import config
import openai
import ast

# Function imports
from func_ai import confirm_route

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
)

# Message class
class IMessage(BaseModel):
  role: str
  content: str


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
  
  # Handle routing
  routing = confirm_route(message_input)
  if routing == "":
    raise HTTPException(status_code=400, detail="Failed to receive AI response")

  # Convert routing string response to array
  try:
    msg_list = ast.literal_eval(routing)
  except:
    raise HTTPException(status_code=400, detail="Something went wrong with the reply")

  # Return routing
  return { "routing": msg_list }


# Route confirmation
@app.get("/api/{item}")
async def process_request(messages: List[IMessage]):
  print(item)
  print(messages)

  # Return routing
  return { "response": "hello" }
