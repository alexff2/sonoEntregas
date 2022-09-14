import React from 'react'

const styleStatus = [
  [
    { color: 'var(--blue-logo)' },
    { color: 'var(--green)' },
    { color: 'var(--orange)' },
    { color: 'var(--red)' },
    { color: 'var(--blue)' },
  ],
  [
    {
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--blue-logo)',
      textAlign: 'center'
    },
    {
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--green)',
      textAlign: 'center'
    },
    {
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--orange)',
      textAlign: 'center'
    },
    {
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--red)',
      textAlign: 'center'
    },
    {
      color: 'var(--text-inverse)',
      backgroundColor: 'var(--blue)',
      textAlign: 'center'
    }
  ]
]
export default function Status({ params }) {
  return (
    <div style={styleStatus[params.type][params.color]}>{params.status}</div>
  )
}