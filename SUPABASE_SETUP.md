# Supabase Setup Guide for Medical Booking System

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `medical-booking-system`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Update Configuration

1. Open `src/scripts/supabase-config.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace with your Anon public key
   ```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the following SQL commands to create the database schema:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (this is automatically created by Supabase Auth)
-- We'll add a custom column for user_type

-- Create patients table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    age INTEGER CHECK (age > 0 AND age <= 120),
    sex VARCHAR(10) CHECK (sex IN ('male', 'female', 'other')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    permanent_address TEXT,
    permanent_city VARCHAR(100),
    clinic_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    department VARCHAR(100),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients
CREATE POLICY "Users can view their own patient profile" ON patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patient profile" ON patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient profile" ON patients
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for doctors
CREATE POLICY "Users can view their own doctor profile" ON doctors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own doctor profile" ON doctors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doctor profile" ON doctors
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for appointments
CREATE POLICY "Patients can view their own appointments" ON appointments
    FOR SELECT USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can view appointments assigned to them" ON appointments
    FOR SELECT USING (
        doctor_id IN (
            SELECT id FROM doctors WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can create appointments" ON appointments
    FOR INSERT WITH CHECK (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can update appointments assigned to them" ON appointments
    FOR UPDATE USING (
        doctor_id IN (
            SELECT id FROM doctors WHERE user_id = auth.uid()
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your domain URLs
   - **Enable email confirmations**: Set to `false` for development (set to `true` for production)

## Step 6: Enable Real-time

1. In your Supabase dashboard, go to **Database** → **Replication**
2. Enable real-time for the following tables:
   - `appointments`
   - `patients`
   - `doctors`

## Step 7: Test the Setup

1. Start your local server (if using a local development server)
2. Try registering a new patient or doctor
3. Check the Supabase dashboard to see if data is being created
4. Test the login functionality

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is added to the allowed origins in Supabase settings
2. **Authentication Errors**: Check that your API keys are correct
3. **Database Errors**: Verify that all tables were created successfully
4. **Real-time Not Working**: Ensure real-time is enabled for the tables

### Security Notes:

- Never expose your service role key in client-side code
- Use the anon key for client-side operations
- Row Level Security (RLS) is enabled to protect user data
- All sensitive operations should be done through server-side functions

## Production Deployment

When deploying to production:

1. Update the Site URL and Redirect URLs in Supabase settings
2. Enable email confirmations
3. Set up proper CORS origins
4. Consider using environment variables for API keys
5. Set up database backups
6. Monitor usage and performance

## Support

If you encounter any issues:
1. Check the Supabase documentation
2. Review the browser console for error messages
3. Check the Supabase dashboard logs
4. Ensure all SQL commands were executed successfully
