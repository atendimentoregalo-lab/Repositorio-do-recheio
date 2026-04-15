"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export function UpgradePopup({
  show,
  onClose,
}: {
  show: boolean
  onClose: () => void
}) {
  const [countdown, setCountdown] = useState(450)

  useEffect(() => {
    if (!show) return
    
    // Meta Pixel - ViewContent quando popup abre
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Recheios Secretos Premium',
        content_ids: ['recheios-premium'],
        content_type: 'product',
        value: 7.99,
        currency: 'BRL'
      });
    }
    
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [show])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleUpgradeAccept = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Recheios Secretos Premium',
        value: 7.99,
        currency: 'BRL'
      });
    }
    window.location.href = 'https://www.ggcheckout.com/checkout/v2/nc956KkPYmK5E5JTLhAG'
  }

  const handleUpgradeDecline = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Recheios Secretos Basico',
        value: 1.99,
        currency: 'BRL'
      });
    }
    window.location.href = 'https://www.ggcheckout.com/checkout/v2/O4PSYnUIBTKXuBQ3Odnn'
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-white via-orange-50 to-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300 border-4 border-orange-300">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
          <button
            onClick={handleUpgradeDecline}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 bg-black/20 rounded-full p-2 hover:bg-black/30"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative z-10 text-center">
            <div className="text-6xl mb-3 animate-bounce">{"🤯"}</div>
            <h2 className="text-3xl font-black mb-2 drop-shadow-lg">ESPERA!</h2>
            <p className="text-xl font-bold mb-3">
              {"Você está prestes a perder isso..."}
            </p>

            <div className="bg-black/30 backdrop-blur-md text-white py-4 px-6 rounded-xl inline-flex items-center gap-3 font-bold border-2 border-white/30 animate-pulse">
              <Clock className="h-6 w-6" />
              <div>
                <div className="text-xs uppercase tracking-wider mb-1">
                  Oferta expira em
                </div>
                <div className="text-3xl font-black tabular-nums">
                  {formatTime(countdown)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6 mx-auto max-w-xs">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-300">
              <div style={{ aspectRatio: "9/16" }}>
                <iframe
                  src="https://drive.google.com/file/d/1wli1AE0uLSPqqhU4csnrLEcy-_8ZuxsA/preview"
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                  loading="lazy"
                  title="Video de apresentacao"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-gray-900 mb-3">
              {"Imagine ter acesso a "}
              <span className="text-orange-600 text-3xl">250 receitas</span>
              {" em vez de apenas 20..."}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              {"Por menos de "}
              <span className="font-bold">{"R$ 0,03 por receita"}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {"BÁSICO"}
              </div>
              <div className="text-center pt-2">
                <div className="text-3xl font-bold text-gray-600 mb-2">20</div>
                <div className="text-sm text-gray-600">receitas</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 border-4 border-orange-500 rounded-xl p-4 relative shadow-xl transform scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                PREMIUM
              </div>
              <div className="text-center pt-2">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  +250
                </div>
                <div className="text-sm text-orange-700 font-semibold">
                  {"receitas + bônus"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white rounded-2xl p-8 mb-6 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="text-sm font-bold mb-2 line-through opacity-80">
                {"De R$ 47,00"}
              </div>
              <div className="text-6xl font-black mb-2 drop-shadow-xl">
                {"R$ 7,99"}
              </div>
              <div className="text-lg font-bold bg-black/20 inline-block px-4 py-2 rounded-full">
                {"🔥 Apenas nesta tela"}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-300 shadow-lg">
            <div className="text-center mb-4">
              <p className="text-xl font-bold text-gray-900">
                {"🎁 Tudo que você vai receber:"}
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "100 Receitas de Recheios Secretos",
                  desc: "50 com fogo + 50 sem fogo",
                },
                {
                  title: "50 Receitas de Lanches",
                  desc: "Para variar seu cardápio",
                },
                {
                  title: "50 Receitas de Sobremesas",
                  desc: "Deixe seus clientes encantados",
                },
                {
                  title: "20 Receitas de Caldas",
                  desc: "Finalize suas criações",
                },
                {
                  title: "20 Receitas de Tortas",
                  desc: "Amplie suas vendas",
                },
                {
                  title: "Suporte via WhatsApp",
                  desc: "Tire dúvidas direto comigo",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm"
                >
                  <div className="bg-orange-500 rounded-full p-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleUpgradeAccept}
              className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-base sm:text-lg md:text-xl py-5 sm:py-6 md:py-8 rounded-2xl shadow-2xl transition-all hover:scale-105 border-4 border-green-700 relative overflow-hidden group"
            >
              <span className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2">
                <span className="text-center leading-tight text-sm sm:text-base md:text-xl">
                  {"✅ SIM! Quero +250 receitas por R$ 7,99"}
                </span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
            </Button>

            <button
              onClick={handleUpgradeDecline}
              type="button"
              className="w-full bg-white border-3 border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 font-bold py-4 px-4 rounded-xl text-sm sm:text-base transition-all shadow-lg"
            >
              {"Não, prefiro continuar só as receitas básicas por R$ 1,99"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
