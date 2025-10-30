import { useEffect } from "react"
import api from "../api/apiClient"

function WakeBackend() {
  useEffect(() => {
    const ping = async () => {
      try {
        await api.get("/ping")
        console.log("✅ Backend awake")
      } catch (err) {
        console.warn("⚠️ Ping failed", err)
      }
    }
    ping()
  }, [])

  return null
}

export default WakeBackend
