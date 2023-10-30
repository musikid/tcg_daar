<template>
  <button type="button" class="inline-flex gap-6 px-8 py-3 justify-center items-center text-black
     bg-white text-2xl rounded font-semibold backdrop-blur-96
     hover:(shadow-[0_0_2rem_0rem_rgba(255,255,255,0.35)] scale-105) active:(scale-95)
     transition-all">
    <div class="i-logos-ethereum h-8"></div>
    <span>
      <slot />
    </span>
  </button>
</template>
