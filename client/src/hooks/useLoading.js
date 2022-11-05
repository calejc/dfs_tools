import { useState } from "react"

export default function useLoading(loadingInitially = false) {
  const [isLoading, setIsLoading] = useState(loadingInitially)

  return {
    isLoading,
    loading: () => setIsLoading(true),
    done: () => setIsLoading(false)
  }
}