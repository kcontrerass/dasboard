import LayoutWrapper from '../components/LayoutWrapper'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-background-light text-gray-800 font-sans antialiased h-screen flex overflow-hidden selection:bg-blue-500 selection:text-white">
            <LayoutWrapper>{children}</LayoutWrapper>
        </div>
    )
}
