"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonialImages = [
  "https://i.imgur.com/pYkIAgc.jpeg",
  "https://i.imgur.com/zj4jWla.jpeg",
  "https://i.imgur.com/jIb4Xqt.jpeg",
  "https://i.imgur.com/TeojYYp.jpeg",
  "https://i.imgur.com/AdzBIQd.jpeg",
  "https://i.imgur.com/HLVLuum.jpeg",
  "https://i.imgur.com/XOYuNKC.jpeg",
  "https://i.imgur.com/O1SbkuK.jpeg",
  "https://i.imgur.com/FHluwBv.jpeg",
  "https://i.imgur.com/HroxIFg.jpeg",
  "https://i.imgur.com/H7D52DL.jpeg",
  "https://i.imgur.com/HBeHBz5.jpeg",
  "https://i.imgur.com/BeN6hpF.jpeg",
  "https://i.imgur.com/EmxKqhu.jpeg",
  "https://i.imgur.com/EigLMnT.jpeg",
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-rotate a cada 3 segundos
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === testimonialImages.length - 1 ? 0 : prev + 1
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialImages.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonialImages.length - 1 ? 0 : prev + 1
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext()
    }
    if (touchStart - touchEnd < -75) {
      handlePrev()
    }
  }

  const getVisibleIndices = () => {
    const indices = [currentIndex]
    const nextIndex = (currentIndex + 1) % testimonialImages.length
    indices.push(nextIndex)
    return indices
  }

  return (
    <section className="py-12 px-4" style={{ backgroundColor: "#fdf8f0" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            O que estao dizendo
          </h2>
          <p className="text-gray-600">Veja quem ja esta usando as receitas</p>
        </div>

        <div className="relative">
          {/* Seta esquerda */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>

          {/* Carrossel */}
          <div
            ref={carouselRef}
            className="overflow-hidden mx-8 sm:mx-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => {
              setIsPaused(true)
              handleTouchStart(e)
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              handleTouchEnd()
              setTimeout(() => setIsPaused(false), 1000)
            }}
          >
            {/* Mobile: 1 card */}
            <div className="flex gap-4 sm:hidden">
              <div
                key={currentIndex}
                className="w-full flex-shrink-0 transition-all duration-300 ease-in-out"
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <img
                    src={testimonialImages[currentIndex]}
                    alt={`Depoimento ${currentIndex + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Desktop: 2 cards */}
            <div className="hidden sm:flex gap-4">
              {getVisibleIndices().map((index) => (
                <div
                  key={index}
                  className="w-1/2 flex-shrink-0 transition-all duration-300 ease-in-out"
                >
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <img
                      src={testimonialImages[index]}
                      alt={`Depoimento ${index + 1}`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seta direita */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors"
            aria-label="Proximo"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonialImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-orange-500 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
