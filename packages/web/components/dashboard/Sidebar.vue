<template>
  <nav class="flex min-h-screen w-full bg-background-element">
    <div class="flex px-6 py-8 gap-32 flex-col w-full">
      <div class="self-center">
        <NuxtLink to="/">
          <Logo />
        </NuxtLink>
      </div>
      <div class="flex w-full">
        <slot />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>