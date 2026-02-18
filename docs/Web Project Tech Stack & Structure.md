# **Architectural Blueprint and Implementation Strategy for the Smart Parking Management System (IoT-SPMS)**

## **1\. Executive Summary**

The rapid urbanization of university campuses has precipitated a critical need for intelligent infrastructure management. This report provides an exhaustive technical analysis and implementation roadmap for the **Smart Parking Management System (IoT-SPMS)**, a project scoped within the software engineering curriculum at **Ho Chi Minh City University of Technology (HCMUT)**.1 The proposed system addresses systemic inefficiencies such as traffic congestion, fragmented billing, and opaque occupancy visibility by leveraging **Internet of Things (IoT)** paradigms and modern web application architectures.

The primary objective of this document is to guide the development of a robust, scalable, and educational web application that satisfies the complex requirements of diverse stakeholders—including students, faculty, and administrators. While the assignment guidelines permit a simplified Minimum Viable Product (MVP) without a live database, this report advocates for and details the implementation of a fully functional **Relational Database Management System (RDBMS)**. This approach not only ensures data integrity for critical financial transactions (billing via **BKPay**) but also provides a pedagogically superior platform for mastering full-stack development.

Based on a comparative analysis of current industry standards and the specific constraints of the academic environment, this report recommends a **JavaScript-centric technology stack (MERN/PERN)**. This unification of language across the client and server tiers minimizes context switching and accelerates the development lifecycle. Furthermore, the report details the integration of **Supabase (PostgreSQL)** as the backend data store, offering a unique synthesis of relational structure and real-time capabilities essential for live parking monitoring.

The following sections dissect the system's requirements, justify technology selections through rigorous trade-off analysis, propose a comprehensive database schema, and delineate a standardized project structure that promotes maintainability and collaboration.

## ---

**2\. Comprehensive Requirements Engineering and Analysis**

Successful software architecture is predicated on a deep understanding of requirements. The IoT-SPMS project description 1 outlines a multifaceted system that must operate at the intersection of physical hardware (simulated sensors) and digital services (payment gateways, SSO).

### **2.1 Functional Requirement Decomposition**

The functional landscape of the IoT-SPMS is divided into four distinct operational domains, each imposing specific technical demands on the chosen web stack.

#### **2.1.1 Real-Time Parking Monitoring and Guidance**

* **Requirement:** The system must provide a near real-time view of parking availability to users and drive electronic signage at key intersections.1  
* **Technical Implication:** This requirement negates the viability of traditional request-response HTTP architectures for the dashboard. The frontend must implement **event-driven communication** (WebSockets or Server-Sent Events) to reflect sensor state changes instantly. The backend must be non-blocking to handle high-concurrency streams from IoT gateways without latency.2  
* **Data Complexity:** The data is "hot" (high velocity, short lifespan). A sensor might toggle every few seconds. The architecture must decouple "current state" (cached for speed) from "historical logs" (stored for analytics).

#### **2.1.2 Automated Access Control and Identity Management**

* **Requirement:** Integration with **HCMUT\_SSO** for university members (Students, Faculty, Staff) and specific handling for "Visitors" or exception cases (forgotten cards).1  
* **Technical Implication:** The application must support **Federated Identity Management**. Since direct access to the university's CAS (Central Authentication Service) might be restricted for student projects, the system requires a robust **Mock Authentication Strategy** that simulates the exchange of tickets and session tokens.  
* **Role-Based Access Control (RBAC):** The system must differentiate between user roles. For instance, a "Student" pays via tuition accumulation, while "Faculty" might have subsidized rates. This necessitates a granular permission middleware in the backend.3

#### **2.1.3 Integrated Billing and Financial Settlement**

* **Requirement:** Parking fees are accumulated and settled via **BKPay**, the university's internal payment gateway.  
* **Technical Implication:** Unlike simple parking counters, this system manages financial liability. This strictly requires **ACID (Atomicity, Consistency, Isolation, Durability)** compliance. If a payment is recorded, the debt must be cleared simultaneously. This requirement strongly favors a **Relational Database (SQL)** over a NoSQL document store, as maintaining transactional integrity across "Parking Sessions" and "Invoices" is complex in non-relational systems.4

#### **2.1.4 Data Synchronization and Administration**

