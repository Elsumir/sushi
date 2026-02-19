"use client"

import { Menu, ShoppingBag } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick: () => void
  onCartClick: () => void
  itemCount: number
}

export default function MobileHeader({ onMenuClick, onCartClick, itemCount }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md z-50">
      <button onClick={onMenuClick} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
        <Menu className="w-6 h-6 text-zinc-300" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-950">
          <span className="text-lg font-bold">🌸</span>
        </div>
        <span className="text-lg font-medium tracking-tight text-white">SAKURA</span>
      </div>

      <button onClick={onCartClick} className="relative p-2 hover:bg-zinc-900 rounded-lg transition-colors">
        <ShoppingBag className="w-6 h-6 text-zinc-300" />
        {itemCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
      </button>
    </header>
  )
}
