import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nzviijwmnhuvkfjkcrxw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dmlpandtbmh1dmtmamtjcnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxODkwMTksImV4cCI6MjEwMjc2NTAxOX0.4t8ZzcblmM12WWNzmCyzmTwiWXXA4jY5O7ftTOOmuZg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
