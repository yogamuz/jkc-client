import { useEffect, useState } from 'react'
import useSeason from '../hooks/useSeason'

/* ── Design tokens ─────────────────────────────────────── */
const C = {
  bg:      '#0D0D0D',
  panel:   '#111111',
  border:  '#2A2A2A',
  yellow:  '#FFE600',
  cyan:    '#00E5FF',
  magenta: '#FF3CAC',
  text:    '#E8E8E8',
  muted:   '#555555',
  dim:     '#2A2A2A',
}

const StatusBadge = ({ isActive }) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 10px',
    fontSize: '0.6rem',
    fontWeight: 900,
    letterSpacing: '2px',
    background: 'transparent',
    color: isActive ? C.cyan : C.muted,
    border: `1px solid ${isActive ? C.cyan : C.muted}`,
    fontFamily: "'Courier New', monospace",
    boxShadow: isActive ? `0 0 6px ${C.cyan}40` : 'none',
  }}>
    {isActive ? 'AKTIF' : 'NONAKTIF'}
  </span>
)

const inputStyle = {
  background: '#0A0A0A',
  border: `1px solid ${C.border}`,
  padding: '0.55rem 0.875rem',
  color: C.text,
  fontWeight: 700,
  fontSize: '0.88rem',
  outline: 'none',
  width: '100%',
  fontFamily: "'Courier New', monospace",
  letterSpacing: '0.5px',
}

const actionBtn = (accent) => ({
  background: 'transparent',
  border: `1px solid ${accent}`,
  color: accent,
  padding: '4px 12px',
  cursor: 'pointer',
  fontWeight: 900,
  fontSize: '0.72rem',
  fontFamily: "'Courier New', monospace",
  letterSpacing: '1px',
  boxShadow: `0 0 6px ${accent}30`,
})

const TABLE_COLS = '110px 1fr 140px 130px 110px'

