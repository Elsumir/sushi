"use client"

import { useState, useEffect } from "react"
import MobileHeader from "@/components/mobile-header"
import DesktopSidebar from "@/components/desktop-sidebar"
import MainContent from "@/components/main-content"
import CartSidebar from "@/components/cart-sidebar"
import MobileSidebar from "@/components/mobile-sidebar"

const SECTION_MENU = "menu"
const SECTION_CART = "cart"
const SECTION_HISTORY = "history"

function getInitialSection(): typeof SECTION_MENU | typeof SECTION_CART | typeof SECTION_HISTORY {
  if (typeof window === "undefined") return SECTION_MENU
  const params = new URLSearchParams(window.location.search)
  const section = (params.get("section") ?? "").toLowerCase()
  if (section === SECTION_CART || section === SECTION_HISTORY) return section
  return SECTION_MENU
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeView, setActiveView] = useState<"menu" | "favorites" | "history">("menu")

  useEffect(() => {
    const section = getInitialSection()
    if (section === SECTION_CART) setCartOpen(true)
    if (section === SECTION_HISTORY) setActiveView("history")
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Филадельфия Прайм",
      price: 890,
      image:
        "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Дракон Унаги",
      price: 1150,
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop",
      quantity: 1,
    },
  ])

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const decrementFromCart = (id: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing && existing.quantity <= 1) {
        return prev.filter((item) => item.id !== id)
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={() => setSidebarOpen(true)}
        onCartClick={() => setCartOpen(true)}
        itemCount={cartItems.length}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onChangeView={(view: "menu" | "favorites" | "history") => {
          setActiveView(view)
          setSidebarOpen(false)
        }}
      />

      <DesktopSidebar
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main Content - flexible center area */}
      <MainContent
        onAddToCart={addToCart}
        onDecrementFromCart={decrementFromCart}
        cartItems={cartItems}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        activeView={activeView}
      />

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      {cartOpen && <div className="fixed inset-0 z-40 bg-black/50 xl:hidden" onClick={() => setCartOpen(false)} />}
    </div>
  )
}
