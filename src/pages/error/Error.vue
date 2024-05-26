<template>
  <div class="error-page">
    <div class="not-found-placeholder">
      <empty-placeholder />
    </div>
    <t-link @click="handleGoBack" underline theme="success"
      >回家吧迷路的孩子</t-link
    >
  </div>
</template>

<script setup lang="ts">
import EmptyPlaceholder from '$components/empty-placeholder/EmptyPlaceholder.vue';
import { RouteName } from '$constants/router';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleGoBack = () => {
  router.push({ name: RouteName.Index });
};
</script>

<style scoped>
.error-page {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.not-found-placeholder {
  margin-bottom: 24px;
}
</style>
