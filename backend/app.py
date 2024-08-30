from fastapi import FastAPI
from pydantic import BaseModel, Field
from celery.result import AsyncResult
from typing import Any
from fastapi.middleware.cors import CORSMiddleware
from celery_worker import generate_text_task
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title='Proxima')

origins = ["http://localhost",
           "http://0.0.0.0",
           "http://127.0.0.1",
           "http://localhost:80",
           "http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin","Authorization"],
)

class Prompt(BaseModel):
    prompt: str

@app.get("/health")
async def healthcheck():
    return {"status":"success"}

@app.post("/generateText")
async def generate_text(prompt: Prompt):
    task = generate_text_task.delay(prompt.prompt)
    return {"task_id": task.id}

@app.get("/task/{task_id}")
async def get_generate_text(task_id: str):
    task = AsyncResult(task_id)
    choice=task.ready()
    if choice:
        task_result = task.get()
        return {"result": task_result}
    else:
        return {"status": "Task Pending"}
