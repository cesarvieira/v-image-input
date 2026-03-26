<script setup lang="ts">
import { computed, ref } from 'vue';
import { VImageInput } from '../src/index';

// Basic
const basicResult = ref<File | null>(null);
const basicUrl = computed(() =>
  basicResult.value ? URL.createObjectURL(basicResult.value) : null,
);

// With initial image
const withInitialResult = ref<File | null>(null);
const initialImageUrl = 'https://picsum.photos/seed/initial/400/400';
const withInitialUrl = computed(() =>
  withInitialResult.value ? URL.createObjectURL(withInitialResult.value) : null,
);

// Specific accept (PNG only)
const pngResult = ref<File | null>(null);
const pngUrl = computed(() =>
  pngResult.value ? URL.createObjectURL(pngResult.value) : null,
);

// Different heights
const smallResult = ref<File | null>(null);
const mediumResult = ref<File | null>(null);
const largeResult = ref<File | null>(null);
const smallUrl = computed(() =>
  smallResult.value ? URL.createObjectURL(smallResult.value) : null,
);
const mediumUrl = computed(() =>
  mediumResult.value ? URL.createObjectURL(mediumResult.value) : null,
);
const largeUrl = computed(() =>
  largeResult.value ? URL.createObjectURL(largeResult.value) : null,
);

// Validation (max 2MB)
const validatedResult = ref<File | null>(null);
const validatedUrl = computed(() =>
  validatedResult.value ? URL.createObjectURL(validatedResult.value) : null,
);
const maxSizeBytes = 2 * 1024 * 1024;
const isValid = computed(() => {
  if (!validatedResult.value) return null;
  return validatedResult.value.size <= maxSizeBytes;
});

// Readonly / Disabled
const readonlyResult = ref<File | null>(null);
const disabledResult = ref<File | null>(null);
const readonlyUrl = computed(() =>
  readonlyResult.value ? URL.createObjectURL(readonlyResult.value) : null,
);
const disabledUrl = computed(() =>
  disabledResult.value ? URL.createObjectURL(disabledResult.value) : null,
);

// Multiple
const multiResults = ref<(File | null)[]>([null, null, null]);
const multiUrls = computed(() =>
  multiResults.value.map(file => (file ? URL.createObjectURL(file) : null)),
);

// With label and hint
const labeledResult = ref<File | null>(null);
const labeledUrl = computed(() =>
  labeledResult.value ? URL.createObjectURL(labeledResult.value) : null,
);

// Variant (outlined, filled, plain)
const variantOutlined = ref<File | null>(null);
const variantFilled = ref<File | null>(null);
const variantPlain = ref<File | null>(null);
const variantOutlinedUrl = computed(() =>
  variantOutlined.value ? URL.createObjectURL(variantOutlined.value) : null,
);
const variantFilledUrl = computed(() =>
  variantFilled.value ? URL.createObjectURL(variantFilled.value) : null,
);
const variantPlainUrl = computed(() =>
  variantPlain.value ? URL.createObjectURL(variantPlain.value) : null,
);

// Density (default, comfortable, compact)
const densityDefault = ref<File | null>(null);
const densityComfortable = ref<File | null>(null);
const densityCompact = ref<File | null>(null);
const densityDefaultUrl = computed(() =>
  densityDefault.value ? URL.createObjectURL(densityDefault.value) : null,
);
const densityComfortableUrl = computed(() =>
  densityComfortable.value ? URL.createObjectURL(densityComfortable.value) : null,
);
const densityCompactUrl = computed(() =>
  densityCompact.value ? URL.createObjectURL(densityCompact.value) : null,
);

// Stencil (circle) + aspect ratio 1 – e.g. avatar
const stencilCircleResult = ref<File | null>(null);
const stencilCircleUrl = computed(() =>
  stencilCircleResult.value ? URL.createObjectURL(stencilCircleResult.value) : null,
);

// Aspect ratio only (e.g. 16/9)
const aspectRatioResult = ref<File | null>(null);
const aspectRatioUrl = computed(() =>
  aspectRatioResult.value ? URL.createObjectURL(aspectRatioResult.value) : null,
);

// imgWidth + imgHeight + aspectRatio – fixed output size
const sizedCropResult = ref<File | null>(null);
const sizedCropUrl = computed(() =>
  sizedCropResult.value ? URL.createObjectURL(sizedCropResult.value) : null,
);

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
</script>

