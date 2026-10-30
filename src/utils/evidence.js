import { API_BASE_URL } from '../services/api'

// Event photos live in evidences[] (full_frame = vehicle shot, plate_crop =
// close-up) with URLs relative to the API base.
export const evidencePhotoUrl = (event) => {
  const list = event?.evidences ?? []
  const url = (
    list.find((e) => e?.type === 'full_frame' && e?.url) ??
    list.find((e) => e?.type === 'plate_crop' && e?.url) ??
    list.find((e) => typeof e?.url === 'string' && e.url)
  )?.url ?? event?.observation?.image_url ?? event?.observation?.plate_image_url
  if (typeof url !== 'string' || !url) return null
  return /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`
}
