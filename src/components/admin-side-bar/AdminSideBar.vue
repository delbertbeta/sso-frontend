<template>
  <t-aside style="border-top: 1px solid var(--component-border); width: auto;">
    <t-menu :collapsed="collapsed" :value="routerPath" @change="handleValueChange" theme="light" value="dashboard"
      :defaultExpanded="['personal', 'integration']">
      <t-menu-item value="/">
        <template #icon>
          <t-icon name="dashboard" />
        </template>
        仪表盘
      </t-menu-item>
      <t-submenu value="personal" title="个人">
        <template #icon>
          <t-icon name="user" />
        </template>
        <t-menu-item value="/user">
          <template #icon>
            <t-icon name="info-circle" />
          </template>
          个人信息
        </t-menu-item>
        <t-menu-item value="/security">
          <template #icon>
            <t-icon name="secured" />
          </template>
          账号安全
        </t-menu-item>
        <template #operations>
          <t-icon class="t-menu__operations-icon" :name="iconName" @click="changeCollapsed" />
        </template>
      </t-submenu>
      <t-submenu value="integration" title="连接">
        <template #icon>
          <t-icon name="link" />
        </template>
        <t-menu-item value="/connection">
          <template #icon>
            <t-icon name="app" />
          </template>
          Apps
        </t-menu-item>
      </t-submenu>
      <t-menu-item value="/developer">
        <template #icon>
          <t-icon name="code" />
        </template>
        开发者
      </t-menu-item>
    </t-menu>
  </t-aside>
</template>

<script setup lang="ts">
import type { MenuValue } from 'tdesign-vue-next';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const routerPath = ref<string>(route.path);
const collapsed = ref(false);

const iconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'));

watch(() => route.path, () => routerPath.value = route.path);

const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};

const handleValueChange = (e: MenuValue) => {
  router.push(e as string);
}
</script>