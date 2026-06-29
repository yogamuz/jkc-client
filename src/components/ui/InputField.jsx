const InputField = ({ label, type = 'text', value, onChange, placeholder }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ color: '#aaaacc', fontSize: '0.8rem' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          background: '#1a1a2e',
          border: '1px solid #333355',
          borderRadius: '10px',
          padding: '0.625rem 0.875rem',
          color: '#ffffff',
          fontSize: '0.9rem',
          outline: 'none',
        }}
      />
    </div>
  )
}

export default InputField