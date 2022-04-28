<template>
  <div>
    <div class="text" :class="{ 'has-header': showHeader }">
      <v-input v-model="form" placeholder="Type here" />
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
    filter: {
      type: Object,
      default: "",
    },
  },
  setup(props) {
    const form = ref("");
    const { filter, collection } = props;

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

    function firstLeaf(object: Object) {
      const child = Object.keys(object);
      return child.length > 0 && child[0] !== "0"
        ? [child[0], ...firstLeaf(object[child[0]])]
        : [];
    }

    async function patchFilter(panel: any): Promise<void> {
      try {
        const { id, options } = panel;
        const conditions = options.filter._and;
        let path = firstLeaf(filter._and[0]);
        path.pop();

        const index = conditions.findIndex((prop) => {
          let coll = prop;
          for (const collection of path) {
            coll = coll[collection];
          }
          return coll._eq;
        });

        let cond = conditions[index];
        for (const collection of path) {
          cond = cond[collection];
        }
        cond._eq = form.value;
        console.log(conditions[index]);

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
      localStorage.filter = form.value;
      console.log("store");
      updateFilters();
    }

    onMounted(() => {
      if (localStorage.filter) {
        form.value = localStorage.filter;
      }
    });

    return { form, reload };
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
