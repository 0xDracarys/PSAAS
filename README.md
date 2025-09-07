# Futuristic Portfolio Website - Shubham Bhasker

A cutting-edge personal portfolio website featuring cyberpunk aesthetics, 3D animations, and comprehensive client management system.

## 🚀 Features

### Frontend (Completed)
- **3D Hero Section**: Interactive React Three Fiber scene with floating geometric shapes and particle effects
- **Animated About Section**: Skill visualizations with progress bars and professional timeline
- **Projects Portfolio**: Grid layout with 3D hover effects and detailed modal views
- **Personal Showcase**: Guitar performance section with video player and track listings
- **Multi-Step Client Form**: Progressive form with file uploads and dynamic T&C based on budget
- **Admin Dashboard UI**: Complete interface for project and client request management
- **Responsive Design**: Mobile-first approach with glassmorphism and cyberpunk styling

### Backend (Ready for Implementation)
- MongoDB Atlas integration placeholders
- API route structure for client requests and projects
- TypeScript interfaces and database schemas
- Authentication system preparation

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 with custom cyberpunk theme
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui with custom modifications
- **Icons**: Lucide React
- **Typography**: Playfair Display (headings), Source Sans Pro (body)

### Backend (To Be Implemented)
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js or Supabase Auth
- **File Storage**: Vercel Blob or AWS S3
- **Email**: Resend or SendGrid
- **Validation**: Zod

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm
- Git

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd futuristic-portfolio
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add the following environment variables:
\`\`\`env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=portfolio_db

# Authentication (when implementing)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# File Storage (when implementing)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Email Service (when implementing)
RESEND_API_KEY=your-resend-api-key

# Admin Access (when implementing)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
├── app/
│   ├── admin/                 # Admin dashboard pages
│   ├── api/                   # API routes (ready for backend)
│   ├── globals.css           # Global styles with cyberpunk theme
│   ├── layout.tsx            # Root layout with fonts
│   └── page.tsx              # Main portfolio page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── client-request-form.tsx
│   └── floating-contact-button.tsx
├── lib/
│   ├── mongodb.ts            # Database connection utilities
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
├── public/
│   └── images/               # Project and personal images
└── scripts/                  # Database setup scripts
\`\`\`

## 🗄 Database Schema

### Collections

#### `projects`
\`\`\`typescript
interface Project {
  _id: ObjectId;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  category: 'cybersecurity' | 'ai-ml' | 'web-dev' | 'mobile' | 'blockchain' | 'other';
  status: 'completed' | 'in-progress' | 'planned';
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

#### `clientRequests`
\`\`\`typescript
interface ClientRequest {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  requirements: string;
  referenceLinks: string[];
  budgetRange: string;
  timeline: string;
  files: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  termsAccepted: boolean;
  paymentTerms: string;
  status: 'new' | 'reviewed' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

#### `users` (for admin authentication)
\`\`\`typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user';
  name: string;
  createdAt: Date;
  lastLogin?: Date;
}
\`\`\`

## 🔧 Backend Implementation Roadmap

### Phase 1: Database Setup
1. **MongoDB Atlas Configuration**
   - Create cluster and database
   - Set up connection string
   - Run initial data seeding scripts

2. **API Routes Implementation**
   - Complete `/api/projects` CRUD operations
   - Complete `/api/client-requests` CRUD operations
   - Add proper error handling and validation

### Phase 2: Authentication
1. **Admin Authentication**
   - Implement NextAuth.js or custom auth
   - Secure admin routes with middleware
   - Add login/logout functionality

2. **Session Management**
   - JWT tokens or session cookies
   - Role-based access control

### Phase 3: File Management
1. **File Upload System**
   - Integrate Vercel Blob or AWS S3
   - Handle multiple file types
   - Add file size and type validation

2. **Image Optimization**
   - Automatic image compression
   - Multiple format support (WebP, AVIF)

### Phase 4: Email Integration
1. **Client Notifications**
   - Form submission confirmations
   - Status update emails

2. **Admin Notifications**
   - New client request alerts
   - Daily/weekly summaries

### Phase 5: Advanced Features
1. **Analytics Dashboard**
   - Client request metrics
   - Project performance tracking
   - Visitor analytics integration

2. **Content Management**
   - Dynamic project management
   - Blog system (optional)
   - Testimonials system

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   - Add all production environment variables
   - Configure MongoDB Atlas whitelist

3. **Domain Configuration**
   - Set up custom domain
   - Configure SSL certificates

### Alternative Deployments
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: VPS deployment

## 🔒 Security Considerations

### Frontend Security
- Input validation on all forms
- XSS protection with proper escaping
- CSRF protection for forms

### Backend Security (To Implement)
- Rate limiting on API endpoints
- Input sanitization and validation
- Secure password hashing (bcrypt)
- JWT token security
- Database query protection (prevent injection)

## 🧪 Testing Strategy

### Frontend Testing
\`\`\`bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual
\`\`\`

### Backend Testing (To Implement)
- API endpoint testing with Jest
- Database integration tests
- Authentication flow testing

## 📈 Performance Optimization

### Current Optimizations
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- CSS optimization with Tailwind CSS purging
- 3D scene optimization with React Three Fiber

### Future Optimizations
- Database query optimization
- CDN integration for static assets
- Caching strategies (Redis)
- API response compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shubham Bhasker**
- Email: shubhambhasker2020@gmail.com
- Phone: +91 8700780007
- Location: New Delhi, India
- LinkedIn: [linkedin.com/in/shubham-bhasker](https://linkedin.com/in/shubham-bhasker)
- GitHub: [github.com/shubhambhasker](https://github.com/shubhambhasker)
- TryHackMe: Top 1% (Rank 1,234 out of 3M+ users)
- Bugcrowd: Top 500 researcher

## 🆘 Support

If you encounter any issues or need help with setup:

1. Check the [Issues](../../issues) section
2. Review the documentation
3. Contact the author directly

---

**"In cybersecurity, the smallest oversight can lead to the biggest breach. I build with security at the core, not as an afterthought."** - Shubham Bhasker
