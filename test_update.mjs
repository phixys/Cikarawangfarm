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

async function testUpdate() {
  console.log("Fetching one order...");
  const { data: orders, error: fetchErr } = await supabase.from('pesanan').select('id, status').limit(1);
  if (fetchErr) {
    console.error("Fetch Error:", fetchErr);
    return;
  }
  if (!orders || orders.length === 0) {
    console.log("No orders found");
    return;
  }
  const order = orders[0];
  console.log("Found order:", order);

  console.log("Attempting to update status to the exact same value...");
  const { data: updateData, error: updateErr } = await supabase
    .from('pesanan')
    .update({ status: order.status })
    .eq('id', order.id)
    .select();
    
  console.log("Update Data:", updateData);
  console.log("Update Error:", updateErr);
}

testUpdate();
