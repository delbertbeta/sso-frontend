<template>
  <div>
    <div class="login-header">
      <div class="register-title">创建你的账号</div>
      <t-button theme="default" variant="text" @click="handleGoBackClick">
        <template #icon>
          <arrow-left-icon />
        </template>
        登录
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
        <t-input v-model="formData.username" placeholder="请输入用于登录的 ID"></t-input>
      </t-form-item>
      <t-form-item label="用户名" name="nickname">
        <t-input v-model="formData.nickname" placeholder="请输入用户名"></t-input>
      </t-form-item>
      <t-form-item label="邮箱地址" name="email">
        <t-input v-model="formData.email" placeholder="请输入邮箱地址"></t-input>
      </t-form-item>
      <t-form-item label="密码" name="password">
        <t-input v-model="formData.password" type="password" placeholder="请输入密码"></t-input>
      </t-form-item>
      <t-form-item label="确认密码" name="checkPassword">
        <t-input v-model="formData.checkPassword" type="password" placeholder="请重复输入密码"></t-input>
      </t-form-item>
      <t-button
        :class="{ 'has-error': hasError }"
        theme="primary"
        :loading="submitting"
        type="submit"
        style="margin-top: 32px; width: 100%;"
      >注册</t-button>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { ArrowLeftIcon } from 'tdesign-icons-vue-next';
import type { SubmitContext, FormRule, Data } from 'tdesign-vue-next';
import JSEncrypt from 'jsencrypt';

import { submitRegister } from '$api';
import { digestSha256, getRsaFromLocalStorage } from '$utils/crypto';

const router = useRouter();

const INITIAL_DATA = {
  username: '',
  nickname: '',
  email: '',
  password: '',
  checkPassword: '',
}

const rules: { [key in keyof typeof INITIAL_DATA]: FormRule[] } = {
  username: [{
    required: true, message: '必填', type: 'error',
  }, {
    validator: (val) => val.length >= 1 && val.length <= 24, message: 'ID 长度在 1 - 24 之间', type: 'error',
  }],
  nickname: [{
    required: true, message: '必填', type: 'error',
  }, {
    validator: (val) => val.length >= 1 && val.length <= 24, message: '用户名长度在 1 - 24 之间', type: 'error',
  }],
  email: [{
    required: true, message: '必填', type: 'error',
  }, {
    email: true, message: '不满足邮箱格式', type: 'error',
  }],
  password: [{ required: true, message: '必填', type: 'error' }],
  checkPassword: [{
    required: true, message: '必填', type: 'error',
  }, {
    validator: (val) => val === formData.value.password, message: '密码不一致', type: 'error',
  }],
}

const formData = ref({ ...INITIAL_DATA });
const submitting = ref<boolean>(false);
const hasError = ref<boolean>(false);

const handleSubmit = async ({ validateResult }: SubmitContext<Data>) => {
  submitting.value = true;
  hasError.value = false;

  if (validateResult !== true) {
    submitting.value = false;
    hasError.value = true;
    return;
  }

  try {
    const { data: { token, public_key } } = await getRsaFromLocalStorage();

    const { username, password, nickname, email } = formData.value;

    const hashedPass = await digestSha256(password);

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(public_key);
    const encryptedPass = encrypt.encrypt(hashedPass);

    const submitFormData = {
      username,
      nickname,
      email,
      password: encryptedPass,
      rsa_token: token,
    };

    const res = await submitRegister(submitFormData);
    if (res.isErr) {
      MessagePlugin.error('创建失败：' + res.response.msg);
      hasError.value = true;
    } else {
      MessagePlugin.success('创建成功');
      handleGoBackClick();
    }
  } catch (e) {
    MessagePlugin.error('创建账号失败，请重试');
    console.error(e);
  }
  submitting.value = false;
};

const handleGoBackClick = () => {
  router.replace({ path: '/auth/login' });
}
</script>

<style scoped>
.register-title {
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
