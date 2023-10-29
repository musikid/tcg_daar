<script setup lang="ts">
const { isConnecting, isConnected, connect } = useWallet()

const text = computed(() => {
  console.log(isConnected)
  if (isConnecting) return 'Connecting...'
  if (isConnected) return 'Connected'
  return 'Connect wallet'
})

const clickHandler = () => {
  if (isConnected) return
  connect()
}
</script>

<template>
  <ClientOnly>
    <button type="button" @click="clickHandler" class="inline-flex gap-6 px-8 py-3 justify-center items-center text-black
     bg-white text-2xl rounded font-semibold backdrop-blur-96
     hover:(shadow-[0_0_2rem_0rem_rgba(255,255,255,0.35)] scale-105) active:(scale-95)
     transition-all">
      <div class="i-logos-ethereum h-8"></div>
      <span>{{ text }}</span>
    </button>
  </ClientOnly>
</template>