const SeasonPage = () => {
  const { seasons, loading, error, fetchAll, create, update, remove } = useSeason()
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName]   = useState('')
  const [newLabel, setNewLabel] = useState('')

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleCreate = async () => {
    if (!newName.trim()) return
    await create({ name: newName, label: newLabel })
    setNewName('')
    setNewLabel('')
    setShowForm(false)
  }

  return (
    <div style={{ padding: '2rem 2.5rem', background: C.bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '3px',
            color: C.muted, fontFamily: "'Courier New', monospace", marginBottom: '4px',
          }}>
            // DATA
          </div>
          <h1 style={{
            fontSize: '3rem', fontWeight: 900, color: C.text, margin: 0,
            letterSpacing: '-3px', textTransform: 'uppercase',
            fontFamily: "'Courier New', monospace", lineHeight: 0.9,
          }}>
            Seasons
          </h1>
          <div style={{
            width: '48px', height: '2px', background: C.yellow,
            marginTop: '10px', boxShadow: `0 0 8px ${C.yellow}`,
          }} />
        </div>

        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            background: showForm ? 'transparent' : C.yellow,
            border: showForm ? `1px solid ${C.muted}` : `1px solid ${C.yellow}`,
            padding: '0.65rem 1.5rem',
            fontWeight: 900, fontSize: '0.8rem', letterSpacing: '2px',
            cursor: 'pointer',
            color: showForm ? C.muted : '#000',
            fontFamily: "'Courier New', monospace",
            textTransform: 'uppercase',
            boxShadow: showForm ? 'none' : `0 0 12px ${C.yellow}40`,
          }}
        >
          {showForm ? '✕  BATAL' : '+  SEASON BARU'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          marginBottom: '1.75rem',
          overflow: 'hidden',
        }}>
          <div style={{
            borderBottom: `1px solid ${C.border}`,
            padding: '0.5rem 1.25rem',
          }}>
            <span style={{
              fontSize: '0.6rem', fontWeight: 900, letterSpacing: '3px',
              color: C.yellow, fontFamily: "'Courier New', monospace",
            }}>
              // BUAT SEASON BARU
            </span>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '0 0 140px' }}>
                <div style={{
                  fontSize: '0.58rem', color: C.muted, fontWeight: 900,
                  marginBottom: '5px', fontFamily: "'Courier New', monospace", letterSpacing: '2px',
                }}>
                  NAME *
                </div>
                <input
                  style={inputStyle}
                  placeholder="S42"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{
                  fontSize: '0.58rem', color: C.muted, fontWeight: 900,
                  marginBottom: '5px', fontFamily: "'Courier New', monospace", letterSpacing: '2px',
                }}>
                  LABEL
                </div>
                <input
                  style={inputStyle}
                  placeholder="Season 42"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={loading}
                style={{
                  background: loading ? 'transparent' : C.cyan,
                  border: `1px solid ${loading ? C.muted : C.cyan}`,
                  color: loading ? C.muted : '#000',
                  padding: '0.55rem 1.5rem', fontSize: '0.8rem',
                  flexShrink: 0, cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 900, fontFamily: "'Courier New', monospace",
                  letterSpacing: '2px',
                  boxShadow: loading ? 'none' : `0 0 10px ${C.cyan}40`,
                }}
              >
                {loading ? '...' : 'SIMPAN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(255,60,172,0.08)', border: `1px solid ${C.magenta}`,
          padding: '0.75rem 1.25rem', color: C.magenta, fontWeight: 900,
          fontSize: '0.85rem', marginBottom: '1.5rem',
          fontFamily: "'Courier New', monospace", letterSpacing: '1px',
        }}>
          ⚠  {error}
        </div>
      )}

      {/* Table */}
      <div style={{
        background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: TABLE_COLS,
          borderBottom: `1px solid ${C.border}`,
          padding: '0.65rem 1.25rem',
        }}>
          {['NAME', 'LABEL', 'STATUS', 'DIBUAT', 'AKSI'].map(h => (
            <div key={h} style={{
              fontSize: '0.6rem', fontWeight: 900, letterSpacing: '2.5px',
              color: C.yellow, fontFamily: "'Courier New', monospace",
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Body */}
        {loading && seasons.length === 0 ? (
          <div style={{
            padding: '2.5rem', textAlign: 'center', color: C.dim,
            fontWeight: 900, letterSpacing: '5px', fontSize: '0.72rem',
            fontFamily: "'Courier New', monospace",
          }}>
            MEMUAT...
          </div>
        ) : seasons.length === 0 ? (
          <div style={{
            padding: '2.5rem', textAlign: 'center', color: C.dim,
            fontWeight: 900, letterSpacing: '5px', fontSize: '0.72rem',
            fontFamily: "'Courier New', monospace",
          }}>
            BELUM ADA SEASON
          </div>
        ) : (
          seasons.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: 'grid', gridTemplateColumns: TABLE_COLS,
                padding: '0.875rem 1.25rem',
                borderBottom: i < seasons.length - 1 ? `1px solid ${C.border}` : 'none',
                alignItems: 'center',
                background: i % 2 === 0 ? C.panel : 'rgba(255,255,255,0.01)',
              }}
            >
              <div style={{
                fontWeight: 900, color: C.yellow, fontSize: '0.95rem',
                fontFamily: "'Courier New', monospace", letterSpacing: '-0.5px',
              }}>
                {s.name}
              </div>
              <div style={{
                color: C.text, fontSize: '0.85rem', fontWeight: 700,
                fontFamily: "'Courier New', monospace",
              }}>
                {s.label}
              </div>
              <div>
                <StatusBadge isActive={s.isActive} />
              </div>
              <div style={{
                color: C.muted, fontSize: '0.75rem', fontWeight: 700,
                fontFamily: "'Courier New', monospace", letterSpacing: '0.5px',
              }}>
                {new Date(s.createdAt).toLocaleDateString('id-ID')}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => update(s.id, { isActive: !s.isActive })}
                  title={s.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  style={actionBtn(C.yellow)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,230,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {s.isActive ? '⏸' : '▶'}
                </button>
                <button
                  onClick={() => remove(s.id)}
                  title="Hapus"
                  style={actionBtn(C.magenta)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,60,172,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SeasonPage