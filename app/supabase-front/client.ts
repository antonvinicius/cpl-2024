import { createClient } from '@supabase/supabase-js'
import { Database } from '../api/supabase/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_ANON
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)