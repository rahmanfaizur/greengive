import * as React from 'react'

interface WelcomeEmailProps {
    firstName: string
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ firstName }) => (
    <div style={{ fontFamily: 'sans-serif', color: '#111827' }}>
        <h1 style={{ color: '#00D4AA' }}>Welcome to GreenGive, {firstName}! ⛳</h1>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
            Thank you for joining GreenGive. You're now part of a community that turns everyday golf rounds into meaningful charity donations.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
            To get started, make sure you log your first Stableford score on your dashboard.
        </p>
        <a href="https://greengive.com/dashboard" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#6C63FF',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginTop: '16px'
        }}>
            Go to Dashboard
        </a>
    </div>
)

export default WelcomeEmail
