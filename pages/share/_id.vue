<template>
  <div>
    <h1 style="text-align:center" class="mt-4">
      DropBucket
    </h1>
    <p style="text-align:center" class="mt-2">
      {{ file.filename }}
    </p>
    <p style="font-style:italic;text-align:center">
      {{ file.status_message }}
    </p>
    <p style="text-align:center" class="mt-2">
      {{ file.size.toLocaleString() }} KB
    </p>
    <p style="text-align:center">
      <v-btn style="text-align:center" class="mt-4" color="primary" @click="download">
        Download File
      </v-btn>
    </p>

  <!--  -->
  </div>
</template>

<script>
export default {
  layout: 'empty',
  data () {
    return {
      fileId: this.$route.params.id,
      file: {
        size: ''
      }
    }
  },
  mounted () {
    const self = this
    this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/file/download', {
      id: this.fileId,
      shared: true
    }).then((result) => {
      self.file = result.data.data
      // const link = document.createElement('a')
      // link.download = item.filename
      // link.target = '_blank'
      // link.href = `${result.data.data}`
      // link.click()
    })
  },
  methods: {
    download () {
      const link = document.createElement('a')
      link.download = this.file.filename
      link.target = '_blank'
      link.href = `${this.link}`
      link.click()
    }
  }
}
</script>
