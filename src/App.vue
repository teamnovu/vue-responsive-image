<template>
  <div id="app">
    <div class="p-8 flex justify-center">
      <ResponsiveImage
        class="w-5/6 md:w-3/5 xl:w-1/2"
        src="https://source.unsplash.com/random/{w}x{h}"
        :screens="{
          xs: '360px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }"
        :max-width="3000"
        sizes="w-90vw md:w-60vw md:h-9/16 xl:w-50vw"
      />
    </div>
  </div>
</template>

<script>
import ResponsiveImage from './components/index.js'

export default {
  components: {
    ResponsiveImage
  }
}
</script>
