<script setup lang="ts">
const { toasts } = storeToRefs(useToast())

</script>


<template>
    <Teleport to="body">
        <ul v-if="toasts.length" class=""></ul>
    </Teleport>
</template>