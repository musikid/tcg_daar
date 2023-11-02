<script setup lang="ts">
interface Props {
    title: string
    image: string
}

const props = defineProps<Props>()
</script>

<template>
    <div class="flex p-8 flex-col items-center gap-4 h-full">
        <div class="font-semibold">
            <p class="text-5 2xl:text-6">{{ title }}</p>
        </div>
        <div class="relative h-full w-full">
            <NuxtImg class="object-contain h-full w-full" :src="image" :alt="title" />
        </div>
    </div>
</template>