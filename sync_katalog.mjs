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

async function syncAll() {
  console.log('Fetching pesanan...');
  const { data: pesanan, error } = await supabase.from('pesanan').select('*').eq('jenis_pesanan', 'ternak');
  
  if (error) {
    console.error('Error fetching pesanan:', error);
    return;
  }

  for (const order of pesanan) {
    const match = order.produk.match(/Ternak Domba: (.*)/);
    if (match) {
      const items = match[1].split(', ');
      const idsToUpdate = items.map(item => item.split(' ')[0]);

      let katalogStatus = 'Menunggu Verifikasi';
      const terjualStatuses = ['Pemeriksaan Kesehatan', 'Sedang Dikirim', 'Dikirim', 'Siap Diambil', 'Selesai'];
      
      if (terjualStatuses.includes(order.status)) {
        katalogStatus = 'Terjual';
      } else if (order.status === 'Dibatalkan') {
        katalogStatus = 'Tersedia';
      }

      console.log(`Syncing order ${order.kode_pesanan} (${order.status}) -> IDs ${idsToUpdate.join(', ')} to ${katalogStatus}`);

      if (idsToUpdate.length > 0) {
        const { error: katalogErr } = await supabase
          .from('katalog_ternak')
          .update({ status: katalogStatus })
          .in('id', idsToUpdate);

        if (katalogErr) {
          console.error(`Failed to sync IDs ${idsToUpdate.join(', ')}:`, katalogErr);
        }
      }
    }
  }
  console.log('Sync complete.');
}

syncAll();
