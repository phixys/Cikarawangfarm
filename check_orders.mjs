import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zbsepnvoqqlnymoulcrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpic2VwbnZvcXFsbnltb3VsY3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NzM3NTAsImV4cCI6MjA5NDA0OTc1MH0.mwHIjfjBvYyhISikGPgUbss6hywT23dP9Srq594uqp8'
)

async function test() {
  const { data, error } = await supabase.from('pesanan').select('*')
  console.log('Error:', error)
  console.log('Total Orders:', data?.length)
  console.log('Data:', data)
}
test()
