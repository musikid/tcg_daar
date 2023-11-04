<script setup lang="ts">
const { toasts } = storeToRefs(useToast())

const iconMap: Record<ToastType, string> = {
    error: 'i-mdi-alert-circle text-red-500',
    success: 'i-mdi-check text-green-500',
    info: 'i-mdi-information text-blue-500',
    warning: 'i-mdi-exclamation-thick text-yellow-500',
}
</script>


<template>
    <TransitionGroup name="list" tag="ul" class="flex flex-col gap-2 w-full" v-if="toasts.length">
        <li v-for="toast in toasts" :key="toast.id" class="flex w-full justify-center items-center gap-4">
            <div class="bg-[#111] rounded-xl w-full shadow-lg p-4">
                <div class="flex justify-between gap-4">
                    <div class="flex gap-8 items-center">
                        <span :class="iconMap[toast.type]" class="min-h-5 min-w-5"></span>
                        <div>
                            <h4 class="text-6 font-bold">{{ toast.title }}</h4>
                            <p class="text-5 font-500">
                                {{ toast.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </TransitionGroup>
</template>

<style scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>