<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h1 class="text-display-small mb-4">VImageInput - Playground</h1>
        <p class="text-body-large mb-6">
          Explore different configurations and use cases of the VImageInput component.
        </p>
      </VCol>
    </VRow>

    <!-- 1. Basic -->
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>1. Basic</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Simple usage with v-model.</p>
            <VImageInput v-model="basicResult" label="Select an image" />
          </VCardText>
          <VCardText v-if="basicResult">
            <VDivider class="mb-4" />
            <h4 class="text-body-large mb-2">Result:</h4>
            <VTable density="compact">
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{{ basicResult.name }}</td>
                </tr>
                <tr>
                  <td><strong>Type:</strong></td>
                  <td>{{ basicResult.type }}</td>
                </tr>
                <tr>
                  <td><strong>Size:</strong></td>
                  <td>{{ formatSize(basicResult.size) }}</td>
                </tr>
              </tbody>
            </VTable>
            <VImg v-if="basicUrl" :src="basicUrl" max-height="200" class="mt-4 rounded" />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 2. Initial image -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>2. Initial image (img-url)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Shows a URL as preview before selection.</p>
            <VImageInput
              v-model="withInitialResult"
              label="Replace image"
              :img-url="initialImageUrl"
            />
          </VCardText>
          <VCardText v-if="withInitialResult">
            <VDivider class="mb-4" />
            <p class="text-body-small">New image selected:</p>
            <VImg v-if="withInitialUrl" :src="withInitialUrl" max-height="200" class="mt-2 rounded" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 3. PNG only -->
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>3. PNG only (filter-by-type)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Restricts selection to image/png type.</p>
            <VImageInput
              v-model="pngResult"
              label="Select a PNG"
              filter-by-type="image/png"
            />
          </VCardText>
          <VCardText v-if="pngResult">
            <VDivider class="mb-4" />
            <p class="text-body-small">File: {{ pngResult.name }} ({{ formatSize(pngResult.size) }})</p>
            <VImg v-if="pngUrl" :src="pngUrl" max-height="200" class="mt-2 rounded" />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 4. Validation -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>4. Validation (max 2MB)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Example of external validation by size.</p>
            <VImageInput v-model="validatedResult" label="Image up to 2MB" />
            <VAlert
              v-if="validatedResult && isValid !== null"
              :type="isValid ? 'success' : 'error'"
              variant="tonal"
              class="mt-4"
              density="compact"
            >
              {{ isValid ? 'Size OK.' : 'File larger than 2MB.' }}
              {{ formatSize(validatedResult.size) }}
            </VAlert>
          </VCardText>
          <VCardText v-if="validatedResult && isValid">
            <VImg v-if="validatedUrl" :src="validatedUrl" max-height="200" class="rounded" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 5. Different heights -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>5. Different heights (height)</VCardTitle>
          <p class="text-body-small px-4">Small, medium and large via height prop.</p>
          <VCardText>
            <VRow>
              <VCol cols="12" sm="4">
                <VImageInput v-model="smallResult" label="Small" height="100" />
                <VImg
                  v-if="smallUrl"
                  :src="smallUrl"
                  max-height="120"
                  class="mt-2 rounded"
                />
              </VCol>
              <VCol cols="12" sm="4">
                <VImageInput v-model="mediumResult" label="Medium" height="160" />
                <VImg
                  v-if="mediumUrl"
                  :src="mediumUrl"
                  max-height="120"
                  class="mt-2 rounded"
                />
              </VCol>
              <VCol cols="12" sm="4">
                <VImageInput v-model="largeResult" label="Large" height="220" />
                <VImg
                  v-if="largeUrl"
                  :src="largeUrl"
                  max-height="120"
                  class="mt-2 rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 6. Readonly and Disabled -->
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>6. Read only (readonly)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Does not allow changing or clearing the image.</p>
            <VImageInput v-model="readonlyResult" label="Readonly" readonly />
            <VImg v-if="readonlyUrl" :src="readonlyUrl" max-height="180" class="mt-4 rounded" />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>7. Disabled (disabled)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Field disabled.</p>
            <VImageInput v-model="disabledResult" label="Disabled" disabled />
            <VImg v-if="disabledUrl" :src="disabledUrl" max-height="180" class="mt-4 rounded" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 8. Label and hint -->
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>8. Label and hint</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">With label and help message.</p>
            <VImageInput
              v-model="labeledResult"
              label="Profile photo"
              hint="JPG or PNG, up to 5MB"
              persistent-hint
            />
          </VCardText>
          <VCardText v-if="labeledResult">
            <VDivider class="mb-4" />
            <VImg v-if="labeledUrl" :src="labeledUrl" max-height="200" class="rounded" />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 9. Multiple inputs -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>9. Multiple inputs</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">Multiple VImageInput on the same screen.</p>
            <VRow>
              <VCol v-for="(_, i) in multiResults" :key="i" cols="4">
                <VImageInput v-model="multiResults[i]" :label="`Image ${i + 1}`" height="100" />
                <VImg
                  v-if="multiUrls[i]"
                  :src="multiUrls[i]"
                  max-height="80"
                  class="mt-2 rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 10. Variant (outlined, filled, plain) -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>10. Variant (variant)</VCardTitle>
          <p class="text-body-small px-4">
            Field style: outlined (border), filled (filled), plain (minimal).
          </p>
          <VCardText>
            <VRow>
              <VCol cols="12" md="4">
                <VImageInput
                  v-model="variantOutlined"
                  label="Outlined"
                  variant="outlined"
                  height="140"
                />
                <VImg
                  v-if="variantOutlinedUrl"
                  :src="variantOutlinedUrl"
                  max-height="100"
                  class="mt-2 rounded"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VImageInput
                  v-model="variantFilled"
                  label="Filled"
                  variant="filled"
                  height="140"
                />
                <VImg
                  v-if="variantFilledUrl"
                  :src="variantFilledUrl"
                  max-height="100"
                  class="mt-2 rounded"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VImageInput
                  v-model="variantPlain"
                  label="Plain"
                  variant="plain"
                  height="140"
                />
                <VImg
                  v-if="variantPlainUrl"
                  :src="variantPlainUrl"
                  max-height="100"
                  class="mt-2 rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 11. Density (default, comfortable, compact) -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>11. Density (density)</VCardTitle>
          <p class="text-body-small px-4">
            Vertical density: default, comfortable (less padding), compact (more compact).
          </p>
          <VCardText>
            <VRow>
              <VCol cols="12" md="4">
                <VImageInput
                  v-model="densityDefault"
                  label="Default"
                  density="default"
                  height="140"
                />
                <VImg
                  v-if="densityDefaultUrl"
                  :src="densityDefaultUrl"
                  max-height="100"
                  class="mt-2 rounded"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VImageInput
                  v-model="densityComfortable"
                  label="Comfortable"
                  density="comfortable"
                  height="140"
                />
                <VImg
                  v-if="densityComfortableUrl"
                  :src="densityComfortableUrl"
                  max-height="100"
                  class="mt-2 rounded"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VImageInput
                  v-model="densityCompact"
                  label="Compact"
                  density="compact"
                  height="140"
                />
                <VImg
                  v-if="densityCompactUrl"
                  :src="densityCompactUrl"
                  max-height="100"
                  class="mt-2 rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 12. Stencil (circle) + aspect ratio -->
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>12. Stencil circle (stencil + aspect-ratio)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">
              Circular crop with fixed 1:1 ratio. Useful for avatars.
            </p>
            <VImageInput
              v-model="stencilCircleResult"
              label="Avatar (circle)"
              stencil="circle"
              :aspect-ratio="1"
              height="140"
            />
          </VCardText>
          <VCardText v-if="stencilCircleResult">
            <VImg
              v-if="stencilCircleUrl"
              :src="stencilCircleUrl"
              max-height="160"
              class="rounded-circle"
              style="aspect-ratio: 1; object-fit: cover"
            />
          </VCardText>
        </VCard>
      </VCol>

      <!-- 13. Aspect ratio only -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>13. Aspect ratio (aspect-ratio)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">
              Rectangular crop with fixed 16:9 ratio. Output size follows crop.
            </p>
            <VImageInput
              v-model="aspectRatioResult"
              label="16:9 crop"
              :aspect-ratio="16 / 9"
              height="140"
            />
          </VCardText>
          <VCardText v-if="aspectRatioResult">
            <VImg
              v-if="aspectRatioUrl"
              :src="aspectRatioUrl"
              max-height="200"
              class="rounded"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 14. imgWidth + imgHeight + aspectRatio -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>14. Output size (img-width, img-height, aspect-ratio)</VCardTitle>
          <VCardText>
            <p class="text-body-small mb-4">
              Cropped image is resized to 400×300 with 4:3 aspect ratio.
            </p>
            <VImageInput
              v-model="sizedCropResult"
              label="400×300 (4:3)"
              :img-width="400"
              :img-height="300"
              :aspect-ratio="4 / 3"
              height="140"
            />
          </VCardText>
          <VCardText v-if="sizedCropResult">
            <p class="text-body-small mb-2">
              Output: {{ sizedCropResult.name }} ({{ formatSize(sizedCropResult.size) }})
            </p>
            <VImg
              v-if="sizedCropUrl"
              :src="sizedCropUrl"
              max-height="200"
              class="rounded"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
