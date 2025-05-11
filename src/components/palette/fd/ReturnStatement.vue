<!-- ReturnStatement.vue -->
<template>
    <div class="statement">return
        <ExpressionRenderer :expression="statement.expression" />;
    </div>
</template>

<script setup>
import ExpressionRenderer from './ExpressionRenderer.vue';
const props = defineProps({ statement: Object });
</script>
