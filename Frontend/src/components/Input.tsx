import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}


export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className="input-field" {...props} />
    </div>
  )
}
