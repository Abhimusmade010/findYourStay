import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idCounter = useRef(0)

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = ++idCounter.current
    const next = { id, title: '', description: '', variant: 'default', duration: 2500, ...toast }
    setToasts((prev) => [...prev, next])
    if (next.duration !== Infinity) {
      window.setTimeout(() => remove(id), next.duration)
    }
  }, [remove])

  const value = useMemo(() => ({ push, remove }), [push, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  const success = useCallback((message, opts) => ctx.push({ title: 'Success', description: message, variant: 'success', ...opts }), [ctx])
  const error = useCallback((message, opts) => ctx.push({ title: 'Error', description: message, variant: 'destructive', ...opts }), [ctx])
  const info = useCallback((message, opts) => ctx.push({ title: 'Info', description: message, variant: 'default', ...opts }), [ctx])
  return { ...ctx, success, error, info }
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const variantClass = toast.variant === 'destructive'
    ? 'bg-red-600 text-white border-red-500'
    : toast.variant === 'success'
      ? 'bg-green-600 text-white border-green-500'
      : 'bg-secondary text-secondary-foreground border-border'

  return (
    <div className={`min-w-[260px] max-w-[360px] rounded-md border shadow-lg p-3 ${variantClass}`}>
      {toast.title ? <div className="font-semibold">{toast.title}</div> : null}
      {toast.description ? <div className="text-sm opacity-90">{toast.description}</div> : null}
      <button onClick={onDismiss} className="absolute top-2 right-2 text-xs opacity-80 hover:opacity-100">✕</button>
    </div>
  )
}


