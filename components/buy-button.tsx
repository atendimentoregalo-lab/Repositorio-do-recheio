"use client"

import { Button } from "@/components/ui/button"
import { useState, useCallback, lazy, Suspense } from "react"

const UpgradePopup = lazy(() =>
  import("./upgrade-popup").then((mod) => ({ default: mod.UpgradePopup }))
)

export function BuyButton() {
  const [showUpgradePopup, setShowUpgradePopup] = useState(false)

  const handleBuyClick = useCallback(() => {
    setShowUpgradePopup(true)
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLaiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrJ",
      )
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch {}
  }, [])

  return (
    <>
      <Button
        size="lg"
        onClick={handleBuyClick}
        className="w-full text-xl py-8 bg-red-600 hover:bg-red-700 text-white font-bold shadow-2xl rounded-xl transition-all hover:scale-105 border-4 border-red-700"
      >
        Garantir acesso agora
      </Button>
      {showUpgradePopup && (
        <Suspense fallback={null}>
          <UpgradePopup
            show={showUpgradePopup}
            onClose={() => setShowUpgradePopup(false)}
          />
        </Suspense>
      )}
    </>
  )
}

export function ScrollButton() {
  const scrollToOffer = useCallback(() => {
    document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <Button
      size="lg"
      onClick={scrollToOffer}
      className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xl rounded-lg transition-transform hover:scale-105"
    >
      Quero minhas receitas agora!
    </Button>
  )
}
