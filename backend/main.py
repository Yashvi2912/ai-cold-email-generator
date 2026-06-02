import os
import logging
import pandas as pd
import chromadb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_community.document_loaders import WebBaseLoader

from chains import Chain
from portfolio import Portfolio

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Cold Email Generator API",
    description="API for generating highly personalized cold emails from job postings",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances (Initialized on startup)
llm = None
portfolio = None
chain = None

@app.on_event("startup")
def startup_event():
    global llm, portfolio, chain
    logger.info("Initializing backend services...")

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.warning("GROQ_API_KEY is not set in environment variables!")

    # Initialize LLM
    try:
        llm = ChatGroq(
            temperature=0,
            groq_api_key=api_key,
            model="llama-3.3-70b-versatile"
        )
        chain = Chain(llm)
        logger.info("LLM and Chains initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize LLM: {e}")

    # Initialize ChromaDB and Portfolio
    try:
        # Check if running in a read-only environment or serverless, we persist to a local folder
        client = chromadb.PersistentClient(path="vectorstore")
        collection = client.get_or_create_collection(name="portfolio")
        portfolio = Portfolio(collection)

        # Auto-init if collection is empty
        if collection.count() == 0:
            logger.info("Collection is empty. Initializing from my_portfolio.csv...")
            csv_path = os.path.join(os.path.dirname(__file__), "my_portfolio.csv")
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                portfolio.load_portfolio(df)
                logger.info(f"Loaded {len(df)} portfolio items into vectorstore.")
            else:
                logger.warning(f"Could not find {csv_path} to initialize portfolio.")
        else:
            logger.info(f"Portfolio vectorstore already contains {collection.count()} items.")

    except Exception as e:
        logger.error(f"Failed to initialize Vectorstore/Portfolio: {e}")

# Pydantic Models
class EmailRequest(BaseModel):
    url: str
    tone: str
    template: str

class EmailResponse(BaseModel):
    role: str
    experience: str
    skills: list[str]
    email: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Cold Email Generator API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/generate-email", response_model=EmailResponse)
def generate_email(request: EmailRequest):
    logger.info(f"Received request for URL: {request.url}")
    
    if not llm or not chain or not portfolio:
        logger.error("Services not fully initialized.")
        raise HTTPException(status_code=500, detail="Backend services not initialized properly.")

    try:
        # Load webpage
        logger.info("Loading webpage content...")
        loader = WebBaseLoader(request.url)
        page_data = loader.load().pop().page_content
        logger.info("Webpage loaded successfully.")

        # Extract Job info
        logger.info("Extracting job details...")
        jobs = chain.extract_jobs(page_data)
        
        if isinstance(jobs, dict):
            jobs = [jobs]
            
        if not jobs:
            raise HTTPException(status_code=400, detail="No job postings found at the provided URL.")

        # For simplicity, we just process the first job found
        job = jobs[0]
        
        # Inject tone and template into job dictionary
        job["tone"] = request.tone
        job["template"] = request.template

        skills = job.get("skills", [])
        
        # Query portfolio
        logger.info(f"Querying portfolio for skills: {skills}")
        links = portfolio.query_links(skills)
        
        # Generate email
        logger.info("Generating email with LLM...")
        email = chain.write_mail(job=job, links=links)
        logger.info("Email generated successfully.")

        return EmailResponse(
            role=job.get("role", "Unknown"),
            experience=job.get("experience", "Not specified"),
            skills=skills,
            email=email
        )

    except Exception as e:
        logger.error(f"Error generating email: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
