<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components'
import { CardQueryBuilder, type TCGCard } from '~/composables/pokemon-tcg-sdk/card'

useSeoMeta({
  title: 'Importer',
})

const { Set: TCGSet, Card } = useTCG()

interface SetElement {
  id: string
  name: string
  logo: string
  symbol: string
  count: number
  cards: TCGCard[]
  selected?: boolean
}

const sets = reactive([] as SetElement[])
const page = ref(1)
const end = ref(false)
const pageSize = 10

const load = useDebounceFn(onLoadMore, 1500, { maxWait: 5000 })

const setsToImport = reactive(new Set() as Set<SetElement>)
const remove = (set: SetElement) => {
  setsToImport.delete(set)
  set.selected = false
}
const add = (set: SetElement) => {
  setsToImport.add(set)
  set.selected = true
}
const reset = () => {
  for (const set of setsToImport) {
    set.selected = false
  }
  setsToImport.clear()
}

const manageSetImport = (set: SetElement) => {
  if (setsToImport.has(set)) {
    remove(set)
  }
  else {
    add(set)
  }
}

async function onLoadMore() {
  if (end.value)
    return

  const { sets: _newSets, totalCount } = await TCGSet.search('', page.value++, pageSize)
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
        <DashboardSet class="transition-border-width-50" :class="{ 'border-3 border-amber': set.selected }"
          @header="() => manageSetImport(set)" v-bind="set" />
      </li>
    </ul>
    <Transition>
      <div v-if="setsToImport.size"
        class="absolute transition-bottom overflow-hidden shadow-lg flex gap-6 rounded-xl p-4 bottom-10% left-12.5% w-75% h-25% bg-[#111111]">
        <ul class="flex flex-wrap gap-2 w-75% overflow-y-auto p-2">
          <li class="border h-fit border-primary text-primary rounded px-2 py-1 cursor-pointer hover:filter-saturate-0"
            @click="() => remove(set)" v-for="set in setsToImport" :key="set.id">
            <p class="text-lg text-ellipsis">{{ set.name }}</p>
          </li>
        </ul>
        <div class="overflow-auto flex flex-col gap-6 ml-auto self-end">
          <DashboardButton @click="reset" class="bg-[#e811008f]" icon="i-mdi:exit-to-app">
            Abort
          </DashboardButton>
          <DashboardButton class="bg-primary" icon="i-mdi:exit-to-app">
            Import
          </DashboardButton>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply ;
}

.v-enter-from,
.v-leave-to {
  @apply bottom-0;
}
</style>