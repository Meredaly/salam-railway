<script setup lang="ts">
  import { ref } from 'vue'
  import Icon from '@/UI/Icon'
  import { computed } from 'vue'

  const emit = defineEmits([
    'click:prevent',
    'click:append',
    'update:modelValue',
    'click:input',
    'value',
    'updateValue'
  ])

  const props = defineProps({
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    value: { type: String, default: '' },
    type: { type: String, default: 'text' },
    prevIcon: { type: String, default: '' },
    appendIcon: { type: String, default: '' },
    preventClickable: { type: Boolean, default: false },
    appendClickable: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  })

  const isFocus = ref<boolean>(false)

  const classes = computed(() => {
    return [
      'text-field',
      {
        'text-field_focus': isFocus.value,
        'text-field_color': props.type === 'color',
        'text-field_error': props.error,
        'text-field_disabled': props.disabled
      }
    ]
  })

  const update = (newValue: number | string) => {
    if (props.type === 'number') newValue = Number(newValue)

    emit('update:modelValue', newValue)
    emit('value', newValue)
    emit('updateValue', newValue)
  }

  const preventClick = () => {
    emit('click:prevent')
  }
  const appendClick = () => {
    emit('click:append')
  }
</script>

<template>
  <div :class="classes">
    <div v-if="label" class="text-field__label">{{ label }}</div>
    <div class="text-field__body">
      <div v-if="prevIcon" @click="preventClick" :class="['text-field__prev-icon', { _clickable: preventClickable }]">
        <icon :name="prevIcon" />
      </div>
      <div class="text-field__input">
        <input
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :value="modelValue || value"
          @click="$emit('click:input')"
          @focus="isFocus = true"
          @blur="isFocus = false"
          @input="(event: Event) => update((event.target as HTMLInputElement).value)"
        />
      </div>
      <div v-if="appendIcon" @click="appendClick" :class="['text-field__append-icon', { _clickable: appendClickable }]">
        <icon :name="appendIcon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .text-field {
    width: 100%;
    // .text-field_focus
    &_focus {
    }
    // text-field_error
    &_error {
      animation: 0.2s invalid forwards;
      .text-field__body {
        border-color: var(--red);
        background-color: var(--red-500);
      }
    }
    // .text-field_color
    &_color {
      .text-field__body {
        .text-field__input {
          input {
            padding: 4px 4px;
            height: 44px;
          }
        }
      }
    }
    // .text-field_disabled
    &_disabled {
    }

    // .text-field__label
    &__label {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: var(--text);
      margin-bottom: 4px;
    }
    // .text-field__body
    &__body {
      width: 100%;
      background: var(--background);
      border: 1px solid var(--shade-400);
      border-radius: 6px;
      text-align: left;
      display: flex;
      align-items: center;
    }
    // .text-field__prev-icon
    &__prev-icon {
      display: block;
      padding: 10px;
      pointer-events: none;
      color: var(--caption);
      user-select: none;
      :deep(svg) {
        width: 20px;
        height: 20px;
      }

      &._clickable {
        pointer-events: all;
        cursor: pointer;
      }
    }
    .text-field__prev-icon + .text-field__input {
      margin-left: -10px;
    }
    // .text-field__input
    &__input {
      flex: 1 1;
      width: 0;
      input {
        width: 100%;
        background-color: transparent;
        font-size: 14px;
        line-height: 20px;
        padding: 12px 10px;
        color: var(--text);
        &::placeholder {
          color: var(--gray);
        }

        &[type='number'] {
          -moz-appearance: textfield;
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }
    }
    // .text-field__append-icon
    &__append-icon {
      display: block;
      padding: 10px;
      pointer-events: none;
      user-select: none;
      color: var(--caption);
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
      &._clickable {
        pointer-events: all;
        cursor: pointer;
      }
    }
  }
</style>
