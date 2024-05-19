<template>
  <area-title title="密钥">
    <t-button variant="outline" @click="handleGenerateSecret" :loading="generating">生成新密钥</t-button>
  </area-title>
  <t-card title="新密钥已经成功生成" subtitle="注意密钥仅会完整展示一次，请妥善保存管理" header-bordered hover-shadow v-if="newSecret">
    <div :id="COPY_CONTAINER_ID" @click="handleSelect">{{ newSecret.secret }}</div>
    <template #actions>
      <t-button @click="handleCopy" variant="text">复制</t-button>
    </template>
  </t-card>
  <div class="app-secrets-container" v-if="secrets.length === 0">
    <empty-placeholder />
  </div>
  <div class="app-secrets-container" v-else="">
    <t-list split>
      <t-list-item v-for="secret in secrets" :key="secret.id">
        <t-list-item-meta :title="secret.secret"
          :description="`创建时间： ${dayjs.utc(secret.created_at).local().format('L LT')}`" />
      </t-list-item>
    </t-list>
  </div>
</template>

<script setup lang="ts">
import { createAppSecret, getAppSecrets } from '$api/request';
import EmptyPlaceholder from '$components/empty-placeholder/EmptyPlaceholder.vue';
import { AppSecret } from '$typings/app';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import dayjs from 'dayjs';

const COPY_CONTAINER_ID = 'new-app-secret-container';

const { secrets, applicationId } = defineProps<{
  secrets: AppSecret[];
  applicationId: string;
}>();

const emit = defineEmits<{
  secretsUpdate: [AppSecret[]];
}>();

const newSecret = ref<AppSecret | null>(null);
const generating = ref<boolean>(false);

const handleGenerateSecret = async () => {
  if (!applicationId) {
    return;
  }
  generating.value = true;
  const secret = await createAppSecret(applicationId);
  const newSecrets = await getAppSecrets(applicationId);


  if (secret.isErr || newSecrets.isErr) {
    generating.value = false;
    MessagePlugin.error((secret.isErr && secret.response.msg) || (newSecrets.isErr && newSecrets.response.msg) || '生成失败');
    return;
  }

  emit('secretsUpdate', newSecrets.response.data.application_secrets);
  generating.value = false;
  newSecret.value = secret.response.data.application_secret;
}

const handleSelect = () => {
  const dom = document.getElementById(COPY_CONTAINER_ID);
  if (dom) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(dom);
    selection?.addRange(range);
    return true;
  }
  return false;
}

const handleCopy = () => {
  const success = handleSelect();
  if (success) {
    document.execCommand('copy');
    MessagePlugin.success('复制成功');
  } else {
    MessagePlugin.error('复制失败，请手动复制');
  }
}
</script>

<style scoped>
.app-secrets-container {
  margin: 26px 0 26px 0;
}
</style>
