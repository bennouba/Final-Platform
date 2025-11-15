# Network Diagram & System Architecture

## Overview

This document provides a comprehensive view of the EISHRO platform's network architecture, system components, data flow patterns, and infrastructure topology. The architecture is designed for high availability, scalability, and security.

## System Architecture Overview

### High-Level Architecture
```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        MOB[Mobile App]
        API_CLI[API Clients]
    end

    subgraph "Edge Layer"
        CF[Cloudflare CDN]
        WAF[Web Application Firewall]
        LB[Load Balancer]
    end

    subgraph "Application Layer"
        FE[Frontend - Vercel]
        BE[Backend - Railway]
        API[REST API Gateway]
    end

    subgraph "Data Layer"
        DB[(MySQL Database)]
        REDIS[(Redis Cache)]
        S3[Object Storage]
    end

    subgraph "Integration Layer"
        PAY[Payment Gateways]
        LOG[Logistics APIs]
        EMAIL[Email Service]
        SMS[SMS Service]
    end

    subgraph "Monitoring & Security"
        MON[Monitoring Stack]
        SEC[Security Services]
        LOGS[Audit Logging]
    end

    WEB --> CF
    MOB --> CF
    API_CLI --> CF

    CF --> WAF
    WAF --> LB
    LB --> FE
    LB --> BE

    FE --> API
    API --> BE

    BE --> DB
    BE --> REDIS
    BE --> S3

    BE --> PAY
    BE --> LOG
    BE --> EMAIL
    BE --> SMS

    MON --> BE
    MON --> DB
    MON --> FE
    SEC --> BE
    SEC --> DB
    LOGS --> BE
```

## Network Topology

### Production Network Architecture
```mermaid
graph TB
    subgraph "Internet"
        INTERNET[Public Internet]
    end

    subgraph "Cloudflare"
        CF_GLOBAL[Global CDN Network]
        CF_WAF[WAF & DDoS Protection]
        CF_DNS[DNS & Routing]
    end

    subgraph "Vercel Edge Network"
        VERCEL_US[Vercel US East]
        VERCEL_EU[Vercel EU West]
        VERCEL_ME[Vercel Middle East]
    end

    subgraph "Railway Cloud"
        RAILWAY_US[Railway US]
        RAILWAY_EU[Railway EU]
    end

    subgraph "Database Layer"
        MYSQL_MASTER[(MySQL Master)]
        MYSQL_REPLICA[(MySQL Replica)]
        REDIS_CLUSTER[(Redis Cluster)]
    end

    subgraph "External Services"
        MOAMALAT[Moamalat Gateway]
        ARAMEX[Aramex API]
        SMTP[SMTP Service]
        SMS_GW[SMS Gateway]
    end

    INTERNET --> CF_GLOBAL
    CF_GLOBAL --> CF_WAF
    CF_WAF --> CF_DNS

    CF_DNS --> VERCEL_US
    CF_DNS --> VERCEL_EU
    CF_DNS --> VERCEL_ME

    CF_DNS --> RAILWAY_US
    CF_DNS --> RAILWAY_EU

    RAILWAY_US --> MYSQL_MASTER
    RAILWAY_EU --> MYSQL_REPLICA
    RAILWAY_US --> REDIS_CLUSTER
    RAILWAY_EU --> REDIS_CLUSTER

    RAILWAY_US --> MOAMALAT
    RAILWAY_US --> ARAMEX
    RAILWAY_US --> SMTP
    RAILWAY_US --> SMS_GW
```

## Component Details

### Frontend Layer (Vercel)

#### Architecture
```
Frontend Application Structure:
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service layer
│   ├── lib/           # Utility libraries
│   └── styles/        # Global styles
├── public/            # Static assets
└── dist/             # Build output
```

#### Network Configuration
- **Domains**: platform-eishro.vercel.app, eshro.ly
- **SSL**: Automatic HTTPS with Let's Encrypt
- **CDN**: Vercel Edge Network
- **Caching**: Static asset caching, ISR for dynamic content

### Backend Layer (Railway)

#### Service Architecture
```
Backend Application Structure:
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── database/      # DB migrations & seeds
├── dist/             # Compiled JavaScript
└── logs/             # Application logs
```

#### API Gateway Configuration
```typescript
API Gateway Routes:
├── /api/v1/auth       # Authentication endpoints
├── /api/v1/users      # User management
├── /api/v1/stores     # Store management
├── /api/v1/products   # Product catalog
├── /api/v1/orders     # Order processing
├── /api/v1/payments   # Payment handling
└── /api/v1/analytics  # Reporting & analytics
```

### Database Layer

