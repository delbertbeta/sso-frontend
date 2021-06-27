<template>
  <h1>PrimeSSO</h1>
  <nav>
    <ul>
      <li><router-link to="/login">Login</router-link></li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Index',
  components: {
  },
});
</script>

<style>
</style>
