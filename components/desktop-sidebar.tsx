import { LogOut, Heart, Clock, Compass, LayoutGrid } from "lucide-react"

interface DesktopSidebarProps {
  activeView: "menu" | "favorites" | "history"
  onChangeView: (view: "menu" | "favorites" | "history") => void
}

const navItems = [
  { id: "menu" as const, label: "Меню", icon: LayoutGrid },
  { id: "favorites" as const, label: "Избранное", icon: Heart },
  { id: "history" as const, label: "История", icon: Clock },
]

export default function DesktopSidebar({ activeView, onChangeView }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-zinc-900 bg-zinc-950 h-full py-6 px-4 justify-between">
      <div>
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-950 shadow-lg shadow-zinc-100/10">
            <span className="text-lg font-bold">🌸</span>
          </div>
          <span className="text-xl font-medium tracking-tight text-white hidden lg:block">SAKURA</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left group transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300"
                }`}
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium hidden lg:block">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="space-y-6 hidden lg:block">
        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl" />
          <h4 className="text-white font-medium text-sm mb-1 relative z-10">Премиум статус</h4>
          <p className="text-xs text-zinc-500 mb-3 relative z-10">Бесплатная доставка</p>
          <button className="w-full py-2 bg-white text-zinc-950 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
            Узнать больше
          </button>
        </div>
        <button className="flex items-center gap-3 px-2 text-zinc-500 hover:text-white transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Выйти</span>
        </button>
      </div>
    </aside>
  )
}
