# EISHRO Platform - System Architecture Diagrams

## Overview

This document provides comprehensive visual representations of the EISHRO Platform architecture, including system components, data flow diagrams, database schemas, and integration patterns.

**Current Status (November 2025):**
- ✅ Frontend: 99% Complete
- ✅ Admin Portal: Complete
- ✅ CRM System: Complete
- ✅ Payment Integrations: Complete
- 🔄 Backend API: In Development (Next Phase)
- 🔄 Mobile App: Planned

## System Architecture Diagram

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Layer"
        A[Web Browser/Mobile] --> B[React Frontend]
        B --> C[State Management]
        C --> D[Local Storage/Cache]
    end

    %% API Layer
    subgraph "API Layer"
        E[Cloudflare Workers] --> F[Hono.js Framework]
        F --> G[API Routes]
        G --> H[Authentication]
        G --> I[Business Logic]
    end

    %% Data Layer
    subgraph "Data Layer"
        J[Neon PostgreSQL] --> K[(Relational Database)]
        L[Cloudflare KV] --> M[(Key-Value Store)]
        N[Cloudflare R2] --> O[(Object Storage)]
    end

    %% External Integrations
    subgraph "External Services"
        P[Moamalat Gateway] --> Q[Payment Processing]
        R[Shipping APIs] --> S[Delivery Tracking]
        T[Banking APIs] --> U[Transaction Services]
        V[CRM Systems] --> W[Customer Support]
    end

    %% Connections
    B --> E
    E --> J
    J --> P
    E --> L
    E --> N
    E --> P
    E --> R
    E --> T
    E --> V

    %% Styling
    classDef clientLayer fill:#e1f5fe
    classDef apiLayer fill:#f3e5f5
    classDef dataLayer fill:#e8f5e8
    classDef externalLayer fill:#fff3e0

    class A,B,C,D clientLayer
    class E,F,G,H,I apiLayer
    class J,K,L,M,N,O dataLayer
    class P,Q,R,S,T,U,V,W externalLayer
```

## Component Architecture Diagram

```mermaid
graph TD
    %% Main Application
    A[App.tsx] --> B[Router]
    B --> C[Pages]
    B --> D[Components]

    %% Pages Layer
    subgraph "Page Components"
        C --> E[Store Pages]
        C --> F[Checkout Pages]
        C --> G[Dashboard Pages]
        C --> H[System Pages]

        E --> I[ModernStorePage.tsx]
        E --> J[EnhancedStorePage.tsx]
        E --> K[StorePage.tsx]

        F --> L[EnhancedCheckoutPage.tsx]
        F --> M[CartPage.tsx]

        G --> N[MerchantDashboard.tsx]
        G --> O[NewMerchantDashboard.tsx]

        H --> P[AccountTypeSelectionPage.tsx]
        H --> Q[PrivacyPolicyPage.tsx]
        H --> R[TermsAndConditionsPage.tsx]
    end

    %% Components Layer
    subgraph "Component Architecture"
        D --> S[UI Components]
        D --> T[Feature Components]
        D --> U[Business Components]

        S --> V[ShadCN UI Library]
        V --> W[Buttons, Forms, Modals]

        T --> X[Sliders]
        X --> Y[DeltaSlider.tsx]
        X --> Z[NawaemSlider.tsx]
        X --> AA[SheirineSlider.tsx]

        T --> BB[Payment Components]
        BB --> CC[MultiPaymentGateway.tsx]
        BB --> DD[MoamalatLightboxSDK.tsx]

        T --> EE[Interactive Components]
        EE --> FF[SoundEffects.tsx]
        EE --> GG[NotifyWhenAvailable.tsx]

        U --> HH[Business Logic]
        HH --> II[InvoiceGenerator.tsx]
        HH --> JJ[CityAreaSelector.tsx]
    end

    %% Data Layer
    subgraph "Data Management"
        KK[Data Files] --> LL[Product Data]
        KK --> MM[Store Configuration]
        KK --> NN[Categories & Settings]

        LL --> OO[deltaProducts.ts]
        LL --> PP[nawamProducts.ts]
        LL --> QQ[SheirineProducts.tsx]

        MM --> RR[Store Icons & Colors]
        MM --> SS[Payment Settings]
        MM --> TT[Shipping Configuration]
    end

    %% Connections
    C --> KK
    D --> KK

    %% Styling
    classDef pages fill:#e3f2fd
    classDef components fill:#f3e5f5
    classDef data fill:#e8f5e8

    class C,E,F,G,H,I,J,K,L,M,N,O,P,Q,R pages
    class D,S,T,U,V,W,X,Y,Z,AA,BB,CC,DD,EE,FF,GG,HH,II,JJ components
    class KK,LL,MM,NN,OO,PP,QQ,RR,SS,TT data
