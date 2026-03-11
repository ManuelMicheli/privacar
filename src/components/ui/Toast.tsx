'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export { CustomToaster as Toaster }

export function CustomToaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '0.75rem',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          padding: '14px 18px',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#1A1A2E',
          background: '#fff',
        },
        success: {
          style: {
            borderLeft: '4px solid #10B981',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #DC2626',
          },
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
