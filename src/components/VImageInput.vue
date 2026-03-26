<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useAttrs, useModel, watch, type PropType } from 'vue';
import { useDefaults, useLocale } from 'vuetify';
import { VField, VInput, VSheet } from 'vuetify/components';
import pt from '../locales/pt';
import en from '../locales/en';
import VImageCropDialog from '@cesarv/v-image-crop-dialog';

type InputRule =
  string |
  boolean |
  PromiseLike<boolean | string> |
  ((value: unknown) => boolean | string) |
  ((value: unknown) => PromiseLike<boolean | string>) |
  [string, unknown, string];

const locale = useLocale();
locale.messages['value'] = {
  ...locale.messages['value'],
  pt: {
    ...pt,
    ...(locale.messages['value']['pt'] as Record<string, string> ?? {}),
  },
  en: {
    ...en,
    ...(locale.messages['value']['en'] as Record<string, string> ?? {}),
  },
};

const _props = defineProps({
  clearable: {
    type: Boolean,
    default: true,
  },
  clearIcon: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: [Boolean, String],
    default: false,
  },
  label: {
    type: String,
    default: undefined,
  },
  hint: {
    type: String,
    default: undefined,
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as PropType<'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'>,
    default: undefined,
  },
  density: {
    type: String as PropType<'default' | 'comfortable' | 'compact'>,
    default: 'default',
  },
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | 'auto'>,
    default: false,
  },
  messages: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  errorMessages: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  maxErrors: {
    type: [String, Number],
    default: 1,
  },
  rules: {
    type: Array as PropType<InputRule[]>,
    default: () => [],
  },
  name: {
    type: String,
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  class: {
    type: [String, Array, Object] as PropType<unknown>,
    default: undefined,
  },
  filterByType: {
    type: String,
    default: 'image/*',
  },

  imgUrl: {
    type: String,
    default: null,
  },
  stencil: {
    type: String as PropType<'rect' | 'circle'>,
    default: 'rect',
    validator: (val: string) => {
      return val === 'rect' || val === 'circle';
    },
  },
  imgWidth: {
    type: Number,
    default: undefined,
  },
  imgHeight: {
    type: Number,
    default: undefined,
  },
  aspectRatio: {
    type: Number,
    default: undefined,
  },
  modelValue: {
    type: Object as PropType<File | null>,
    default: null,
    validator: (val) => {
      return val != null && typeof val === 'object';
    },
  },
});
const props = useDefaults(_props, 'VImageInput');
const attrs = useAttrs();

const densityClasses = computed(() => [`v-image-input--density-${props.density}`]);

const filterAccepted = (files: File[]) => {
  const accept = (props.filterByType || '').trim();
  if (!accept) return { accepted: files };

  const accepted = files.filter((file) => {
    const type = file.type || '';
    return accept.split(',').some((rule) => {
      const token = rule.trim();
      if (!token) return false;
      if (token === '*/*') return true;
      if (token.endsWith('/*')) {
        const base = token.slice(0, -1);
        return type.startsWith(base);
      }
      return token === type;
    });
  });

  return { accepted };
};

const model = useModel(props, 'modelValue');

const isDragging = shallowRef(false);
const vSheetRef = ref<InstanceType<typeof VSheet> | null>(null);
const inputRef = ref<HTMLInputElement>();
const inputProps = computed(() => ({
  disabled: props.disabled,
  readonly: props.readonly,
  hideDetails: props.hideDetails,
  messages: props.messages,
  errorMessages: props.errorMessages,
  maxErrors: props.maxErrors,
  rules: props.rules,
  density: props.density,
}));
const fieldProps = computed(() => ({
  clearable: props.clearable,
  clearIcon: props.clearIcon,
  disabled: props.disabled,
  readonly: props.readonly,
  label: props.label,
  hint: props.hint,
  persistentHint: props.persistentHint,
  variant: props.variant,
  density: props.density,
}));
const rootAttrs = computed(() => attrs);
const inputAttrs = computed(() => {
  const relevant = ['accept', 'capture', 'multiple'];
  const output: Record<string, unknown> = {};
  for (const key of relevant) {
    if (key in attrs) output[key] = attrs[key];
  }
  return output;
});

