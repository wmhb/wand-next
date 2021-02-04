<template>
  <Layout name="LayoutAdmin">
    <div class="page-wrapper login-wrapper bg-lightgrey">
      <h1>Log In</h1>
      <p>Einloggen um die wmhb Wand zu steuern.</p>
      <span class="errors" v-if="errors">Error:<br>{{ errors }}</span>
      <form @submit.prevent="login">
        <div class="form__control">
          <input type="text"
                class="form__input input--light"
                placeholder="Usernamen eingeben"
                v-model="credentials.username">
        </div>
        <div class="form__control">
          <input type="password"
                class="form__input input--light"
                placeholder="Passwort eingeben"
                v-model="credentials.password">
        </div>
        <button class="btn" type="submit">Absenden</button>
      </form>
    </div>
  </Layout>
</template>

<script>
import Layout from '../lib/Layout'

export default {
  name: 'login',
  components: {
    Layout
  },
  mounted() {},
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      errors: ''
    }
  },
  created() {},
  methods: {
    login() {
      const { username, password } = this.credentials
      this.$store
        .dispatch('auth_request', { username, password })
        .then(() => {
          this.$router.push('/admin')
        })
        .catch((e) => {
          this.errors = e.data
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/vars';

.errors {
  display: block;
  font-weight: 700;
  color: $white;
  background-color: $tomatored;
  padding: 1em;
  margin-bottom: .5em;
}
</style>
