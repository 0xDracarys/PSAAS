# The Agentic Development Framework (ADF) - PSAAS Edition

**Version:** 2.0  
**Last Updated:** October 5, 2025  
**Purpose:** A comprehensive, structured methodology for AI-assisted software development tailored for the PSAAS architecture (MongoDB, Cloudinary, Netlify, Next.js).

---

## 📑 **Table of Contents**

- [1. Core Philosophy](#1-core-philosophy)
- [2. Phase 1: Conception & Planning (The Blueprint Phase)](#2-phase-1-conception--planning-the-blueprint-phase)
- [3. Phase 2: Structured Implementation (The Build Phase)](#3-phase-2-structured-implementation-the-build-phase)
- [4. Phase 3: Quality Assurance & Debugging (The Polish Phase)](#4-phase-3-quality-assurance--debugging-the-polish-phase)
- [5. Phase 4: Deployment & Operations (The Launch Phase)](#5-phase-4-deployment--operations-the-launch-phase)
- [6. Guiding Principles & Best Practices](#6-guiding-principles--best-practices)

---

## **1. Core Philosophy**

This framework is built on four pillars designed to maximize the efficiency of AI collaboration while enforcing engineering rigor:

1.  **System Integrity First:** The primary goal is to enhance functionality without introducing regressions. No feature is worth deploying if it compromises the stability of the existing application.
2.  **Documentation as the Source of Truth:** The project's Internal Knowledge Base (IKB), indexed by `/docs/MAIN.md`, is the central brain of the project. It is the starting and ending point for all development tasks.
3.  **Structured Iteration:** We reject unstructured "one-shot" generation in favor of a methodical, multi-step process that ensures alignment and quality at each stage.
4.  **Human-in-the-Loop Verification:** AI implementation is not considered complete until it has been manually verified by a human stakeholder. We do not trust, we verify.

---

## **⚠️ CRITICAL RULES - MUST FOLLOW IN EVERY TASK**

### **Rule #1: DO NOT BREAK EXISTING CODE - The 98% Certainty Threshold**

**YOU MUST NEVER break the existing website, architecture, features, or any working functionality.**

- **98% Certainty Required:** Before implementing ANY change, you must be AT LEAST 98% certain that your code will not break existing functionality. If you are not 98% certain, **STOP IMMEDIATELY** and ask the developer for clarification or guidance.
- **No Guessing:** If you are unsure about how something works, read the existing code thoroughly, check the IKB documentation, and ask questions. Never guess or assume.
- **Respect Existing Patterns:** All new implementations must follow the existing architecture patterns:
  - Use the same variable naming conventions
  - Follow the same function structure and organization
  - Match the existing data flow patterns
  - Integrate seamlessly with existing components
  - Use the same state management approaches
  - Follow the same API response structures

### **Rule #2: NEVER Create Dummy or Random Data**

**YOU MUST NEVER create fake, dummy, placeholder, or random data to "make things work".**

- **No Quick Fixes with Fake Data:** If a feature is not working or there's an error, you must:
  1. Stop and analyze the root cause
  2. Identify what data or configuration is actually missing
  3. Report the specific issue to the developer
  4. Wait for proper implementation guidance
- **Only Real Data:** Use only real, production-ready data structures that match the actual requirements
- **Exception:** Dummy data is ONLY allowed when explicitly requested by the developer for:
  - Testing purposes
  - Database seeding scripts
  - Development environment setup
  - Example documentation

### **Rule #3: Architectural Consistency is Mandatory**

**ALL new features must fit perfectly within the existing architecture.**

- **Variable Consistency:** New variables must follow existing naming patterns (camelCase for JavaScript, PascalCase for components, UPPER_SNAKE_CASE for constants)
- **Function Consistency:** New functions must follow existing patterns (async/await usage, error handling, return types)
- **Data Structure Consistency:** New data must match existing database schemas and TypeScript interfaces exactly
- **Import/Export Consistency:** Follow the same module import/export patterns used throughout the codebase
- **Everything Stays in Order:** Your implementation should feel like it was part of the original codebase from day one

### **Rule #4: When in Doubt, ASK**

**If you are uncertain about ANYTHING, immediately stop and ask the developer.**

Do NOT:
- ❌ Implement something you're not sure about
- ❌ Create workarounds with dummy data
- ❌ Guess at the intended behavior
- ❌ Assume a pattern when you're not certain
- ❌ Break working code to try a "better" approach

Instead DO:
- ✅ Stop implementation
- ✅ Clearly state what you're uncertain about
- ✅ Ask specific questions
- ✅ Wait for clarification
- ✅ Then proceed with confidence

### **Violation Consequences**

Violating these rules means:
- 🔴 Breaking the developer's trust
- 🔴 Wasting development time on debugging
- 🔴 Potentially breaking production features
- 🔴 Creating technical debt
- 🔴 Undermining the entire development process

**These rules are NON-NEGOTIABLE. They apply to EVERY task, EVERY feature, EVERY line of code.**

---

## **2. Phase 1: Conception & Planning (The Blueprint Phase)**

Every task, no matter how small, begins with a clear and comprehensive plan. This phase ensures that what we build is what is needed.

### **Step 1.1: Ideation & Foundational Thinking**
Before creating any documents, apply a multi-layered thinking process to fully explore the feature:
* **Logical Thinking:** What is the core purpose and function of this feature?
* **Analytical Thinking:** How will it work? What are the primary objectives and goals?
* **Computational Thinking:** How does the logic fit into the existing system? What are the rules and constraints?
* **Procedural Thinking:** How do we make this feature excellent and best-in-class? What strategies will lead to success?

### **Step 1.2: The Product Requirement Document (PRD)**
The PRD is the master blueprint for a feature. It is generated collaboratively between the user and the AI. An effective PRD must contain:
* **Project Overview:** A high-level summary.
* **Target Audience:** Who is this for?
* **Core Features & Functionality:** A detailed list of what the feature will do.
* **User Flow & UI/UX Vision:** How users will interact with the feature. Mockups or visual inspiration should be included where possible.
* **Technical Stack:** The proposed technologies and frameworks to be used:
  * **Frontend:** Next.js 14+ with React Server Components
  * **Database:** MongoDB Atlas with connection pooling
  * **Media Storage:** Cloudinary for all image/video handling
  * **Deployment:** Netlify with automatic builds and Edge Functions
  * **Styling:** Tailwind CSS with custom component library

### **Step 1.3: The Agent Requirement Document (ARD)**
For features involving autonomous AI agents, a specialized ARD is required. This document details:
* **Agent's Purpose & Goal:** The agent's primary objective.
* **Tools:** A list of APIs and functions the agent can use.
* **Memory:** How the agent will retain and learn from information and interactions.

### **Step 1.4: IKB Initialization**
The generated PRD and ARD are the first documents to be added to the `/docs` directory. The `/docs/MAIN.md` file must be updated to index these new planning documents.

---

## **3. Phase 2: Structured Implementation (The Build Phase)**

This phase translates the blueprint into functional code using a methodical, AI-assisted workflow.

### **Step 2.1: The PRD-Driven Implementation Cycle**
For all major features, development must follow this exact sequence to ensure architectural coherence:
1.  **Frontend Scaffolding:** Based on the PRD, build the static UI components using Next.js and React.
2.  **Backend API PRD Generation:** Based on the frontend's data needs, generate a detailed API specification document. This becomes the contract between the frontend and backend.
3.  **Backend Implementation:** Build and test the backend logic and API endpoints according to the API PRD using Next.js API routes.
4.  **API Integration Plan:** Generate a final, clear plan for connecting the functional backend to the frontend.
5.  **Final Integration:** Implement the connection, making the feature fully interactive.

### **Step 2.2: Version Control Protocol (Git)**
Git is not just a tool; it is our safety net and historical record.
* **Incremental Local Commits:** After each small, verifiable achievement, perform a local `git commit`. The message must be clear, concise, and describe the change (e.g., `feat: Implement blog post creation endpoint`).
* **Feature-Complete Pushes:** Only push code to the remote repository (`git push`) when the entire feature is complete and has passed the verification phase. Netlify will automatically trigger a deployment.

### **Step 2.3: IKB Maintenance Protocol**
The IKB must be a living, breathing representation of the project.
* **New Documentation:** Upon completing a new feature, a new documentation file must be created in `/docs` and indexed in `MAIN.md`.
* **Updating Documentation:** If a change is made to an existing feature, the corresponding document in `/docs` must be updated. A new file should not be created.

### **Step 2.4: MongoDB Best Practices**
When working with the database layer:
* **Schema Design:** Leverage MongoDB's flexible document model. Embed related data where it makes sense (e.g., recent blog comments within a blog post document).
* **Indexing:** Always create indexes on frequently queried fields (`email`, `createdAt`, `status`, etc.).
* **Connection Pooling:** Use the cached connection pattern implemented in `lib/mongodb.ts` to prevent exhausting database connections.
* **Data Validation:** Implement schema validation at the application layer using TypeScript interfaces and Zod schemas.
* **Atomic Operations:** Use MongoDB's atomic operations (`$set`, `$inc`, `$push`) for concurrent updates.

### **Step 2.5: Cloudinary Best Practices**
When handling media assets:
* **Upload Strategy:** Use Cloudinary's Node.js SDK for server-side uploads. Never expose API credentials to the client.
* **Transformations:** Define transformations at delivery time via URL parameters rather than creating multiple uploaded versions.
* **Folder Structure:** Organize uploads using folder parameter (e.g., `folder: 'blogs/images'`).
* **Optimization:** Always use `q_auto` and `f_auto` for automatic quality and format optimization.
* **Signed URLs:** Use signed URLs for private or sensitive content.
* **Resource Management:** Tag uploaded assets appropriately for easy bulk operations.

### **Step 2.6: Netlify Deployment Best Practices**
When preparing for deployment:
* **Environment Variables:** Store all secrets (MongoDB URI, Cloudinary credentials) in Netlify's environment variables, never in code.
* **Build Command:** Ensure `netlify.toml` has the correct build command: `pnpm run build` or `npm run build`.
* **Publish Directory:** Set publish directory to `.next` for Next.js.
* **Functions:** Next.js API routes automatically become Netlify Functions. No additional configuration needed.
* **Edge Functions:** Use Next.js Middleware for edge-side logic - it automatically deploys as Netlify Edge Functions.
* **Headers & Redirects:** Configure headers and redirects in `netlify.toml` for optimal caching and routing.
* **Build Plugins:** Leverage `@netlify/plugin-nextjs` for optimal Next.js deployment (auto-installed).

---

## **4. Phase 3: Quality Assurance & Debugging (The Polish Phase)**

This phase ensures that what we've built is robust, bug-free, and performs as expected.

### **Step 4.1: High-Level Testing**
Focus on tests that provide the most value.
* **Integration Tests:** Prioritize high-level integration tests that simulate user workflows from end-to-end. These are more valuable than low-level unit tests for catching regressions.
* **API Testing:** Test all API routes with various input scenarios, including edge cases and error conditions.
* **Database Testing:** Use memory storage fallback for testing to avoid polluting production data.
* **AI-Generated Tests:** Leverage the AI to write test cases, but always review them for correctness and coverage.

### **Step 4.2: AI-Assisted Debugging**
* **Error Message First:** When a bug occurs, the first step is always to copy the full error message and provide it directly to the AI. This is often the fastest path to a solution.
* **Check Logs:** For Netlify deployments, check both build logs and function logs in the Netlify dashboard.
* **MongoDB Debugging:** Check connection status, query performance, and indexes in MongoDB Atlas dashboard.
* **Cloudinary Debugging:** Verify uploads in Cloudinary Media Library and check transformation URLs.
* **Systematic Problem Solving:** If the first attempt fails, ask the AI to hypothesize several potential root causes before attempting another fix. Avoid getting stuck in a loop of failed attempts. `git reset` to a clean state if necessary before trying a new approach.

### **Step 4.3: Integrated Debugging Utilities**
For every new feature, a corresponding debug utility must be implemented. This provides visibility into the feature's state and behavior in a controlled manner. All work on the global debug system must be preceded by a thorough review of its documentation in the IKB.

### **Step 4.4: User-Guided Verification**
An implementation is **not complete** until it passes manual verification.
* **Provide Verification Steps:** The AI must provide a simple, clear checklist for the user to follow to test the new functionality.
* **Await Confirmation:** The AI must wait for the user's explicit "pass" or "fail" confirmation before committing the final code or moving to the next task.

---

## **5. Phase 4: Deployment & Operations (The Launch Phase)**

This phase focuses on delivering the application to users and ensuring its ongoing health.

### **Step 5.1: Netlify Deployment Workflow**
The deployment process on Netlify is highly automated:
1. **Push to Git:** Push code to the connected Git repository (GitHub, GitLab, etc.).
2. **Automatic Build:** Netlify automatically detects the push and triggers a build.
3. **Build Process:**
   - Installs dependencies using `pnpm install` (or npm/yarn)
   - Runs the build command specified in `netlify.toml`
   - Generates Next.js production build
   - Optimizes assets and prepares functions
4. **Deployment:** Successful builds are automatically deployed to production or preview URLs.
5. **Rollback:** If issues arise, use Netlify's one-click rollback to previous deployments.

### **Step 5.2: Environment Configuration**
Proper environment setup is critical:
* **Development:** Use `.env.local` for local development (never commit this file).
* **Staging/Production:** Configure environment variables in Netlify Dashboard under Site Settings → Environment Variables.
* **Required Variables:**
  - `MONGODB_URI`: MongoDB Atlas connection string
  - `MONGODB_DB`: Database name
  - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
  - `CLOUDINARY_API_KEY`: Cloudinary API key
  - `CLOUDINARY_API_SECRET`: Cloudinary API secret
  - `NEXTAUTH_SECRET`: NextAuth secret for authentication
  - `NEXTAUTH_URL`: Application URL

### **Step 5.3: Monitoring & Logging**
Implement comprehensive monitoring:
* **Netlify Analytics:** Enable Netlify Analytics for traffic and performance insights.
* **Function Logs:** Monitor Netlify Function logs for API errors and performance issues.
* **MongoDB Monitoring:** Use MongoDB Atlas monitoring for database performance, slow queries, and connection issues.
* **Cloudinary Analytics:** Review Cloudinary dashboard for media transformation usage and bandwidth.
* **Error Tracking:** Implement error tracking service (Sentry, LogRocket) for production error monitoring.

### **Step 5.4: Performance Optimization**
Optimize for speed and efficiency:
* **Next.js Optimization:**
  - Use Image component for automatic image optimization
  - Implement dynamic imports for code splitting
  - Enable React Server Components for reduced client bundle
  - Use `next/font` for optimized font loading
* **Database Optimization:**
  - Create appropriate indexes for common queries
  - Use connection pooling to prevent connection exhaustion
  - Implement data caching where appropriate
* **CDN & Edge:**
  - Leverage Netlify's global CDN for static assets
  - Use Edge Functions for geo-location features
  - Configure proper cache headers in `netlify.toml`

---

## **6. Guiding Principles & Best Practices**

These are the overarching rules that govern all actions within this framework.

* **Start with an MVP:** Always build the minimum viable product first. Get the core functionality working, then iterate and add more features.
* **Refactor Frequently:** Once a feature is working and covered by tests, ask the AI to refactor the code to improve its structure, readability, and efficiency.
* **Keep Files Small & Modular:** Large, monolithic files are difficult for both humans and AIs to understand. Strive for a modular architecture with clear API boundaries.
* **Terminal & Server Discipline:** Execute one command at a time in the terminal. The development server on port 3000 should be maintained as a single instance.
* **Netlify-First Deployment:** Always use Netlify as the deployment platform. Never use alternative platforms (Vercel, Heroku, etc.) without explicit approval.
* **Cloudinary-First Media:** All image and video handling must go through Cloudinary. Never store media files in the repository or use alternative services.
* **MongoDB Atlas Exclusivity:** All persistent data storage must use MongoDB Atlas. Never introduce alternative databases without architectural review.
* **Security First:**
  - Never commit secrets or API keys to the repository
  - Always validate and sanitize user inputs
  - Use environment variables for all configuration
  - Implement proper authentication and authorization
  - Follow OWASP Top 10 security guidelines
* **Experimentation:** The AI landscape changes weekly. Continuously experiment with different models (Gemini, Claude, GPT variants) to find the best tool for a specific task (e.g., planning vs. code implementation).

### **Tech Stack Summary**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | Next.js 14+ | Server and client rendering, routing, API routes |
| UI Components | React with TypeScript | Component-based UI development |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Database | MongoDB Atlas | NoSQL document database with flexible schema |
| Media Storage | Cloudinary | Image and video storage with transformation CDN |
| Deployment | Netlify | Automated CI/CD, serverless functions, edge functions |
| Authentication | NextAuth.js | Authentication for Next.js applications |
| API | Next.js API Routes | Serverless API endpoints |

### **Critical Rules**

1. **No Alternative Platforms:** Use only Netlify for deployment. No Vercel, Heroku, AWS, or other platforms.
2. **No Alternative Media Storage:** Use only Cloudinary for media. No S3, local storage, or other CDNs.
3. **No Alternative Databases:** Use only MongoDB for data persistence. No PostgreSQL, MySQL, or other databases.
4. **Single Source of Truth:** The IKB in `/docs/MAIN.md` is the authoritative source for all project knowledge.
5. **Verification Before Completion:** No feature is complete without user verification and sign-off.

---

**End of Framework Document**

*This framework is a living document and will evolve as the project grows and new best practices emerge.*
