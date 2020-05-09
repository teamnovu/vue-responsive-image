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
          let match = size.match(/^(?:([a-z]+):)?w-([0-9]{1,2})vw?$/)
          if (match) {
            const breakpoint = match[1] && this.breakpointKeys.includes(match[1]) ? match[1] : BASE_BREAKPOINT_KEY
            const percentage = match[2] ? parseInt(match[2]) : null
            if (breakpoint && percentage) acc.width[breakpoint] = percentage
            return acc
          }

          match = size.match(/^(?:([a-z]+):)?h-(([0-9]+)(?:\/([0-9]+))?|full)$/)
          if (match) {
            const breakpoint = match[1] && this.breakpointKeys.includes(match[1]) ? match[1] : BASE_BREAKPOINT_KEY
            const percentage = match[2] === 'full' ? 100 : parseInt(match[3]) / (parseInt(match[4]) || 1) * 100
            if (breakpoint && percentage) acc.height[breakpoint] = percentage
            return acc
          }

          console.warn('ignoring invalid sizes string:', size)
          return acc
        }, { width: {}, height: {} })

      const percentages = this.breakpointKeys.reduce((acc, key, i) => {
        if (sizes.width[key]) {
          acc.width[key] = sizes.width[key]
        } else if (i > 0) {
          acc.width[key] = acc.width[this.breakpointKeys[i - 1]]
        } else {
          acc.width[key] = 100
        }

        if (sizes.height[key]) {
          acc.height[key] = sizes.height[key]
        } else if (i > 0) {
          acc.height[key] = acc.height[this.breakpointKeys[i - 1]]
        } else {
          acc.height[key] = null
        }

        return acc
      }, { width: {}, height: {} })

      return percentages
    },

    imageWidths () {
      const imageWidths = this.breakpointKeys.reduce((acc, key, i) => {
        let nextBreakpoint = this.breakpoints[this.breakpointKeys[i + 1]]
        if (!nextBreakpoint) nextBreakpoint = this.maxWidth

        acc[key] = Math.round(nextBreakpoint / 100 * this.percentages.width[key])
        return acc
      }, {})

      return imageWidths
    },

    imageHeights () {
      const imageHeights = this.breakpointKeys.reduce((acc, key, i) => {
        let imageWidth = this.imageWidths[key]
        if (!imageWidth) imageWidth = this.maxWidth

        acc[key] = this.percentages.height[key]
          ? Math.round(imageWidth / 100 * this.percentages.height[key])
          : null
        return acc
      }, {})

      return imageHeights
    },

    fallbackSrc () {
      const lastBreakpointWidthPercentage = this.percentages.width[this.breakpointKeys[this.breakpointKeys.length - 1]]
      const lastBreakpointHeightPercentage = this.percentages.height[this.breakpointKeys[this.breakpointKeys.length - 1]]
      let fallbackWidth = this.maxWidth
      let fallbackHeight
      if (lastBreakpointWidthPercentage) fallbackWidth = fallbackWidth / 100 * lastBreakpointWidthPercentage
      if (lastBreakpointHeightPercentage) fallbackHeight = fallbackWidth / 100 * lastBreakpointHeightPercentage
      return this.assembleSrc({ w: fallbackWidth, h: fallbackHeight })
    },

    srcsetAttr () {
      return this.breakpointKeys
        .map(key => `${this.assembleSrc({ w: this.imageWidths[key], h: this.imageHeights[key] })} ${this.imageWidths[key]}w`)
        .join(',\n')
    },

    sizesAttr () {
      return [...this.breakpointKeys]
        .reverse()
        .map((key, i) => i >= this.breakpointKeys.length - 1 ? this.imageWidths[key] + 'w' : `(min-width: ${this.breakpoints[key]}px) ${this.imageWidths[key]}w`)
        .join(',\n')
    }
  },

  methods: {
    assembleSrc (payload) {
      let assembled = this.src

      if (payload.w !== undefined) assembled = assembled.replace(/\{w\}/g, payload.w || '')
      if (payload.h !== undefined) assembled = assembled.replace(/\{h\}/g, payload.h || '')

      return assembled
    }
  }
}
</script>
