'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

type Etapa = 'email' | 'senha-coordenacao' | 'mfa' | 'link-enviado'

export default function LoginPage() {
  const [etapa, setEtapa] = useState<Etapa>('email')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [codigoMfa, setCodigoMfa] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    const { data: role } = await supabase.rpc('get_role_by_email', { email_input: email })

    if (role === 'coordenacao') {
      setEtapa('senha-coordenacao')
      setCarregando(false)
      return
    }

    // Aluno (ou e-mail novo, nunca visto antes): segue por link mágico
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setCarregando(false)
    if (error) {
      setErro('Não foi possível enviar o link. Confira o e-mail e tente novamente.')
      return
    }
    setEtapa('link-enviado')
  }

  async function handleSenhaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setCarregando(false)
      setErro('E-mail ou senha incorretos.')
      return
    }

    // Verifica se essa conta precisa do segundo fator (MFA)
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    setCarregando(false)

    if (aal?.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
      setEtapa('mfa')
      return
    }

    window.location.href = '/'
  }

  async function handleMfaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    const { data: fatores } = await supabase.auth.mfa.listFactors()
    const fator = fatores?.totp?.[0]

    if (!fator) {
      setErro('Nenhum segundo fator configurado nessa conta.')
      setCarregando(false)
      return
    }

    const { data: desafio, error: erroDesafio } = await supabase.auth.mfa.challenge({ factorId: fator.id })
    if (erroDesafio || !desafio) {
      setErro('Não foi possível iniciar a verificação. Tente novamente.')
      setCarregando(false)
      return
    }

    const { error: erroVerificacao } = await supabase.auth.mfa.verify({
      factorId: fator.id,
      challengeId: desafio.id,
      code: codigoMfa,
    })

    setCarregando(false)

    if (erroVerificacao) {
      setErro('Código incorreto. Tente novamente.')
      return
    }

    window.location.href = '/'
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        Entrar
      </h1>

      {etapa === 'email' && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="seu-email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button type="submit" disabled={carregando} className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60" style={{ backgroundColor: 'var(--color-azure)' }}>
            {carregando ? 'Verificando...' : 'Continuar'}
          </button>
        </form>
      )}

      {etapa === 'senha-coordenacao' && (
        <form onSubmit={handleSenhaSubmit} className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: 'var(--color-slate)' }}>Conta da coordenação — informe sua senha.</p>
          <input
            type="password"
            required
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button type="submit" disabled={carregando} className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60" style={{ backgroundColor: 'var(--color-azure)' }}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      )}

      {etapa === 'mfa' && (
        <form onSubmit={handleMfaSubmit} className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: 'var(--color-slate)' }}>
            Digite o código do seu aplicativo autenticador.
          </p>
          <input
            type="text"
            required
            placeholder="000000"
            value={codigoMfa}
            onChange={(e) => setCodigoMfa(e.target.value)}
            className="px-4 py-2 rounded-md border"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button type="submit" disabled={carregando} className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-60" style={{ backgroundColor: 'var(--color-azure)' }}>
            {carregando ? 'Verificando...' : 'Confirmar'}
          </button>
        </form>
      )}

      {etapa === 'link-enviado' && (
        <p style={{ color: 'var(--color-slate)' }}>
          Enviamos um link de acesso para <strong>{email}</strong>. Clique nele para entrar.
        </p>
      )}

      {erro && <p className="text-sm mt-4" style={{ color: '#D14343' }}>{erro}</p>}
    </div>
  )
}