"use client"

import { useEffect } from "react"

const CLEANUP_FLAG = "duruduygu_sw_cleanup_v1"

export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const runCleanup = async () => {
      try {
        if (window.localStorage.getItem(CLEANUP_FLAG) === "1") return
      } catch {
        // Ignore localStorage access issues and continue with cleanup.
      }

      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map((registration) => registration.unregister()))
        }

        if ("caches" in window) {
          const cacheKeys = await caches.keys()
          await Promise.all(cacheKeys.map((key) => caches.delete(key)))
        }

        try {
          window.localStorage.setItem(CLEANUP_FLAG, "1")
        } catch {
          // Ignore localStorage access issues after cleanup.
        }
      } catch {
        // Silent fail: cleanup should never block rendering.
      }
    }

    void runCleanup()
  }, [])

  return null
}