* **Requirement:** Synchronization with **HCMUT\_DATACORE** for user data consistency and a comprehensive admin dashboard for reporting.1  
* **Technical Implication:** The system requires background jobs or cron tasks to simulate the synchronization of user details (e.g., updating a student's license plate or faculty status). The admin dashboard requires complex aggregation queries (e.g., "Total revenue per zone this month"), further supporting the case for a SQL database with robust aggregation capabilities.5

### **2.2 Non-Functional Requirements (NFR) Analysis**

* **Concurrency and Scalability:** The system must handle bursts of traffic, particularly during class changeovers (7:00 AM, 1:00 PM). The backend runtime must handle thousands of concurrent open connections (for real-time dashboards) with minimal resource consumption.1  
* **Resilience and Fault Tolerance:** Physical sensors are prone to failure. The system must implement "Heartbeat" logic to detect dead sensors. If a sensor stops reporting, the dashboard should indicate "Unknown" rather than a false "Free" state.5  
* **Usability and Responsiveness:** Drivers interacting with the mobile/web app have high cognitive load (driving). The UI must be high-contrast, large-format, and instant. A Single Page Application (SPA) architecture is essential to prevent page reloads from disrupting the user flow.6

## ---

**3\. Technology Stack Selection and Justification**

The selection of a technology stack is a strategic decision that balances learning curves, performance requirements, and ecosystem maturity. For a beginner web developer targeting the IoT-SPMS requirements, the **MERN (Mongo-Express-React-Node)** or **PERN (Postgres-Express-React-Node)** stack is the optimal path.

### **3.1 Programming Language: JavaScript (Node.js)**

**Recommendation:** **JavaScript (with Node.js on the server)**.

* **Justification for the Backend (Node.js):**  
  * **Event-Driven I/O:** Node.js utilizes a single-threaded event loop, which is architecturally superior for I/O-heavy applications like IoT systems.2 When thousands of sensors send updates simultaneously, Node.js handles them asynchronously without blocking the execution thread, whereas traditional multi-threaded languages (like Java or Python's default implementation) might struggle with thread context switching overhead.7  
  * **JSON Natively:** IoT devices typically transmit data in JSON format. Node.js processes JSON natively without parsing overhead, streamlining the pipeline from Sensor \-\> Server \-\> Database \-\> Frontend.8  
  * **Isomorphic Development:** Using JavaScript for both frontend and backend reduces the cognitive load for a beginner. You do not need to mentally switch between Python (for backend) and JavaScript (for frontend), allowing you to master one syntax deeply.  
* **Comparison with Python (Django/Flask):**  
  * While Python is excellent for AI/ML (e.g., number plate recognition), its synchronous nature in frameworks like Flask can be a bottleneck for real-time dashboards unless advanced async libraries (FastAPI) are used.9 For a student prioritizing web development and real-time sockets, Node.js is the more direct route.

### **3.2 Frontend Framework: React.js**

**Recommendation:** **React.js**.

* **Justification:**  
  * **Component-Based Architecture:** The parking lot is a grid of identical units (slots). React allows you to define a single \<ParkingSlot /\> component and render it hundreds of times with different properties (ID, Status). This modularity is perfect for the domain.10  
  * **Virtual DOM:** When a single car enters, only one slot changes color. React's Virtual DOM calculates the minimal set of changes required to update the screen, ensuring the dashboard remains responsive even on low-power devices.11  
  * **Ecosystem:** The React ecosystem offers robust libraries for maps (react-leaflet), charts (recharts), and state management (Context API or Redux), which are essential for the analytics dashboard required in the assignment.12  
* **Why not "Vanilla" JS?**  
  * Building a real-time updating dashboard with plain DOM manipulation leads to "spaghetti code" that is hard to debug and maintain. Frameworks provide the necessary structure for state management.

### **3.3 Database Selection: Supabase (PostgreSQL)**

**Recommendation:** **Supabase**.

* **Context:** The user requested a "free database" suitable for a beginner but capable of handling the project's logic. While **Firebase** is often the default for IoT, **Supabase** is recommended here for specific reasons rooted in the project requirements.  
* **Why Supabase (PostgreSQL) over Firebase?**  
  1. **Relational Integrity (The "Billing" Factor):** The IoT-SPMS has a strong financial component (BKPay integration, fee calculation). This requires complex relationships: *Users* have many *Sessions*; *Sessions* have *Invoices*. Relational databases (SQL) enforce these links (Foreign Keys), ensuring that you cannot have an "Invoice" without a "User." Firebase (NoSQL) puts the burden of data integrity on your application code, which is error-prone for beginners.4  
  2. **Built-in Realtime:** Supabase offers a feature where it "listens" to the PostgreSQL database. When you insert a row (e.g., a sensor log), Supabase instantly pushes that event to the React frontend via WebSockets. This gives you the best of both worlds: the structure of SQL and the speed of Firebase.14  
  3. **Educational Value:** Learning SQL is a foundational skill for software engineers. It is more transferable to enterprise environments than proprietary NoSQL query languages.15

### **3.4 Backend Framework: Express.js**

**Recommendation:** **Express.js**.

* **Justification:** Express is the standard server framework for Node.js. It is unopinionated, meaning it gives you the tools to build APIs (routes, middleware) without forcing a specific directory structure. This flexibility is ideal for learning how HTTP works. It has massive community support and thousands of middleware packages (e.g., cors for security, body-parser for data).16

## ---

**4\. System Architecture and Integration Strategy**

The architecture of the IoT-SPMS is designed to mimic a production-grade IoT environment while accommodating the constraints of a student project (simulated hardware, mock external services).

### **4.1 High-Level Architecture Diagram (Textual Description)**

The system follows a **Three-Tier Architecture** augmented with an **Event-Driven** layer.

1. **Presentation Tier (The Client):**  
   * **Admin Dashboard (Web):** Used by parking operators to view occupancy heatmaps, revenue reports, and override sensor states.  
   * **User Portal (Web/Mobile Web):** Used by students/faculty to check availability, register vehicles, and view billing history.  
   * **Public Display (Simulated Signage):** A simplified view showing only "Zone A: Full", "Zone B: Open".  
2. **Logic Tier (The Server):**  
   * **API Gateway (Express.js):** The single entry point for all requests.  
   * **Authentication Service:** Manages mock SSO sessions and JWT (JSON Web Token) issuance.  
   * **Parking Service:** Processes sensor data, updates slot status, and calculates fees based on duration.  
   * **Payment Service:** Interfaces with the Mock BKPay gateway.  
3. **Data Tier (The Persistence Layer):**  
   * **Supabase (PostgreSQL):** Stores relational data (Users, Transactions).  
   * **Realtime Engine:** Broadcasts database INSERT/UPDATE events to connected clients.  
4. **Simulation Tier (The "Physical" World):**  
   * **IoT Simulator Script:** A Node.js process that acts as the physical sensors. It generates random "Car In/Car Out" events and sends them to the backend API.

### **4.2 Handling External Integrations (The "Mock" Strategy)**

Since you likely do not have administrative access to the real **HCMUT\_SSO** or **BKPay** systems, you must implement **Mock Services**. This demonstrates architectural maturity—the ability to decouple your system from external dependencies.

#### **4.2.1 Mocking HCMUT\_SSO**

* **Concept:** Instead of redirecting to the real CAS server, your app will have a "Dev Login" page.  
* **Mechanism:**  
  1. User clicks "Login with HCMUT\_SSO" on your frontend.  
  2. In development mode, this redirects to a local form asking for a Student ID.  
  3. When submitted, the backend looks up the ID in a "Mock User Table" (seeded with dummy data).  
  4. If found, the backend issues a standard JWT signed with a local secret.  
  5. To the rest of the app, this token is indistinguishable from a real SSO token.17

#### **4.2.2 Mocking BKPay**

* **Concept:** Simulate the latency and uncertainty of a bank transaction.  
* **Mechanism:**  
  1. Backend sends a payment request to POST /api/mock/bkpay.  
  2. The Mock Controller waits for 2 seconds (simulating network lag).  
  3. It randomly returns 200 OK (Success) or 402 Payment Required (Insufficient Funds) based on a random number generator.  
  4. This forces your frontend to handle "Loading" states and "Error" states properly, meeting the non-functional requirement of resilience.19

## ---

**5\. Database Design and Schema**

A well-structured database is the backbone of the IoT-SPMS. Using **PostgreSQL** via Supabase allows for strict data typing and relationship enforcement.

### **5.1 Entity-Relationship Model (ERD)**

The schema consists of five core tables designed to satisfy the requirements of RBAC, real-time monitoring, and billing.

| Table Name | Description | Key Columns (PK/FK) | Rationale |
| :---- | :---- | :---- | :---- |
| **users** | Stores account details for Students, Faculty, and Staff. | id (PK), sso\_id (Unique), role (Enum), balance | Differentiates pricing policies based on role. sso\_id links to HCMUT ID. |
| **parking\_zones** | Logical grouping of slots (e.g., "Building H6 Basement"). | id (PK), name, hourly\_rate | Allows different pricing for different areas (e.g., VIP vs Standard). |
| **parking\_slots** | Represents physical spaces. | id (PK), zone\_id (FK), sensor\_id, status (Enum: FREE/OCCUPIED) | sensor\_id decouples the physical hardware from the logical slot. |
| **parking\_sessions** | The core billing record. Logs entry and exit. | id (PK), user\_id (FK), slot\_id (FK), entry\_time, exit\_time, amount\_due | Fee is calculated as (exit\_time \- entry\_time) \* zone\_rate. |
| **transactions** | Financial ledger for BKPay payments. | id (PK), session\_id (FK), bkpay\_ref, status (Enum), created\_at | Keeps a permanent audit trail of payments, separate from the parking log. |

### **5.2 Critical Design Decisions**

1. **Separation of sessions and transactions:** A session is a parking event. A transaction is a payment attempt. A single session might have multiple failed transactions before a successful one. Separating them ensures you don't lose the parking record if a payment fails.4  
2. **The sensor\_id Abstraction:** By storing sensor\_id in the parking\_slots table, you allow for hardware replacement. If Sensor \#101 breaks and is replaced by Sensor \#999, you simply update the database record for "Slot A1" without changing the slot's ID or historical data.  
3. **Indexing:** Indexes should be applied to parking\_sessions(user\_id) and parking\_slots(status) to ensure the dashboard and user history load instantly even with millions of records.

## ---

**6\. Detailed Project Structure**

A clean, standardized folder structure is critical for maintainability. The following structure follows the "Bulletproof Node.js" and standard React patterns, adapted for a monorepo setup.11

### **6.1 Root Directory Layout**

/smart-parking-system

├── /backend \# The Node.js API and Logic Layer

├── /frontend \# The React Client Layer

├── /docs \# Documentation (Diagrams, Requirements)

├── /scripts \# Utility scripts (Seeding DB, Deployment)

├── package.json \# Root configuration (Optional, for workspaces)

└── README.md \# The master project guide

### **6.2 Backend Structure (/backend)**

The backend uses a layered architecture (Controller-Service-Data Access) to separate concerns.

| Directory/File | Purpose & Description |
| :---- | :---- |
| **src/app.js** | The Express application setup. Configures middleware (CORS, BodyParser) and mounts routes. |
| **src/server.js** | The entry point. Connects to the database and starts the HTTP server listener. |
| **src/config/** | **Configuration Layer.** |
| └── db.js | Initializes the Supabase/PostgreSQL client connection. |
| └── env.js | Centralizes environment variables (API keys, secrets) using dotenv. |
| **src/controllers/** | **Request Handling Layer.** Translates HTTP requests into data operations. |
| └── authController.js | Handles login, logout, and token refreshing. |
| └── parkingController.js | Handles requests to fetch slot status or update occupancy. |
| └── paymentController.js | Manages the interaction with the mock BKPay service. |
| **src/services/** | **Business Logic Layer.** Contains the "brain" of the app. |
| └── feeCalculator.js | Logic: calculateFee(entryTime, userRole). Applies discounts for Faculty. |
| └── monitorService.js | Logic for aggregating sensor data (e.g., "Count free slots in Zone A"). |
| **src/models/** | **Data Access Layer.** Defines SQL queries and interactions with Supabase. |
| └── SlotModel.js | Functions like findSlotById, updateStatus. |
| **src/routes/** | **Routing Layer.** Maps URLs to Controllers. |
| └── api.js | Defines endpoints like GET /api/slots, POST /api/payment. |
| **src/middleware/** | **Interception Layer.** |
| └── authenticate.js | Verifies the JWT token before allowing access to protected routes. |
| └── mockDelay.js | (Optional) Artificially slows down responses to test frontend loading states. |
| **src/simulator/** | **IoT Simulation Layer.** |
| └── sensorSim.js | A standalone script that generates random sensor events. |

### **6.3 Frontend Structure (/frontend)**

The frontend structure emphasizes component reusability and global state management using React Context.

| Directory/File | Purpose & Description |
| :---- | :---- |
| **src/main.jsx** | The React entry point. Mounts the app to the DOM. |
| **src/App.jsx** | Sets up the Router (react-router-dom) and global Context Providers. |
| **src/api/** | **Networking Layer.** |
| └── client.js | A configured axios instance with base URLs and interceptors (for adding tokens). |
| **src/assets/** | Static files (Images, Fonts, HCMUT Logos). |
| **src/components/** | **UI Building Blocks.** |
| ├── common/ | Generic components: Button.jsx, Input.jsx, Loader.jsx. |
| ├── layout/ | Structural components: Navbar.jsx, Sidebar.jsx, Footer.jsx. |
| └── parking/ | Domain components: SlotGrid.jsx, ParkingCard.jsx, StatusBadge.jsx. |
| **src/context/** | **State Management Layer.** |
| └── AuthContext.jsx | Stores the logged-in user's state globally (avoiding prop drilling). |
| └── ParkingContext.jsx | Stores the real-time status of slots, updated via Supabase subscriptions. |
| **src/hooks/** | **Custom Logic Hooks.** |
| └── useRealtime.js | Encapsulates the logic for connecting to Supabase Realtime channels. |
| **src/pages/** | **View Layer.** Each file corresponds to a Route. |
| ├── Dashboard.jsx | The main view showing the parking map. |
| ├── Login.jsx | The login form (or Mock SSO redirection page). |
| └── Admin.jsx | The control panel for staff. |
| **src/utils/** | **Helper Functions.** |
| └── formatters.js | Functions to format dates (DD/MM/YYYY) and currency (VND). |

## ---

**7\. Implementation Roadmap: From Simulation to Dashboard**

This section provides a step-by-step guide to building the application, specifically addressing the "beginner" and "simulation" constraints.

### **Phase 1: The "Mock" IoT Infrastructure**

Before building the web app, you must simulate the hardware.

1. **The Logic:** Real parking sensors (ultrasonic/infrared) detect distance. If distance \< threshold, status \= OCCUPIED.  
2. **The Simulator Script (sensorSim.js):**  
   * Create an array of Slot IDs: \`\`.  
   * Use setInterval to trigger every 5 seconds.  
   * Randomly select a slot and flip its status.  
   * Send a generic HTTP POST request to your local backend:  
     JSON  
     POST /api/sensors/update  
     { "sensor\_id": "S-A1", "status": "OCCUPIED", "timestamp": "2026-02-18T10:00:00Z" }

   * *Insight:* This decouples your web development from hardware. Your backend doesn't know (or care) that the data is coming from a script rather than a real ESP32 microcontroller.21

### **Phase 2: The Backend Core**

1. **Setup Express:** Initialize the server.  
2. **Connect Supabase:** Use the supabase-js client.  
3. **Create the Webhook Endpoint:** Build the endpoint that receives the simulator's POST request. This endpoint should:  
   * Validate the sensor ID.  
   * Update the parking\_slots table in Supabase.  
   * *Crucially:* If the status changes from FREE \-\> OCCUPIED, create a new row in parking\_sessions (Entry Event).  
   * If status changes from OCCUPIED \-\> FREE, find the active session and close it (Exit Event), triggering the fee calculation.

### **Phase 3: The Frontend Dashboard**

1. **Visualizing the Grid:** Fetch the list of slots (GET /api/slots) and render them using CSS Grid.  
2. **Connecting Realtime:**  
   * Use the Supabase client in the React frontend to subscribe to the parking\_slots table.  
   * When an UPDATE event is received (triggered by the Simulator \-\> Backend \-\> Database pipeline), immediately update the specific slot's color in the React state.  
   * *Result:* You will see the boxes on your screen flipping colors automatically as your simulator script runs in the background.

### **Phase 4: Integration (Billing & SSO)**

1. **Implement Mock SSO:** Create a simple login page. When "Login" is clicked, set a generic User Object in the AuthContext and redirect to the Dashboard.  
2. **Implement Payment:** On the "My History" page, show closed sessions with a "Pay Now" button. Clicking it calls the Mock BKPay endpoint. Handle the success/failure response to update the UI (e.g., show a "Payment Successful" toast notification).

## ---

**8\. Nuanced Technical Insights for Evaluation Excellence**

To demonstrate mastery of the subject matter beyond a basic implementation, the following insights should be integrated into the project's design and documentation:

### **8.1 The "Stale Data" Problem in IoT Systems**

**Insight:** A naive system assumes that if a sensor says "Free," the slot is free. However, sensors fail. If a sensor loses power while a car is parked, the system might incorrectly show it as "Free" forever. **Solution:** Implement a **"Heartbeat" Protocol**. The simulator should send a "ping" every minute even if the status hasn't changed. In the frontend, check the last\_updated timestamp. If it is older than 5 minutes, render the slot as **Grey (Unknown)** rather than Green or Red. This handles the "resilience to sensor malfunctions" requirement.1

### **8.2 Concurrency and Race Conditions**

**Insight:** Two drivers might see the same "Green" slot on their apps and race for it.

**Solution:** While difficult to solve perfectly without reservation hardware, the software can implement **Optimistic Locking**. When a user "reserves" a slot (if that feature is added), the database checks the version of the record. This prevents double-booking logic at the database level.

### **8.3 Security: The "Man-in-the-Middle" Risk**

**Insight:** An attacker could simulate the simulator, sending false "Free" signals to confuse drivers.

**Solution:** Even in a mock environment, implement a simple **API Key** or **Shared Secret** mechanism. The simulator must send a header x-api-key: secret-sensor-key with its requests. The backend validates this before processing the data.

## ---

**9\. Conclusion**

The **IoT-SPMS** project represents a significant convergence of web development, database theory, and IoT principles. By adopting a **JavaScript-centric stack (Node.js/React)**, the project benefits from a unified development language and a vast ecosystem of tools perfectly suited for real-time applications. The choice of **Supabase** provides the necessary relational structure for financial integrity while simplifying the complex task of real-time state synchronization.

Following the structured roadmap outlined in this report—starting with a robust simulation layer and moving through to a reactive frontend—will result in a system that not only meets the academic requirements of HCMUT but also mimics professional industry practices. The inclusion of mock services for SSO and BKPay demonstrates a sophisticated understanding of system integration and decoupling, ensuring the project is resilient, testable, and scalable.

This architecture provides a solid foundation for the Minimum Viable Product while leaving ample room for future enhancements, such as predictive analytics for parking availability or integration with real-world camera hardware.

#### **Works cited**

1. SE252\_\_ProjectDesc\_\_SmartParking.pdf  
2. Top IoT Languages Every Developer Should Learn 2026 \- Digis, accessed February 18, 2026, [https://digiscorp.com/top-iot-languages-every-developer-should-learn-2026/](https://digiscorp.com/top-iot-languages-every-developer-should-learn-2026/)  
3. Project 3 CNPM | PDF | Databases | Server (Computing) \- Scribd, accessed February 18, 2026, [https://www.scribd.com/document/957948092/Project-3-CNPM](https://www.scribd.com/document/957948092/Project-3-CNPM)  
4. Supabase vs Firebase: Complete Comparison Guide for Startups in 2025 \- Leanware, accessed February 18, 2026, [https://www.leanware.co/insights/supabase-vs-firebase-complete-comparison-guide](https://www.leanware.co/insights/supabase-vs-firebase-complete-comparison-guide)  
5. Smart Parking Management Software Development Guide, accessed February 18, 2026, [https://www.glasierinc.com/blog/smart-parking-app-development-guide](https://www.glasierinc.com/blog/smart-parking-app-development-guide)  
6. How to Create Smart Parking Solutions with Custom Software | Attract Group, accessed February 18, 2026, [https://attractgroup.com/blog/how-to-create-smart-parking-solutions-with-custom-software/](https://attractgroup.com/blog/how-to-create-smart-parking-solutions-with-custom-software/)  
7. Processing IoT Data with Node.js & TypeScript | by Len Joseph | The Startup \- Medium, accessed February 18, 2026, [https://medium.com/swlh/processing-iot-data-with-node-js-typescript-a392be124084](https://medium.com/swlh/processing-iot-data-with-node-js-typescript-a392be124084)  
8. Top 10 Programming Language used in IoT Projects in 2026 \- WebbyLab, accessed February 18, 2026, [https://webbylab.com/blog/top-10-programming-languages-for-iot-projects/](https://webbylab.com/blog/top-10-programming-languages-for-iot-projects/)  
9. Backend Battle 2025: FastAPI vs Express Explained \- Slincom, accessed February 18, 2026, [https://www.slincom.com/blog/programming/fastapi-vs-express-backend-comparison-2025](https://www.slincom.com/blog/programming/fastapi-vs-express-backend-comparison-2025)  
10. Top 15 React Component Libraries to Use in 2026 \- DEV Community, accessed February 18, 2026, [https://dev.to/tahmidbintaslim/top-15-react-component-libraries-to-use-in-2026-33a4](https://dev.to/tahmidbintaslim/top-15-react-component-libraries-to-use-in-2026-33a4)  
11. crsandeep/simple-react-full-stack: Boilerplate to build a full stack web application using React, Node.js, Express and Webpack. \- GitHub, accessed February 18, 2026, [https://github.com/crsandeep/simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack)  
12. How I Built a Real-Time Dashboard MVP in 2 Days with WebSockets & React, accessed February 18, 2026, [https://levelup.gitconnected.com/how-i-built-a-real-time-dashboard-mvp-in-2-days-with-websockets-react-c083c7b7d935](https://levelup.gitconnected.com/how-i-built-a-real-time-dashboard-mvp-in-2-days-with-websockets-react-c083c7b7d935)  
13. Firebase vs Supabase: 2026 Backend Comparison & Full Guide \- Zignuts, accessed February 18, 2026, [https://www.zignuts.com/blog/firebase-vs-supabase](https://www.zignuts.com/blog/firebase-vs-supabase)  
14. Supabase vs Firebase: Which Backend Should You Actually Use in 2026? \- YouTube, accessed February 18, 2026, [https://www.youtube.com/watch?v=XYe8mKwMHLg](https://www.youtube.com/watch?v=XYe8mKwMHLg)  
15. Supabase Vs Firebase: The Ultimate Guide 2025 | Lanex AU, accessed February 18, 2026, [https://lanex.au/blog/supabase-vs-firebase-the-ultimate-guide-2025/](https://lanex.au/blog/supabase-vs-firebase-the-ultimate-guide-2025/)  
16. FastAPI vs Express: A Simple Comparison for Beginners \- DhiWise, accessed February 18, 2026, [https://www.dhiwise.com/post/fastapi-vs-express-a-simple-comparison-for-beginner](https://www.dhiwise.com/post/fastapi-vs-express-a-simple-comparison-for-beginner)  
17. Stub / mock for local development and testing \- Auth0 Community, accessed February 18, 2026, [https://community.auth0.com/t/stub-mock-for-local-development-and-testing/134573](https://community.auth0.com/t/stub-mock-for-local-development-and-testing/134573)  
18. Simplified local development and testing with Auth0 simulation \- Frontside, accessed February 18, 2026, [https://frontside.com/blog/2022-01-13-auth0-simulator/](https://frontside.com/blog/2022-01-13-auth0-simulator/)  
19. Building a Mock Payment Gateway: An Overview | by Archit Sharma \- Medium, accessed February 18, 2026, [https://medium.com/@architsharmaa/building-a-mock-payment-gateway-an-overview-487159309d46](https://medium.com/@architsharmaa/building-a-mock-payment-gateway-an-overview-487159309d46)  
20. Folder Structure for NodeJS & ExpressJS project \- DEV Community, accessed February 18, 2026, [https://dev.to/mr\_ali3n/folder-structure-for-nodejs-expressjs-project-435l](https://dev.to/mr_ali3n/folder-structure-for-nodejs-expressjs-project-435l)  
21. Building a Real-Time IoT Dashboard with HarperDB and Node.js \- DEV Community, accessed February 18, 2026, [https://dev.to/programazing/building-a-real-time-iot-dashboard-with-harperdb-and-nodejs-4jkp](https://dev.to/programazing/building-a-real-time-iot-dashboard-with-harperdb-and-nodejs-4jkp)