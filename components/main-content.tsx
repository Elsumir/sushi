"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search, Sliders, ArrowRight, Heart, Clock } from "lucide-react"
import ProductCard from "./product-card"

interface CartItem {
  id: number
  quantity: number
}

interface MainContentProps {
  onAddToCart: (product: any) => void
  onDecrementFromCart: (id: number) => void
  cartItems: CartItem[]
  favorites: number[]
  onToggleFavorite: (id: number) => void
  activeView: "menu" | "favorites" | "history"
}

const categoryOrder = ["Фирменные роллы", "Нигири & Сашими", "Сеты", "Поке"] as const

const products = [
  {
    id: 1,
    name: "Филадельфия Прайм",
    description: "Лосось, сливочный сыр, авокадо",
    price: 890,
    image: "/images/philadelphia-prime.jpg",
    badge: null,
    category: "Фирменные роллы",
  },
  {
    id: 2,
    name: "Дракон Унаги",
    description: "Угорь, рис, нори, унаги соус",
    price: 1150,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop",
    badge: "HOT",
    category: "Фирменные роллы",
  },
  {
    id: 6,
    name: "Каппа Маки",
    description: "Огурец, кунжут, рис",
    price: 250,
    image: "https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=800&auto=format&fit=crop",
    category: "Фирменные роллы",
  },
  {
    id: 3,
    name: "Магуро Нигири",
    description: "Тунец Yellowfin, рис",
    price: 320,
    image: "/images/maguro-nigiri.jpg",
    category: "Нигири & Сашими",
  },
  {
    id: 5,
    name: "Сашими Микс",
    description: "Лосось, тунец, гребешок",
    price: 1450,
    image: "https://images.unsplash.com/photo-1558985250-27a406d64cb3?q=80&w=800&auto=format&fit=crop",
    category: "Нигири & Сашими",
  },
  {
    id: 10,
    name: "Эби Нигири",
    description: "Креветка тигровая, рис",
    price: 280,
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=800&auto=format&fit=crop",
    category: "Нигири & Сашими",
  },
  {
    id: 4,
    name: "Сезон Сакуры Сет",
    description: "Лосось, тунец, гребешок, трюфельный соус",
    price: 2850,
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=800&auto=format&fit=crop",
    category: "Сеты",
  },
  {
    id: 9,
    name: "Омакасе Сет",
    description: "12 шт от шеф-повара",
    price: 3200,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=800&auto=format&fit=crop",
    category: "Сеты",
  },
  {
    id: 7,
    name: "Поке с лососем",
    description: "Лосось, рис, эдамаме, авокадо",
    price: 750,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    category: "Поке",
  },
  {
    id: 8,
    name: "Поке с тунцом",
    description: "Тунец, манго, огурец, кунжут",
    price: 820,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop",
    category: "Поке",
  },
]

// Group products by category in order
const groupedProducts = categoryOrder.map((cat) => ({
  category: cat,
  items: products.filter((p) => p.category === cat),
}))

