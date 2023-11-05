<script setup lang="ts">
const cards = await useFetch('/api/cards', { query: { userOnly: true } })

const { data } = await useFetch('/api/binders')
const { binders } = data.value as any
</script>

<template>
    <div>
        <section>
            <ul class="flex flex-col">

            </ul>
            <ul class="flex flex-col">
                <li class="flex flex-col gap-4 p-6" v-for="binder in binders">
                    <h3 class="text-4">{{ binder.name }}</h3>
                    <p class="text-3">{{ binder.cards.length }}</p>
                    <ul class="grid grid-cols-3">
                        <li v-for="card in binder.cards">
                            <p>{{ card.name }}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
    </div>
</template>