#### MySQL Architecture
```sql
Database Schema Overview:
├── users              # User accounts & profiles
├── stores             # Merchant stores
├── products           # Product catalog
├── product_images     # Product media
├── orders             # Customer orders
├── order_items        # Order line items
├── payments           # Payment transactions
├── coupons            # Discount coupons
├── user_addresses     # Shipping addresses
└── audit_logs         # Security audit trail
```

#### Connection Pooling
```typescript
Database Connection Configuration:
{
  host: process.env.DB_HOST,
  port: 3306,
  database: 'eishro_db',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pool: {
    max: 20,           // Maximum connections
    min: 5,            // Minimum connections
    acquire: 30000,    // Connection timeout
    idle: 10000        // Idle timeout
  }
}
```

### Security Layer

#### Network Security
```mermaid
graph LR
    subgraph "Perimeter Security"
        WAF[Web Application Firewall]
        DDoS[DDoS Protection]
        SSL[SSL/TLS Termination]
    end

    subgraph "Application Security"
        AUTH[JWT Authentication]
        ACL[Access Control Lists]
        CORS[CORS Policy]
        RATE[Rate Limiting]
    end

    subgraph "Data Security"
        ENC[AES-256 Encryption]
        HASH[bcrypt Hashing]
        AUDIT[Audit Logging]
    end

    INTERNET --> WAF
    WAF --> DDoS
    DDoS --> SSL
    SSL --> AUTH
    AUTH --> ACL
    ACL --> CORS
    CORS --> RATE
    RATE --> ENC
    ENC --> HASH
    HASH --> AUDIT
```

#### Security Controls
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy (CSP)
- **CSRF Protection**: SameSite cookies, CSRF tokens
- **Rate Limiting**: 100 requests per 15 minutes per IP

## Data Flow Diagrams

### User Registration Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database
    participant EM as Email Service

    U->>FE: Submit registration form
    FE->>BE: POST /api/auth/register
    BE->>BE: Validate input data
    BE->>DB: Check email uniqueness
    DB-->>BE: Email available
    BE->>BE: Hash password (bcrypt)
    BE->>DB: Create user record
    DB-->>BE: User created
    BE->>EM: Send verification email
    EM-->>U: Verification email sent
    BE-->>FE: Registration successful
    FE-->>U: Show success message
```

### Order Processing Flow
```mermaid
sequenceDiagram
    participant C as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database
    participant PAY as Payment Gateway
    participant LOG as Logistics API

    C->>FE: Place order
    FE->>BE: POST /api/orders
    BE->>DB: Validate inventory
    DB-->>BE: Inventory confirmed
    BE->>PAY: Process payment
    PAY-->>BE: Payment successful
    BE->>DB: Create order record
    BE->>DB: Update inventory
    BE->>LOG: Create shipment
    LOG-->>BE: Shipment created
    BE->>BE: Send notifications
    BE-->>FE: Order confirmed
    FE-->>C: Show confirmation
```

### Payment Processing Flow
```mermaid
sequenceDiagram
    participant C as Customer
    participant FE as Frontend
    participant BE as Backend
    participant MG as Moamalat Gateway
    participant DB as Database

    C->>FE: Initiate payment
    FE->>BE: POST /api/payments/initiate
    BE->>MG: Create payment session
    MG-->>BE: Payment URL returned
    BE-->>FE: Redirect to payment page
    FE-->>C: Redirect to Moamalat
    C->>MG: Complete payment
    MG->>BE: Payment webhook
    BE->>DB: Update payment status
    BE->>BE: Process order
    BE-->>FE: Payment completed
    FE-->>C: Show success page
```

## Infrastructure Monitoring

### Monitoring Architecture
```mermaid
graph TB
    subgraph "Application Monitoring"
        APP_METRICS[Application Metrics]
        ERROR_TRACKING[Error Tracking]
        PERFORMANCE[Performance Monitoring]
    end

    subgraph "Infrastructure Monitoring"
        SERVER_METRICS[Server Metrics]
        DB_METRICS[Database Metrics]
        NETWORK_METRICS[Network Metrics]
    end

    subgraph "Business Monitoring"
        USER_ANALYTICS[User Analytics]
        SALES_METRICS[Sales Metrics]
        CONVERSION_TRACKING[Conversion Tracking]
    end

    subgraph "Alerting System"
        ALERT_MANAGER[Alert Manager]
        NOTIFICATION[Notification Channels]
        DASHBOARD[Monitoring Dashboard]
    end

    APP_METRICS --> ALERT_MANAGER
    ERROR_TRACKING --> ALERT_MANAGER
    PERFORMANCE --> ALERT_MANAGER
    SERVER_METRICS --> ALERT_MANAGER
    DB_METRICS --> ALERT_MANAGER
    NETWORK_METRICS --> ALERT_MANAGER
    USER_ANALYTICS --> DASHBOARD
    SALES_METRICS --> DASHBOARD
    CONVERSION_TRACKING --> DASHBOARD

    ALERT_MANAGER --> NOTIFICATION
