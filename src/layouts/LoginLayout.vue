<template>
  <div class="login-layout">
    <div class="login-layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginLayout',
});
</script>

<style scoped>
.login-layout {
  height: 100%;
  width: 100%;
  background-color: #eceff7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-layout-content {
  height: auto;
  width: 500px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 6px;
  box-shadow: 0 0 42px rgba(0, 0, 0, 0.1);
  padding: 32px 32px;
}
</style>
