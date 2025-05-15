import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DashboardLayout from "@/components/DashboardLayout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Dashboard Administración",
    description: "Sistema de Gestión Administrativa de Farmacias",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <DashboardLayout>
                    {children}
                </DashboardLayout>

            </body>
        </html>
    );
}