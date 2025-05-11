<!-- IfStatement.vue -->
<template>
    <div class="statement">
      <div>
        if (<ExpressionRenderer :expression="statement.condition" />) {
          <div class="block">
            <StatementRenderer v-for="(stmt, index) in statement.then.statements" :key="index" :statement="stmt" />
          </div>
        }
        <div v-if="statement.else">
          else {
            <div class="block">
              <StatementRenderer v-for="(stmt, index) in statement.else.statements" :key="'else-' + index" :statement="stmt" />
            </div>
          }
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import ExpressionRenderer from './ExpressionRenderer.vue';
  import StatementRenderer from './StatementRenderer.vue';
  const props = defineProps({ statement: Object });
  </script>
  