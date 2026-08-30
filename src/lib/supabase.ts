import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://amdtikicbdiulaaiumom.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZHRpa2ljYmRpdWxhYWl1bW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNDUwNzQsImV4cCI6MjEwMzYyMTA3NH0.9SqFVSGxYGeVQnTH3ASH0De9LJ2wQzjCKi23Tca0HDs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
