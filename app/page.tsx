import { Check, Shield } from "lucide-react"
import { BuyButton, ScrollButton } from "@/components/buy-button"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance leading-tight">
            Recheios simples que dão certo
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 mb-4 font-medium">
            {"Receitas fáceis, rápidas e baratas — acesso imediato"}
          </p>

          <p className="text-lg text-gray-600 mb-10">
            {"Mesmo se você estiver começando agora"}
          </p>

          <div className="flex justify-center gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="https://i.imgur.com/6vsyA6d.jpeg"
                  alt="Recheio de chocolate"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={112}
                  height={112}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Chocolate</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="https://i.imgur.com/ISLoVFH.png"
                  alt="Recheio de leite ninho"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={112}
                  height={112}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Leite Ninho</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="https://i.imgur.com/KbB9y0e.jpeg"
                  alt="Recheio de morango"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={112}
                  height={112}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Morango</p>
            </div>
          </div>

          <ScrollButton />
        </div>
      </section>

      {/* Beneficios */}
      <section id="offer" className="py-12 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 bg-white rounded-2xl p-8 shadow-md">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-800">Recheios com e sem fogo</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-800">Ingredientes comuns de mercado</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-800">Prontos em poucos minutos</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-800">{"Passo a passo fácil de seguir"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="py-10 px-4" style={{ backgroundColor: "#f5ede0" }}>
        <div className="max-w-sm mx-auto">
          <img
            src="https://i.imgur.com/jYfUYV7.jpeg"
            alt="Expert em confeitaria"
            className="w-full max-w-[320px] mx-auto rounded-2xl shadow-lg"
            loading="lazy"
            style={{ borderRadius: "16px" }}
          />
        </div>
      </section>

      {/* Prova de uso */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfeito para:</h2>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-orange-600 font-bold text-xl">{"•"}</span> bolos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-600 font-bold text-xl">{"•"}</span> bolo no pote
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-600 font-bold text-xl">{"•"}</span> sobremesas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-600 font-bold text-xl">{"•"}</span> quem vende ou quer começar
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            {"O que você recebe"}
          </h2>

          <div className="bg-white border-4 border-orange-300 rounded-2xl p-8 shadow-2xl mb-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-800">
                  {"Acesso imediato ao Guia Recheios Secretos "}
                  <span className="font-bold text-orange-600">(20 receitas)</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-800">Receitas simples e testadas</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-800">{"Uso liberado para vender"}</p>
              </div>
            </div>

            <div className="text-center mb-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl py-6">
              <div className="text-5xl font-bold text-orange-600 mb-2">{"R$ 1,99"}</div>
              <p className="text-gray-600 text-lg">{"pagamento único"}</p>
            </div>

            <BuyButton />
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <TestimonialsCarousel />

      {/* Garantia */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-3 bg-green-50 border-2 border-green-400 rounded-full px-6 py-4 shadow-md">
            <Shield className="h-8 w-8 text-green-600" />
            <p className="text-lg font-medium text-gray-800">
              {"Garantia de 7 dias. Se não gostar, devolvemos seu dinheiro."}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Perguntas frequentes
          </h2>

          <div className="space-y-6 bg-white rounded-2xl p-8 shadow-md">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recebo como?</h3>
              <p className="text-gray-700">
                {"No seu e-mail, logo após o pagamento ser confirmado."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Serve para iniciantes?
              </h3>
              <p className="text-gray-700">
                {"Sim. As receitas são simples e com passo a passo fácil."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Posso vender?</h3>
              <p className="text-gray-700">
                {"Sim. Você pode usar as receitas para vender suas sobremesas."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <section className="py-8 px-4 bg-white border-t">
        <div className="max-w-2xl mx-auto text-center">
          <a
            href="https://capable-froyo-8c85bb.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 6.988 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            {"Tirar dúvidas no WhatsApp"}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-white text-center border-t">
        <p className="text-sm text-gray-600">
          {"© 2025 Recheios Secretos. Todos os direitos reservados."}
        </p>
      </footer>
    </div>
  )
}
