<script setup lang="ts">
import type { NuxtApp } from '#app'

const wallet = useWallet()
const { $csrfFetch } = useNuxtApp() as NuxtApp & { $csrfFetch: typeof $fetch }

const { isConnecting, isConnected } = storeToRefs(wallet)
const { connect, prepareSiweMessage } = wallet

const text = computed(() => {
  if (isConnected?.value) return 'Go to dashboard'
  if (isConnecting?.value) return 'Connecting...'
  return 'Connect wallet'
})

const clickHandler = async () => {
  if (!isConnected?.value)
    return await connect()

  try {
    await $csrfFetch('/api/auth/signin', { method: 'get' })

    const body = await prepareSiweMessage(useCookie('nonce', { sameSite: 'strict' }))

    await $csrfFetch('/api/auth/signin', {
      method: 'post',
      body,
    })
    navigateTo('/dashboard')
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <ClientOnly>
    <button type="button" @click="() => clickHandler()" class="inline-flex gap-6 px-8 py-3 justify-center items-center text-black
     bg-white text-2xl rounded font-semibold backdrop-blur-96
     hover:(shadow-[0_0_2rem_0rem_rgba(255,255,255,0.35)] scale-105) active:(scale-95)
     transition-all">
      <div class="i-logos-ethereum h-8"></div>
      <span>{{ text }}</span>
    </button>
  </ClientOnly>
</template>
