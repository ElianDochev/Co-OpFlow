from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ProjectCategory(str, Enum):
    WEB_SOFTWARE = "web_software_development"
    MOBILE_APPS = "mobile_apps"
    AI_ML = "ai_machine_learning"
    BLOCKCHAIN_CRYPTO = "blockchain_crypto"
    GAME_DEV = "game_development"
    AR_VR_XR = "ar_vr_xr"
    HARDWARE_IOT = "hardware_iot"
    CYBERSECURITY = "cybersecurity"
    DEVOPS_INFRA = "devops_infrastructure"
    VISUAL_ARTS = "visual_arts"
    MUSIC_AUDIO = "music_audio_projects"
    FILM_VIDEO_ANIMATION = "film_video_animation"
    GRAPHIC_DESIGN = "graphic_design_branding"
    PHOTOGRAPHY = "photography"
    FASHION_APPAREL = "fashion_apparel"
    PERFORMING_ARTS = "performing_arts"
    CREATIVE_WRITING = "creative_writing_literature_comics"
    STARTUP_MVP = "startup_mvp_development"
    ECOMMERCE = "ecommerce_online_stores"
    SAAS_B2B = "saas_b2b_solutions"
    FINTECH = "finance_fintech"
    REAL_ESTATE = "real_estate_proptech"
    HR_RECRUITMENT = "hr_recruitment_platforms"
    MARKETING_ADVERTISING = "marketing_advertising_projects"
    LEGALTECH = "legaltech"
    NONPROFITS_NGOS = "nonprofits_ngos"
    EDUCATION = "education_learning_platforms"
    MENTAL_HEALTH = "mental_health_wellbeing"
    ENVIRONMENTAL = "environmental_sustainability_projects"
    DIVERSITY_INCLUSION = "diversity_inclusion_initiatives"
    LOCAL_COMMUNITY = "local_community_building"
    HEALTHTECH_MEDTECH = "healthtech_medtech"
    BIOTECH = "biotechnology_biohacking"
    SCIENTIFIC_RESEARCH = "scientific_research_collaborations"
    SPACE_AEROSPACE = "space_aerospace_projects"
    UNIVERSITY_STUDENT = "university_student_projects"
    HACKATHON = "hackathon_ideas"
    OPEN_SOURCE = "open_source_contributions"
    EXPERIMENTAL = "experimental_conceptual_projects"
    HOBBY = "hobby_projects"
    DIY_MAKER = "diy_maker_hardware"
    EVENTS_FESTIVALS = "events_festivals"
    CROWDFUNDING = "crowdfunding_campaigns"
    LIFESTYLE_PRODUCTIVITY = "lifestyle_productivity_tools"
    CLOUD_COMPUTING = "cloud_computing"
    ROBOTICS = "robotics"
    QUANTUM_COMPUTING = "quantum_computing"
    SPORTS_FITNESS = "sports_fitness"
    TRAVEL_TOURISM = "travel_tourism"
    FOOD_BEVERAGE = "food_beverage"
    PARENTING_FAMILY = "parenting_family"
    PETS_ANIMALS = "pets_animals"
    AUTOMOTIVE = "automotive"
    AGRICULTURE = "agriculture"
    PUBLIC_SAFETY = "public_safety"
    GOVERNMENT_CIVICTECH = "government_civictech"


class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)
    category: ProjectCategory
    tech_stack: List[str] = []
    team_name: Optional[str] = None
    looking_for: Optional[str] = None
    image_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[ProjectCategory] = None
    tech_stack: Optional[List[str]] = None
    team_name: Optional[str] = None
    looking_for: Optional[str] = None
    image_url: Optional[str] = None


class ProjectInDB(ProjectBase):
    id: str = Field(alias="_id")
    creator_id: str
    likes_count: int = 0  # Integer counter for likes
    stars_count: int = 0  # Integer counter for stars
    created_at: datetime
    updated_at: datetime


class ProjectResponse(ProjectBase):
    id: str
    creator_id: str
    creator_name: str
    likes_count: int
    stars_count: int
    created_at: datetime
    updated_at: datetime


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool 