from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MongoDB Configuration
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "coopflow_db"
    
    # JWT Configuration
    secret_key: str = "your-secret-key-here-make-it-long-and-secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # File Upload Configuration
    upload_dir: str = "uploads"
    max_file_size: int = 5242880  # 5MB in bytes
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings() 