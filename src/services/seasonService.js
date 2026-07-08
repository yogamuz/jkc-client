const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.')
  return data
}

export const getAllSeasons  = ()       => apiFetch('/api/seasons')
export const getSeasonById  = (id)     => apiFetch(`/api/seasons/${id}`)
export const getPublicRates = () => apiFetch('/api/seasons/public/rates')
export const createSeason   = (body)   => apiFetch('/api/seasons', { method: 'POST',   body: JSON.stringify(body) })
export const updateSeason   = (id, b)  => apiFetch(`/api/seasons/${id}`, { method: 'PATCH',  body: JSON.stringify(b) })
export const deleteSeason   = (id)     => apiFetch(`/api/seasons/${id}`, { method: 'DELETE' })
export const addColumn      = (id, b)  => apiFetch(`/api/seasons/${id}/columns`, { method: 'POST',   body: JSON.stringify(b) })
export const removeColumn   = (id, key)=> apiFetch(`/api/seasons/${id}/columns/${key}`, { method: 'DELETE' })
export const updateRates    = (id, b)  => apiFetch(`/api/seasons/${id}/rates`, { method: 'PUT',    body: JSON.stringify(b) })