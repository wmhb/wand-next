<template>
<div class="layoutWand">
  <header>
    <LogoSmall class="logo"/>
  </header>
<main class="admin-view">
  <slot/>
</main>
</div>
</template>

<script>
import LogoSmall from '../assets/logo-small.svg'

export default {
  name: 'Admin',
  components: {
    LogoSmall
  }
}
</script>

<style lang="scss">
@import '../scss/vars';
@import '../scss/mixins';
.logo {
  fill: $black;
  position: absolute;
  height: 9vw;
  top: 2vw;
  left: 2vw;
  z-index: 10;

  @include mq('sm') {
    height: 5vw;
  }

  transition: width $transition-short-duration $ease-cb;
}

.admin-view > .page-wrapper {
  padding: 12vw 2vw 2vw;
  overflow-x: hidden;
  height: 100%;

  @include mq('sm') {
    padding-top: 9vw;
  }
}

form {
  display: flex;
  flex-wrap: wrap;
}

.form__control {
  width: 100%;
}

textarea,
input[type="text"],
input[type="password"],
input[type="button"],
input[type="submit"] {
  -webkit-appearance: none;
  border-radius: 0;
}

.form__input {
  width: 100%;
  padding: .5em;
  margin-bottom: .5em;
  font-size: 1em;
  line-height: 1.25em;
}

.btn {
  flex: 1;
  background-color: $blue;
  border: none;
  padding: .5em;

  color: $white;
  font-size: 1.25em;
}
</style>
