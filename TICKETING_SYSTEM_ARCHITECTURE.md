# 🏗️ Arsitektur Sistem IT Helpdesk / Ticketing System

## Diagram Arsitektur

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile App]
        C[Admin Panel]
    end
    
    subgraph "API Gateway / Load Balancer"
        D[Nginx / Load Balancer]
    end
    
    subgraph "Application Layer"
        E[Express.js API Server]
        F[SSO Authentication Service]
    end
    
    subgraph "Business Logic Layer"
        G[Ticket Management]
        H[User Management]
        I[Notification Service]
        J[File Upload Service]
    end
    
    subgraph "Data Layer"
        K[PostgreSQL Database]
        L[MinIO File Storage]
        M[Redis Cache]
    end
    
    subgraph "External Services"
        N[Email SMTP]
        O[WhatsApp API]
        P[Monitoring Tools]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    G --> K
    H --> K
    I --> N
    I --> O
    J --> L
    E --> M
    G --> P
    
    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style K fill:#e8f5e8
    style L fill:#e8f5e8
    style M fill:#e8f5e8
```

## Diagram Database Schema

```mermaid
erDiagram
    users {
        uuid id PK
        string name
        string email UK
        string password
        string division
        enum role
        boolean status
        timestamp created_at
        timestamp updated_at
    }
    
    categories {
        uuid id PK
        string name UK
        text description
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    priorities {
        uuid id PK
        string name UK
        text description
        integer level
        string color
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    sla_rules {
        uuid id PK
        uuid priority_id FK
        integer duration_hours
        text description
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    tickets {
        uuid id PK
        string ticket_number UK
        uuid user_id FK
        uuid assigned_to FK
        uuid category_id FK
        uuid priority_id FK
        string title
        text description
        enum status
        timestamp sla_deadline
        timestamp resolved_at
        timestamp closed_at
        timestamp created_at
        timestamp updated_at
    }
    
    ticket_comments {
        uuid id PK
        uuid ticket_id FK
        uuid user_id FK
        text comment
        boolean is_internal
        timestamp created_at
    }
    
    ticket_attachments {
        uuid id PK
        uuid ticket_id FK
        uuid user_id FK
        string file_name
        string file_path
        string file_type
        integer file_size
        text description
        timestamp created_at
    }
    
    users ||--o{ tickets : creates
    users ||--o{ tickets : assigned_to
    users ||--o{ ticket_comments : writes
    users ||--o{ ticket_attachments : uploads
    categories ||--o{ tickets : categorizes
    priorities ||--o{ tickets : prioritizes
    priorities ||--|| sla_rules : defines
    tickets ||--o{ ticket_comments : has
    tickets ||--o{ ticket_attachments : contains
```

## Diagram Alur Tiket

```mermaid
flowchart TD
    A[User Login] --> B[Dashboard User]
    B --> C[Buat Tiket Baru]
    C --> D[Form Tiket]
    D --> E[Submit Tiket]
    E --> F[Status: OPEN]
    F --> G[Notifikasi ke IT Staff]
    
    H[IT Staff Login] --> I[Dashboard Staff]
    I --> J[Daftar Tiket]
    J --> K[Assign Tiket]
    K --> L[Status: IN_PROGRESS]
    L --> M[Notifikasi ke User]
    
    N[Teknisi] --> O[Update Progress]
    O --> P[Tambah Komentar]
    P --> Q[Upload File]
    Q --> R[Update Status]
    R --> S{Status?}
    
    S -->|RESOLVED| T[Notifikasi ke User]
    S -->|ON_HOLD| U[Menunggu Info/Part]
    S -->|IN_PROGRESS| O
    
    T --> V[User Review]
    V --> W{User Puas?}
    W -->|Ya| X[Close Tiket]
    W -->|Tidak| Y[Tambah Komentar]
    Y --> Z[Status: IN_PROGRESS]
    Z --> O
    
    X --> AA[Status: CLOSED]
    U --> BB[Status: IN_PROGRESS]
    BB --> O
    
    CC[SLA Monitoring] --> DD{Tiket Overdue?}
    DD -->|Ya| EE[Notifikasi SLA]
    DD -->|Tidak| FF[Continue Monitoring]
    EE --> GG[Escalate to Manager]
    
    style F fill:#ffeb3b
    style L fill:#2196f3
    style T fill:#4caf50
    style X fill:#f44336
    style AA fill:#9e9e9e
```

## Diagram Komponen Sistem

```mermaid
graph LR
    subgraph "Frontend"
        A[User Portal]
        B[IT Staff Portal]
        C[Manager Dashboard]
        D[Admin Panel]
    end
    
    subgraph "API Layer"
        E[REST API]
        F[Authentication Middleware]
        G[Validation Middleware]
        H[File Upload Middleware]
    end
    
    subgraph "Business Logic"
        I[Ticket Service]
        J[User Service]
        K[Notification Service]
        L[File Service]
        M[Dashboard Service]
    end
    
    subgraph "Data Access"
        N[Ticket Repository]
        O[User Repository]
        P[Category Repository]
        Q[Priority Repository]
    end
    
    subgraph "Infrastructure"
        R[PostgreSQL]
        S[MinIO Storage]
        T[Email Service]
        U[Redis Cache]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> F
    E --> G
    E --> H
    F --> I
    G --> I
    H --> L
    I --> N
    J --> O
    K --> T
    L --> S
    M --> N
    N --> R
    O --> R
    P --> R
    Q --> R
    I --> U
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#fce4ec
    style R fill:#f3e5f5
    style S fill:#f3e5f5
    style T fill:#f3e5f5
    style U fill:#f3e5f5
```

## Diagram Role & Permission

```mermaid
graph TD
    A[User Login] --> B{Role Check}
    
    B -->|User| C[User Portal]
    B -->|IT Staff| D[IT Staff Portal]
    B -->|Manager| E[Manager Dashboard]
    B -->|Admin| F[Admin Panel]
    
    C --> C1[View Own Tickets]
    C --> C2[Create New Ticket]
    C --> C3[Add Comments]
    C --> C4[Upload Attachments]
    C --> C5[Close Own Tickets]
    
    D --> D1[View All Tickets]
    D --> D2[Assign Tickets]
    D --> D3[Update Ticket Status]
    D --> D4[Add Internal Comments]
    D --> D5[Upload Solution Files]
    D --> D6[View SLA Status]
    
    E --> E1[View All Tickets]
    E --> E2[View Reports]
    E --> E3[Monitor SLA]
    E --> E4[View Staff Performance]
    E --> E5[Export Reports]
    
    F --> F1[Manage Users]
    F --> F2[Manage Categories]
    F --> F3[Manage Priorities]
    F --> F4[Manage SLA Rules]
    F --> F5[System Configuration]
    F --> F6[View All Data]
    
    style C fill:#e3f2fd
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style F fill:#fce4ec
```

## Diagram Notifikasi

```mermaid
sequenceDiagram
    participant U as User
    participant API as API Server
    participant DB as Database
    participant NS as Notification Service
    participant ES as Email Service
    participant IT as IT Staff
    
    U->>API: Create Ticket
    API->>DB: Save Ticket
    API->>NS: Trigger Notification
    NS->>ES: Send Email
    ES->>IT: Email Notification
    
    IT->>API: Assign Ticket
    API->>DB: Update Ticket
    API->>NS: Trigger Notification
    NS->>ES: Send Email
    ES->>U: Assignment Notification
    
    IT->>API: Update Status
    API->>DB: Update Ticket
    API->>NS: Trigger Notification
    NS->>ES: Send Email
    ES->>U: Status Update Notification
    
    IT->>API: Add Comment
    API->>DB: Save Comment
    API->>NS: Trigger Notification
    NS->>ES: Send Email
    ES->>U: Comment Notification
    
    Note over NS,ES: SLA Monitoring
    NS->>ES: SLA Reminder
    ES->>IT: Overdue Notification
```

## Diagram File Upload Flow

```mermaid
flowchart TD
    A[User Upload File] --> B[File Validation]
    B --> C{File Valid?}
    C -->|No| D[Return Error]
    C -->|Yes| E[Generate Unique Filename]
    E --> F[Upload to MinIO]
    F --> G{Upload Success?}
    G -->|No| H[Return Error]
    G -->|Yes| I[Save File Record to DB]
    I --> J[Return Success]
    
    K[File Download] --> L[Check Permission]
    L --> M{Has Permission?}
    M -->|No| N[Return 403]
    M -->|Yes| O[Get File from MinIO]
    O --> P[Return File]
    
    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style I fill:#e8f5e8
    style J fill:#4caf50
    style D fill:#f44336
    style H fill:#f44336
    style N fill:#ff9800
```

## Diagram Monitoring & SLA

```mermaid
graph TD
    A[SLA Monitoring Service] --> B[Check Ticket Deadlines]
    B --> C{Ticket Overdue?}
    C -->|No| D[Continue Monitoring]
    C -->|Yes| E[Mark as Overdue]
    E --> F[Send Notification]
    F --> G[Update Dashboard]
    
    H[Performance Monitoring] --> I[Calculate Metrics]
    I --> J[SLA Compliance %]
    I --> K[Average Resolution Time]
    I --> L[Staff Performance]
    I --> M[Category Statistics]
    
    N[Alert System] --> O{SLA Threshold?}
    O -->|Below| P[Send Alert to Manager]
    O -->|Above| Q[Continue Monitoring]
    
    R[Reporting Service] --> S[Generate Reports]
    S --> T[Daily Reports]
    S --> U[Weekly Reports]
    S --> V[Monthly Reports]
    S --> W[Custom Reports]
    
    style E fill:#f44336
    style F fill:#ff9800
    style P fill:#f44336
    style J fill:#4caf50
    style K fill:#2196f3
```

## Teknologi Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Knex.js** - SQL query builder
- **PostgreSQL** - Database
- **Joi** - Data validation
- **Multer** - File upload handling

### Authentication & Security
- **SSO** - Single Sign-On integration
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **XSS Protection** - Cross-site scripting protection

### File Storage & Media
- **MinIO** - Object storage
- **Multer** - File upload middleware
- **Sharp** - Image processing

### Communication
- **Nodemailer** - Email service
- **RabbitMQ** - Message queue (optional)
- **WebSocket** - Real-time communication (optional)

### Monitoring & Logging
- **Winston** - Logging
- **Morgan** - HTTP request logger
- **Custom Monitoring** - SLA tracking

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Docker** - Containerization

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        A[Load Balancer]
        B[API Server 1]
        C[API Server 2]
        D[Database Primary]
        E[Database Replica]
        F[MinIO Cluster]
        G[Redis Cluster]
    end
    
    subgraph "Development Environment"
        H[Dev API Server]
        I[Dev Database]
        J[Dev MinIO]
    end
    
    subgraph "External Services"
        K[Email SMTP]
        L[Monitoring Tools]
        M[Backup Service]
    end
    
    A --> B
    A --> C
    B --> D
    C --> D
    B --> E
    C --> E
    B --> F
    C --> F
    B --> G
    C --> G
    
    D --> M
    F --> M
    
    style A fill:#e3f2fd
    style D fill:#e8f5e8
    style E fill:#e8f5e8
    style F fill:#fff3e0
    style G fill:#fce4ec
```

Sistem IT Helpdesk / Ticketing System ini dirancang dengan arsitektur yang scalable, maintainable, dan secure. Semua komponen terintegrasi dengan baik dan mendukung berbagai skenario penggunaan sesuai dengan kebutuhan organisasi.
