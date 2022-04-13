<template>
  <div class="default-layout">
    <t-layout style="height: 100%;">
      <t-header>
        <t-head-menu value="login" height="120px">
          <template #logo>
            <div class="logo">
              <t-icon class="t-menu__operations-icon" name="control-platform" />
            </div>
            <span class="page-title">Prime SSO</span>
          </template>
          <template #operations>
            <operation-dropdown />
          </template>
        </t-head-menu>
      </t-header>
      <t-layout>
        <admin-side-bar />
        <t-layout>
          <t-content class="main-content">
            <router-view />
          </t-content>
          <t-footer>Copyright @ 2022-{{ new Date().getFullYear() }} Delbert. All Rights Reserved</t-footer>
        </t-layout>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { key } from '$store';
import { useStore } from 'vuex';

import OperationDropdown from '$components/operation-dropdown/OperationDropdown.vue';
import AdminSideBar from '../components/admin-side-bar/AdminSideBar.vue';

const store = useStore(key);

store.dispatch('user/getSelfInfo');
</script>

<style scoped>
.logo {
  margin-left: 22px;
}

.page-title {
  font-size: 18px;
}

.default-layout {
  height: 100%;
}

.main-content {
  margin: 16px 16px 0;
  padding: 16px;
  border-radius: 3px;
  background: var(--td-bg-color-container);
  overflow: hidden;
}
</style>