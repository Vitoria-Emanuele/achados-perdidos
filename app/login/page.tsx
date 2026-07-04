'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setCarregando(false)

    if (error) {
      setErro('Não foi possível enviar o link. Confira o e-mail e tente novamente.')
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Verifique seu e-mail
        </h1>
        <p style={{ color: 'var(--color-slate)' }}>
          Enviamos um link de acesso para <strong>{email}</strong>. Clique nele para entrar.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        Entrar
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="seu-email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-md border"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <button
          type="submit"
          disabled={carregando}
          className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-azure)' }}
        >
          {carregando ? 'Enviando...' : 'Enviar link de acesso'}
        </button>

        {erro && <p className="text-sm" style={{ color: '#D14343' }}>{erro}</p>}
      </form>
    </div>
  )
}