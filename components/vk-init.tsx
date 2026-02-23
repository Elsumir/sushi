"use client"

import { useEffect } from "react"
import bridge from "@vkontakte/vk-bridge"

/**
 * Инициализация VK Mini App.
 * При открытии внутри ВКонтакте вызывает VKWebAppInit; вне VK запрос просто отклонится.
 */
export default function VKInit() {
  useEffect(() => {
    if (typeof window === "undefined") return

    bridge
      .send("VKWebAppInit")
      .then(() => {
        bridge.send("VKWebAppUpdateConfig", {
          viewport_height: window.innerHeight,
          viewport_width: window.innerWidth,
        }).catch(() => {})
      })
      .catch(() => {})
  }, [])

  return null
}
