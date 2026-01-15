THIS PROJECT IS FULLY VIBECODED USING CURSOR AI FOR ENACTUS DEMONSTRATION



# Forsa - Hospital Patient Portal

> **Note: This is the presented version of the project.**

A modern, multi-hospital patient portal web application for hospitals in Tetouan, Morocco. Built with React, Vite, Tailwind CSS, and Supabase. This platform allows patients to manage appointments, view hospital information, submit reviews, request help, and enables administrators to manage hospital operations.

## 🌟 Features

### Patient Features
- 🔐 **Authentication** - Secure login and signup system (required for help requests)
- ⏱️ **Real-time Waiting Lists** - Join department queues with live updates
- 🩸 **Blood Bank Inventory** - View real-time blood type availability
- 👨‍⚕️ **Doctor Directory** - Browse doctors, specializations, and availability status
- ⭐ **Reviews System** - Submit and view hospital/doctor reviews with ratings and optional doctor selection
- 🆘 **Help Requests** - Request emergency help from hospital staff with description (login required)
- 🗺️ **Hospital Locations** - Interactive map showing all hospital locations
- 🏥 **Multi-Hospital Support** - Access different hospitals from a single platform

### Admin Features
- 📊 **Admin Dashboard** - Comprehensive management interface
- 📋 **Waiting List Management** - View and delete patients from waiting lists
- 🩸 **Blood Bank Management** - Update blood inventory in real-time
- 🆘 **Help Requests Management** - View, manage, and resolve patient help requests with status tracking
- 🔄 **Real-time Updates** - All changes sync instantly across the platform

### Additional Features
- 👥 **Contributors Section** - Meet the development team
- 🙏 **Special Thanks** - Acknowledgment section
- 📧 **Contact Information** - Easy way to reach the team
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Routing**: React Router DOM
- **Icons**: Font Awesome
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/omarelhorre/Sari3-V2.git
cd Sari3-V2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database Tables

Run these SQL scripts in your Supabase SQL Editor in order:

#### Step 1: Core Tables

Run the SQL from `supabase_reviews_table.sql` and `supabase_help_requests_table.sql` files, or use the combined script below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waiting_list table
CREATE TABLE waiting_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'waiting'
);

-- Create doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blood_bank table
CREATE TABLE blood_bank (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_type TEXT UNIQUE NOT NULL,
  units INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create help_requests table
CREATE TABLE help_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);
```

#### Step 2: Enable Row Level Security

```sql
-- Enable RLS
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
```

#### Step 3: Create RLS Policies

```sql
-- Waiting List Policies
CREATE POLICY "Users can view waiting lists" ON waiting_list FOR SELECT USING (true);
CREATE POLICY "Users can insert waiting lists" ON waiting_list FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can delete waiting lists" ON waiting_list FOR DELETE USING (true);

-- Doctor Policies
CREATE POLICY "Users can view doctors" ON doctors FOR SELECT USING (true);

-- Blood Bank Policies
CREATE POLICY "Users can view blood bank" ON blood_bank FOR SELECT USING (true);
CREATE POLICY "Anyone can update blood bank" ON blood_bank FOR UPDATE USING (true) WITH CHECK (true);

-- Department Policies
CREATE POLICY "Users can view departments" ON departments FOR SELECT USING (true);

-- Review Policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Help Requests Policies
CREATE POLICY "Anyone can view help requests" ON help_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert help requests" ON help_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update help requests" ON help_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete help requests" ON help_requests FOR DELETE USING (true);
```

#### Step 4: Seed Initial Data

```sql
-- Insert departments
INSERT INTO departments (name, description, capacity) VALUES
('Emergency', 'Urgent care and emergency services', 20),
('Surgery', 'Surgical procedures and operations', 10),
('Radiology', 'Medical imaging and diagnostics', 15),
('Cardiology', 'Heart and cardiovascular care', 12),
('Pediatrics', 'Children healthcare services', 18);

-- Insert doctors (replace department_id with actual IDs from departments table)
INSERT INTO doctors (name, specialization, department_id, available) VALUES
('Dr. Amina Bennani', 'Emergency Medicine', (SELECT id FROM departments WHERE name = 'Emergency'), true),
('Dr. Youssef Alami', 'Cardiology', (SELECT id FROM departments WHERE name = 'Cardiology'), true),
('Dr. Fatima Zahra', 'Pediatrics', (SELECT id FROM departments WHERE name = 'Pediatrics'), false),
('Dr. Hassan Tazi', 'General Surgery', (SELECT id FROM departments WHERE name = 'Surgery'), true),
('Dr. Laila Senhaji', 'Radiology', (SELECT id FROM departments WHERE name = 'Radiology'), true);

