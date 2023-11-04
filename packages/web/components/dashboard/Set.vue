<script setup lang="ts">
import type { TCGCard } from '~/composables/pokemon-tcg-sdk/card'

interface Props {
    symbol: string
    logo: string
    name: string
    count: number
    cards: TCGCard[]
}

const isCollapsed = ref(false)
const chevronClass = computed(() => ({
    'rotate-0': !isCollapsed.value,
    'rotate-90': isCollapsed.value,
}))
const collapsibleClass = computed(() => ({
    'h-0': !isCollapsed.value,
    'h-full': isCollapsed.value,
}))
defineProps<Props>()
defineEmits(['header'])
</script>

<template>
    <article class="bg-background-element rounded-3xl shadow flex flex-col gap-6 p-8 my-6">
        <hgroup class="inline-flex gap-6 items-center cursor-pointer" @click="(e) => $emit('header', e)">
            <div class="w-25% md:w-15% xl:w-10%">
                <img class="h-full w-full" :src="logo">
            </div>
            <div class="h-full flex flex-col justify-between">
                <h3 class="font-sans font-bold text-xl md:text-2xl">{{ name }}</h3>
                <h4 class="text-sm md:text-lg">{{ count }} cards</h4>
            </div>
        </hgroup>
        <section class="bg-background-main p-8">
            <div class="font-sans font-bold text-lg flex justify-center border-b-1 pb-4 border-b-[#1E1E1E]">
                <button type="button" class="flex items-center gap-2" @click="isCollapsed = !isCollapsed">
                    <h4 class="">Featured cards</h4>
                    <div class="transition-all h-7 w-7 i-mdi:chevron-right" :class="chevronClass"></div>
                </button>
            </div>
            <ul :class="collapsibleClass" class="overflow-hidden transition-all grid rounded-3xl p-6 grid-cols-2 gap-4">
                <li class="w-full" v-for="item in cards" :key="item.id">
                    <DashboardCard :title="item.name" :image="item.images.small" />
                </li>
            </ul>
        </section>
    </article>
</template>