```

## Database Schema Diagram

```mermaid
erDiagram
    %% Core Entities
    STORES ||--o{ PRODUCTS : contains
    STORES ||--o{ ORDERS : manages
    USERS ||--o{ STORES : owns
    USERS ||--o{ ORDERS : places

    %% Extended Relationships
    PRODUCTS }o--o{ PRODUCT_VARIANTS : has
    PRODUCTS }o--o{ PRODUCT_IMAGES : has
    PRODUCTS }o--o{ INVENTORY : tracks

    ORDERS }o--o{ ORDER_ITEMS : contains
    ORDERS }o--o{ PAYMENTS : processes
    ORDERS }o--o{ SHIPMENTS : fulfills

    %% Entity Definitions
    STORES {
        integer id PK
        string name
        string slug
        string logo
        json settings
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        integer id PK
        integer store_id FK
        string name
        text description
        decimal price
        string category
        json images
        json variants
        boolean in_stock
        timestamp created_at
        timestamp updated_at
    }

    ORDERS {
        string id PK
        integer store_id FK
        integer user_id FK
        json customer_info
        json shipping_address
        decimal total
        string status
        json payment_info
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        integer id PK
        string email
        string password_hash
        string role
        integer store_id FK
        json profile
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_VARIANTS {
        integer id PK
        integer product_id FK
        string type
        string value
        decimal price_modifier
    }

    INVENTORY {
        integer id PK
        integer product_id FK
        integer quantity
        string location
        timestamp last_updated
    }

    PAYMENTS {
        string id PK
        string order_id FK
        string payment_method
        decimal amount
        string status
        string transaction_id
        timestamp created_at
    }

    SHIPMENTS {
        string id PK
        string order_id FK
        string carrier
        string tracking_number
        string status
        json shipping_address
        timestamp created_at
        timestamp updated_at
    }
```

## Workflow & Data Flow Diagram

```mermaid
flowchart TD
    %% Customer Journey
    A[Customer Discovery] --> B[Store Browsing]
    B --> C[Product Selection]
    C --> D[Add to Cart]
    D --> E[Cart Management]
    E --> F[Checkout Process]

    %% Payment Flow
    F --> G[Payment Gateway Selection]
    G --> H{Moamalat Integration}
    G --> I[Alternative Payment Methods]
    H --> J[Payment Processing]
    I --> J
    J --> K{Payment Status}
    K -->|Success| L[Order Confirmation]
    K -->|Failed| M[Payment Retry]
    M --> G

    %% Order Processing
    L --> N[Order Creation]
    N --> O[Merchant Notification]
    O --> P[Order Processing]
    P --> Q[Inventory Update]
    Q --> R[Shipping Arrangement]

    %% Fulfillment
    R --> S[Shipping Provider]
    S --> T[Delivery Tracking]
    T --> U[Customer Updates]
    U --> V[Order Completion]

    %% Admin & CRM Workflow
    AA[Admin Portal] --> BB[Ticket Management]
    AA --> CC[Merchant Oversight]
    AA --> DD[Financial Reports]
    BB --> EE[Customer Support]
    CC --> FF[Store Management]
    DD --> GG[Revenue Analytics]

    %% Merchant Management
    W[Merchant Dashboard] --> X[Analytics]
    W --> Y[Order Management]
    W --> Z[Customer Service]
    W --> AA
    W --> HH[Product Management]

    %% Data Integration
    BB[External APIs] --> CC[Payment APIs]
    BB --> DD[Shipping APIs]
    BB --> EE[Banking APIs]
    BB --> FF[CRM Systems]

    %% Connections
    J --> BB
    S --> BB
    Z --> BB
    AA --> BB

    %% Styling
    classDef customerFlow fill:#e3f2fd
    classDef paymentFlow fill:#f3e5f5
    classDef orderFlow fill:#e8f5e8
    classDef merchantFlow fill:#fff3e0
    classDef adminFlow fill:#fce4ec
    classDef externalFlow fill:#ffebee

    class A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V customerFlow
    class W,X,Y,Z,HH merchantFlow
    class AA,BB,CC,DD,EE,FF,GG adminFlow
    class BB,CC,DD,EE,FF externalFlow
```

## Network Architecture Diagram

```mermaid
graph TB
    %% Internet Layer
    A[Internet] --> B[Cloudflare Global Network]
    B --> C[CDN Edge Locations]

    %% Load Balancing
    C --> D[Load Balancer]
    D --> E[Web Application Firewall]

    %% Application Layer
    E --> F[Frontend Application]
    F --> G[Admin Portal]
    F --> H[Merchant Dashboard]
    F --> I[Customer Interface]

    %% API Gateway
    F --> J[API Gateway]
    G --> J
    H --> J
    I --> J

    %% Backend Services
    J --> K[Authentication Service]
    J --> L[Store Management Service]
    J --> M[Order Processing Service]
    J --> N[Payment Service]
    J --> O[CRM Service]

    %% Database Layer
    K --> P[(User Database)]
    L --> Q[(Store Database)]
    M --> R[(Order Database)]
    N --> S[(Payment Database)]
    O --> T[(CRM Database)]

    %% External Integrations
    N --> U[Moamalat Gateway]
    N --> V[Other Payment Providers]
    M --> W[Shipping APIs]
    M --> X[Delivery Services]

    %% Monitoring & Security
    Y[Security Monitoring] --> B
    Z[Performance Monitoring] --> B
    AA[Log Aggregation] --> B

    %% Backup & Recovery
    BB[Automated Backup] --> CC[Cloud Storage]
    CC --> DD[Disaster Recovery]

    %% Styling
    classDef internetLayer fill:#e3f2fd
    classDef networkLayer fill:#f3e5f5
    classDef appLayer fill:#e8f5e8
    classDef dataLayer fill:#fff3e0
    classDef externalLayer fill:#fce4ec
    classDef monitoringLayer fill:#ffebee

    class A,B,C internetLayer
    class D,E networkLayer
    class F,G,H,I,J,K,L,M,N,O appLayer
    class P,Q,R,S,T dataLayer
    class U,V,W,X externalLayer
    class Y,Z,AA,BB,CC,DD monitoringLayer
```

## Integration Architecture Diagram

```mermaid
graph LR
    %% EISHRO Platform Core
    A[EISHRO Platform] --> B[API Gateway]
    B --> C[Authentication Service]
    B --> D[Store Management Service]
    B --> E[Payment Service]
    B --> F[Order Service]
    B --> G[Shipping Service]

    %% Payment Integrations
    E --> H[Moamalat Gateway]
    E --> I[Digital Wallets]
    I --> J[MobiCash]
    I --> K[Sadad]
    I --> L[Tadawul]
    E --> M[Banking APIs]
    M --> N[Libyan Banks]
    M --> O[International Cards]

    %% Shipping Integrations
    G --> P[Local Carriers]
    P --> Q[Amyal]
    P --> R[Darbsail]
    P --> S[Vanex]
    P --> T[Wingsly]
    G --> U[International Carriers]
    U --> V[Aramex]
    U --> W[FedEx]
    U --> X[DHL]

    %% Communication Integrations
    Y[Notification Service] --> Z[SMS Providers]
    Y --> AA[Email Services]
    Y --> BB[Push Notifications]

    %% CRM Integration
    CC[CRM System] --> DD[Customer Support]
    CC --> EE[Ticketing System]
    CC --> FF[Communication Hub]

    %% Data Storage
    GG[Database Layer] --> HH[User Data]
    GG --> II[Order Data]
    GG --> JJ[Product Data]
    GG --> KK[Analytics Data]

    %% External Connections
    H --> LL[Payment Networks]
    Q --> MM[Local Logistics]
    Z --> NN[Telecom Providers]

    %% Styling
    classDef core fill:#e3f2fd
    classDef payment fill:#f3e5f5
    classDef shipping fill:#e8f5e8
    classDef communication fill:#fff3e0
    classDef storage fill:#fce4ec

    class A,B,C,D,E,F,G core
    class H,I,J,K,L,M,N,O payment
    class P,Q,R,S,T,U,V,W,X shipping
    class Y,Z,AA,BB,CC,DD,EE,FF communication
    class GG,HH,II,JJ,KK storage
```

## Security Architecture Diagram

```mermaid
flowchart TD
    %% Security Layers
    A[Client Security] --> B[HTTPS/TLS Encryption]
    B --> C[Input Validation]
    C --> D[Authentication Layer]

    %% Authentication Flow
    D --> E[JWT Token Management]
    E --> F[Role-Based Access Control]
    F --> G[Resource Authorization]

    %% API Security
    G --> H[API Gateway Security]
    H --> I[Rate Limiting]
    I --> J[Request Validation]
    J --> K[Business Logic Layer]

    %% Data Security
    K --> L[Data Encryption]
    L --> M[Database Security]
    M --> N[Secure Storage]

    %% Payment Security
    O[Payment Security] --> P[PCI DSS Compliance]
    P --> Q[Tokenization]
    Q --> R[Secure Transmission]
    R --> S[Payment Gateway]

    %% Monitoring & Logging
    T[Security Monitoring] --> U[Audit Logging]
    U --> V[Threat Detection]
    V --> W[Incident Response]
    W --> X[Security Alerts]

    %% Connections
    D --> O
    K --> T
    S --> T

    %% Security Standards
    Y[Security Standards] --> Z[OWASP Compliance]
    Y --> AA[GDPR Readiness]
    Y --> BB[Local Regulations]
    Y --> CC[Industry Best Practices]

    %% Styling
    classDef securityLayer fill:#ffebee
    classDef authLayer fill:#f3e5f5
    classDef dataLayer fill:#e8f5e8
    classDef monitoringLayer fill:#fff3e0

    class A,B,C,D,E,F,G,H,I,J,K,L,M,N securityLayer
    class O,P,Q,R,S authLayer
    class T,U,V,W,X monitoringLayer
    class Y,Z,AA,BB,CC dataLayer
```

## Deployment Architecture Diagram

```mermaid
graph TB
    %% Development Environment
    subgraph "Development"
        A[Local Development] --> B[Vite Dev Server]
        B --> C[Hot Module Replacement]
        C --> D[Local API Testing]
    end

    %% Staging Environment
    subgraph "Staging"
        E[Staging Deployment] --> F[Cloudflare Pages]
        F --> G[Preview Environment]
        G --> H[Integration Testing]
    end

    %% Production Environment
    subgraph "Production"
        I[Production Deployment] --> J[Cloudflare Global Network]
        J --> K[CDN Distribution]
        K --> L[Edge Computing]
        L --> M[Auto Scaling]
    end

    %% Backend Services
    subgraph "Backend Infrastructure"
        N[Cloudflare Workers] --> O[Serverless Functions]
        O --> P[API Endpoints]
        P --> Q[Business Logic]

        R[Cloudflare D1] --> S[(SQLite Database)]
        T[Cloudflare KV] --> U[(Key-Value Store)]
        V[Cloudflare R2] --> W[(Object Storage)]
    end

    %% External Services
    subgraph "External Integrations"
        X[Payment Providers] --> Y[Moamalat APIs]
        Z[Shipping Partners] --> AA[Carrier APIs]
        BB[Banking Network] --> CC[Bank APIs]
    end

    %% Monitoring & Analytics
    subgraph "Observability"
        DD[Performance Monitoring] --> EE[Real User Metrics]
        FF[Error Tracking] --> GG[Exception Reporting]
        HH[Analytics] --> II[Business Intelligence]
    end

    %% CI/CD Pipeline
    JJ[Git Repository] --> KK[Version Control]
    KK --> LL[Automated Testing]
    LL --> MM[Build Process]
    MM --> NN[Deployment Pipeline]
    NN --> E
    NN --> I

    %% Connections
    B --> N
    F --> N
    J --> N
    N --> R
    N --> T
    N --> V
    N --> X
    N --> Z
    N --> BB
    N --> DD
    N --> FF
    N --> HH

    %% Styling
    classDef devEnv fill:#e3f2fd
    classDef stagingEnv fill:#fff3e0
    classDef prodEnv fill:#e8f5e8
    classDef backendEnv fill:#f3e5f5
    classDef externalEnv fill:#fce4ec
    classDef monitoringEnv fill:#ffebee

    class A,B,C,D devEnv
    class E,F,G,H stagingEnv
    class I,J,K,L,M prodEnv
    class N,O,P,Q backendEnv
    class R,S,T,U,V,W backendEnv
    class X,Y,Z,AA,BB,CC externalEnv
    class DD,EE,FF,GG,HH,II monitoringEnv
    class JJ,KK,LL,MM,NN monitoringEnv
```

## Component Interaction Diagram

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant A as API Gateway
    participant P as Payment Service
    participant S as Shipping Service
    participant M as Merchant
    participant D as Database

    %% Customer Shopping Journey
    C->>F: Browse Products
    F->>A: Request Product Data
    A->>D: Query Products
    D-->>A: Return Product Data
    A-->>F: Display Products
    F-->>C: Show Product Catalog

    %% Add to Cart
    C->>F: Add to Cart
    F->>F: Update Local State
    F->>D: Persist Cart Data

    %% Checkout Process
    C->>F: Initiate Checkout
    F->>F: Validate Cart
    F->>F: Collect Shipping Info
    F->>F: Show Payment Options

    %% Payment Processing
    C->>F: Select Payment Method
    F->>P: Initiate Payment
    P->>A: Process Payment Request
    A->>P: Payment Gateway Integration
    P-->>A: Payment Response
    A-->>F: Payment Status
    F-->>C: Payment Confirmation

    %% Order Creation
    F->>A: Create Order
    A->>D: Store Order Data
    A->>S: Arrange Shipping
    S->>D: Update Shipping Status

    %% Merchant Operations
    M->>F: Access Dashboard
    F->>A: Request Order Data
    A->>D: Query Orders
    D-->>A: Return Order Data
    A-->>F: Display Dashboard
    F-->>M: Show Merchant Interface

    %% Order Management
    M->>F: Update Order Status
    F->>A: Update Order
    A->>D: Modify Order Status
    A->>S: Notify Shipping
    A->>C: Send Status Update
```

## Performance Architecture Diagram

```mermaid
graph TD
    %% Performance Layers
    A[User Experience] --> B[Perceived Performance]
    B --> C[Actual Performance]

    %% Frontend Optimization
    subgraph "Frontend Performance"
        D[Code Splitting] --> E[Route-based Splitting]
        D --> F[Component Splitting]
        E --> G[Lazy Loading]
        F --> G

        H[Asset Optimization] --> I[Image Optimization]
        H --> J[Bundle Optimization]
        I --> K[WebP Format]
        J --> L[Tree Shaking]

        M[Caching Strategy] --> N[Service Worker]
        M --> O[Local Storage]
        M --> P[CDN Assets]
    end

    %% Backend Optimization
    subgraph "Backend Performance"
        Q[API Optimization] --> R[Response Caching]
        Q --> S[Database Indexing]
        Q --> T[Query Optimization]

        U[Edge Computing] --> V[Global CDN]
        U --> W[Reduced Latency]
        V --> X[Edge Locations]
    end

    %% Database Performance
    subgraph "Database Performance"
        Y[Query Performance] --> Z[Index Optimization]
        Y --> AA[Connection Pooling]
        Y --> BB[Read Replicas]

        CC[Data Structure] --> DD[Normalized Schema]
        CC --> EE[Optimized Relations]
        DD --> FF[Efficient Queries]
    end

    %% Monitoring
    subgraph "Performance Monitoring"
        GG[Real User Monitoring] --> HH[Core Web Vitals]
        GG --> II[Performance Metrics]
        HH --> JJ[User Experience]

        KK[Server Monitoring] --> LL[Response Times]
        KK --> MM[Error Rates]
        KK --> NN[Resource Usage]
    end

    %% Connections
    C --> D
    C --> H
    C --> M
    C --> Q
    C --> U
    C --> Y
    C --> CC
    C --> GG
    C --> KK

    %% Styling
    classDef frontendPerf fill:#e3f2fd
    classDef backendPerf fill:#f3e5f5
    classDef dataPerf fill:#e8f5e8
    classDef monitoringPerf fill:#fff3e0

    class D,E,F,G,H,I,J,K,L,M,N,O,P frontendPerf
    class Q,R,S,T,U,V,W,X backendPerf
    class Y,Z,AA,BB,CC,DD,EE,FF dataPerf
    class GG,HH,II,JJ,KK,LL,MM,NN monitoringPerf
```

## Mobile Responsiveness Diagram

```mermaid
flowchart TD
    %% Responsive Breakpoints
    A[Responsive Design] --> B[Mobile First]
    B --> C[320px - 768px]
    C --> D[Touch Optimization]
    C --> E[Simplified Navigation]
    C --> F[Stacked Layouts]

    %% Tablet Optimization
    A --> G[Tablet Layout]
    G --> H[768px - 1024px]
    H --> I[Hybrid Navigation]
    H --> J[Grid Adaptations]
    H --> K[Touch & Click Support]

    %% Desktop Enhancement
    A --> L[Desktop Experience]
    L --> M[1024px+]
    M --> N[Advanced Features]
    M --> O[Hover Effects]
    M --> P[Keyboard Navigation]

    %% Component Adaptation
    Q[Component Scaling] --> R[Button Sizing]
    Q --> S[Text Scaling]
    Q --> T[Spacing Adjustment]
    Q --> U[Image Resizing]

    %% Performance Considerations
    V[Mobile Performance] --> W[Image Optimization]
    V --> X[Reduced Animations]
    V --> Y[Bandwidth Optimization]
    V --> Z[Offline Support]

    %% Styling
    classDef mobileStyle fill:#e3f2fd
    classDef tabletStyle fill:#f3e5f5
    classDef desktopStyle fill:#e8f5e8
    classDef componentStyle fill:#fff3e0
    classDef performanceStyle fill:#fce4ec

    class A,B,C,D,E,F mobileStyle
    class G,H,I,J,K tabletStyle
    class L,M,N,O,P desktopStyle
    class Q,R,S,T,U componentStyle
    class V,W,X,Y,Z performanceStyle
```

## Summary

These diagrams provide a comprehensive visual representation of the EISHRO Platform's architecture, including:

### 🏗️ **System Architecture**
- Layered architecture with clear separation of concerns
- Cloud-native deployment using Cloudflare's global infrastructure
- Scalable design supporting multiple stores and high traffic

### 🗄️ **Database Design**
- Normalized schema optimized for e-commerce operations
- Support for product variants, inventory tracking, and order management
- Flexible structure for multi-store and multi-vendor operations

### 🔄️ **Workflow & Data Flow**
- Complete customer journey from discovery to completion
- Integrated admin and CRM workflows
- Comprehensive merchant management processes
- Real-time order processing and fulfillment

### 🌐 **Network Architecture**
- Global CDN distribution with Cloudflare
- Multi-layered security and load balancing
- Microservices architecture for backend services
- Automated backup and disaster recovery

### 🔄️ **Integration Patterns**
- Robust payment gateway integrations with Libyan financial institutions
- Comprehensive shipping provider network
- CRM and customer service integrations
- Admin portal for system oversight

### 🚀 **Performance Architecture**
- Mobile-first responsive design
- Edge computing for global performance
- Advanced caching and optimization strategies

### 🔒 **Security Architecture**
- Multi-layered security approach
- Payment security compliance (PCI DSS)
- Comprehensive monitoring and threat detection
- GDPR and local Libyan regulations compliance

**Current Implementation Status (November 2025):**
- ✅ Frontend: 99% Complete with full e-commerce functionality
- ✅ Admin Portal: Complete with CRM and ticket management
- ✅ Payment Integrations: Complete with Libyan gateways
- 🔄 Backend API: Next phase development
- 🔄 Mobile App: Planned for future release

This visual documentation ensures that all stakeholders understand the platform's architecture, data flow, and integration points, facilitating maintenance, scaling, and future development.