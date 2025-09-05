<template>
  <t-loading v-if="loading || !defaultFormData" />
  <template v-else>
    <div class="form-area">
      <area-title title="基础信息" />
      <app-edit-form
        ref="appEditForm"
        :defaultFormData="defaultFormData"
        :currentIconUrl="application?.icon_url"
        :submitting="submitting"
        @submit="handleSubmit"
        @error="handleError"
      />
      <t-button
        :class="{ 'has-error': hasError, 'save-button': true }"
        theme="primary"
        :loading="submitting"
        type="submit"
        @click="triggerSubmit"
        style="margin-top: 32px; width: 100%"
        >保存</t-button
      >
      <app-secrets
        :secrets="applicationSecrets"
        @secretsUpdate="handleSecretsUpdate"
        :application-id="appId"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { RouteName } from '$constants/router';
import { computed, onMounted, ref } from 'vue';
import { getSingleApp, patchApp } from '$api/request';
import AppEditForm from '$components/app-edit-form/AppEditForm.vue';
import AppSecrets from '$components/app-secrets/AppSecrets.vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { AppSecret, AppWithSecrets, CreateAppParams } from '$typings/app';

const route = useRoute();
const router = useRouter();

const loading = ref<boolean>(true);
const appEditForm = ref<InstanceType<typeof AppEditForm> | null>(null);
const submitting = ref<boolean>(false);
const hasError = ref<boolean>(false);

const application = ref<AppWithSecrets | null>(null);
const applicationSecrets = ref<AppSecret[]>([]);

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
  try {
    const res = await patchApp(application.value!.id, {
      ...params,
      icon_id: params.icon_id ? params.icon_id : undefined,
    });
    if (res.isErr) {
      MessagePlugin.error('更新失败：' + res.response.msg);
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
  MessagePlugin.success('修改成功');
};

const appId = Array.isArray(route.params.appId)
  ? route.params.appId[0]
  : route.params.appId;

if (!appId) {
  router.push({ name: RouteName.Developer });
}

onMounted(async () => {
  const res = await getSingleApp(appId);
  if (res.isErr) {
    router.push({ name: RouteName.Developer });
    MessagePlugin.error(res.response.msg);
    return;
  }
  application.value = res.response.data;
  applicationSecrets.value = res.response.data.application_secrets;
  loading.value = false;
});

const defaultFormData = computed<CreateAppParams | null>(() => {
  if (!application.value) {
    return null;
  }
  const { name, description, redirect_uris, homepage_url } = application.value;
  return {
    icon_id: '',
    name,
    description,
    redirect_uris,
    homepage_url,
  };
});

const handleSecretsUpdate = (appSecrets: AppSecret[]) => {
  applicationSecrets.value = appSecrets;
};
</script>

<style scoped>
.form-area {
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
}

.save-button {
  margin-bottom: 24px;
}
</style>
