<template>
  <div class="title-bar">
    <div class="title">应用</div>
    <t-button @click="handleCreateButtonClick">
      <template #icon><add-icon slot="icon" /></template>
      新建 App
    </t-button>
    <t-dialog
      v-model:visible="showNewAppModal"
      header="新建 App"
      mode="modal"
      :confirmBtn="null"
      :cancelBtn="null"
      draggable
      width="600px"
      :closeOnOverlayClick="false"
      :closeOnEscKeydown="false"
      destroyOnClose
    >
      <new-app @submit="handleSubmit" />
    </t-dialog>
  </div>
  <application-list ref="applicationListRef" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NewApp from './NewApp.vue';
import ApplicationList from '$components/application-list/ApplicationList.vue';
import { AddIcon } from 'tdesign-icons-vue-next';

const showNewAppModal = ref<boolean>(false);
const applicationListRef = ref<InstanceType<typeof ApplicationList> | null>(
  null
);

const handleCreateButtonClick = () => {
  showNewAppModal.value = true;
};

const handleSubmit = () => {
  applicationListRef.value?.refresh();
  showNewAppModal.value = false;
};
</script>

<style>
.t-dialog__body {
  padding-bottom: 0;
  padding-top: 24px;
}

.title {
  font-weight: bold;
  font-size: 18px;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
