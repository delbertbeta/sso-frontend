<template>
  <t-loading v-if="!selfInfo" />
  <div class="form-wrapper" v-else>
    <div style="width: 600px;">
      <div class="title-row">
        <div style="font-weight: bold; font-size: 18px;">个人信息</div>
        <div>
          <template v-if="editing">
            <t-button style="margin-right: 18px;" theme="primary" @click="handleSubmit">保存</t-button>
          </template>
          <t-button
            :theme="editing ? 'danger' : 'primary'"
            @click="switchEditing"
          >{{ editing ? '取消' : '修改' }}</t-button>
        </div>
      </div>
      <t-form
        ref="form"
        :disabled="!editing"
        :data="formData"
        :colon="true"
        label-align="top"
        style="width: 600px;"
        @submit="handleSubmit"
      >
        <div class="form-row">
          <face
            style="margin-right: 16px; flex-shrink: 0;"
            :face-url="faceInfo.face_url"
            size="68px"
            :nickname="faceInfo.nickname"
          />
          <t-form-item style="width: 100%;" label="ID" name="username">
            <t-tooltip style="width: 100%;" content="ID 注册后无法修改">
              <t-input disabled v-model="formData.username"></t-input>
            </t-tooltip>
          </t-form-item>
        </div>
        <br />
        <t-form-item label="用户名" name="nickname">
          <t-input v-model="formData.nickname" placeholder="请输入用户名"></t-input>
        </t-form-item>
        <t-form-item label="邮箱地址" name="email">
          <t-input v-model="formData.email" placeholder="请输入邮箱地址"></t-input>
        </t-form-item>
        <t-form-item label="个人签名" name="self_info">
          <t-textarea v-model="formData.self_info" placeholder="请输入个人签名" :maxcharacter="100"></t-textarea>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { key } from '$store';
import { ref, computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import Face from '$components/face/Face.vue';

const store = useStore(key);

const selfInfo = computed(() => store.state.user.self);

const faceInfo = reactive({
  face_url: '',
  nickname: '',
});

const formData = reactive({
  username: '',
  nickname: '',
  email: '',
  self_info: '',
});

watch(selfInfo, () => {
  if (!selfInfo.value) {
    return;
  }
  formData.email = selfInfo.value.email ?? '';
  formData.nickname = selfInfo.value.nickname;
  formData.username = selfInfo.value.username;
  formData.self_info = selfInfo.value.self_info ?? '';

  faceInfo.face_url = selfInfo.value.face_url!;
  faceInfo.nickname = selfInfo.value.nickname;
});

const editing = ref<boolean>(false);
const submitting = ref<boolean>(false);

const handleSubmit = () => {

};

const switchEditing = () => {
  editing.value = !editing.value;
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.form-row {
  display: flex;
  margin-bottom: 8px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  margin-bottom: 22px;
}
</style>