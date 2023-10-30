<script setup lang="ts">
import type { NuxtApp } from '#app'

const wallet = useWallet()

const { isConnecting, isConnected } = storeToRefs(wallet)
const { connect, prepareSiweMessage } = wallet

const text = computed(() => {
  if (isConnected?.value)
    return 'Go to dashboard'
  if (isConnecting?.value)
    return 'Connecting...'
  return 'Connect wallet'
})

const goNext = async () => navigateTo('/dashboard')

async function clickHandler() {
  if (!isConnected?.value)
    return await connect()

  const { data } = await useCsrfFetch('/api/auth/signin', { method: 'get' })
  if (!data.value)
    throw createError('Nonce not found')

  switch (data.value?.type) {
    case 'user':
      return await goNext()
  }

  const body = await prepareSiweMessage(useCookie('nonce', { sameSite: 'strict' }))

  await useCsrfFetch('/api/auth/signin', {
    method: 'post',
    body,
  })
  navigateTo('/dashboard')
}
</script>

<template>
  <div>
    <LandingMainHero>
      <LandingSignInButton @click="clickHandler">
        {{ text }}
      </LandingSignInButton>
    </LandingMainHero>
    <LandingBlockchainHero />
    <LandingBoosterHero />
    <LandingCardCollectionHero />
  </div>
</template>
