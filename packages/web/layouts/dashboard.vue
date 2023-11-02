<script setup lang="ts">
const toggle = ref(false)
</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <div class="lg:block min-w-50% md:min-w-25% xl:min-w-15% z1" :class="{ 'block': toggle, 'hidden': !toggle }">
      <DashboardSidebar>
        <menu class="flex w-full flex-col gap-16">
          <ul class="flex flex-col gap-4">
            <DashboardSidebarLink icon="i-mdi:application-import" text="Import cards" to="/dashboard/import" />
          </ul>
          <ul class="flex flex-col gap-4">
            <DashboardSidebarLink icon="i-mdi:book-open-blank-variant" text="Cards" to="/dashboard/cards" />
            <DashboardSidebarLink icon="i-mdi:gift-open" text="Booster" to="/dashboard/booster" />
          </ul>
        </menu>
      </DashboardSidebar>
    </div>
    <div class="flex h-screen flex-col w-full">
      <DashboardTopbar @menu-to="toggle = !toggle" />
      <main class="p-4 h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="postcss">
body {
  @apply bg-background-main h-screen font-sans;
}
</style>