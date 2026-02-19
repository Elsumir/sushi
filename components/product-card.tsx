"use client"

import { Plus, Minus, Heart } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  badge?: string | null
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onDecrement: (id: number) => void
  quantity: number
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export default function ProductCard({ product, onAddToCart, onDecrement, quantity, isFavorite, onToggleFavorite }: ProductCardProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 hover:border-zinc-700 transition-all group">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-zinc-800">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isFavorite
              ? "bg-rose-500 text-white"
              : "bg-zinc-950/60 backdrop-blur text-white/70 hover:text-white hover:bg-zinc-950/80"
          }`}
          aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        >
          <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-current" : ""}`} />
        </button>
        {product.badge && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {product.badge}
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-white font-medium text-lg tracking-tight">{product.name}</h4>
          <p className="text-zinc-500 text-xs mt-1">{product.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-white font-medium">{product.price} &#8381;</span>

        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrement(product.id)}
              className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
              aria-label="Уменьшить количество"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-white text-sm font-medium w-5 text-center tabular-nums">{quantity}</span>
            <button
              onClick={() => onAddToCart(product)}
              className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 transition-colors"
              aria-label="Увеличить количество"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            aria-label="Добавить в корзину"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