export default function MainContent({ onAddToCart, onDecrementFromCart, cartItems, favorites, onToggleFavorite, activeView }: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0])
  const [isUserClick, setIsUserClick] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const categoryTabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Touch/mouse drag for category tabs
  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  const handlePointerDown = (e: React.PointerEvent) => {
    // Не обрабатываем события на кнопках - они должны обрабатывать клики сами
    if ((e.target as HTMLElement).tagName === 'BUTTON') return
    
    const container = categoryTabsRef.current
    if (!container) return
    isDragging.current = true
    hasDragged.current = false
    dragStartX.current = e.clientX
    scrollStartX.current = container.scrollLeft
    container.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const container = categoryTabsRef.current
    if (!container) return
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 5) hasDragged.current = true
    container.scrollLeft = scrollStartX.current - dx
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragging = isDragging.current
    isDragging.current = false
    const container = categoryTabsRef.current
    if (container) {
      container.releasePointerCapture(e.pointerId)
    }
    // Если не было реального drag (движения больше 5px), сбрасываем флаг сразу
    if (wasDragging && !hasDragged.current) {
      hasDragged.current = false
    }
  }

  const filteredGroups = groupedProducts
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (product) =>
          searchQuery === "" ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0)

  // Scroll active tab into view in the slider
  const scrollTabIntoView = useCallback((category: string) => {
    const tab = tabRefs.current[category]
    const container = categoryTabsRef.current
    if (!tab || !container) return

    const tabLeft = tab.offsetLeft
    const tabWidth = tab.offsetWidth
    const containerWidth = container.offsetWidth
    const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2

    container.scrollTo({ left: scrollLeft, behavior: "smooth" })
  }, [])

  // IntersectionObserver to detect which section is visible
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserClick) return

        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const topCategory = visible[0].target.getAttribute("data-category")
          if (topCategory && topCategory !== activeCategory) {
            setActiveCategory(topCategory)
            scrollTabIntoView(topCategory)
          }
        }
      },
      {
        root: container,
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [filteredGroups, isUserClick, activeCategory, scrollTabIntoView])

  // Handle category click - scroll to section
  const handleCategoryClick = (category: string, e?: React.MouseEvent) => {
    // Если был drag, не обрабатываем клик
    if (hasDragged.current) {
      hasDragged.current = false // Сбрасываем флаг
      return
    }
    setActiveCategory(category)
    setIsUserClick(true)
    scrollTabIntoView(category)

    const section = sectionRefs.current[category]
    const container = scrollContainerRef.current
    if (section && container) {
      const topOffset = section.offsetTop - container.offsetTop
      container.scrollTo({ top: topOffset, behavior: "smooth" })
    }

    // Re-enable observer after scroll finishes
    setTimeout(() => setIsUserClick(false), 800)
  }

  // Обработчик для предотвращения всплытия событий от кнопок
  const handleButtonPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation() // Останавливаем всплытие, чтобы контейнер не обрабатывал событие
    // Сбрасываем флаг drag при клике на кнопку
    hasDragged.current = false
    isDragging.current = false
  }

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation() // Останавливаем всплытие для мыши
    hasDragged.current = false
    isDragging.current = false
  }

  const favoriteProducts = products.filter((p) => favorites.includes(p.id))

  // Favorites view
  if (activeView === "favorites") {
    return (
      <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0">
        <div className="p-6 md:p-8 pb-0 z-20 bg-zinc-950/95 backdrop-blur">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-1">Избранное</h1>
              <p className="text-sm text-zinc-500">
                {favoriteProducts.length > 0
                  ? `${favoriteProducts.length} ${favoriteProducts.length === 1 ? "товар" : favoriteProducts.length < 5 ? "товара" : "товаров"} в избранном`
                  : "Здесь пока пусто"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pt-4">
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onDecrement={onDecrementFromCart}
                  quantity={cartItems.find((item) => item.id === product.id)?.quantity || 0}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <Heart className="w-12 h-12 mb-4 text-zinc-700" />
              <p className="text-lg font-medium text-zinc-400">Нет избранных товаров</p>
              <p className="text-sm mt-1 text-zinc-600">Нажмите на сердечко, чтобы добавить товар в избранное</p>
            </div>
          )}
        </div>
      </main>
    )
  }

  // History view
  if (activeView === "history") {
    return (
      <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0">
        <div className="p-6 md:p-8 pb-0 z-20 bg-zinc-950/95 backdrop-blur">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-1">История</h1>
            <p className="text-sm text-zinc-500">Ваши прошлые заказы</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pt-4">
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <Clock className="w-12 h-12 mb-4 text-zinc-700" />
            <p className="text-lg font-medium text-zinc-400">История заказов пуста</p>
            <p className="text-sm mt-1 text-zinc-600">Здесь будут отображаться ваши прошлые заказы</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0">
      {/* Search & Filter Header */}
      <div className="p-6 md:p-8 pb-0 z-20 bg-zinc-950/95 backdrop-blur">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-1">
              <span className="text-zinc-500">Александр</span>
            </h1>
            <p className="text-sm text-zinc-500">Что будем заказывать сегодня?</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Поиск роллов, суши..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-transparent focus:border-zinc-700 text-sm text-white rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Category Tabs Slider */}
        <div
          ref={categoryTabsRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-4 scroll-smooth cursor-grab active:cursor-grabbing touch-pan-x select-none"
        >
          {categoryOrder.map((category) => (
            <button
              key={category}
              ref={(el) => { tabRefs.current[category] = el }}
              onPointerDown={handleButtonPointerDown}
              onMouseDown={handleButtonMouseDown}
              onClick={() => handleCategoryClick(category)}
              className={`relative whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                category === activeCategory
                  ? "bg-white text-zinc-950"
                  : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Menu Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pt-4">
        {/* Featured Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-10 group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2000&auto=format&fit=crop"
            alt="Sushi Set"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-lg">
            <span className="inline-block px-2 py-1 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded mb-3 border border-rose-500/20">
              НОВИНКА
            </span>
            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-2">Сезон Сакуры</h2>
            <p className="text-zinc-300 text-sm mb-6 line-clamp-2">
              Эксклюзивный сет от шефа: свежайший лосось, тунец Bluefin и нежный гребешок с трюфельным соусом.
            </p>
            <button className="px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">
              Заказать сет
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products by Category */}
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <section
              key={group.category}
              ref={(el) => { sectionRefs.current[group.category] = el }}
              data-category={group.category}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white tracking-tight">{group.category}</h3>
                <button className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
                  Фильтры <Sliders className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onDecrement={onDecrementFromCart}
                    quantity={cartItems.find((item) => item.id === product.id)?.quantity || 0}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <Search className="w-10 h-10 mb-4 text-zinc-700" />
            <p className="text-lg font-medium text-zinc-400">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте другой поисковый запрос</p>
          </div>
        )}
      </div>
    </main>
  )
}
