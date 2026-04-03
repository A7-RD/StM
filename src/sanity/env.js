export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-03-02'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

const missing = []
if (!projectId?.trim()) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset?.trim()) missing.push('NEXT_PUBLIC_SANITY_DATASET')
if (missing.length > 0) {
  throw new Error(
    `Sanity env missing: ${missing.join(', ')}. Add them to .env.local (copy from .env.example). ` +
      'Project id and dataset: https://www.sanity.io/manage'
  )
}
