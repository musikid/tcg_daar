<script setup lang="ts">
const { Card: CardContract, address } = storeToRefs(useWallet())
const { publicClient } = useWallet()

const cardsReceivedFilter = await CardContract.value.createEventFilter.Transfer({ to: address!.value })
const logs = await publicClient.getFilterLogs({ filter: cardsReceivedFilter })
console.info(logs)
</script>

<template>
    <section>

    </section>
</template>
