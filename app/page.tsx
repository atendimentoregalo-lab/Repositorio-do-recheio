import { Check, Shield } from "lucide-react"
import Image from "next/image"

const learningCards = [
  { image: "/learning-fillings.jpg", caption: "Recheios secretos — com e sem fogão" },
  { image: "/learning-ingredients.jpg", caption: "Ingredientes simples" },
  { image: "/learning-quick.jpg", caption: "Prontos em poucos minutos" },
  { image: "/learning-step-by-step.png", caption: "Passo a passo fácil de seguir" },
]

const completeBenefits = [
  "100 receitas dos meus Recheios Secretos",
  "Suporte exclusivo no WhatsApp comigo",
  "Grupo secreto com receitas todos os dias",
  "Certificado do meu curso",
]

const gifts = [
  "50 Receitas de Lanches",
  "50 Receitas de Sobremesas",
  "20 Receitas de Caldas",
  "20 Receitas de Tortas",
]

export default function SalesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7efe3] text-[#321b13]">
      <section className="relative px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center lg:text-left">
              <h1 className="mx-auto max-w-3xl font-serif text-4xl font-black leading-[1.08] tracking-tight text-[#321b13] sm:text-5xl lg:mx-0 lg:text-6xl">
                Lembra do recheio mais gostoso que você já comeu na vida?
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#654b3f] sm:text-xl lg:mx-0">
                Imagine poder fazer sempre um recheio cremoso, gostoso e consistente — e ouvir todos aqueles elogios.
              </p>
              <p className="mx-auto mt-5 inline-block rounded-md bg-[#a82725] px-4 py-3 text-base font-extrabold text-white shadow-lg sm:text-lg lg:mx-0">
                Isso é mais simples do que você pensa.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-[#c48a51]/20" aria-hidden="true" />
              <div className="relative rotate-1 overflow-hidden rounded-[1.7rem] border-[10px] border-[#fffaf2] bg-[#fffaf2] shadow-[0_28px_70px_rgba(65,35,20,0.22)]">
                <Image
                  src="/clara-filling.jpg"
                  alt="Clara apresentando um pote de recheio cremoso"
                  width={900}
                  height={1100}
                  priority
                  sizes="(max-width: 1024px) 90vw, 36vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-2 rounded-xl bg-[#fffaf2] px-5 py-3 font-serif text-sm font-bold text-[#754126] shadow-xl sm:left-0">
                Meu segredo revelado
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <span className="text-lg font-semibold text-[#8c7667] line-through">De R$ 67</span>
              <span className="font-serif text-4xl font-black text-[#a82725] sm:text-5xl">por R$ 1,99</span>
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href="#offer"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#a82725] px-8 py-4 text-lg font-black text-white shadow-lg transition hover:bg-[#bd302d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#321b13]"
              >
                EU QUERO
              </a>
            </div>
            <p className="mt-3 text-sm text-[#806c5d]">Pagamento único • acesso enviado após a confirmação</p>
          </div>
        </div>
      </section>

      <section className="bg-[#321b13] px-5 py-16 text-[#fff8ec] sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4b56e]">Por dentro do guia</p>
            <h2 className="mt-3 font-serif text-3xl font-black sm:text-4xl">O que você vai aprender?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningCards.map((card, index) => (
              <figure key={card.image} className="mx-auto w-full max-w-[300px] rotate-[-1deg] bg-[#fffaf2] p-3 pb-5 shadow-[0_16px_38px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0">
                <Image
                  src={card.image}
                  alt={card.caption}
                  width={600}
                  height={700}
                  loading="lazy"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 42vw, 22vw"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="px-2 pt-4 text-center font-serif text-base font-bold text-[#4b2b1c]">
                  {card.caption}
                </figcaption>
                <span className="sr-only">Imagem {index + 1} de 4</span>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-[#ead7ba] bg-[#fffaf2] p-6 shadow-[0_20px_60px_rgba(74,42,25,0.08)] sm:p-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a45632]">Receitas para o seu dia a dia</p>
            <h2 className="mt-3 font-serif text-3xl font-black text-[#321b13] sm:text-4xl">Perfeito para</h2>
            <p className="mt-4 leading-relaxed text-[#654b3f]">
              Bolos, bolos no pote, tortas e sobremesas — e para quem já vende ou quer começar a vender.
            </p>
          </div>
          <div className="rounded-3xl border border-[#d8e8d9] bg-[#e9f4e9] p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/clara-avatar.jpeg"
                alt="Clara Aureliano"
                width={56}
                height={56}
                loading="lazy"
                sizes="56px"
                className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <div>
                <p className="font-semibold text-[#283b2d]">Clara Aureliano</p>
                <p className="text-xs text-[#607663]">Mensagem de voz</p>
              </div>
              <span className="ml-auto text-xs text-[#607663]" aria-hidden="true">áudio</span>
            </div>
            <div className="rounded-2xl bg-[#f7fbf6] p-3 sm:p-4">
              <audio className="h-11 w-full accent-[#168c55]" controls preload="metadata" aria-label="Áudio da Clara sobre as receitas">
                <source src="/clara-audio.ogg" type="audio/ogg" />
                Seu navegador não suporta reprodução de áudio.
              </audio>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#435b46]">
              “Nossas receitas são perfeitas para bolos, bolos no pote, tortas, sobremesas e pra quem vende ou quer começar a vender.”
            </p>
          </div>
        </div>
      </section>

      <section id="offer" className="scroll-mt-6 bg-[#eee0cc] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a45632]">Seu próximo passo</p>
            <h2 className="mt-3 font-serif text-3xl font-black leading-tight text-[#321b13] sm:text-5xl">
              Esse é o próximo passo para o recheio mais gostoso da sua vida.
            </h2>
            <p className="mt-4 text-lg text-[#654b3f]">Escolha o acesso ideal para você.</p>
          </div>

          <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-[0.82fr_1.18fr]">
            <article className="order-2 flex flex-col rounded-3xl border border-[#d9c8b1] bg-[#fffaf2] p-6 shadow-lg sm:p-8 md:order-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a765e]">Acesso essencial</p>
              <h3 className="mt-2 font-serif text-2xl font-black text-[#321b13]">Plano Básico</h3>
              <p className="mt-5 font-serif text-4xl font-black text-[#8b4b2b]">R$ 1,99</p>
              <p className="mt-1 text-sm text-[#806c5d]">pagamento único</p>
              <ul className="my-7 flex-1 space-y-4 text-[#50392d]">
                <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 flex-none text-[#a45632]" />20 receitas de recheios</li>
              </ul>
              <a href="https://ggcheckout.app/checkout/v2/PNAubEWNug7yQunsDyWO3X" className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#a45632] px-5 py-3 text-center font-bold text-[#8b4b2b] transition hover:bg-[#f5eadb]">
                Quero o básico
              </a>
            </article>

            <article className="relative order-1 flex flex-col rounded-3xl border-2 border-[#dfaaa9] bg-gradient-to-br from-[#fff9f6] via-[#fff0ed] to-[#f9dfdc] p-6 text-[#3b201c] shadow-[0_24px_70px_rgba(133,55,51,0.16)] sm:p-8 md:order-2">
              <div className="mb-5 flex justify-center">
                <span className="inline-flex items-center rounded-full bg-[#a82725] px-5 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-md sm:text-base">
                  Mais escolhido
                </span>
              </div>
              <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#9a4d4a]">Tudo em um só acesso</p>
              <h3 className="mt-2 text-center font-serif text-3xl font-black text-[#3b201c] sm:text-4xl">Plano Completo</h3>
              <p className="mx-auto mt-3 max-w-md text-center text-base leading-relaxed text-[#75524c]">
                Mais receitas, presentes especiais e suporte para acompanhar você.
              </p>
              <ul className="mt-7 space-y-4 text-base leading-relaxed text-[#49322e] sm:text-lg">
                {completeBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3"><Check className="mt-0.5 h-6 w-6 flex-none text-[#b24d58]" />{benefit}</li>
                ))}
              </ul>
              <div className="my-7 rounded-2xl border border-[#e7c7c2] bg-white/75 p-5 sm:p-6">
                <p className="text-center text-base font-extrabold text-[#8c3d43] sm:text-lg">E ainda leva estes presentes:</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {gifts.map((gift) => <li key={gift} className="flex gap-2 text-sm font-medium text-[#583b36] sm:text-base"><span className="font-black text-[#b24d58]">+</span>{gift}</li>)}
                </ul>
              </div>
              <div className="mb-5 flex items-end justify-center gap-3">
                <span className="pb-1 text-base text-[#92716b] line-through">De R$ 127</span>
                <span className="font-serif text-5xl font-black text-[#9a3944] sm:text-6xl">R$ 9,27</span>
              </div>
              <a href="https://ggcheckout.app/checkout/v2/si3AocmqeWzMShfoQl2nhZ" className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#168c55] px-5 py-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-[#117647] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#321b13]">
                EU QUERO!
              </a>
              <p className="mt-3 text-center text-sm text-[#75524c]">Garantia de 14 dias sobre sua compra</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-serif text-3xl font-black text-[#321b13] sm:text-4xl">Perguntas frequentes</h2>
          <div className="divide-y divide-[#ead7ba] overflow-hidden rounded-2xl border border-[#ead7ba] bg-[#fffaf2] px-6 shadow-sm sm:px-8">
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-6 font-bold text-[#321b13] marker:hidden">Recebo como?</summary>
              <p className="mt-3 leading-relaxed text-[#654b3f]">No seu e-mail, logo após o pagamento ser confirmado.</p>
            </details>
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-6 font-bold text-[#321b13] marker:hidden">Serve para iniciantes?</summary>
              <p className="mt-3 leading-relaxed text-[#654b3f]">Sim. As receitas são simples e com passo a passo fácil.</p>
            </details>
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-6 font-bold text-[#321b13] marker:hidden">Posso vender?</summary>
              <p className="mt-3 leading-relaxed text-[#654b3f]">Sim. Você pode usar as receitas para vender suas sobremesas.</p>
            </details>
          </div>
          <div className="mt-8 text-center">
            <a href="https://wa.me/5587921449947?text=Ol%C3%A1%2C%20tenho%20d%C3%BAvidas%20sobre%20os%20Recheios%20Secretos%2C%20e%20preciso%20de%20Ajuda!" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#168c55] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-[#117647]">
              Tirar dúvidas no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ead7ba] bg-[#fffaf2] px-5 py-10 text-center">
        <p className="text-base font-semibold text-[#51382b]">Jesus Cristo é o mesmo ontem, hoje e para sempre.</p>
        <p className="mt-1 text-sm italic text-[#806c5d]">— Hebreus 13:8</p>
        <p className="mt-6 text-xs text-[#9a8879]">© 2027 KF Empreendimentos Digitais. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}
