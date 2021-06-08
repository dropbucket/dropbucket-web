<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="files"
        :search="search"
        :single-list="true"
        item-key="filename"
        show-select
        :single-select="true"
        @dblclick:row="rowClicked"
        @contextmenu:row="rowRightClicked"
      >
        <template #[`item.filename`]="{ item }">
          <v-icon v-if="item.is_folder">
            mdi-folder
          </v-icon>
          <v-icon v-else-if="item.content_type.includes('image')">
            mdi-image
          </v-icon>
          {{ item.filename }}
        </template>

        <template #[`item.last_modified_at`]="{ item }">
          {{ formatDate(item.last_modified_at/1000) }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at/1000) }}
        </template>
        <template #[`item.size`]="{ item }">
          {{ item.size }}KB
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" width="360">
      <v-list>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="listClick(item.text)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-dialog>

    <v-dialog v-model="folderDialog" width="360">
      <v-list>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="folderListClick(item.text)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-dialog>

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
            @click="renameFolder"
          >
            rename
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="itemRenameDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5 mb-4">
          Rename
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newFileName"
            hide-details
            label="Name"
            outlined
            class="mb-2"
          />
          <v-text-field
            v-model="newFileDesc"
            hide-details
            outlined
            label="Description"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="red darken-3"
            text
            @click="itemRenameDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            dark
            @click="renameFile"
          >
            rename
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="moveDialog" width="360">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="[ {
            text: 'Folder',
            align: 'start',
            value: 'filename'
          }]"
          :items="files.filter((item) => {
            return item.is_folder
          })"
          :search="search"
          :single-list="true"
          item-key="filename"
          :hide-default-footer="true"
          :single-select="true"
          @click:row="moveClicked"
          @contextmenu:row="rowRightClicked"
        >
          <template #[`item.filename`]="{ item }">
            <v-icon v-if="item.is_folder">
              mdi-folder
            </v-icon>
            <v-icon v-else-if="item.content_type.includes('image')">
              mdi-image
            </v-icon>
            {{ item.filename }}
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    clickable: {
      type: Boolean,
      default: true
    },
    files: {
      type: Array,
      required: true
    }
    // itemSelected: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
  },
  data () {
    return {
      moveDialog: false,
      itemRenameDialog: false,
      newFileName: '',
      newFileDesc: '',
      newFolderDialog: false,
      newFolderDesc: '',
      newFolder: '',
      dialog: false,
      folderDialog: false,
      snackbar: false,
      text: '',
      itemSelected: {},
      selected: [],
      items: [
        {
          icon: 'mdi-delete',
          text: 'Delete'
        },
        {
          icon: 'mdi-star-plus-outline',
          text: 'Add to Star'
        },
        {
          icon: 'mdi-export-variant',
          text: 'Share'
        },
        {
          icon: 'mdi-rename-box',
          text: 'Rename'
        },
        {
          icon: 'mdi-folder-move-outline',
          text: 'Move to'
        }
      ],
      folderItems: [
        {
          icon: 'mdi-delete',
          text: 'Delete'
        },
        {
          icon: 'mdi-star-plus-outline',
          text: 'Add to Star'
        },
        {
          icon: 'mdi-rename-box',
          text: 'Rename'
        },
        {
          icon: 'mdi-folder-move-outline',
          text: 'Move to'
        }
      ],
      search: '',
      options: [{
        name: 'test'
      }],
      headers: [
        {
          text: 'Filename',
          align: 'start',
          value: 'filename'
        },
        { text: 'Last Modified', value: 'last_modified_at' },
        { text: 'Created', value: 'created_at' },
        { text: 'File Size', value: 'size' }
      ]

    }
  },
  watch: {
    selected (value) {
      this.$emit('selected', value[0])
    }
  },
  methods: {
    rowRightClicked (e, itemProp) {
      if (!this.clickable) {
        return
      }
      e.preventDefault()
      const { item } = itemProp
      console.log(item)

      this.itemSelected = item
      if (!item.is_folder) {
        this.dialog = true
        // case item is file
      } else {
        this.folderDialog = true
        // case item is folder
      }
    },

    renameFolder () {
      const self = this
      this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder', {
        change_description: this.newFolderDesc,
        change_foldername: this.newFolder,
        id: this.itemSelected.id
      }).then(() => {
        self.refresh()
        self.newFolderDialog = false
        self.folderDialog = false
      })
    },

    renameFile () {
      const self = this
      this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file', {
        description: this.newFileDesc,
        filename: this.newFileName,
        id: this.itemSelected.id
      }).then(() => {
        self.$emit('refresh')
        self.itemRenameDialog = false
        self.dialog = false
      })
    },

    folderListClick (text) {
      const self = this
      if (text === 'Delete') {
        this.$axios.delete('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder', {
          data: {
            id: this.itemSelected.id
          }
        }).then(() => {
          self.$emit('refresh')
        })
      } else if (text === 'Rename') {
        this.newFolderDialog = true
        this.newFolderDesc = this.itemSelected.description
        this.newFolder = this.itemSelected.filename
      } else if (text === 'Move to') {
        self.dialog = false
        self.moveDialog = true
      }
    },
    moveClicked (item) {
      const self = this
      if (!this.itemSelected.is_folder) {
        this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/move', {
          id: this.itemSelected.id,
          location_id: item.id
        }).then(() => {
          self.moveDialog = false
          self.$emit('refresh')
        })
      } else {
        this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder/move', {
          id: this.itemSelected.id,
          location_id: item.id
        }).then(() => {
          self.moveDialog = false
          self.$emit('refresh')
        })
      }
    },

    listClick (text) {
      const self = this
      const itemId = this.itemSelected.id
      if (text === 'Share') {
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
      } else if (text === 'Delete') {
        this.$axios.delete('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file', {
          data: {
            id: this.itemSelected.id
          }
        }).then(() => {
          self.$emit('refresh')
        })
      } else if (text === 'Rename') {
        this.itemRenameDialog = true
        this.newFileName = this.itemSelected.filename
        this.newFileDesc = this.itemSelected.description
      } else if (text === 'Add to Star') {
        this.$axios.patch('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/favorites/item', {
          id: this.itemSelected.id
        }).then(() => {
          self.refresh()
        })
      } else if (text === 'Move to') {
        self.dialog = false
        self.moveDialog = true
      }
    },

    rowClicked (event, data) {
      const { item } = data
      // console.log(item)
      if (!this.clickable) {
        return
      }

      if (!item.is_folder) {
        this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/download', {
          id: item.id
        }).then((result) => {
          const link = document.createElement('a')
          link.download = item.filename
          link.target = '_blank'
          link.href = `${result.data.data.url}`
          link.click()
        })
      } else {
        this.$emit('UpdateParentId', item.id)
      }
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    formatDate (timestamp) {
      const date = new Date(timestamp * 1000)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
      return `${this.pad2(monthNames[date.getMonth() + 1])} ${this.pad2(date.getDate())}, ${date.getFullYear()} ${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}`
    }
  }
}
</script>
