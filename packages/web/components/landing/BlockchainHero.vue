<script setup lang="ts">
const { appName } = useAppConfig()
</script>

<template>
    <section class="flex flex-col gap-16 my-48 lg:my-0 xl:flex-row justify-between xl:h-screen items-center">
        <hgroup class="text-center lg:text-left xl:max-w-xl">
            <h2>
                Leverage newest
                <br>
                <span class="color-[#7585FF]">blockchain</span>
                <br>
                technologies
            </h2>
            <br class="lg:hidden">
            <p>{{ appName }} relies on Ethereum blockchain
                to distribute NFTs and allows
                use of multi-chain bridges to securely
                transfer your cards
                between chain networks.</p>
        </hgroup>
        <div class="relative xl:flex-1 flex xl:justify-end md:max-w-100%">
            <div class="relative self-center md:self-auto xl:pr-25%">
                <NuxtImg class="absolute top-0 left-0 object-cover max-w-100 max-h-100 blur-64 md:blur-100 z0"
                    src="/images/landing/eth-logo.png" alt="" />
                <NuxtImg class="object-cover max-w-100 max-h-100 z1" src="/images/landing/eth-logo.png" alt="" />
            </div>
        </div>
    </section>
</template>
