import './globals.css'

export const metadata = {
    title: 'Student Management System',
    description: 'Modern student management system built with Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    )
}