import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// read env vars
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.rpc('get_policies_for_pesanan');
  console.log(data, error);
}
check();
