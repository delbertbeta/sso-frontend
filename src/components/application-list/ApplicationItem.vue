<template>
  <div class="application-item">
    <div class="application-item-left">
      <face :nickname="app.name" :face-url="app.icon_url" size="66px" />
      <div class="application-item-info">
        <div class="application-item-info-name">{{ app.name }}</div>
        <div class="application-item-info-description">
          {{ app.description }}
        </div>
      </div>
    </div>
    <t-button
      class="application-item-right"
      theme="default"
      variant="outline"
      @click="handleEditClick"
    >
      <template #icon><edit-1-icon slot="icon" /></template>
      编辑
    </t-button>
  </div>
</template>

<script setup lang="ts">
import { AppListItem } from '$typings/app';
import Face from '$components/face/Face.vue';
import { Edit1Icon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router';
import { RouteName } from '$constants/router';

const props = defineProps<{
  app: AppListItem;
}>();

const router = useRouter();

const handleEditClick = () => {
  router.push({
    name: RouteName.AppEdit,
    params: {
      appId: props.app.id,
    },
  });
};
</script>

<style>
.application-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.application-item-left {
  display: flex;
}

.application-item-info {
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.application-item-info-name {
  font-weight: bold;
  margin-bottom: 8px;
}

.application-item-info-description {
  color: var(--td-font-gray-2);
}
</style>
