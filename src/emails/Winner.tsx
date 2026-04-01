import * as React from 'react'

interface WinnerEmailProps {
    firstName: string
    prizeTier: string
    prizeAmount: number
    drawMonth: string
}

export const WinnerEmail: React.FC<Readonly<WinnerEmailProps>> = ({
    firstName,
    prizeTier,
    prizeAmount,
    drawMonth
}) => (
    <div style={{ fontFamily: 'sans-serif', color: '#111827' }}>
        <h1 style={{ color: '#6C63FF' }}>You're a winner, {firstName}! 🏆</h1>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
            Congratulations! Your numbers matched the <strong>{prizeTier}</strong> tier for the <strong>{drawMonth}</strong> draw!
        </p>
        <div style={{
            backgroundColor: '#f3f4f6',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            margin: '24px 0'
        }}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Estimated Prize
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                £{prizeAmount.toFixed(2)}
            </p>
        </div>
        <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#ef4444', fontWeight: 'bold' }}>Action Required:</p>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
            To claim your prize, please click the link below and securely upload your scorecard or app tracking proof for admin verification.
        </p>
        <a href="https://greengive.com/dashboard" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#00D4AA',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginTop: '16px'
        }}>
            Verify Proof
        </a>
    </div>
)

export default WinnerEmail
