<template>
  <v-container>
    <v-row>
      <v-col align-self="end" style="text-align: right;">
        <!-- <v-btn
          right
          color="red darken-2"
          class="mb-4 white--text"
          @click="pDelete"
        >
          <v-icon dark left>
            mdi-delete
          </v-icon>
          permanently Delete
        </v-btn> -->
        <v-btn
          right
          color="yellow darken-4"
          class="mb-4 white--text"
          @click="restore"
        >
          <v-icon dark left>
            mdi-backup-restore
          </v-icon>
          Restore
        </v-btn>
        <v-btn
          right
          color="light-blue darken-2"
          class="mb-4 white--text"
          @click="pDelete"
        >
          <v-icon dark left>
            mdi-delete-empty-outline
          </v-icon>
          Empty Trash
        </v-btn>
      </v-col>
    </v-row>

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
      itemSelected: {}
    }
  },
  mounted () {
    const self = this
    this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/trash', {
      id: this.$store.state.authUser.uid
    }).then((res) => {
      // console.log(res.data.data.Items)
      self.files = res.data.data
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    restore () {
      if (!this.itemSelected.is_folder) {
        this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/trash', {
          id: this.itemSelected.id

        }).then(() => {
          self.refresh()
        })
      } else {
        this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder/trash', {

          id: this.itemSelected.id

        }).then(() => {
          self.refresh()
        })
      }
    },
    pDelete () {
      const self = this
      this.$axios.delete('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/trash', {
        data: {
          id: this.itemSelected.id
        }
      }).then(() => {
        self.refresh()
      })
    },
    refresh () {
      const self = this
      this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/trash', {
        id: this.$store.state.authUser.uid
      }).then((res) => {
      // console.log(res.data.data.Items)
        self.files = res.data.data
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>
