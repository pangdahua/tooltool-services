export const useGlobalError = () => {
  const errorKey = useState<string | null>('global-error-key', () => null)
  const errorMessage = useState<string | null>('global-error-message', () => null)
  const isVisible = useState<boolean>('global-error-visible', () => false)

  const showError = (key: string, message?: string) => {
    errorKey.value = key
    errorMessage.value = message || null
    isVisible.value = true

    // Auto hide after 8 seconds
    setTimeout(() => {
      isVisible.value = false
    }, 8000)
  }

  const hideError = () => {
    isVisible.value = false
  }

  return {
    errorKey,
    errorMessage,
    isVisible,
    showError,
    hideError
  }
}
