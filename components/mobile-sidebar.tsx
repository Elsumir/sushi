import { LogOut, Heart, Clock, Compass, LayoutGrid } from "lucide-react"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeView: "menu" | "favorites" | "history"
  onChangeView: (view: "menu" | "favorites" | "history") => void
}

const navItems = [
  { id: "menu" as const, label: "Меню", icon: LayoutGrid },
  { id: "favorites" as const, label: "Избранное", icon: Heart },
  { id: "history" as const, label: "История", icon: Clock },
]

export default function MobileSidebar({ isOpen, onClose, activeView, onChangeView }: MobileSidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-zinc-950 p-6 z-50 transform transition-transform duration-300 md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">🌸</span>
          </div>
          <span className="text-lg font-bold tracking-wide text-white">SAKURA</span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-left transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="space-y-4">
          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
            <h4 className="text-white font-semibold text-sm mb-1">Премиум статус</h4>
            <p className="text-xs text-zinc-400 mb-4">Бесплатная доставка</p>
            <button className="w-full py-2 bg-white text-zinc-950 text-xs font-bold rounded-lg hover:bg-zinc-100 transition-colors">
              Узнать больше
            </button>
          </div>

          <button className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
