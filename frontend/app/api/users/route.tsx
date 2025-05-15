import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const data_request = await request.json()
        const { email, password } = data_request

        const correo = email
        const contrasena = password

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 })
        }

        const response = await fetch('http://localhost:8082/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena }),
        })

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
        }

        const data_reponse = await response.json();
        
        return NextResponse.json(data_reponse, { status: 200 })
    } catch (error) {
        console.error('Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}