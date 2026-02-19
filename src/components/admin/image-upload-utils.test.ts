import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getUploadFailureMessage,
  parseUploadResponseText,
} from '@/components/admin/image-upload-utils'

test('parses valid upload error payload', () => {
  const payload = parseUploadResponseText('{"error":"Dosya türü geçersiz"}')
  assert.equal(payload.error, 'Dosya türü geçersiz')
})

test('returns generic parse error for invalid JSON', () => {
  const payload = parseUploadResponseText('{not-json')
  assert.equal(payload.error, 'Sunucu beklenmeyen bir yanıt döndü')
})

test('uses backend error message when upload fails', () => {
  const message = getUploadFailureMessage(500, { error: 'Yükleme başarısız oldu.' })
  assert.equal(message, 'Yükleme başarısız oldu.')
})

test('falls back to HTTP based message when backend error is missing', () => {
  const message = getUploadFailureMessage(413)
  assert.equal(message, 'Yükleme başarısız (HTTP 413)')
})
