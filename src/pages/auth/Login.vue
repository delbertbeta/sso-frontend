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
        <t-input
          v-model="formData.username"
          placeholder="请输入您的 ID"
        ></t-input>
      </t-form-item>
      <t-form-item label="密码" name="password">
        <t-input
          v-model="formData.password"
          type="password"
          placeholder="请输入您的密码"
        ></t-input>
      </t-form-item>
      <t-button
        :class="{ 'has-error': hasError }"
        theme="primary"
        type="submit"
        style="margin-top: 32px; width: 100%; margin-bottom: 12px"
        :loading="submitting"
        >登录</t-button
      >
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { ArrowRightIcon } from 'tdesign-icons-vue-next';
import type { SubmitContext, FormRule, Data } from 'tdesign-vue-next';
import JSEncrypt from 'jsencrypt';
import { useStore } from 'vuex';

import { submitLogin } from '$api';
import { digestSha256, getRsaFromLocalStorage } from '$utils/crypto';
import { processRedirectQuery } from '$utils/url';
import { safeDeleteStorage, safeGetStorage } from '$utils/local-storage';
import type { LastPath } from '$typings/path';
import { key } from '$store';

const router = useRouter();
const route = useRoute();
const store = useStore(key);

const INITIAL_DATA = {
  username: '',
  password: '',
};

const rules: { [key in keyof typeof INITIAL_DATA]: FormRule[] } = {
  username: [
    {
      required: true,
      message: '必填',
      type: 'error',
    },
    {
      min: 1,
      max: 24,
      message: 'ID 长度在 1 - 24 之间',
      type: 'error',
    },
  ],
  password: [{ required: true, message: '必填', type: 'error' }],
};

const formData = ref({ ...INITIAL_DATA });
const submitting = ref<boolean>(false);
const hasError = ref<boolean>(false);

const handleRedirect = () => {
  const oidcRequestRaw = sessionStorage.getItem('oidc_request');
  if (oidcRequestRaw) {
    const oidcRequest = JSON.parse(oidcRequestRaw);
    sessionStorage.removeItem('oidc_request');
    router.replace({ path: '/oidc/consent', query: oidcRequest });
    return;
  }

  if (processRedirectQuery(route.query)) {
    return;
  }
  router.replace({
    path: safeGetStorage<LastPath>('last_path')?.path ?? '/',
  });
  safeDeleteStorage('last_path');
};

const handleSubmit = async ({ validateResult }: SubmitContext<Data>) => {
  submitting.value = true;
  hasError.value = false;

  if (validateResult !== true) {
    hasError.value = true;
    submitting.value = false;
    return;
  }

  try {
    const {
      data: { token, public_key },
    } = await getRsaFromLocalStorage();
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
      handleRedirect();
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
  router.replace({ path: '/auth/register', query: route.query });
};

onMounted(async () => {
  const { response_type, client_id, redirect_uri } = route.query;
  if (response_type && client_id && redirect_uri) {
    const oidcRequest = {
      response_type,
      client_id,
      redirect_uri,
    };
    sessionStorage.setItem('oidc_request', JSON.stringify(oidcRequest));
  }

  if (store.getters['user/self']) {
    handleRedirect();
    return;
  }

  try {
    await store.dispatch('user/getSelfInfo');
    if (store.getters['user/self']) {
      handleRedirect();
    }
  } catch (e) {
    // not logged in, do nothing
  }
});
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
