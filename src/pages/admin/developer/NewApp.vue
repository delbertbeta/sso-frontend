<template>
  <div class="form-wrapper">
    <div style="width: 100%;">
      <t-form ref="form" :rules="rules" :data="formData" :colon="true" label-align="top" style="width: 100%;"
        @submit="handleSubmit">
        <div class="form-row">
          <image-uploader editing :submitting="submitting" style="margin-right: 16px;
            flex-shrink: 0;" size="68px">
            <t-avatar size="68px">
              <template #icon>
                <app-icon />
              </template>
            </t-avatar>
          </image-uploader>
          <t-form-item style="width: 100%;" label="应用名称" name="name">
            <t-input v-model="formData.name"></t-input>
          </t-form-item>
        </div>
        <br />
        <t-form-item label="应用主页 URL" name="homepage_url">
          <t-input v-model="formData.homepage_url"></t-input>
        </t-form-item>
        <t-form-item label="应用描述" name="description">
          <t-textarea v-model="formData.description" :maxcharacter="200"></t-textarea>
        </t-form-item>
        <t-form-item label="认证回调 URL" name="authorization_callback_url">
          <t-input v-model="formData.authorization_callback_url"></t-input>
        </t-form-item>
        <t-button :class="{ 'has-error': hasError }" theme="primary" :loading="submitting" type="submit"
          style="margin-top: 32px; width: 100%;">提交</t-button>
      </t-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ImageUploader from '$components/image-uploader/ImageUploader.vue';
import { CreateAppParams } from '$typings/app';
import { AppIcon } from 'tdesign-icons-vue-next';
import { FormRule, SubmitContext } from 'tdesign-vue-next';

import { reactive, ref, defineEmits } from 'vue';

const emit = defineEmits(['submit']);

const rules: { [key in keyof Partial<CreateAppParams>]: FormRule[] } = {
  name: [{
    required: true, message: '必填', type: 'error',
  }, {
    validator: (val) => val.length >= 1 && val.length <= 24, message: '名称长度在 1 - 24 之间', type: 'error',
  }],
  homepage_url: [{
    required: true, message: '必填', type: 'error',
  }, {
    validator: (val) => val.length >= 1 && val.length <= 200, message: 'URL 长度在 1 - 200 之间', type: 'error',
  }, {
    url: {
      protocols: ['http', 'https'],
      require_protocol: true,
    }, message: '必须是合法的 URL，需要带 http/https 前缀', type: 'error',
  }],
  authorization_callback_url: [{
    required: true, message: '必填', type: 'error',
  }, {
    validator: (val) => val.length >= 2 && val.length <= 200, message: 'URL 长度在 1 - 200 之间', type: 'error',
  }, {
    url: {
      protocols: ['http', 'https'],
      require_protocol: true,
    }, message: '必须是合法的 URL，需要带 http/https 前缀', type: 'error',
  }],
}
const formData = reactive<CreateAppParams>({
  name: '',
  description: '',
  icon_id: '',
  homepage_url: '',
  authorization_callback_url: '',
});

const submitting = ref<boolean>(false);
const hasError = ref<boolean>(false);

const handleSubmit = async ({ validateResult }: SubmitContext<FormData>) => {
  submitting.value = true;
  hasError.value = false;

  if (validateResult !== true) {
    submitting.value = false;
    hasError.value = true;
    return;
  }

  submitting.value = false;
  hasError.value = false;
  emit('submit');
}
</script>

<style>
.has-error {
  animation: Spring 0.4s ease-in-out 0s 1;
}
</style>
