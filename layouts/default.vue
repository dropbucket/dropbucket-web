<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="user.photoURL" />
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.displayName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-text-field
            v-model="msg"
            placeholder="Status message"
          />
        </v-list-item>
      </v-list>
      <v-divider />

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      msg: '',
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-delete',
          title: 'Trash',
          to: '/trash'
        },
        {
          icon: 'mdi-star-plus-outline',
          title: 'Starred',
          to: '/starred'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'DropBucket',
      user: {
        displayName: '',
        email: '',
        photoURL: ''
      }
    }
  },
  watch: {
    msg (value) {
      localStorage.setItem('msg', value)
    }
  },
  mounted () {
    const user = this.$fire.auth.currentUser
    if (user != null) {
      this.user = {
        ...this.user,
        ...user
      }
    }
  }
}
</script>
