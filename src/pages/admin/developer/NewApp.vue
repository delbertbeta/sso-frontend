<template>
  <div class="form-wrapper">
    <div style="width: 100%">
      <app-edit-form
        ref="appEditForm"
        @submit="handleSubmit"
        @error="handleError"
      />
      <t-button
        :class="{ 'has-error': hasError }"
        theme="primary"
        :loading="submitting"
        type="submit"
        @click="triggerSubmit"
        style="margin-top: 32px; width: 100%"
        >提交</t-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CreateAppParams } from '$typings/app';
import { createApp } from '$api';
import { MessagePlugin } from 'tdesign-vue-next';
import AppEditForm from '$components/app-edit-form/AppEditForm.vue';
import { ref } from 'vue';

const appEditForm = ref<InstanceType<typeof AppEditForm> | null>(null);
const submitting = ref<boolean>(false);
const hasError = ref<boolean>(false);

const emit = defineEmits(['submit']);

const triggerSubmit = () => {
  submitting.value = true;
  hasError.value = false;
  appEditForm.value?.submit();
};

const handleError = () => {
  submitting.value = false;
  hasError.value = true;
};

const handleSubmit = async (params: CreateAppParams) => {
  if (!params.icon_id) {
    MessagePlugin.error('创建失败：请上传一个应用 Icon');
    handleError();
    return;
  }

  try {
    const res = await createApp(params);
    if (res.isErr) {
      MessagePlugin.error('创建失败：' + res.response.msg);
      handleError();
      return;
    }
  } catch (e) {
    MessagePlugin.error('网络错误，请重试');
    handleError();
    console.error(e);
    return;
  }

  submitting.value = false;
  hasError.value = false;
  MessagePlugin.success('创建成功');
  emit('submit');
};
</script>

<style scoped>
.has-error {
  animation: Spring 0.4s ease-in-out 0s 1;
}
</style>
