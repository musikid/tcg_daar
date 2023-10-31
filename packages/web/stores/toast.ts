export type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastId = number

interface Toast {
    id: ToastId
    title: string
    description: string
    type: ToastType
    duration: number
    isClosable: boolean
    onClose?: () => void
}

interface ToastParams {
    title: string
    description: string
    type: ToastType
    duration?: number
    isClosable?: boolean
    onClose?: () => void
}

export const useToast = defineStore('toast', () => {
    const toasts = reactive<Toast[]>([])
    const defaultDuration = 3000

    const counter = ref(0)
    const getId = () => counter.value++

    const removeToast = (id: ToastId) => {
        const index = toasts.findIndex((toast) => toast.id === id)
        if (index > -1) {
            const toast = toasts[index]
            toasts.splice(index, 1)
            toast.onClose?.()
        }
    }

    const createToast = (params: ToastParams) => {
        const toast: Toast = {
            id: getId(),
            title: params.title,
            description: params.description,
            type: params.type,
            duration: params.duration ?? defaultDuration,
            isClosable: params.isClosable ?? true,
            onClose: params.onClose,
        }
        toasts.push(toast)
        setTimeout(() => removeToast(toast.id), toast.duration)
    }

    const success = (params: Omit<ToastParams, 'type'>) => {
        createToast({ ...params, type: 'success' })
    }

    const error = (params: Omit<ToastParams, 'type'>) => {
        createToast({ ...params, type: 'error' })
    }

    const warning = (params: Omit<ToastParams, 'type'>) => {
        createToast({ ...params, type: 'warning' })
    }

    const info = (params: Omit<ToastParams, 'type'>) => {
        createToast({ ...params, type: 'info' })
    }

    return {
        toasts,
        success,
        error,
        warning,
        info,
    }
})