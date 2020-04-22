<template>
  <img
    :src="fallbackSrc"
    :srcset="srcsetAttr"
    :sizes="sizesAttr"
  />
</template>

<script>
const DEFAULT_SCREENS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}
const BASE_BREAKPOINT_KEY = '_base'

export default {
  name: 'ResponsiveImage',

  props: {
    src: {
      type: String,
      required: true
    },
    maxWidth: {
      type: Number,
      default: 2560
    },
    screens: {
      type: Object,
      default: () => DEFAULT_SCREENS
    },
    sizes: {
      type: String,
      default: ''
    }
  },

  computed: {
    breakpoints () {
      const base = {}
      base[BASE_BREAKPOINT_KEY] = 0

      return Object.keys(this.screens).reduce((acc, key) => {
        // parse pixel number value
        const matches = this.screens[key].match(/^(\d+)px$/)
        if (matches[1]) acc[key] = parseInt(matches[1])
        return acc
      }, base)
    },

    breakpointKeys () {
      return Object.keys(this.breakpoints).sort((a, b) => this.breakpoints[a] - this.breakpoints[b])
    },

    percentages () {
      const sizes = this.sizes
        .toLowerCase()
        .split(/\s+/)
        .filter(s => s)
        .reduce((acc, size) => {
          const matches = size.match(/^(?:([a-z]+):)?w-([0-9]{1,2})vw?$/)
          if (!matches) {
            console.warn('ignoring invalid size string:', size)
            return acc
          }

          const breakpoint = matches[1] && this.breakpointKeys.includes(matches[1]) ? matches[1] : BASE_BREAKPOINT_KEY
          const percentage = matches[2] ? parseInt(matches[2]) : null

          if (breakpoint && percentage) acc[breakpoint] = percentage
          return acc
        }, {})

      const percentages = this.breakpointKeys.reduce((acc, key, i) => {
        if (sizes[key]) {
          acc[key] = sizes[key]
        } else if (i > 0) {
          acc[key] = acc[this.breakpointKeys[i - 1]]
        } else {
          acc[key] = 100
        }

        return acc
      }, {})

      return percentages
    },

    imageSizes () {
      const imageSizes = this.breakpointKeys.reduce((acc, key, i) => {
        let nextBreakpoint = this.breakpoints[this.breakpointKeys[i + 1]]
        if (!nextBreakpoint) nextBreakpoint = this.maxWidth

        acc[key] = Math.round(nextBreakpoint / 100 * this.percentages[key])
        return acc
      }, {})

      return imageSizes
    },

    fallbackSrc () {
      const lastBreakpointPercentage = this.percentages[this.breakpointKeys[this.breakpointKeys.length - 1]]
      let fallbackWidth = this.maxWidth
      if (lastBreakpointPercentage) fallbackWidth = fallbackWidth / 100 * lastBreakpointPercentage
      return this.assembleSrc({ w: fallbackWidth })
    },

    srcsetAttr () {
      return this.breakpointKeys
        .map(key => `${this.assembleSrc({ w: this.imageSizes[key] })} ${this.imageSizes[key]}w`)
        .join(',\n')
    },

    sizesAttr () {
      return [...this.breakpointKeys]
        .reverse()
        .map((key, i) => i >= this.breakpointKeys.length - 1 ? this.imageSizes[key] + 'w' : `(min-width: ${this.breakpoints[key]}px) ${this.imageSizes[key]}w`)
        .join(',\n')
    }
  },

  methods: {
    assembleSrc (payload) {
      let assembled = this.src

      if (payload.w) assembled = assembled.replace(/\{w\}/g, payload.w)

      return assembled
    }
  }
}
</script>
