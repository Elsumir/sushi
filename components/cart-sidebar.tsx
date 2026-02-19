"use client"

import { X, MapPin, ChevronRight, Trash2, Minus, Plus } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
}

export default function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = total > 0 ? 150 : 0
  const finalTotal = total + deliveryFee

  return (
    <>
      {/* Desktop Cart Sidebar */}
      <aside className="hidden xl:flex flex-col w-96 border-l border-zinc-900 bg-zinc-950 p-6 z-30">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-white tracking-tight">Мой заказ</h2>
          <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">ID: #4921</span>
        </div>

        {/* Address Selection */}
        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 mb-6 cursor-pointer hover:border-zinc-600 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg text-rose-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Дом</p>
                <p className="text-zinc-500 text-xs mt-0.5">Ул. Тверская 12, кв. 45</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-400">
            <span>Время доставки</span>
            <span className="text-white">~35 мин</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-500">Ваша корзина пуста</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{item.price} ₽</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-white w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        {items.length > 0 && <div className="h-px bg-zinc-800 my-4" />}

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Сумма</span>
              <span className="text-white">{total} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Доставка</span>
              <span className="text-white">{deliveryFee} ₽</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-zinc-800">
              <span className="text-white">Итого</span>
              <span className="text-white">{finalTotal} ₽</span>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <button className="w-full py-3 bg-white text-zinc-950 font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
          Оформить заказ
        </button>
      </aside>

      {/* Mobile Cart Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-96 border-l border-zinc-900 bg-zinc-950 p-6 z-50 transform transition-transform duration-300 xl:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-white tracking-tight">Мой заказ</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Address Selection */}
        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 mb-6 cursor-pointer hover:border-zinc-600 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg text-rose-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Дом</p>
                <p className="text-zinc-500 text-xs mt-0.5">Ул. Тверская 12, кв. 45</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-400">
            <span>Время доставки</span>
            <span className="text-white">~35 мин</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 mb-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-zinc-500">Ваша корзина пуста</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{item.price} ₽</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-white w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        {items.length > 0 && <div className="h-px bg-zinc-800 mb-4" />}

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Сумма</span>
              <span className="text-white">{total} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Доставка</span>
              <span className="text-white">{deliveryFee} ₽</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-zinc-800">
              <span className="text-white">Итого</span>
              <span className="text-white">{finalTotal} ₽</span>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <button className="w-full py-3 bg-white text-zinc-950 font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
          Оформить заказ
        </button>
      </aside>
    </>
  )
}
