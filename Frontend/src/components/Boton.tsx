import React from 'react'

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function Boton({ children, ...props }: BotonProps) {
  return (
    <button className="btn-volt" {...props}>
      {children}
    </button>
  )
}
