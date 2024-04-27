<template>
  <t-loading v-if="loading" />
  <template v-else>
    <empty-placeholder v-if="!apps.length" />
    <div v-for="app in apps">
      <application-item :app="app" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { getAppList } from '$api/index';
import { AppList } from '$typings/app';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import ApplicationItem from './ApplicationItem.vue';
import EmptyPlaceholder from '$components/empty-placeholder/EmptyPlaceholder.vue';

const apps = ref<AppList>([]);
const loading = ref<boolean>(true);

const refresh = async () => {
  const res = await getAppList();
  loading.value = false;
  if (res.isErr) {
    MessagePlugin.error('加载失败：' + res.response.msg);
    return;
  }

  apps.value = res.response.data.applications;
}

onMounted(() => {
  refresh();
});

defineExpose({ refresh });
</script>

<style>

</style>