# config.py
import os
from dotenv import load_dotenv
load_dotenv()

# --- Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY", "default_dev_key")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
ALGORITHM = "HS256"
