import React from "react"

const Input = ({ value, name, type, placeholder, onChange }) => {

  return (
    <div className="form-group">
      <input type={type}
        className="form-control"
        value={value || ''}
        placeholder={placeholder}
        name={name}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  )
}

export default React.memo(Input)