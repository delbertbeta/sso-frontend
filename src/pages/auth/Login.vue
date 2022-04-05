<template>
  <div>
    <div class="login-header">
      <div class="login-title">欢迎回来</div>
      <t-button theme="default" variant="text" @click="handleGoBackClick">
        <template #icon>
          <arrow-right-icon />
        </template>
        注册
      </t-button>
    </div>
    <t-form
      ref="form"
      :data="formData"
      :rules="rules"
      :colon="true"
      label-align="top"
      @submit="handleSubmit"
    >
      <t-form-item label="ID" name="username">
        <t-input v-model="formData.username" placeholder="请输入您的 ID"></t-input>
      </t-form-item>
      <t-form-item label="密码" name="password">
        <t-input v-model="formData.password" type="password" placeholder="请输入您的密码"></t-input>
      </t-form-item>
      <t-button
        :class="{ 'has-error': hasError }"
        theme="primary"
        type="submit"
        style="margin-top: 32px; width: 100%; margin-bottom: 12px;"
        :loading="submitting"
      >登录</t-button>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { ArrowRightIcon } from 'tdesign-icons-vue-next';
import type { SubmitContext, FormRule } from 'tdesign-vue-next';
import JSEncrypt from 'jsencrypt';

import { submitLogin } from '$api';
import { digestSha256, getRsaFromLocalStorage } from '$utils/crypto';
import { safeDeleteStorage, safeGetStorage } from '$utils/local-storage';
import type { LastPath } from '$typings/path';

const router = useRouter();

const INITIAL_DATA = {
  username: '',
  password: '',
}

const rules: { [key in keyof typeof INITIAL_DATA]: FormRule[] } = {
  username: [{
    required: true, message: '必填', type: 'error',
  }, {
    min: 1, max: 24, message: 'ID 长度在 1 - 24 之间', type: 'error',
  }],
  password: [{ required: true, message: '必填', type: 'error' }],
}

const formData = ref({ ...INITIAL_DATA });
const submitting = ref<boolean>(false);
const hasError = ref<boolean>(false);

const handleSubmit = async ({ validateResult }: SubmitContext<FormData>) => {
  submitting.value = true;
  hasError.value = false;

  if (validateResult !== true) {
    hasError.value = true;
    submitting.value = false;
    return;
  }

  try {
    const { data: { token, public_key } } = await getRsaFromLocalStorage();
    const { username, password } = formData.value;

    const hashedPass = await digestSha256(password);

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(public_key);
    const encryptedPass = encrypt.encrypt(hashedPass);

    const submitFormData = {
      username,
      password: encryptedPass,
      rsa_token: token,
    };

    const res = await submitLogin(submitFormData);
    if (!res.isErr) {
      MessagePlugin.success('登录成功');
      router.replace({ path: safeGetStorage<LastPath>('last_path')?.path ?? '/' });
      safeDeleteStorage('last_path');
    } else {
      if (res.response.code === 104) {
        MessagePlugin.error('ID 或密码错误，请检查后重试');
      } else {
        MessagePlugin.error('登录失败：' + res.response.msg);
      }
      hasError.value = true;
    }
  } catch (e) {
    MessagePlugin.error('登录失败，请重试');
    console.error(e);
  }
  submitting.value = false;
};

const handleGoBackClick = () => {
  router.replace({ path: '/auth/register' });
}
</script>

<style scoped>
.login-title {
  font-size: 22px;
  font-weight: bold;
}

.login-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.has-error {
  animation: Spring 0.4s ease-in-out 0s 1;
}

:deep(.t-form__item) {
  margin-bottom: 8px;
}

:deep(.t-input__extra) {
  margin: 4px 0 0 0;
}
</style>
