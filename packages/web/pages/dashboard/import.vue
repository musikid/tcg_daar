<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components'
import { CardQueryBuilder, type TCGCard } from '~/composables/pokemon-tcg-sdk/card'

useSeoMeta({
  title: 'Importer',
})

const { Set, Card } = useTCG()

interface SetElement {
  id: string
  name: string
  logo: string
  symbol: string
  cards: TCGCard[]
}

const sets = reactive([] as SetElement[])
const page = ref(1)
const end = ref(false)
const pageSize = 10

const load = useDebounceFn(onLoadMore, 1500, { maxWait: 5000 })

async function onLoadMore() {
  if (end.value)
    return

  const { sets: _newSets, totalCount } = await Set.search('', page.value++, pageSize)
  if (sets.length >= totalCount!) {
    end.value = true
    return
  }

  const newSets = await Promise.all(_newSets.map(async set => {
    const q = new CardQueryBuilder().withSetId(set.id).build()
    return {
      id: set.id,
      name: set.name,
      logo: set.images.logo,
      symbol: set.images.symbol,
      count: set.total,
      cards: (await Card.search(q, 1, 4)).cards,
    }
  }))

  sets.push(...newSets)
}
</script>

<template>
  <section class="p-6" v-infinite-scroll="load">
    <ul class="xl:(grid grid-cols-2) gap-4">
      <li v-for="set in sets" :key="set.id">
        <DashboardSet v-bind="set" />
      </li>
    </ul>
  </section>
</template>
