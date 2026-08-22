import { createClient } from '@supabase/supabase-js';

// Puxando as chaves de segurança que você salvou no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Criando e exportando o "motor" do banco de dados
export const supabase = createClient(supabaseUrl, supabaseAnonKey);