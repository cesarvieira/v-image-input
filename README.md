# V-Image-Input

Vue 3 component for image selection with integrated cropping, built with Vuetify 3 and TypeScript. Uses [@cesarv/v-image-crop-dialog](https://github.com/cesarvieira/v-image-crop-dialog) for the choose → crop → final file flow.

## Features

- Full integration with **Vuetify 3** (VField, VInput, density, variant)
- **Drag & drop** and click to select file
- **Crop dialog** after selection (via v-image-crop-dialog)
- **v-model** with `File | null` (cropped image in WebP)
- **Initial image** via URL (`img-url`)
- **Filter by type** (`filter-by-type`, e.g. PNG only)
- **Customizable height** (`height`)
- **Crop options**: **stencil** (rect / circle), **aspect-ratio**, **img-width** / **img-height** (output size)
- **Variant** and **density** (outlined, filled, plain / default, comfortable, compact)
- **Label**, **hint**, **readonly**, **disabled**, **clearable**
- **i18n** (pt, en) for placeholder texts
- **TypeScript** support

## Requirements

- Vue 3.5+
- Vuetify 3.11+

## Installation

```bash
npm install @cesarv/v-image-input
```

## Usage

### Global registration (optional)

```typescript
import { createApp } from 'vue';
import Vuetify from 'vuetify';
import { VImageInput } from '@cesarv/v-image-input';
import '@cesarv/v-image-input/dist/styles.css';

const app = createApp(App);
app.use(Vuetify);
app.component('VImageInput', VImageInput);
```

### Direct import in component

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VImageInput } from '@cesarv/v-image-input';
import '@cesarv/v-image-input/dist/styles.css';

const image = ref<File | null>(null);
</script>

<template>
  <VImageInput v-model="image" label="Select an image" />
</template>
```

## Examples

### Basic

```vue
<template>
  <VImageInput v-model="file" label="Select an image" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VImageInput } from '@cesarv/v-image-input';

const file = ref<File | null>(null);
</script>
```

### Initial image (img-url)

Shows a URL as preview before the user selects another image.

```vue
<template>
  <VImageInput
    v-model="file"
    label="Replace image"
    img-url="https://example.com/avatar.jpg"
  />
</template>
```

### PNG only (filter-by-type)

Restricts selection to `image/png` type.

```vue
<template>
  <VImageInput
    v-model="file"
    label="Select a PNG"
    filter-by-type="image/png"
  />
</template>
```

### Height (height)

Sets the preview area height in pixels.

```vue
<template>
  <VImageInput v-model="file" label="Avatar" height="160" />
</template>
```

### Variant (outlined, filled, plain)

Field style, same as Vuetify fields.

```vue
<template>
  <VImageInput v-model="file" label="Outlined" variant="outlined" />
  <VImageInput v-model="file" label="Filled" variant="filled" />
  <VImageInput v-model="file" label="Plain" variant="plain" />
</template>
```

### Density (default, comfortable, compact)

Controls the component’s vertical density.

```vue
<template>
  <VImageInput v-model="file" label="Default" density="default" />
  <VImageInput v-model="file" label="Comfortable" density="comfortable" />
  <VImageInput v-model="file" label="Compact" density="compact" />
</template>
```

### Stencil (circle) and aspect ratio

Circular crop with fixed 1:1 ratio (e.g. for avatars).

```vue
<template>
  <VImageInput
    v-model="file"
    label="Avatar (circle)"
    stencil="circle"
    :aspect-ratio="1"
  />
</template>
```

### Aspect ratio only

Rectangular crop with fixed ratio (e.g. 16:9). Output size follows the crop.

```vue
<template>
  <VImageInput
    v-model="file"
    label="16:9 crop"
    :aspect-ratio="16 / 9"
  />
</template>
```

### Output size (img-width, img-height, aspect-ratio)

Cropped image is resized to the given dimensions with the given aspect ratio.

```vue
<template>
  <VImageInput
    v-model="file"
    label="400×300 (4:3)"
    :img-width="400"
    :img-height="300"
    :aspect-ratio="4 / 3"
  />
</template>
```

### Label and hint

```vue
<template>
  <VImageInput
    v-model="file"
    label="Profile photo"
    hint="JPG or PNG, up to 5MB"
    persistent-hint
  />
</template>
```

### Readonly and disabled

```vue
<template>
  <VImageInput v-model="file" label="Read only" readonly />
  <VImageInput v-model="file" label="Disabled" disabled />
</template>
```

### External validation (e.g. max size)

The component does not validate file size; validation is up to your code.

```vue
<template>
  <VImageInput v-model="file" label="Image up to 2MB" />
  <VAlert v-if="file && file.size > 2 * 1024 * 1024" type="error">
    File larger than 2MB.
  </VAlert>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const file = ref<File | null>(null);
</script>
```

## API

### Main props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `File \| null` | `null` | Cropped image file (v-model). |
| `imgUrl` | `string` | `null` | URL of the image shown initially (preview). |
| `filterByType` | `string` | `'image/*'` | Type accepted by the input (e.g. `'image/png'`). |
| `height` | `string \| number` | — | Preview area height (e.g. `'160'`, `160`). |
| `stencil` | `'rect' \| 'circle'` | `'rect'` | Crop stencil shape (rectangular or circular). |
| `aspectRatio` | `number` | — | Crop aspect ratio (e.g. `1`, `16/9`, `4/3`). |
| `imgWidth` | `number` | — | Output image width in pixels (after crop). |
| `imgHeight` | `number` | — | Output image height in pixels (after crop). |
| `variant` | `'outlined' \| 'filled' \| 'plain'` | — | Field visual variant (VField). |
| `density` | `'default' \| 'comfortable' \| 'compact'` | — | Component density. |
| `label` | `string` | — | Field label. |
| `hint` | `string` | — | Help text. |
| `persistentHint` | `boolean` | — | Keeps hint always visible. |
| `clearable` | `boolean` | `true` | Shows button to clear the image. |
| `disabled` | `boolean` | — | Disables the input. |
| `readonly` | `boolean` | — | Read only (cannot change or clear). |

Other **VInput**, **VField**, and **VSheet** props from Vuetify are forwarded when applicable.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `File \| null` | Emitted when the image is changed or removed (after crop or clear). |

### v-model

- **Value:** `File | null`
- After the user selects a file, the crop dialog opens. On confirm, the component emits the `File` (WebP) via `update:modelValue`. On clear, it emits `null`.

## Playground

The repository includes a playground in `playground/` with usage examples. To run it:

```bash
git clone https://github.com/cesarvieira/v-image-input.git
cd v-image-input
npm install
npm run dev
```

## Dependencies

- [@cesarv/v-image-crop-dialog](https://github.com/cesarvieira/v-image-crop-dialog) — crop dialog (included as package dependency).

## Notes

- The cropped image is exported in **WebP** by v-image-crop-dialog.
- The component includes translations for **pt** and **en** for drag & drop texts; use Vuetify’s locale to switch.
- Vuetify must be configured in your project.

## License

ISC

## Author

[Cesar Vieira](https://github.com/cesarvieira)
