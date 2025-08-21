# Medical Booking System

A modern, full-stack medical appointment booking system built with HTML, CSS, JavaScript, and Supabase. This system allows patients to book appointments with different medical specialists and provides comprehensive dashboards for both patients and doctors.

## Features

- **User Authentication**: Secure login/registration for patients and doctors
- **Role-based Access**: Separate dashboards for patients and doctors
- **Specialty Booking**: Book appointments with different medical specialists (Cardiology, Neurology, Orthopedics, etc.)
- **Real-time Updates**: Live appointment updates using Supabase real-time
- **Appointment Management**: Book, view, and manage appointments
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **SQL Database**: PostgreSQL database with Row Level Security (RLS)
- **Admin Panel**: Administrative interface for system management

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with JWT tokens
- **Dependencies**: @supabase/supabase-js v2.55.0

## Quick Start

### Prerequisites

- Node.js (for package management)
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Mini_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the detailed setup guide in `SUPABASE_SETUP.md`
   - Or use the quick setup below

### Quick Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and Anon Key

2. **Set Up Configuration (IMPORTANT: Security)**
   - Copy `src/scripts/supabase-config.template.js` to `src/scripts/supabase-config.js`
   - Replace `YOUR_SUPABASE_URL_HERE` and `YOUR_SUPABASE_ANON_KEY_HERE` with your actual values
   - **⚠️ NEVER commit your actual credentials to Git!**
   - The `supabase-config.js` file is already added to `.gitignore` to prevent accidental commits

3. **Create Database Tables**
   - In Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `database-schema.sql`
   - Execute the SQL commands

4. **Enable Real-time**
   - Go to Database → Replication
   - Enable real-time for `appointments`, `patients`, and `doctors` tables

### Running the Application

1. **Start a local server** (you can use any of these methods):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Open your browser**
   - Navigate to `http://localhost:8000/src/pages/login.html`
   - Or start with `http://localhost:8000/src/pages/index.html` for the main page

## Project Structure

```
Mini_project/
├── src/
│   ├── pages/
│   │   ├── index.html              # Main landing page
│   │   ├── login.html              # Login page
│   │   ├── Pregistration.html      # Patient registration
│   │   ├── Dregistration.html      # Doctor registration
│   │   ├── patient-dashboard.html  # Patient dashboard
│   │   ├── doctor-dashboard.html   # Doctor dashboard
│   │   ├── admin.html              # Admin panel
│   │   ├── Alternate.html          # Alternative booking page
│   │   ├── run.html                # Booking runner page
│   │   ├── cardio.html             # Cardiology specialist page
│   │   ├── neuro.html              # Neurology specialist page
│   │   ├── Orthopedic.html         # Orthopedics specialist page
│   │   ├── Ophthalmologist.html    # Ophthalmology specialist page
│   │   ├── pulmonologist.html      # Pulmonology specialist page
│   │   ├── Urologist.html          # Urology specialist page
│   │   ├── Gastroenterologist.html # Gastroenterology specialist page
│   │   ├── ENT.html                # ENT specialist page
│   │   ├── General.html            # General medicine specialist page
│   │   └── dermatologist.html      # Dermatology specialist page
│   ├── scripts/
│   │   ├── supabase-config.js      # Supabase configuration (configured)
│   │   ├── supabase-config.template.js # Template for configuration
│   │   └── script.js               # Main JavaScript
│   └── styles/
│       └── style.css               # Main stylesheet
├── public/
│   └── images/                     # Image assets
├── database-schema.sql             # Database schema
├── SUPABASE_SETUP.md              # Detailed setup guide
├── package.json                   # Dependencies
├── package-lock.json              # Lock file
├── .gitignore                     # Git ignore rules
├── debug-supabase.html            # Debug page for Supabase testing
├── check-registration.html        # Registration testing page
├── test.html                      # General testing page
└── README.md                      # This file
```

## Key Features Explained

### Authentication System
- **Patient Registration**: Creates user account + patient profile + initial appointment
- **Doctor Registration**: Creates user account + doctor profile
- **Secure Login**: JWT-based authentication with Supabase
- **Session Management**: Automatic session handling

### Specialty Booking System
- **Multiple Specialties**: Cardiology, Neurology, Orthopedics, Ophthalmology, Pulmonology, Urology, Gastroenterology, ENT, General Medicine, Dermatology
- **Specialist Pages**: Dedicated pages for each medical specialty
- **Flexible Booking**: Patients can choose from available specialists
- **Alternate Booking**: Alternative booking flow for different scenarios

### Dashboard Features

#### Patient Dashboard
- View upcoming and recent appointments
- Appointment statistics
- Quick actions for booking new appointments
- Real-time updates when appointments change

#### Doctor Dashboard
- View today's appointments
- Manage pending appointments
- Patient history and details
- Appointment status management

#### Admin Panel
- System-wide management capabilities
- User and appointment oversight
- Administrative functions

### Database Design
- **Patients Table**: Stores patient information linked to auth users
- **Doctors Table**: Stores doctor information linked to auth users
- **Appointments Table**: Links patients and doctors with appointment details
- **Row Level Security**: Ensures users can only access their own data

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Client-side and server-side validation
- **SQL Injection Protection**: Parameterized queries via Supabase
- **CORS Protection**: Configured CORS policies

## Real-time Features

- **Live Updates**: Appointments update in real-time across all users
- **Instant Notifications**: Changes appear immediately without page refresh
- **Multi-user Support**: Multiple users can use the system simultaneously

## Testing and Debugging

The project includes several testing and debugging pages:
- `debug-supabase.html`: For testing Supabase connections and functionality
- `check-registration.html`: For testing registration processes
- `test.html`: General testing utilities

## Deployment

### Development
- Use any local server (Python, Node.js, PHP)
- Configure Supabase for localhost URLs

### Production
1. **Deploy to hosting service** (Netlify, Vercel, GitHub Pages)
2. **Update Supabase settings**:
   - Add production domain to allowed origins
   - Enable email confirmations
   - Set up proper redirect URLs
3. **Environment variables**: Use environment variables for API keys

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add your domain to Supabase allowed origins
   - Check browser console for specific error messages

2. **Authentication Errors**
   - Verify API keys are correct
   - Check Supabase project settings
   - Ensure email confirmations are configured properly

3. **Database Errors**
   - Verify all SQL commands were executed
   - Check Supabase dashboard for table creation
   - Ensure RLS policies are in place

4. **Real-time Not Working**
   - Enable real-time for required tables
   - Check browser console for connection errors
   - Verify subscription setup

### Getting Help

1. Check the browser console for error messages
2. Review Supabase dashboard logs
3. Verify all setup steps were completed
4. Check the `SUPABASE_SETUP.md` for detailed instructions
5. Use the debug pages for testing specific functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly using the provided debug pages
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Check the Supabase documentation
- Review the setup guide in `SUPABASE_SETUP.md`
- Check browser console for error messages
- Verify all configuration steps were completed
- Use the debug pages for testing specific functionality
