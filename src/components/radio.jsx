import React from "react"

const Input = ({ label, value, name, checked, onChange }) => (
  <>
    <label className="radio inline">
      <input type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(name, e.target.value)}
      />
      <span> {label} </span>
    </label> {' '}
  </>
)

export default Input