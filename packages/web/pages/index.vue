<script setup lang="ts">
const wallet = useWallet()

const { isConnecting, isConnected } = storeToRefs(wallet)
const { connect, prepareSiweMessage, disconnect } = wallet

const text = computed(() => {
  if (isConnected?.value)
    return 'Go to dashboard'
  if (isConnecting?.value)
    return 'Connecting...'
  return 'Connect wallet'
})

const goNext = async () => navigateTo('/dashboard')

const loading = ref(false)

async function clickHandler() {
  if (!isConnected?.value)
    return await connect().catch((err) => {
      disconnect()
      throw createError({ ...err })
    })

  const { data, pending: pendingNonce, error } = await useFetch('/api/auth/signin', { method: 'get' })
  if (!data.value)
    throw createError('Nonce not found')

  watchEffect(() => {
    loading.value = pendingNonce.value
  })

  switch (data.value.type) {
    case 'user':
      return await goNext()
  }

  const body = await prepareSiweMessage(useCookie('nonce', { sameSite: 'strict' }))

  const { pending } = await useFetch('/api/auth/signin', {
    method: 'post',
    body,
  })
  watchEffect(() => {
    loading.value = pending.value
  })

  navigateTo('/dashboard')
}
</script>

<template>
  <div>
    <LandingMainHero>
      <LandingSignInButton :loading="loading" @click="clickHandler">
        {{ text }}
      </LandingSignInButton>
    </LandingMainHero>
    <LandingBlockchainHero />
    <LandingBoosterHero />
    <LandingCardCollectionHero />
  </div>
  <NuxtErrorBoundary @error="console.error">
    <!-- You use the default slot to render your content -->
    <template #error="{ error, clearError }">
      You can display the error locally here: {{ error }}
      <button @click="clearError">
        This will clear the error.
      </button>
    </template>
  </NuxtErrorBoundary>
</template>
