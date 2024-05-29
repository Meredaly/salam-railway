<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '@/UI/Icon'

  const props = defineProps({
    title: { type: String, default: '' },
    prevIcon: { type: String, default: '' },
    appendIcon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    styles: { type: String, default: 'primary' },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  })

  const classes = computed(() => {
    return [
      'button',
      `button_${props.styles}`,
      {
        button_block: props.block,
        button_loading: props.loading
      }
    ]
  })
</script>

<template>
  <button :class="classes">
    <div v-if="prevIcon" class="button__prev-icon">
      <icon :name="prevIcon" />
    </div>
    <div v-if="title" class="button__text">{{ title }}</div>
    <div v-if="appendIcon" class="button__append-icon">
      <icon :name="appendIcon" />
    </div>
  </button>
</template>

<style scoped lang="scss">
  .button {
    border: 1px solid transparent;
    padding: 10px;
    background-color: transparent;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;

    &_primary {
      background-color: var(--primary);
      color: var(--true-white);
      .button__text {
      }
    }
    &_gray {
      background-color: var(--shade-400);
      color: var(--text);
      .button__text {
      }
      &:hover {
        background-color: var(--gray);
      }
    }
    &_block {
      width: 100%;
    }

    // .button__prev-icon
    &__prev-icon {
      &:deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .button__text
    &__text {
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      flex: 1 1;
    }
    // .button__append-icon
    &__append-icon {
      &:deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    // .button_loading
    &_loading {
      &::after {
        content: '';
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid var(--true-white);
        border-left-color: transparent;
        position: absolute;
        top: 50%;
        left: 50%;
        animation: rotate 0.8s linear infinite;
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      }

      .button__prev-icon,
      .button__append-icon,
      .button__text {
        opacity: 0;
        visibility: hidden;
      }
    }
  }
</style>
