<template>
  <div :aria-details="header" class="col-auto">
    <button
      type="button"
      :class="'btn btn-' + secondButtonClass"
      @click="openModal"
      :disabled="!modalCondition"
    >
      <button-tooltip :header="header" :icons="tooltipIcons" />
    </button>
    <div class="modal fade" ref="scoreModal" :id="slugify(header)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ header }}</h5>
            <button
              type="button"
              class="btn-close"
              :id="'close-' + slugify(header)"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row gy-2 justify-content-center">
              <slot name="selectOption"></slot>
            </div>
          </div>
          <div class="modal-footer">
            <slot name="setOptions"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import ButtonTooltip from "./ButtonTooltip.vue";
import { Modal } from "bootstrap";

export default {
  components: { ButtonTooltip },
  data() {
    return {
      modal: null,
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs.scoreModal, {
      backdrop: "static",
      keyboard: false,
    });
  },
  props: {
    header: {
      type: String,
      required: true,
    },
    modalCondition: {
      required: true,
    },
    tooltipIcons: {
      type: Array,
      required: true,
    },
    secondButtonClass: {
      type: String,
      required: true,
    },
  },
  methods: {
    slugify(str) {
      return _.kebabCase(str);
    },
    openModal() {
      this.modal.show();
    },
    closeModal() {
      document.activeElement?.blur();
      this.modal.hide();
    },
  },
};
</script>
