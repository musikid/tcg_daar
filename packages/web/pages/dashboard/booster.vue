<script setup lang="ts">

const { Booster } = useWallet()

const { boosters } = await $fetch('/api/booster')

const unpack = (id: string) => {
    Booster.value.write.unpack()
}
</script>

<template>
    <section>
        <ul>
            <li v-for="booster in boosters">
                <p>{{ booster.id }}</p>
                <button @click="unpack(booster.id)">Unpack</button>
            </li>
        </ul>
    </section>
</template>
