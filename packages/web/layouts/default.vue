<template>
  <div class="relative">
    <LandingTopBar class="fixed top-0 left-0 w-screen z1" />
    <main class="bg-neutral9 px-10% flex py-8 pt-32 lg:pt-32 xl:pt-0">
      <div class="absolute z0 top--20 left-10 w-100 h-50 blur-5rem rounded-full bg-i-[--main-gradient]"></div>
      <slot />
    </main>
  </div>
</template>

<style>
:root {
  --main-gradient: linear-gradient(110deg, rgba(255, 222, 86, 0.80) 0%, rgba(255, 138, 138, 0.80) 52.49%, rgba(137, 202, 252, 0.90) 87.16%);
}

h1 {
  @apply text-4xl lg:text-8xl font-serif font-bold;
}

h2 {
  @apply text-4xl lg:text-7xl font-serif font-bold;
}

p {
  @apply text-xl lg:text-3xl font-sans;
}

body,
html {
  @apply h-full w-full m-none font-sans;
}
</style>
