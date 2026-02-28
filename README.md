# 🎓 E-Learning Platform Dashboard

A comprehensive e-learning management system built with React, TypeScript, and Firebase. This platform provides separate dashboards for Admins, Instructors, and Students with full course management, certificates, and payment integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [User Roles](#user-roles)
- [Pages & Features](#pages--features)
- [Firebase Setup](#firebase-setup)
- [Usage](#usage)
- [Screenshots](#screenshots)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration (automatically creates student accounts)
- Login/Logout functionality
- Role-based access control (Admin, Instructor, Student)
- Protected routes based on user roles
- Firebase Authentication integration

### 👨‍💼 Admin Dashboard
- **Home**: Overview statistics and analytics
- **Courses Management**: Create, edit, delete courses
- **Students Management**: View and manage student accounts
- **Analytics**: Platform statistics and insights
- **Settings**: Platform configuration
- **Add Instructor**: Create instructor accounts (Admin only)

### 👨‍🏫 Instructor Dashboard
- **Home**: Instructor overview
- **Courses**: Manage own courses
- **Students**: View enrolled students
- **Analytics**: Course performance metrics
- **Settings**: Personal settings

### 👨‍🎓 Student Dashboard
- **Dashboard**: Personal learning overview
- **Browse Courses**: Explore available courses
- **My Courses**: Enrolled courses with progress tracking
- **Certificates**: View and download earned certificates (PNG/PDF)
- **Schedule**: Class schedule and upcoming sessions
- **Settings**: Profile, notifications, and security settings

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend & Services
- **Firebase Authentication** - User management
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage (profile photos)

### Additional Libraries
- **React Hook Form** - Form handling
- **SweetAlert2** - Beautiful alerts
- **jsPDF** - PDF generation
- **html2canvas** - Certificate generation
- **React Toastify** - Notifications

## 📁 Project Structure

```
Dashboard E-Learning/
├── config/
│   └── firebase.ts              # Firebase configuration
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # Admin/Instructor layout
│   │   ├── StudentLayout.tsx    # Student layout
│   │   ├── Sidebar.tsx          # Admin/Instructor sidebar
│   │   ├── StudentSidebar.tsx   # Student sidebar
│   │   ├── Router.tsx           # Main routing
│   │   ├── ProtectedRoute.tsx   # Route protection
│   │   └── RoleRedirect.tsx     # Role-based redirect
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── hooks/
│   │   └── useUserProfile.ts    # User profile hook
│   ├── pages/
│   │   ├── Home.tsx             # Admin/Instructor home
│   │   ├── Courses.tsx          # Course management
│   │   ├── Students.tsx         # Student management
│   │   ├── Analytics.tsx        # Analytics page
│   │   ├── Settings.tsx         # Settings page
│   │   ├── AdminSettings.tsx    # Admin settings (Add Instructor)
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── StudentDashboard.tsx # Student home
│   │   ├── BrowseCourses.tsx    # Course browsing
│   │   ├── Checkout.tsx         # Payment checkout
│   │   ├── StudentCourses.tsx   # Enrolled courses
│   │   ├── StudentCertificates.tsx # Certificates
│   │   ├── StudentSchedule.tsx  # Class schedule
│   │   └── StudentSettings.tsx  # Student settings
│   ├── services/
│   │   ├── auth.service.ts      # Authentication service
│   │   ├── user.service.ts      # User management
│   │   ├── course.service.ts    # Course operations
│   │   ├── purchase.service.ts  # Purchase handling
│   │   └── settings.service.ts  # Settings management
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Dashboard E-Learning
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Enable Storage
   - Copy your Firebase config

4. **Update Firebase configuration**
   
Edit `config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

5. **Run the development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

## ⚙️ Configuration

### Firebase Collections Structure

#### `users`
```typescript
{
  uid: string,
  email: string,
  displayName: string,
  role: "admin" | "instructor" | "student",
  createdAt: timestamp
}
```

#### `courses`
```typescript
{
  id: string,
  title: string,
  description: string,
  instructor: string,
  price: number,
  image: string,
  category: string,
  level: string,
  duration: string,
  students: number,
  rating: number,
  createdAt: timestamp
}
```

#### `purchases`
```typescript
{
  id: string,
  userId: string,
  courses: Array<{
    courseId: string,
    title: string,
    instructor: string,
    image: string
  }>,
  totalAmount: number,
  purchaseDate: timestamp,
  paymentMethod: string
}
```

#### `userSettings`
```typescript
{
  profile: {
    displayName: string,
    email: string,
    phone: string,
    bio: string,
    language: string,
    timezone: string,
    photoURL?: string
  },
  notifications: {
    emailNotifications: boolean,
    courseUpdates: boolean,
    newMessages: boolean,
    assignments: boolean,
    promotions: boolean
  }
}
```

## 👥 User Roles

### Admin
- Full system access
- Create instructor accounts
- Manage all courses and students
- View analytics
- System settings

### Instructor
- Manage own courses
- View enrolled students
- Course analytics
- Personal settings

### Student
- Browse and purchase courses
- Track learning progress
- Download certificates
- Manage schedule
- Personal settings

## 📄 Pages & Features

### Authentication Pages

#### Register (`/auth/register`)
- User registration
- Automatically creates student accounts
- Email/password validation
- Redirects to appropriate dashboard

#### Login (`/auth/login`)
- Email/password authentication
- Role-based redirection
- Remember me functionality

### Admin/Instructor Pages

#### Dashboard (`/dashboard`)
- Statistics overview
- Recent activities
- Quick actions

#### Courses (`/dashboard/courses`)
- Course list with search/filter
- Add new courses
- Edit/delete courses
- Course details

#### Students (`/dashboard/students`)
- Student list
- Student details
- Enrollment management

#### Analytics (`/dashboard/analytics`)
- Platform statistics
- Course performance
- User engagement metrics

#### Settings (`/dashboard/settings`)
- Platform configuration
- User preferences

#### Admin Settings (`/admin/settings`)
- **Add Instructor**: Create instructor accounts
  - Full name
  - Email address
  - Password setup
  - Automatic role assignment

### Student Pages

#### Dashboard (`/student`)
- Learning progress
- Enrolled courses
- Upcoming classes
- Recent certificates

#### Browse Courses (`/student/browse`)
- Course catalog
- Search and filters
- Course details
- Add to cart

#### Checkout (`/student/checkout`)
- Cart review
- Payment methods (Cash, Credit Card, PayPal)
- Order summary
- Purchase confirmation

#### My Courses (`/student/courses`)
- Enrolled courses
- Progress tracking
- Continue learning
- Course materials

#### Certificates (`/student/certificates`)
- Certificate gallery
- Download as PNG
- Download as PDF
- Professional certificate design with SVG icons
- Share certificates

#### Schedule (`/student/schedule`)
- Class calendar
- Upcoming sessions
- Live/recorded indicators
- Join class links

#### Settings (`/student/settings`)
- **Profile Tab**:
  - Upload profile photo (Firebase Storage)
  - Update name, email, phone
  - Language selection
  - Bio
  
- **Notifications Tab**:
  - Email notifications
  - Course updates
  - New messages
  - Assignments & deadlines
  - Promotions
  
- **Security Tab**:
  - Change password
  - Delete account (with confirmation)

## 🔥 Firebase Setup

### 1. Authentication
- Enable Email/Password provider
- Configure authorized domains

### 2. Firestore Database
Create the following collections:
- `users`
- `courses`
- `purchases`
- `userSettings`

### 3. Storage
- Create `profile-photos` folder for user avatars

### 4. Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'instructor']);
    }
    
    match /purchases/{purchaseId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == request.resource.data.userId;
    }
    
    match /userSettings/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 💻 Usage

### Creating an Admin Account
1. Register a new account (will be created as student)
2. Manually update the role in Firestore:
   - Go to Firebase Console → Firestore
   - Find the user in `users` collection
   - Change `role` field to `"admin"`

### Adding an Instructor
1. Login as Admin
2. Navigate to Sidebar → "Add Instructor"
3. Fill in instructor details
4. Submit form
5. Instructor can now login with provided credentials

### Student Workflow
1. Register account
2. Browse available courses
3. Add courses to cart
4. Complete checkout
5. Access courses from "My Courses"
6. Download certificates upon completion

## 🎨 Key Features Implementation

### Certificate Generation
- Professional SVG icon design
- A4 landscape format
- Download as PNG or PDF
- Unique certificate numbers
- Student name and course details

### Profile Photo Upload
- Firebase Storage integration
- Image preview
- Automatic URL update in Auth and Firestore
- Secure file handling

### Settings Management
- Real-time sync with Firestore
- Profile updates
- Notification preferences
- Password change with re-authentication
- Account deletion with confirmation

### Payment Integration
- Multiple payment methods
- Cart management
- Order summary
- Purchase history

## 🔒 Security Features

- Role-based access control
- Protected routes
- Firebase Authentication
- Password re-authentication for sensitive operations
- Secure file uploads
- Input validation
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebars
- Responsive grids
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🎯 Future Enhancements

- [ ] Video streaming integration
- [ ] Real-time chat
- [ ] Assignment submission
- [ ] Quiz system
- [ ] Progress tracking
- [ ] Email notifications
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for modern e-learning

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email support@elearning.com or join our Slack channel.

---

**Note**: Make sure to update all Firebase configuration and API keys before deploying to production.
