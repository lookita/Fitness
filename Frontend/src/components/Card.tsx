import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
}

export default function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.75rem' }}>{title}</h1>}
      {children}
    </div>
  )
}
