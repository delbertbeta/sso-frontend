<template>
  <t-button @click="handleCreateButtonClick">新建 App</t-button>
  <t-dialog v-model:visible="showNewAppModal" header="新建 App" mode="modal" :confirmBtn="null" :cancelBtn="null"
    draggable width="600px" :closeOnOverlayClick="false" :closeOnEscKeydown="false" destroyOnClose>
    <template #body>
      <new-app />
    </template>
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NewApp from './NewApp.vue';

const showNewAppModal = ref<boolean>(false);

const handleCreateButtonClick = () => {
  showNewAppModal.value = true;
}
</script>

<style>
.t-dialog__body {
  padding-bottom: 0;
  padding-top: 24px;
}
</style>