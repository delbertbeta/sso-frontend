<template>
  <div class="container">
    <t-card :loading="!app" class="consent-card" header-bordered>
      <div v-if="app" class="card-content">
        <t-avatar :image="app.icon_url" :alt="app.name" size="80px" />
        <h1 class="title">授权请求</h1>
        <p class="app-name">{{ app.name }}</p>
        <p class="description">此应用请求以下权限：</p>
        <t-list :split="false" class="scope-list">
          <t-list-item v-for="s in scopes" :key="s">{{ s }}</t-list-item>
        </t-list>
      </div>
      <template #footer>
        <div class="button-group">
          <t-button theme="primary" @click="handleConsent">同意授权</t-button>
          <t-button theme="default" @click="handleDeny">拒绝</t-button>
        </div>
      </template>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getSingleApp, authorizeOidc } from '@/api/request';
import type { AppWithIconUrl } from '@/typings/app';

const route = useRoute();
const app = ref<AppWithIconUrl | null>(null);
const scopes = ref<string[]>([]);

const getQueryParams = () => {
  const query = route.query;
  return {
    clientId: query.client_id as string,
    scope: query.scope as string,
    state: query.state as string,
    redirectUri: query.redirect_uri as string,
    responseType: query.response_type as string,
    nonce: query.nonce as string,
  };
};

onMounted(async () => {
  const { clientId, scope } = getQueryParams();
  if (clientId) {
    try {
      const res = await getSingleApp(clientId);
      if (!res.isErr) {
        app.value = res.response.data;
      }
    } catch (error) {
      console.error('Failed to fetch application info:', error);
    }
  }
  if (scope) {
    scopes.value = scope.split(' ');
  }
});

const handleConsent = async () => {
  const params = getQueryParams();
  try {
    const response = await authorizeOidc({
      client_id: params.clientId,
      scope: params.scope,
      state: params.state,
      redirect_uri: params.redirectUri,
      response_type: params.responseType,
      nonce: params.nonce,
    });
    if (!response.isErr && response.response.data.redirect_to) {
      window.location.href = response.response.data.redirect_to;
    }
  } catch (error) {
    console.error('Authorization failed:', error);
  }
};

const handleDeny = () => {
  const { redirectUri, state } = getQueryParams();
  if (redirectUri) {
    const separator = redirectUri.includes('?') ? '&' : '?';
    window.location.href = `${redirectUri}${separator}error=access_denied&state=${state}`;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.consent-card {
  max-width: 400px;
  width: 100%;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
}

.title {
  font-size: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.app-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.description {
  margin-bottom: 1rem;
}

.scope-list {
  margin-bottom: 1rem;
  text-align: left;
  display: inline-block;
  padding: 0;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}
</style>