const acceptFallback = attrs['accept'] ? String(attrs['accept']) : 'image/*';
const inputAccept = props.filterByType ?? acceptFallback;

const fileUrl = ref<string | null>(props.imgUrl ?? null);
const image = ref<File>();
const showCropper = ref(false);

const onDragover = (e: DragEvent) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  isDragging.value = true;
};

const onDragleave = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  isDragging.value = false;

  if (!inputRef.value) return;

  const allDroppedFiles = Array.from(e.dataTransfer?.files ?? []);
  selectAccepted(allDroppedFiles);
};

const onFileSelection = (e: Event) => {
  if (!e.target || (e as Event & { repack?: boolean }).repack) return; // prevent loop

  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    selectAccepted(Array.from(target.files));
  }
};

const selectAccepted = (files: File[]) => {
  const dataTransfer = new DataTransfer();
  const { accepted } = filterAccepted(files);

  for (const file of accepted) {
    dataTransfer.items.add(file);
  }

  image.value = dataTransfer.files?.[0] ?? null;
  showCropper.value = true;

  if (inputRef.value) {
    inputRef.value.files = dataTransfer.files;

    const event = new Event('change', { bubbles: true }) as Event & { repack?: boolean };
    event.repack = true;
    inputRef.value.dispatchEvent(event);
  }
};

const onFileCropped = (file: File) => {
  showCropper.value = false;
  clear();
  model.value = file;
  fileUrl.value = URL.createObjectURL(file);
};

const onClick = () => {
  inputRef.value?.click();
};

const onClickRemove = () => {
  model.value = null;
  clear();
};

const clear = () => {
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
  fileUrl.value = null;

  if (!inputRef.value) return;

  inputRef.value.value = '';
};

watch(() => [props.imgUrl, props.modelValue], (newValues) => {
  const [newImgUrl, newModelValue] = newValues as [string | null, File | null];

  if (newModelValue) {
    onFileCropped(newModelValue);
  } else if (typeof newImgUrl === 'string') {
    clear();
    fileUrl.value = newImgUrl ?? null;
  }
});

onBeforeUnmount(() => {
  clear();
});
</script>

<template>
  <VInput
    v-bind="{
      ...inputProps,
      ...rootAttrs,
    }"
    :class="[
      'v-image-input',
      props.class,
      {
        'v-input--focused': isDragging,
      },
    ]"
  >
    <template #default="{ id, isDirty, isValid, isReadonly }">
      <VField
        :id="id.value"
        v-bind="{
          ...fieldProps,
          centerAffix: false,
          error: isValid.value === false,
          dirty: isDirty.value || !!fileUrl,
          loading: props.loading,
        }"
        :class="[
          'v-image-input__field',
          {
            'v-field--focused': isDragging,
          },
        ]"
        @click:clear="!isReadonly.value ? onClickRemove() : undefined"
      >
        <template #default="{ props: { class: fieldClass } }">
          <VSheet
            ref="vSheetRef"
            :class="[
              'bg-transparent',
              fieldClass,
              {
                'v-image-input--clickable': !isReadonly.value,
                'v-image-input--disabled': isReadonly.value,
              },
              densityClasses,
            ]"
            :style="{ height: props.height }"
            @dragleave="!isReadonly.value ? onDragleave($event) : undefined"
            @dragover="!isReadonly.value ? onDragover($event) : undefined"
            @drop="!isReadonly.value ? onDrop($event) : undefined"
            @click="!isReadonly.value ? onClick() : undefined"
          >
            <VImg
              v-if="fileUrl"
              :src="fileUrl"
            />
          </VSheet>
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot v-if="slotName !== 'default'" :name="slotName" v-bind="slotProps"></slot>
        </template>
      </VField>
      <input
        ref="inputRef"
        type="file"
        :accept="inputAccept"
        :disabled="props.disabled"
        :name="props.name"
        v-bind="inputAttrs"
        @change="onFileSelection"
      >
      <VImageCropDialog
        v-model="showCropper"
        :file="image"
        :stencil="props.stencil"
        :img-width="props.imgWidth"
        :img-height="props.imgHeight"
        :aspect-ratio="props.aspectRatio"
        @update:file="onFileCropped"
      />
    </template>
  </VInput>
</template>

<style scoped lang="scss">
@use '../styles/styles.sass';
</style>
