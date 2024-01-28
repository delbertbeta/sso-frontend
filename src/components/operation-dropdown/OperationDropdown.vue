<template>
  <div class="operation-dropdown">
    <t-dropdown trigger="click" @click="handleClick">
      <t-button variant="text" size="large">
        <self-face />
        <template #suffix><t-icon name="chevron-down" /></template>
      </t-button>
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item value="logout">
            <t-icon name="logout" style="margin-right: 8px;" />登出
          </t-dropdown-item>
        </t-dropdown-menu>
      </template>
    </t-dropdown>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import type { DropdownOption } from 'tdesign-vue-next';
import SelfFace from '$components/face/SelfFace.vue';
import { logout } from '$api';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { key } from '$store';

const router = useRouter();
const store = useStore(key);

const handleClick = async (e: DropdownOption) => {
  if (e.value === 'logout') {
    const res = await logout();
    if (res.isErr) {
      MessagePlugin.error('登出失败：' + res.response.msg);
    } else {
      MessagePlugin.success('您已成功登出');
      store.commit('user/reset');
      router.replace('/auth/login');
    }
  }
}
</script>

<style scoped>
:deep(.t-dropdown__item-text) {
  display: flex;
  align-items: center;
}
</style>