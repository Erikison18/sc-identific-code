<template>
  <div id="app">
    <h1>DEMO</h1>
    <code-manage></code-manage>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {

  },
  mounted() {
    
  }
};
</script>

<style lang="scss">
html {
  font-size: 14px;
}

body {
  font-size: 1rem;
  padding: 40px;
}

table,
th,
td {
  border: 1px #ddd solid;
}

table {
  border-collapse: collapse;
}

th,
td {
  padding: 8px 16px;
}

thead,
tbody tr:nth-of-type(even) {
  background-color: #fafafa;
}

button {
  background-image: linear-gradient(to bottom, #fff, #fafafa);
  border: 1px #ddd solid;
  border-radius: 4px;
  cursor: pointer;
  font-size: inherit;
  outline: none;
  padding: 8px 16px;

  &:hover {
    border-color: #ccc;
    background-image: linear-gradient(to bottom, #fafafa, #eee);
  }

  &:active {
    border-color: #09f;
    background-image: linear-gradient(to bottom, #fafafa, #eee);
    box-shadow: 0 0 0 3px fade-out(#09f, 0.85);
  }
}
</style>
