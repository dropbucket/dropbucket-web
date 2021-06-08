<template>
  <div />
</template>

<script>
export default {
  mounted () {
    const self = this
    this.$axios.post('https://yiswgnlhla.execute-api.ap-northeast-2.amazonaws.com/dropbucketDP/folder', {
      parent_id: 'create root'
    }).then(() => {
      self.$router.push('/')
    }).catch(() => {
      self.$router.push('/')
    })
  }
}
</script>
