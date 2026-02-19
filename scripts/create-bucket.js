// scripts/create-bucket.js
require('dotenv').config({ path: '.env.local', override: true })
require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const provider = (process.env.IMAGE_STORAGE_PROVIDER || 'supabase').toLowerCase()
const bucketId = process.env.SUPABASE_STORAGE_BUCKET || 'product-images'

;(async () => {
  try {
    if (provider !== 'supabase') {
      console.log(`IMAGE_STORAGE_PROVIDER=${provider} -> Supabase bucket setup skipped.`)
      process.exitCode = 0
      return
    }

    if (!url || !key) {
      console.error('MISSING SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      process.exitCode = 1
      return
    }

    const supabase = createClient(url, key)
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) {
      console.error('ERROR listing buckets:', listError.message || listError)
      process.exitCode = 1
      return
    }

    const existing = buckets.find((b) => b.id === bucketId)
    if (!existing) {
      const { data, error } = await supabase.storage.createBucket(bucketId, { public: true })
      if (error) {
        console.error('ERROR creating bucket:', error.message || error)
        process.exitCode = 1
        return
      }
      console.log(`Bucket created: ${bucketId}`, data)
      process.exitCode = 0
      return
    }

    if (!existing.public) {
      const { data, error } = await supabase.storage.updateBucket(bucketId, { public: true })
      if (error) {
        console.error('ERROR updating bucket visibility:', error.message || error)
        process.exitCode = 1
        return
      }
      console.log(`Bucket updated to public: ${bucketId}`, data)
      process.exitCode = 0
      return
    }

    console.log(`Bucket already exists and is public: ${bucketId}`)
  } catch (e) {
    console.error('EXCEPTION', e && e.message ? e.message : e)
    process.exitCode = 1
    return
  }
})()
