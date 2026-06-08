import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function checkSchema() {
  // We can just fetch 1 row to see the keys (columns)
  const { data, error } = await supabase.from('pesanan').select('*').limit(1);
  if (error) console.error(error);
  else if (data && data.length > 0) console.log("Columns:", Object.keys(data[0]));
  else console.log("Table is empty, can't infer schema easily this way.");
}
checkSchema();
