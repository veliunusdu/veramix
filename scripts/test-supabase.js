// scripts/test-supabase.js
// Force-load project env files so shell/user-level vars do not override local config.
require('dotenv').config({ path: '.env.local', override: true })
require('dotenv').config({ path: '.env' })
// Load supabase client lazily and validate url/key with clearer messages
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('MISSING ENV: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in .env.local/.env');
  process.exit(1);
}

// Debug info to detect malformed URL issues
try {
  console.log('SUPABASE_URL debug:', JSON.stringify(url));
  console.log('SUPABASE_URL length:', url.length);
  console.log('SUPABASE_URL startsWith http(s):', url && (url.startsWith('http://') || url.startsWith('https://')));
} catch (e) {
  console.log('Error logging SUPABASE_URL debug:', e && e.message);
}

if (url.includes('<') || url.includes('>') || /<.*>/.test(url)) {
  console.error('SUPABASE_URL appears to contain placeholder text (e.g. "<project-id>").');
  console.error('Please set SUPABASE_URL to your actual project URL, for example: https://your-project-id.supabase.co');
  process.exit(2);
}

let supabase;
try {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(url, key);
} catch (e) {
  console.error('Failed to initialize Supabase client:', e && e.message);
  process.exit(3);
}

(async () => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('KEY INVALID or ERROR:', error && error.message ? error.message : error);
    } else {
      console.log('KEY OK - users count:', Array.isArray(data?.users) ? data.users.length : 0);
    }
  } catch (e) {
    console.error('EXCEPTION', e && e.message ? e.message : e);
  }
})();
