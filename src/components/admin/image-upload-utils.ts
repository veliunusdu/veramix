export type UploadResponsePayload = {
  error?: string
}

export function parseUploadResponseText(text: string) {
  if (!text) return {} as UploadResponsePayload

  try {
    return JSON.parse(text) as UploadResponsePayload
  } catch {
    return { error: 'Sunucu beklenmeyen bir yanıt döndü' } satisfies UploadResponsePayload
  }
}

export function getUploadFailureMessage(status: number, payload?: UploadResponsePayload) {
  return payload?.error ?? `Yükleme başarısız (HTTP ${status})`
}
