<template>
  <div>
    <div class="text" :class="{ 'has-header': showHeader }">
      <v-input v-model="filter" placeholder="Type here" />
      <div class="button">
        <v-button @click="reload"> Reload </v-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useApi, useStores } from "@directus/extensions-sdk";
import { defineComponent, ref, onMounted, getCurrentInstance } from "vue";

export default defineComponent({
  props: {
    showHeader: {
      type: Boolean,
      default: false,
    },
    collection: {
      type: String,
      default: "",
    },
    field: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const filter = ref("");
    const { field, collection } = props;

    const api = useApi();
    const { useInsightsStore } = useStores();
    const insightsStore = useInsightsStore();

    const instance = getCurrentInstance();
    const { dashboard } = instance.vnode.props;

    const params = {
      params: {
        filter: { dashboard },
      },
    };

    async function patchFilter(panel: any): Promise<void> {
      try {
        const { id, options } = panel;
        const conditions = options.filter._and;

        const index = conditions.findIndex(
          (prop) => prop[collection][field]._eq
        );

        conditions[index][collection][field]._eq = filter.value;
        await api.patch(`panels/${id}`, { options });
      } catch {}
    }

    async function updateFilters(): Promise<void> {
      api.get("panels", params).then(async ({ data }) => {
        let list = [];
        for (const panel of data.data) {
          list.push(patchFilter(panel));
        }
        Promise.allSettled(list).then(async () => {
          await insightsStore.hydrate();
        });
      });
    }

    function reload() {
      localStorage.filter = filter.value;
      updateFilters();
    }

    onMounted(() => {
      if (localStorage.filter) {
        filter.value = localStorage.filter;
      }
    });

    return { filter, reload };
  },
});
</script>

<style scoped>
.text {
  padding: 12px;
}

.text.has-header {
  padding: 0 12px;
}

.button {
  padding-top: 12px;
}
</style>