```

### Key Monitoring Metrics
- **Application Performance**: Response times, error rates, throughput
- **Database Performance**: Query execution time, connection pool usage
- **Infrastructure Health**: CPU usage, memory usage, disk I/O
- **Security Events**: Failed login attempts, suspicious activities
- **Business Metrics**: User registrations, order volumes, revenue

## Disaster Recovery

### Backup Strategy
```mermaid
graph TB
    subgraph "Primary Site"
        PRIMARY_DB[(Primary Database)]
        PRIMARY_FILES[File Storage]
        PRIMARY_LOGS[Application Logs]
    end

    subgraph "Backup Site"
        BACKUP_DB[(Backup Database)]
        BACKUP_FILES[Backup Storage]
        BACKUP_LOGS[Log Archives]
    end

    subgraph "Offsite Storage"
        CLOUD_BACKUP[Cloud Backup]
        TAPE_BACKUP[Tape Backup]
    end

    PRIMARY_DB --> BACKUP_DB
    PRIMARY_FILES --> BACKUP_FILES
    PRIMARY_LOGS --> BACKUP_LOGS

    BACKUP_DB --> CLOUD_BACKUP
    BACKUP_FILES --> CLOUD_BACKUP
    BACKUP_LOGS --> TAPE_BACKUP
```

### Recovery Procedures
1. **Database Failover**: Automatic switch to replica within 30 seconds
2. **Application Recovery**: Container restart within 60 seconds
3. **Data Recovery**: Point-in-time recovery from backups
4. **Full System Recovery**: Complete restoration within 4 hours

## Scalability Design

### Horizontal Scaling
```mermaid
graph LR
    subgraph "Load Balancer"
        LB[Load Balancer]
    end

    subgraph "Application Servers"
        APP1[App Server 1]
        APP2[App Server 2]
        APP3[App Server 3]
        APP4[App Server N]
    end

    subgraph "Database Cluster"
        MASTER[(Master DB)]
        REPLICA1[(Replica 1)]
        REPLICA2[(Replica 2)]
        REPLICA3[(Replica N)]
    end

    subgraph "Cache Cluster"
        CACHE1[(Redis 1)]
        CACHE2[(Redis 2)]
        CACHE3[(Redis 3)]
    end

    LB --> APP1
    LB --> APP2
    LB --> APP3
    LB --> APP4

    APP1 --> MASTER
    APP2 --> MASTER
    APP3 --> REPLICA1
    APP4 --> REPLICA2

    APP1 --> CACHE1
    APP2 --> CACHE2
    APP3 --> CACHE3
    APP4 --> CACHE1
```

### Auto-Scaling Triggers
- **CPU Usage**: Scale up when >70% for 5 minutes
- **Memory Usage**: Scale up when >80% for 3 minutes
- **Request Queue**: Scale up when queue >100 requests
- **Database Connections**: Scale up when connections >80% of pool

## Compliance and Security

### Network Security Controls
- **Firewall Rules**: Restrict inbound/outbound traffic
- **Network Segmentation**: Isolate sensitive components
- **VPN Access**: Secure administrative access
- **Intrusion Detection**: Real-time threat monitoring

### Data Protection
- **Encryption in Transit**: TLS 1.3 for all communications
- **Encryption at Rest**: AES-256-GCM for database and files
- **Data Masking**: Sensitive data masking in logs
- **Backup Encryption**: Encrypted backup storage

## Performance Optimization

### CDN Configuration
- **Edge Locations**: 200+ global edge locations
- **Caching Rules**: Static assets cached for 1 year
- **Dynamic Content**: ISR for frequently changing content
- **Image Optimization**: Automatic format conversion and compression

### Database Optimization
- **Indexing Strategy**: Composite indexes for common queries
- **Query Optimization**: EXPLAIN analysis for slow queries
- **Connection Pooling**: Efficient connection reuse
- **Read Replicas**: Offload read queries to replicas

## Conclusion

The EISHRO platform's network architecture is designed to provide high availability, scalability, and security while maintaining optimal performance. The multi-layered approach ensures that the platform can handle growth while maintaining reliability and user experience.

## Appendices

### Appendix A: Detailed Component Specifications
### Appendix B: Security Policy Document
### Appendix C: Disaster Recovery Plan
### Appendix D: Performance Benchmarks
### Appendix E: Network Configuration Scripts