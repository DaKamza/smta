
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://etfmnpomsnkvtfsdwoim.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Zm1ucG9tc25rdnRmc2R3b2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTQzMjYsImV4cCI6MjA1NjU5MDMyNn0.IQoPcWPyAm_NzedkuWesKrbLrwBnCGQq6sE3cDvOm_I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