-- Insert blood bank data
INSERT INTO blood_bank (blood_type, units) VALUES
('A+', 12),
('A-', 3),
('B+', 8),
('B-', 2),
('O+', 15),
('O-', 5),
('AB+', 4),
('AB-', 1);
```

#### Step 5: Enable Real-time Replication

1. Go to **Database > Replication** in Supabase dashboard
2. Enable replication for the following tables:
   - `waiting_list`
   - `blood_bank`
   - `reviews`
   - `help_requests`

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 👤 Admin Access

The application includes mock admin authentication for testing. Use these credentials:

### Admin 1 (Saniat Rmel Hospital)
- **Username**: `admin1`
- **Password**: `admin123`
- **Hospital**: Saniat Rmel Hospital

### Admin 2 (Tetouan Medical center)
- **Username**: `admin2`
- **Password**: `admin123`
- **Hospital**: Tetouan Medical center

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminBloodBankTab.jsx      # Blood bank management
│   │   ├── AdminDashboard.jsx         # Main admin interface
│   │   ├── AdminHelpRequestsTab.jsx   # Help requests management
│   │   └── AdminWaitingList.jsx       # Waiting list management
│   ├── auth/
│   │   ├── LoginForm.jsx              # Login component
│   │   └── SignupForm.jsx             # Signup component
│   ├── common/
│   │   ├── Button.jsx                 # Reusable button
│   │   ├── Form.jsx                   # Reusable form
│   │   ├── Header.jsx                 # Navigation header
│   │   ├── JoinQueueModal.jsx         # Queue joining modal
│   │   ├── LoadingSpinner.jsx        # Loading indicator
│   │   └── Modal.jsx                  # Reusable modal
│   ├── dashboard/
│   │   ├── BloodBankTab.jsx           # Blood bank display
│   │   ├── Dashboard.jsx              # Patient dashboard
│   │   ├── DoctorsTab.jsx             # Doctor directory
│   │   ├── ReviewForm.jsx             # Review submission form
│   │   ├── ReviewsTab.jsx             # Reviews display
│   │   ├── RequestHelpModal.jsx       # Help request modal
│   │   └── WaitingListTab.jsx         # Waiting list display
│   ├── hospital/
│   │   ├── HospitalCard.jsx           # Hospital card component
│   │   └── HospitalDetail.jsx        # Hospital detail page
│   └── map/
│       ├── MapView.jsx                # Hospital locations map
│       └── ParticleBackground.jsx     # Animated background
├── contexts/
│   └── AuthContext.jsx                # Authentication context
├── hooks/
│   └── useAuth.js                     # Auth hook (legacy)
├── lib/
│   └── supabaseClient.js              # Supabase client config
├── App.jsx                            # Main app component
├── main.jsx                           # Entry point
└── index.css                          # Global styles
```

## 🎨 Design System

Colors from `design.json`:
- **Primary**: `#4CAF50` (green)
- **Secondary**: `#2E7D32` (dark green)
- **Accent**: `#43A047` (bright green)
- **Background**: `#F5F7FA` (light gray)
- **Text**: `#4D4D4D` (dark gray)

## 🏥 Supported Hospitals

Currently, the platform supports:
- **Saniat Rmel Hospital** - Tetouan, Morocco
- **Tetouan Medical center** - Tetouan, Morocco

## 📝 Key Features Explained

### Reviews System
- Patients can submit reviews for hospitals or specific doctors
- Optional doctor selection when submitting reviews
- Rating system (1-5 stars)
- Real-time updates when new reviews are submitted
- Reviews are filtered by hospital

### Help Requests System
- **Patient Side**: 
  - Login required to request help
  - Optional description field for detailed information
  - Confirmation step before submitting
  - Success message confirming help is on the way
- **Admin Side**:
  - View all help requests in dedicated tab
  - Status management: pending → in-progress → resolved
  - Delete functionality
  - Real-time updates
  - Filtered by hospital

### Admin Dashboard
- **Waiting List Tab**: View all patients in waiting lists, delete entries with confirmation
- **Blood Bank Tab**: Update blood inventory quantities in real-time
- **Help Requests Tab**: Manage patient help requests with status tracking
- All changes sync instantly with patient dashboards

### Real-time Features
- Waiting list updates
- Blood bank inventory changes
- New review submissions
- Help request status changes
- All powered by Supabase real-time subscriptions

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Add environment variables in site settings
4. Deploy!

## 👥 Contributors

- **Reda Zakaria** - 3rd year engineering student at Computer Science
- **Omar El Horre** - 3rd year engineering student at Computer Science

### Special Thanks

- **Hiba El Bouhaddioui** - 2nd year engineering student at preparatory classes
- **Abdellah Raissouni** - 5th year engineering student at computer science

## 📧 Contact

For inquiries, please contact: **elhorre.omar@etu.uae.ac.ma**

## 📄 License

MIT

## 🔄 Version

**Version 2.0** - Multi-hospital support with reviews, help requests, ambulance management, and comprehensive admin management

### Recent Updates
- ✅ Ambulance management system with availability tracking
- ✅ Integrated help requests with ambulance dispatch
- ✅ Enhanced admin dashboard with ambulance and help request management
- ✅ Improved UI/UX with dark mode support
- ✅ Fixed queue joining issues and modal positioning
- ✅ Updated button labels (Accept/Reject for help requests, Pull from waiting list)

---

**Copyright © 2025-2026**

**This is the presented version of the Forsa Hospital Patient Portal project.**
