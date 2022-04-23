<template>
  <t-loading v-if="!selfInfo" />
  <div class="form-wrapper" v-else>
    <div style="width: 600px;">
      <div class="title-row">
        <div style="font-weight: bold; font-size: 18px;">个人信息</div>
        <div>
          <t-button :theme="editing ? 'danger' : 'primary'" :disabled="submitting" @click="switchEditing">{{ editing ?
              '取消' : '修改'
          }}
          </t-button>
          <template v-if="editing">
            <t-button style="margin-left: 18px;" theme="primary" @click="handleSubmit" :loading="submitting">保存
            </t-button>
          </template>
        </div>
      </div>
      <t-form ref="form" :disabled="!editing || submitting" :data="formData" :colon="true" label-align="top"
        style="width: 600px;" @submit="handleSubmit">
        <div class="form-row">
          <FaceUploader ref="faceUploader" style="margin-right: 16px;
            flex-shrink: 0;" size="68px" :editing="editing" :submitting="submitting" />
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
        <t-form-item label="个人签名" name="self_info">
          <t-textarea v-model="formData.self_info" placeholder="请输入个人签名" :maxcharacter="100"></t-textarea>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { MessagePlugin } from 'tdesign-vue-next';

import { key } from '$store';
import FaceUploader from '$components/face/FaceUploader.vue';
import { patchSelfInfo } from '$api/request';

const store = useStore(key);

const selfInfo = computed(() => store.state.user.self);

const formData = reactive({
  username: selfInfo.value?.username ?? '',
  nickname: selfInfo.value?.nickname ?? '',
  self_info: selfInfo.value?.self_info ?? '',
});

const faceUploader = ref<InstanceType<typeof FaceUploader> | null>(null);
const editing = ref<boolean>(false);
const submitting = ref<boolean>(false);

watchEffect(() => {
  if (!selfInfo.value) {
    return;
  }
  if (!editing.value) {
    formData.nickname = selfInfo.value.nickname;
    formData.username = selfInfo.value.username;
    formData.self_info = selfInfo.value.self_info ?? '';
  }
});

const handleSubmit = async () => {
  let face_id: string | null;
  submitting.value = true;
  try {
    face_id = await faceUploader.value!.doSubmit();
  } catch (e) {
    MessagePlugin.error('上传头像失败：' + JSON.stringify(e));
    submitting.value = false;
    return;
  }

  try {
    const res = await patchSelfInfo({
      self_info: formData.self_info,
      nickname: formData.nickname,
      face_id,
    });
    if (res.isErr) {
      MessagePlugin.error('编辑失败：' + JSON.stringify(res.response));
      return;
    }
  } catch (e) {
    MessagePlugin.error('编辑失败：' + JSON.stringify(e));
  }

  await store.dispatch('user/getSelfInfo');
  submitting.value = false;
  editing.value = false;
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