<!-- EmitStatement.vue -->
<template>
    <div class="statement">emit {{ statement.event }}(<span v-for="(arg, i) in statement.args" :key="i">
            <ExpressionRenderer :expression="{ type: 'Identifier', value: arg }" />
            <span v-if="i < statement.args.length - 1">, </span>
        </span>);</div>
</template>

<script setup>
import ExpressionRenderer from './ExpressionRenderer.vue';
const props = defineProps({ statement: Object });
</script>