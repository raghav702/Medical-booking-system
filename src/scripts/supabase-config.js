// Supabase Configuration
import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
// You'll get these from your Supabase project dashboard
const supabaseUrl = 'https://ikpgrdgxzohuwnnneigw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGdyZGd4em9odXdubm5laWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1OTU4NDksImV4cCI6MjA3MTE3MTg0OX0.dIQSUteLZ2SI4JNlIbidgOHR_1qrKtQWTPRn4dSFLEw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication functions
export const auth = {
    // Sign up a new user
    async signUp(email, password, userType) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    user_type: userType
                }
            }
        })
        return { data, error }
    },

    // Sign in existing user
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        return { data, error }
    },

    // Sign out user
    async signOut() {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get current user
    getCurrentUser() {
        return supabase.auth.getUser()
    },

    // Listen to auth changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// Database functions
export const database = {
    // Patient operations
    async createPatient(patientData) {
        const { data, error } = await supabase
            .from('patients')
            .insert([patientData])
            .select()
        return { data, error }
    },

    async getPatientByUserId(userId) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', userId)
            .single()
        return { data, error }
    },

    // Doctor operations
    async createDoctor(doctorData) {
        const { data, error } = await supabase
            .from('doctors')
            .insert([doctorData])
            .select()
        return { data, error }
    },

    async getDoctorByUserId(userId) {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('user_id', userId)
            .single()
        return { data, error }
    },

    // Appointment operations
    async createAppointment(appointmentData) {
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData])
            .select()
        return { data, error }
    },

    async getAppointmentsByPatient(patientId) {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                doctors (
                    name,
                    specialization
                )
            `)
            .eq('patient_id', patientId)
            .order('appointment_date', { ascending: true })
        return { data, error }
    },

    async getAppointmentsByDoctor(doctorId) {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                patients (
                    name,
                    phone,
                    age
                )
            `)
            .eq('doctor_id', doctorId)
            .order('appointment_date', { ascending: true })
        return { data, error }
    },

    async updateAppointmentStatus(appointmentId, status) {
        const { data, error } = await supabase
            .from('appointments')
            .update({ status: status })
            .eq('id', appointmentId)
            .select()
        return { data, error }
    },

    // Get all doctors for patient selection
    async getAllDoctors() {
        const { data, error } = await supabase
            .from('doctors')
            .select('id, name, specialization')
            .order('name')
        return { data, error }
    },

    // Get appointment statistics
    async getAppointmentStats(userId, userType) {
        let query
        if (userType === 'patient') {
            query = supabase
                .from('appointments')
                .select('status')
                .eq('patient_id', userId)
        } else {
            query = supabase
                .from('appointments')
                .select('status')
                .eq('doctor_id', userId)
        }

        const { data, error } = await query
        return { data, error }
    }
}

// Real-time subscriptions
export const realtime = {
    // Subscribe to appointment changes
    subscribeToAppointments(userId, userType, callback) {
        let query
        if (userType === 'patient') {
            query = supabase
                .channel('appointments')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'appointments', filter: `patient_id=eq.${userId}` },
                    callback
                )
        } else {
            query = supabase
                .channel('appointments')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'appointments', filter: `doctor_id=eq.${userId}` },
                    callback
                )
        }
        return query.subscribe()
    }
}
