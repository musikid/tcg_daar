<script setup lang="ts">
import type { TCGCard } from '~/composables/pokemon-tcg-sdk/card'

interface Props {
    symbol: string
    logo: string
    name: string
    count: number
    cards: TCGCard[]
}

defineProps<Props>()
</script>

<template>
    <article class="bg-background-element rounded-3xl shadow flex flex-col gap-6 p-8 my-6">
        <hgroup class="inline-flex gap-6 items-center">
            <div class="w-25% md:w-15% xl:w-10%">
                <img class="h-full w-full" :src="logo">
            </div>
            <div class="h-full flex flex-col justify-between">
                <h3 class="font-sans font-bold text-xl md:text-2xl">{{ name }}</h3>
                <h4 class="text-sm md:text-lg">{{ count }} cards</h4>
            </div>
        </hgroup>
        <ul class="grid bg-background-main rounded-3xl p-6 grid-cols-2 xl:grid-cols-3 gap-4 h-full">
            <li class="w-full" v-for="item in cards" :key="item.id">
                <DashboardCard :title="item.name" :image="item.images.small" />
            </li>
        </ul>
    </article>
</template>
