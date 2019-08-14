<template>
  <div class="card widget bearer-token-widget">
    <div class="card-header bg-primary text-white ct-chart provisions-today">
      <p>Bearer Token</p>
    </div>
    <div class="card-body text-center">
      <p>Auth Time: {{authTime}}</p>
      <p>Expires: {{expiresAt}}</p>
      <button class="btn btn-primary" @click="copyToken()">Copy Bearer Token</button>
    </div>
  </div>
</template>
<script src="./bearer-token-widget.js"></script>
<style lang="scss" src="./bearer-token-widget.scss" scoped></style>
