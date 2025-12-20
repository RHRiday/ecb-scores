<template>
  <span data-bs-toggle="tooltip" data-bs-placement="top" :title="header">
    <span v-for="(icon, index) in icons">
      <fa-icon :icon="icon" />
      <span v-if="index < icons.length - 1"> &nbsp; </span>
    </span>
  </span>
</template>

<script>
export default {
  name: "ButtonTooltip",
  props: {
    header: {
      type: String,
      required: true,
    },
    icons: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
