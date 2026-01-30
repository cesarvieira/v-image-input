<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, useAttrs, useModel, watch, type PropType } from 'vue';
import { useDefaults, useLocale } from 'vuetify';
import { VField, VInput, VSheet } from 'vuetify/components';
import { makeDensityProps, useDensity } from 'vuetify/lib/composables/density.mjs';
import { makeFileFilterProps, useFileFilter } from 'vuetify/lib/composables/fileFilter.mjs';
import { filterInputAttrs } from 'vuetify/lib/util/helpers.mjs';
import { makeVSheetProps } from 'vuetify/lib/components/VSheet/VSheet.mjs';
import { useFileDrop } from 'vuetify/lib/composables/fileDrop.mjs';
import pt from '../locales/pt';
import en from '../locales/en';
import { makeVFieldProps } from 'vuetify/lib/components/VField/VField.mjs';
import { makeVInputProps } from 'vuetify/lib/components/VInput/VInput.mjs';
import VImageCropDialog from '@cesarv/v-image-crop-dialog';

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
  ...makeFileFilterProps({
    filterByType: 'image/*',
  }),
  ...makeVInputProps(),
  ...makeVFieldProps({
    clearable: true,
  }),
  ...makeDensityProps(),
  ...makeVSheetProps(),

  imgUrl: {
    type: String,
    default: null,
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

const { densityClasses } = useDensity(props, 'v-image-input');
const { filterAccepted } = useFileFilter(props);
const model = useModel(props, 'modelValue');

const isDragging = shallowRef(false);
const vSheetRef = ref<InstanceType<typeof VSheet> | null>(null);
const inputRef = ref<HTMLInputElement>();
const { handleDrop } = useFileDrop();

const inputProps = VInput.filterProps(props);
const fieldProps = VField.filterProps(props);
const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);

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

const onDrop = async (e: DragEvent) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  isDragging.value = false;

  if (!inputRef.value) return;

  const allDroppedFiles = await handleDrop(e);
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
        @update:file="onFileCropped"
      />
    </template>
  </VInput>
</template>

<style scoped lang="scss">
@use '../styles/styles.sass';
</style>
