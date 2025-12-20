<template>
  <div class="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          @click="toggle()"
        >
          <slot name="header"></slot>
        </button>
      </h2>

      <div class="accordion-collapse collapse" ref="collapseEl">
        <div class="accordion-body">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Collapse } from "bootstrap";

export default {
  name: "Accordion",
  data() {
    return {
      collapse: null,
    };
  },
  mounted() {
    this.collapse = new Collapse(this.$refs.collapseEl, {
      toggle: false,
    });
  },
  methods: {
    toggle() {
      this.collapse.toggle();
    },
  },
};
</script>
