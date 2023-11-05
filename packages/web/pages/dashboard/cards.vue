<script setup lang="ts">
const { Card, Main } = storeToRefs(useWallet())
const { publicClient, CollectionAbi } = useWallet()

const sets = reactive({} as Record<string, any>)

const colls = await Main.value.read.getCollections()
for (const coll of colls) {
    const name = await publicClient.readContract({
        address: coll,
        abi: CollectionAbi,
        functionName: 'name',
    })
    const { data: setNameData } = await useFetch(`/api/sets/${name}`)
    const prettyName = (setNameData.value as any)?.name ?? name
    const cardsIds = await publicClient.readContract({
        address: coll,
        abi: CollectionAbi,
        functionName: 'getCards',
    }) as BigInt[]
    const { data } = await useFetch('/api/cards', { query: { ids: cardsIds.join(",") } })
    const { cards } = (data.value as any)
    const cardsOffchainData = await Promise.all(cards.map(c => useFetch(c.url).then(r => {
        return {
            ...r.data.value,
            owner: c.owner,
        }
    })))
    sets[prettyName] = cardsOffchainData
}
</script>

<template>
    <section class="flex flex-col gap-6">
        <li class="bg-background-element p-8 rounded-lg" v-for="set in Object.keys(sets)" :key="set">
            <h3 class="text-7">{{ set }}</h3>
            <ul class="grid grid-cols-3 gap-8">
                <li class="flex flex-col gap-2 items-center" v-for="card in sets[set]" :key="card.id">
                    <p class="font-sans font-light text-6">{{ card.name }}</p>
                    <div class="h-25vh lg:h-20vh">
                        <NuxtImg class="h-full" :src="card.image" />
                    </div>
                    <p class="font-sans text-3 border-black border-1 rounded-xl self-center px-2 py-1 my-1">{{ card.owner }}</p>
                </li>
            </ul>
        </li>
    </section>
</template>
