from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Academic Works API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# Models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class AcademicWork(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    author: str
    abstract: str
    category_id: str
    year: int
    university: Optional[str] = None
    advisor: Optional[str] = None
    pdf_url: Optional[str] = None
    type: str  # "skripsi", "tesis", "disertasi"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AcademicWorkCreate(BaseModel):
    title: str
    author: str
    abstract: str
    category_id: str
    year: int
    university: Optional[str] = None
    advisor: Optional[str] = None
    pdf_url: Optional[str] = None
    type: str

class AdminAuth(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Simple admin authentication
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"  # In production, use hashed passwords
SECRET_TOKEN = "academic_works_admin_token_2025"

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != SECRET_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

# Authentication endpoints
@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(auth: AdminAuth):
    if auth.username != ADMIN_USERNAME or auth.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    return AdminToken(access_token=SECRET_TOKEN)

# Category endpoints
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find().to_list(length=None)
    return [Category(**cat) for cat in categories]

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate, token: str = Depends(verify_admin_token)):
    category_dict = category.dict()
    category_obj = Category(**category_dict)
    await db.categories.insert_one(category_obj.dict())
    return category_obj

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(
    category_id: str, 
    category: CategoryCreate, 
    token: str = Depends(verify_admin_token)
):
    category_dict = category.dict()
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": category_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    updated_category = await db.categories.find_one({"id": category_id})
    return Category(**updated_category)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, token: str = Depends(verify_admin_token)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# Academic works endpoints
@api_router.get("/works", response_model=List[AcademicWork])
async def get_works(category_id: Optional[str] = None, type: Optional[str] = None):
    filter_dict = {}
    if category_id:
        filter_dict["category_id"] = category_id
    if type:
        filter_dict["type"] = type
    
    works = await db.academic_works.find(filter_dict).sort("created_at", -1).to_list(length=None)
    return [AcademicWork(**work) for work in works]

@api_router.get("/works/{work_id}", response_model=AcademicWork)
async def get_work(work_id: str):
    work = await db.academic_works.find_one({"id": work_id})
    if not work:
        raise HTTPException(status_code=404, detail="Academic work not found")
    return AcademicWork(**work)

@api_router.post("/works", response_model=AcademicWork)
async def create_work(work: AcademicWorkCreate, token: str = Depends(verify_admin_token)):
    # Verify category exists
    category = await db.categories.find_one({"id": work.category_id})
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    
    work_dict = work.dict()
    work_obj = AcademicWork(**work_dict)
    await db.academic_works.insert_one(work_obj.dict())
    return work_obj

@api_router.put("/works/{work_id}", response_model=AcademicWork)
async def update_work(
    work_id: str, 
    work: AcademicWorkCreate, 
    token: str = Depends(verify_admin_token)
):
    # Verify category exists
    category = await db.categories.find_one({"id": work.category_id})
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    
    work_dict = work.dict()
    result = await db.academic_works.update_one(
        {"id": work_id},
        {"$set": work_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Academic work not found")
    
    updated_work = await db.academic_works.find_one({"id": work_id})
    return AcademicWork(**updated_work)

@api_router.delete("/works/{work_id}")
async def delete_work(work_id: str, token: str = Depends(verify_admin_token)):
    result = await db.academic_works.delete_one({"id": work_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Academic work not found")
    return {"message": "Academic work deleted successfully"}

# Statistics endpoint
@api_router.get("/stats")
async def get_stats():
    total_works = await db.academic_works.count_documents({})
    total_categories = await db.categories.count_documents({})
    
    # Count by type
    skripsi_count = await db.academic_works.count_documents({"type": "skripsi"})
    tesis_count = await db.academic_works.count_documents({"type": "tesis"})
    disertasi_count = await db.academic_works.count_documents({"type": "disertasi"})
    
    return {
        "total_works": total_works,
        "total_categories": total_categories,
        "by_type": {
            "skripsi": skripsi_count,
            "tesis": tesis_count,
            "disertasi": disertasi_count
        }
    }

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
