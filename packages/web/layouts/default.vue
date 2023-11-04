<template>
  <div class="relative">
    <LandingTopBar class="fixed top-0 left-0 w-screen z1" />
    <main class="bg-neutral9 px-10% flex pb-8 pt-32">
      <div class="absolute z0 top--20 left-10 w-100 h-50 blur-5rem rounded-full bg-i-[--main-gradient]"></div>
      <NuxtErrorBoundary class="transition">
        <slot />
        <template #error="{ error, clearError }">
          <div class="bg-background-main flex h-screen w-screen">
            <div class="flex p-32 gap-4 flex-col m-auto">
              <h1>An error occurred</h1>
              <pre>
            {{ error.value.message }}
          </pre>
              <button type="button" class="transition m-auto font-sans font-bold
           text-black px-4 py-2 text-xl rounded-lg
            hover:(shadow-[0_0_2rem_0rem_rgba(255,255,255,0.35)] scale-105) active:(scale-95)
            bg-white w-fit" @click="clearError">
                Return in safe seas
              </button>
            </div>
          </div>
        </template>
      </NuxtErrorBoundary>
    </main>
  </div>
</template>

<style>
:root {
  --main-gradient: linear-gradient(110deg, rgba(255, 222, 86, 0.80) 0%, rgba(255, 138, 138, 0.80) 52.49%, rgba(137, 202, 252, 0.90) 87.16%);
}

h1 {
  @apply text-6xl lg:text-8xl font-serif font-bold;
}

h2 {
  @apply text-5xl lg:text-7xl font-serif font-bold;
}

p {
  @apply text-2xl lg:text-3xl font-sans;
}

body,
html {
  @apply h-full w-full m-none font-sans;
}
</style>
