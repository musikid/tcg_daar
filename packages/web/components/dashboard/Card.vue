<script setup lang="ts">
interface Props {
    title: string
    image: string
}

const props = defineProps<Props>()
</script>

<template>
    <div class="flex p-8 flex-col items-center gap-4 h-full">
        <div class="font-bold">
            <p>{{ title }}</p>
        </div>
        <div class="relative h-full w-full">
            <NuxtImg class="object-contain h-full w-full" :src="image" :alt="title" />
        </div>
    </div>
</template>