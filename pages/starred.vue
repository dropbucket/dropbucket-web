<template>
  <v-container>
    <v-row>
      <v-col align-self="end" style="text-align: right;">
        <v-btn
          right
          color="yellow darken-4"
          class="mb-4 white--text"
          @click="removeStar"
        >
          <v-icon dark left>
            mdi-star-minus-outline
          </v-icon>
          Remove Star
        </v-btn>
        <v-btn
          right
          color="light-blue darken-2"
          class="mb-4 white--text"
          @click="share"
        >
          <v-icon dark left>
            mdi-export-variant
          </v-icon>
          Share
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
    >
      {{ text }}

      <template>
        <v-btn
          color="pink"
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <FileList :clickable="false" :files="files" @selected="(value) => {itemSelected = value}" @refresh="refresh" />
    <input ref="newFile" type="file" hidden>
  </v-container>
</template>

<script>
import FileList from '@/components/fileList'

export default {
  components: {
    FileList
  },
  data () {
    return {
      newFolderDialog: false,
      singleSelect: false,
      files: [

      ],
      text: '',
      snackbar: false,
      itemSelected: {}
    }
  },
  mounted () {
    const self = this
    this.$axios.get('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/favorites').then((res) => {
      // console.log(res.data.data.Items)
      self.files = res.data.data.Items
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    removeStar () {
      const self = this
      this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/favorites/item', {
        id: this.itemSelected.id
      }).then(() => {
        self.refresh()
      })
    },
    refresh () {
      const self = this
      this.$axios.get('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/favorites').then((res) => {
      // console.log(res.data.data.Items)
        self.files = res.data.data.Items
      }).catch((error) => {
        console.log(error)
      })
    },
    share () {
      const self = this
      this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/share/item', {
        id: this.itemSelected.id
      }).then((res) => {
        self.snackbar = true
        self.text = 'Shared link has been copied to the clipboard'

        const tempElem = document.createElement('textarea')
        tempElem.value = res.data.url
        document.body.appendChild(tempElem)

        tempElem.select()
        document.execCommand('copy')
        document.body.removeChild(tempElem)
      })
    }
  }
}

</script>
