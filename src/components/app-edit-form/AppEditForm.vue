<template>
  <t-form
    ref="form"
    :rules="rules"
    :data="formData"
    :colon="true"
    label-align="top"
    style="width: 100%"
    @submit="handleSubmit"
  >
    <div class="form-row">
      <image-uploader
        editing
        ref="iconUploader"
        :submitting="submitting"
        style="margin-right: 16px; flex-shrink: 0"
        size="68px"
      >
        <t-avatar
          v-if="currentIconUrl"
          size="68px"
          :image="currentIconUrl"
          :image-props="{ fit: 'cover' }"
        >
        </t-avatar>
        <t-avatar size="68px" v-else>
          <template #icon>
            <app-icon />
          </template>
        </t-avatar>
      </image-uploader>
      <t-form-item style="width: 100%" label="应用名称" name="name">
        <t-input v-model="formData.name"></t-input>
      </t-form-item>
    </div>
    <br />
    <t-form-item label="应用主页 URL" name="homepage_url">
      <t-input v-model="formData.homepage_url"></t-input>
    </t-form-item>
    <t-form-item label="应用描述" name="description">
      <t-textarea
        v-model="formData.description"
        :maxcharacter="250"
      ></t-textarea>
    </t-form-item>
    <t-form-item label="认证回调 URL" name="authorization_callback_url">
      <t-input v-model="formData.authorization_callback_url"></t-input>
    </t-form-item>
  </t-form>
</template>
<script setup lang="ts">
import { AppIcon } from 'tdesign-icons-vue-next';
import ImageUploader from '$components/image-uploader/ImageUploader.vue';
import {
  Data,
  FormRule,
  SubmitContext,
  FormInstanceFunctions,
} from 'tdesign-vue-next';
import { reactive, ref } from 'vue';
import { CreateAppParams } from '$typings/app';

const { defaultFormData, submitting } = defineProps<{
  defaultFormData?: CreateAppParams;
  submitting?: boolean;
  currentIconUrl?: string;
}>();

const emit = defineEmits<{
  submit: [CreateAppParams];
  error: [];
}>();

const rules: { [key in keyof Partial<CreateAppParams>]: FormRule[] } = {
  name: [
    {
      required: true,
      message: '必填',
      type: 'error',
    },
    {
      validator: (val) => val.length >= 1 && val.length <= 24,
      message: '名称长度在 1 - 24 之间',
      type: 'error',
    },
  ],
  homepage_url: [
    {
      required: true,
      message: '必填',
      type: 'error',
    },
    {
      validator: (val) => val.length >= 1 && val.length <= 200,
      message: 'URL 长度在 1 - 200 之间',
      type: 'error',
    },
    {
      url: {
        protocols: ['http', 'https'],
        require_protocol: true,
      },
      message: '必须是合法的 URL，需要带 http/https 前缀',
      type: 'error',
    },
  ],
  description: [
    {
      required: true,
      message: '必填',
      type: 'error',
    },
    {
      validator: (val) => val.length >= 1 && val.length <= 250,
      message: '描述长度在 1 - 200 之间',
      type: 'error',
    },
  ],
  authorization_callback_url: [
    {
      required: true,
      message: '必填',
      type: 'error',
    },
    {
      validator: (val) => val.length >= 2 && val.length <= 200,
      message: 'URL 长度在 1 - 200 之间',
      type: 'error',
    },
    {
      url: {
        protocols: ['http', 'https'],
        require_protocol: true,
      },
      message: '必须是合法的 URL，需要带 http/https 前缀',
      type: 'error',
    },
  ],
};

const formData = reactive<CreateAppParams>(
  defaultFormData ?? {
    name: '',
    description: '',
    icon_id: '',
    homepage_url: '',
    authorization_callback_url: '',
  }
);

const form = ref<FormInstanceFunctions | null>(null);
const iconUploader = ref<InstanceType<typeof ImageUploader> | null>(null);

const handleSubmit = async ({ validateResult }: SubmitContext<Data>) => {
  const handleErrorState = () => {
    emit('error');
  };

  if (validateResult !== true) {
    handleErrorState();
    return;
  }

  const iconId = await iconUploader.value!.doSubmit();

  emit('submit', {
    ...formData,
    icon_id: iconId ?? '',
  });
};

defineExpose({
  submit: () => {
    form.value?.submit();
  },
});
</script>

<style scoped></style>
