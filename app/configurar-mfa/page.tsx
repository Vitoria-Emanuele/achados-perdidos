'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ConfigurarMfaPage() {
  const [qrCode, setQrCode] = useState('')
  const [factorId, setFactorId] = useState('')
  const [codigo, setCodigo] = useState('')
  const [concluido, setConcluido] = useState(false)
  const [erro, setErro] = useState('')

  async function iniciarConfiguracao() {
    setErro('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })

    if (error || !data) {
      setErro('Não foi possível iniciar a configuração.')
      return
    }

    setQrCode(data.totp.qr_code)
    setFactorId(data.id)
  }

  async function confirmarCodigo(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    const supabase = createClient()

    const { data: desafio } = await supabase.auth.mfa.challenge({ factorId })
    if (!desafio) {
      setErro('Erro ao iniciar verificação.')
      return
    }

    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: desafio.id,
      code: codigo,
    })

    if (error) {
      setErro('Código incorreto. Confira o app autenticador e tente de novo.')
      return
    }

    setConcluido(true)
  }

  if (concluido) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
          Segundo fator configurado!
        </h1>
        <p style={{ color: 'var(--color-slate)' }}>A partir de agora, o login vai pedir esse código.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--color-navy)' }}>
        Configurar segundo fator (MFA)
      </h1>

      {!qrCode && (
        <button onClick={iniciarConfiguracao} className="px-4 py-2 rounded-md text-white font-medium" style={{ backgroundColor: 'var(--color-azure)' }}>
          Gerar QR Code
        </button>
      )}

      {qrCode && (
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: 'var(--color-slate)' }}>
            Escaneie com o Google Authenticator (ou similar) e digite o código gerado.
          </p>
          <div dangerouslySetInnerHTML={{ __html: qrCode }} />
          <form onSubmit={confirmarCodigo} className="flex flex-col gap-3">
            <input
              type="text"
              required
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="px-4 py-2 rounded-md border"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <button type="submit" className="px-4 py-2 rounded-md text-white font-medium" style={{ backgroundColor: 'var(--color-azure)' }}>
              Confirmar
            </button>
          </form>
        </div>
      )}

      {erro && <p className="text-sm" style={{ color: '#D14343' }}>{erro}</p>}
    </div>
  )
}