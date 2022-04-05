<template>
  <div class="default-layout">
    <t-layout>
      <t-header>
        <t-head-menu value="login" height="120px">
          <template #logo>
            <div class="logo">
              <t-icon class="t-menu__operations-icon" name="control-platform" />
              <span>Delbert's SSO</span>
            </div>
          </template>
          <template #operations>
            <a href="javascript:;">
              <t-icon class="t-menu__operations-icon" name="home" />
            </a>
          </template>
        </t-head-menu>
      </t-header>
      <t-layout>
        <t-aside style="border-top: 1px solid var(--component-border)">
          <t-menu theme="light" value="dashboard" style="margin-right: 50px" height="550px">
            <t-menu-item value="dashboard">
              <template #icon>
                <t-icon name="dashboard" />
              </template>
              仪表盘
            </t-menu-item>
            <t-menu-item value="hello">
              <template #icon>
                <t-icon name="dashboard" />
              </template>
              仪表盘
            </t-menu-item>
          </t-menu>
        </t-aside>
        <t-layout>
          <t-content>
            <div>Content</div>
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

const store = useStore(key);

store.dispatch('user/getSelfInfo');
</script>

<style scoped>
.logo {
  margin-left: 22px;
}
</style>