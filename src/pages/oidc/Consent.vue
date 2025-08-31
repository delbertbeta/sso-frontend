<template>
  <div class="container">
    <div v-if="app" class="consent-card">
      <img :src="app.icon_url" :alt="app.name" class="app-logo" />
      <h1 class="title">授权请求</h1>
      <p class="app-name">{{ app.name }}</p>
      <p class="description">此应用请求以下权限：</p>
      <ul class="scope-list">
        <li v-for="s in scopes" :key="s">{{ s }}</li>
      </ul>
      <div class="button-group">
        <button class="btn btn-primary" @click="handleConsent">同意授权</button>
        <button class="btn btn-secondary" @click="handleDeny">拒绝</button>
      </div>
    </div>
    <div v-else class="loading">正在加载应用信息...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/api';
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
      const res = await api.get<AppWithIconUrl, any>(
        `/api/application/${clientId}`
      );
      if (!res.isErr) {
        app.value = res.response;
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
    const response = await api.post<{ redirect_to: string }, any>(
      '/api/oidc/authorize',
      {
        client_id: params.clientId,
        scope: params.scope,
        state: params.state,
        redirect_uri: params.redirectUri,
        response_type: params.responseType,
        nonce: params.nonce,
      }
    );
    if (!response.isErr && response.response.redirect_to) {
      window.location.href = response.response.redirect_to;
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
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.app-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.5rem;
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
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  text-align: left;
  display: inline-block;
}

.scope-list li {
  margin-bottom: 0.5rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.loading {
  font-size: 1.2rem;
}
</style>
