<template>
  <form @submit="handleSubmit">
    <fieldset>
      <legend>Login</legend>
      <div>
        <label for="username">Username: </label>
        <input name="username" type="text" v-model="username" />
      </div>
      <div>
        <label for="password">Password: </label>
        <input name="password" type="password" v-model="password" />
      </div>
      <div>
        <input type="submit" value="Login" />
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref<string>('');
    const password = ref<string>('');

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      alert('submit!');
    };

    watch(username, u => console.log('username: ', u));
    watch(password, p => console.log('password: ', p));

    return {
      handleSubmit,
      username,
      password,
    };
  }
});
</script>

<style scoped>
</style>
