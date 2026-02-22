from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class TeamRole(str, Enum):
    LEAD = "lead"
    MEMBER = "member"
    ADMIN = "admin"


class ApplicationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class InvitationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"


class TeamCategory(str, Enum):
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


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=10)
    skills: List[str] = []
    looking_for: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    category: TeamCategory


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    skills: Optional[List[str]] = None
    looking_for: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[TeamCategory] = None


class TeamMember(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    role: TeamRole
    joined_at: datetime


class TeamInDB(TeamBase):
    id: str = Field(alias="_id")
    lead_id: str
    members: List[TeamMember] = []
    created_at: datetime
    updated_at: datetime


class TeamResponse(TeamBase):
    id: str
    lead_id: str
    lead_name: str
    members_count: int
    created_at: datetime
    updated_at: datetime


class TeamListResponse(BaseModel):
    teams: List[TeamResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool


class TeamApplication(BaseModel):
    team_id: str
    user_id: str
    user_name: str
    user_email: str
    cover_letter: str
    role: str
    status: ApplicationStatus = ApplicationStatus.PENDING
    created_at: datetime


class TeamInvitation(BaseModel):
    team_id: str
    team_name: str
    inviter_id: str
    inviter_name: str
    invitee_email: str
    role: str
    message: Optional[str] = None
    status: InvitationStatus = InvitationStatus.PENDING
    created_at: datetime


class TeamApplicationCreate(BaseModel):
    cover_letter: str = Field(..., min_length=10)
    role: str = Field(..., min_length=1)


class TeamInvitationCreate(BaseModel):
    email: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)
    message: Optional[str] = None 