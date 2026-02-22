// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the coopflow_db database
db = db.getSiblingDB('coopflow_db');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "account_type", "hashed_password", "created_at", "updated_at"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        name: {
          bsonType: "string",
          minLength: 1
        },
        account_type: {
          enum: ["personal", "startup"]
        },
        hashed_password: {
          bsonType: "string"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection('projects', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "category", "creator_id", "created_at", "updated_at"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200
        },
        description: {
          bsonType: "string",
          minLength: 10
        },
        category: {
          enum: [
            "web_software_development",
            "mobile_apps",
            "ai_machine_learning",
            "blockchain_crypto",
            "game_development",
            "ar_vr_xr",
            "hardware_iot",
            "cybersecurity",
            "devops_infrastructure",
            "visual_arts",
            "music_audio_projects",
            "film_video_animation",
            "graphic_design_branding",
            "photography",
            "fashion_apparel",
            "performing_arts",
            "creative_writing_literature_comics",
            "startup_mvp_development",
            "ecommerce_online_stores",
            "saas_b2b_solutions",
            "finance_fintech",
            "real_estate_proptech",
            "hr_recruitment_platforms",
            "marketing_advertising_projects",
            "legaltech",
            "nonprofits_ngos",
            "education_learning_platforms",
            "mental_health_wellbeing",
            "environmental_sustainability_projects",
            "diversity_inclusion_initiatives",
            "local_community_building",
            "healthtech_medtech",
            "biotechnology_biohacking",
            "scientific_research_collaborations",
            "space_aerospace_projects",
            "university_student_projects",
            "hackathon_ideas",
            "open_source_contributions",
            "experimental_conceptual_projects",
            "hobby_projects",
            "diy_maker_hardware",
            "events_festivals",
            "crowdfunding_campaigns",
            "lifestyle_productivity_tools",
            "cloud_computing",
            "robotics",
            "quantum_computing",
            "sports_fitness",
            "travel_tourism",
            "food_beverage",
            "parenting_family",
            "pets_animals",
            "automotive",
            "agriculture",
            "public_safety",
            "government_civictech"
          ]
        },
        creator_id: {
          bsonType: "string"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create chats collection
db.createCollection('chats', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["participant_ids", "participant_names", "created_at", "updated_at"],
      properties: {
        name: {
          bsonType: "string"
        },
        is_group: {
          bsonType: "bool"
        },
        participant_ids: {
          bsonType: "array",
          minItems: 2
        },
        participant_names: {
          bsonType: "array",
          minItems: 2
        },
        last_message: {
          bsonType: "object"
        },
        last_message_at: {
          bsonType: "date"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create messages collection
db.createCollection('messages', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["content", "message_type", "chat_id", "sender_id", "sender_name", "created_at", "updated_at"],
      properties: {
        content: {
          bsonType: "string",
          minLength: 1,
          maxLength: 1000
        },
        message_type: {
          enum: ["text", "image", "file"]
        },
        chat_id: {
          bsonType: "string"
        },
        sender_id: {
          bsonType: "string"
        },
        sender_name: {
          bsonType: "string"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create notifications collection
db.createCollection('notifications', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "message", "notification_type", "recipient_id", "is_read", "created_at", "updated_at"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200
        },
        message: {
          bsonType: "string",
          minLength: 1,
          maxLength: 500
        },
        notification_type: {
          enum: ["message", "team_invitation", "project_like", "project_star", "event_registration", "forum_reply", "general"]
        },
        data: {
          bsonType: "object"
        },
        recipient_id: {
          bsonType: "string"
        },
        is_read: {
          bsonType: "bool"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create teams collection
db.createCollection('teams', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "creator_id", "created_at", "updated_at"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200
        },
        category: {
          enum: [
            "web_software_development",
            "mobile_apps",
            "ai_machine_learning",
            "blockchain_crypto",
            "game_development",
            "ar_vr_xr",
            "hardware_iot",
            "cybersecurity",
            "devops_infrastructure",
            "visual_arts",
            "music_audio_projects",
            "film_video_animation",
            "graphic_design_branding",
            "photography",
            "fashion_apparel",
            "performing_arts",
            "creative_writing_literature_comics",
            "startup_mvp_development",
            "ecommerce_online_stores",
            "saas_b2b_solutions",
            "finance_fintech",
            "real_estate_proptech",
            "hr_recruitment_platforms",
            "marketing_advertising_projects",
            "legaltech",
            "nonprofits_ngos",
            "education_learning_platforms",
            "mental_health_wellbeing",
            "environmental_sustainability_projects",
            "diversity_inclusion_initiatives",
            "local_community_building",
            "healthtech_medtech",
            "biotechnology_biohacking",
            "scientific_research_collaborations",
            "space_aerospace_projects",
            "university_student_projects",
            "hackathon_ideas",
            "open_source_contributions",
            "experimental_conceptual_projects",
            "hobby_projects",
            "diy_maker_hardware",
            "events_festivals",
            "crowdfunding_campaigns",
            "lifestyle_productivity_tools",
            "cloud_computing",
            "robotics",
            "quantum_computing",
            "sports_fitness",
            "travel_tourism",
            "food_beverage",
            "parenting_family",
            "pets_animals",
            "automotive",
            "agriculture",
            "public_safety",
            "government_civictech"
          ]
        },
        creator_id: {
          bsonType: "string"
        },
        created_at: {
          bsonType: "date"
        },
        updated_at: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "created_at": -1 });

db.projects.createIndex({ "creator_id": 1 });
db.projects.createIndex({ "category": 1 });
db.projects.createIndex({ "created_at": -1 });
db.projects.createIndex({ "title": "text", "description": "text", "team_name": "text" });

// Indexes for chats
db.chats.createIndex({ "participant_ids": 1 });
db.chats.createIndex({ "last_message_at": -1 });
db.chats.createIndex({ "created_at": -1 });

// Indexes for messages
db.messages.createIndex({ "chat_id": 1 });
db.messages.createIndex({ "sender_id": 1 });
db.messages.createIndex({ "created_at": -1 });

// Indexes for notifications
db.notifications.createIndex({ "recipient_id": 1 });
db.notifications.createIndex({ "is_read": 1 });
db.notifications.createIndex({ "created_at": -1 });
db.notifications.createIndex({ "notification_type": 1 });

print("MongoDB initialization completed successfully!"); 