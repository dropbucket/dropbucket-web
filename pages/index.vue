<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          color="blue darken-1"
          class="mb-4 white--text"
          @click="newFolderDialog=true"
        >
          <v-icon dark left>
            mdi-folder-plus
          </v-icon>
          New Folder
        </v-btn>

        <v-btn
          color="blue-grey"
          class="mb-4 white--text"
          @click="$refs.newFile.click()"
        >
          <v-icon dark left>
            mdi-cloud-upload
          </v-icon>
          New File
        </v-btn>
      </v-col>
      <v-col align-self="end" style="text-align: right;">
        <v-btn
          right
          color="red darken-2"
          class="mb-4 white--text"
          @click="deleteBtn"
        >
          <v-icon dark left>
            mdi-delete
          </v-icon>
          Delete
        </v-btn>
        <v-btn
          right
          color="yellow darken-4"
          class="mb-4 white--text"
          @click="addToStar"
        >
          <v-icon dark left>
            mdi-star-plus-outline
          </v-icon>
          Star
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

    <FileList :files="files.filter((file) => file.filename !== 'root')" @selected="(value) => {itemSelected = value}" @UpdateParentId="(value) => { $router.push('/?parentId=' + value)}" @refresh="refresh" />

    <v-dialog
      v-model="newFolderDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5 mb-4">
          New Folder
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newFolder"
            hide-details
            label="Folder name"
            outlined
            class="mb-2"
          />
          <v-text-field
            v-model="newFolderDesc"
            hide-details
            outlined
            label="Folder description"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="red darken-3"
            text
            @click="newFolderDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            dark
            @click="createNewFolder"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input ref="newFile" type="file" hidden @change="handleFileChange">
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
      files: [],
      newFolder: '',
      fileModel: {},
      newFolderDesc: '',
      parentId: this.$store.state.authUser.uid,
      itemSelected: {
        is_folder: false
      },
      pastParentId: ''
    }
  },
  watchQuery (newQuery, oldQuery) {
    // Only execute component methods if the old query string contained `bar`
    // and the new query string contains `foo`
    if (this.pastParentId !== newQuery.parentId) {
      this.parentId = newQuery.parentId ? newQuery.parentId : this.$fire.auth.currentUser.uid
      this.update()
      // console.log(newQuery)
    }
  },

  mounted () {
    const self = this
    this.parentId = this.$store.state.authUser.uid
    this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/list', {
      parent_id: this.$store.state.authUser.uid
    }).then((res) => {
      self.files = res.data.data.Items
    })
  },
  methods: {
    update () {
      const self = this
      this.$router.push('/?parentId=' + this.parentId)
      self.pastParentId = self.parentId
      this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/list', {
        parent_id: this.parentId
      }).then((res) => {
        self.files = res.data.data.Items
      })
    },
    share () {
      const self = this
      this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/share/item', {
        id: this.itemSelected.id,
        statusMessage: localStorage.getItem('msg')
      }).then((res) => {
        self.snackbar = true
        self.text = 'Shared link has been copied to the clipboard'

        const tempElem = document.createElement('textarea')
        tempElem.value = window.location.protocol + '//' + window.location.hostname + '/share/' + self.itemSelected.id
        document.body.appendChild(tempElem)

        tempElem.select()
        document.execCommand('copy')
        document.body.removeChild(tempElem)
      })
    },
    deleteBtn () {
      const self = this
      if (this.itemSelected.is_folder) {
        this.$axios.delete('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder', {
          data: {
            id: this.itemSelected.id
          }
        }).then(() => {
          self.refresh()
        })
      } else {
        this.$axios.delete('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file', {
          data: {
            id: this.itemSelected.id
          }
        }).then(() => {
          self.refresh()
        })
      }
    },

    addToStar () {
      const self = this
      this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/favorites/item', {
        id: this.itemSelected.id
      }).then(() => {
        self.refresh()
      })
    },

    handleFileChange (e) {
      const self = this
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      formData.append('parent_id', this.parentId)
      this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        self.update()
      })
    },
    createNewFolder () {
      const self = this
      this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder', {
        description: this.newFolderDesc,
        filename: this.newFolder,
        parent_id: this.parentId
      }).then(() => {
        self.update()
        self.newFolderDialog = false
      })
    },
    refresh () {
      this.update()
    }

  }
}

</script>
