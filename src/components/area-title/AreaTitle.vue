<template>
  <div class="title">
    <div class="title-text">{{ title }}</div>
    <slot />
  </div>
  <t-divider />
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();

</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.title-text {
  font-weight: bold;
  font-size: 18px;
  flex: 1;
}
</style>
