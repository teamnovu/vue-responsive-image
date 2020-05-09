import { shallowMount } from '@vue/test-utils'
import ResponsiveImage from '@/components/ResponsiveImage.vue'

describe('ResponsiveImage.vue', () => {
  it('correctly parses breakpoints', () => {
    const src = 'https://example.com/image?w={w}'
    const screens = {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src, screens }
    })

    expect(wrapper.vm.breakpoints).toMatchObject({
      _base: 0,
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    })
  })

  it('correctly sorts breakpoint keys', () => {
    const src = 'https://example.com/image?w={w}'
    const screens = {
      sm: '640px',
      xs: '360px',
      lg: '1024px',
      md: '768px',
      xl: '1280px'
    }
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src, screens }
    })

    expect(wrapper.vm.breakpointKeys).toMatchObject(['_base', 'xs', 'sm', 'md', 'lg', 'xl'])
  })

  it('correctly parses width percentages from sizes string', () => {
    const src = 'https://example.com/image?w={w}'
    let sizes
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src }
    })

    sizes = 'w-90vw md:w-60vw xl:w-50vw'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.widthPercentages).toMatchObject({
      _base: 90,
      sm: 90,
      md: 60,
      lg: 60,
      xl: 50
    })

    sizes = 'xl:w-50vw md:h-4/5 w-90vw h-full md:w-60vw'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.widthPercentages).toMatchObject({
      _base: 90,
      sm: 90,
      md: 60,
      lg: 60,
      xl: 50
    })

    sizes = 'md:w-60vw md:w-80vw xl:w-50vw xxl:w-100'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.widthPercentages).toMatchObject({
      _base: 100,
      sm: 100,
      md: 80,
      lg: 80,
      xl: 50
    })

    sizes = 'w-80 h-1/2 md:w-60 xl:w-50vw h-full md:h-2/3'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.widthPercentages).toMatchObject({
      _base: 100,
      sm: 100,
      md: 100,
      lg: 100,
      xl: 50
    })
  })

  it('correctly parses and calculates height percentages from sizes string', () => {
    const src = 'https://example.com/image?w={w}&h={h}'
    let sizes
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src }
    })

    sizes = 'h-9/10 md:h-3/5 xl:h-1/2'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.heightPercentages).toMatchObject({
      _base: 90,
      sm: 90,
      md: 60,
      lg: 60,
      xl: 50
    })

    sizes = 'xl:h-5/10 md:w-80vw h-9/10 w-100vw md:h-6/10'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.heightPercentages).toMatchObject({
      _base: 90,
      sm: 90,
      md: 60,
      lg: 60,
      xl: 50
    })

    sizes = 'md:h-6/10 md:h-8/10 xl:h-full xxl:h-foo'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.heightPercentages).toMatchObject({
      _base: null,
      sm: null,
      md: 80,
      lg: 80,
      xl: 100
    })

    sizes = 'w-80 h-3/2 md:h-3/5 xl:h-2 w-10 md:w-50vw'
    wrapper.setProps({ src, sizes })
    expect(wrapper.vm.heightPercentages).toMatchObject({
      _base: 150,
      sm: 150,
      md: 60,
      lg: 60,
      xl: 200
    })
  })

  it('correctly computes image widths', () => {
    const src = 'https://example.com/image?w={w}'
    let sizes = ''
    const maxWidth = 2560
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src, sizes, maxWidth }
    })

    expect(wrapper.vm.imageWidths).toMatchObject({
      _base: 640,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 2560
    })

    sizes = 'md:w-80vw xl:w-50vw'
    wrapper.setProps({ src, sizes, maxWidth })
    expect(wrapper.vm.imageWidths).toMatchObject({
      _base: 640,
      sm: 768,
      md: Math.round(1024 / 100 * 80),
      lg: Math.round(1280 / 100 * 80),
      xl: Math.round(2560 / 100 * 50)
    })

    sizes = 'w-80vw md:w-60vw xl:w-50vw'
    wrapper.setProps({ src, sizes, maxWidth })
    expect(wrapper.vm.imageWidths).toMatchObject({
      _base: Math.round(640 / 100 * 80),
      sm: Math.round(768 / 100 * 80),
      md: Math.round(1024 / 100 * 60),
      lg: Math.round(1280 / 100 * 60),
      xl: Math.round(2560 / 100 * 50)
    })
  })

  it('correctly computes image heights', () => {
    const src = 'https://example.com/image?w={w}&h={h}'
    let sizes = ''
    const maxWidth = 2560
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src, sizes, maxWidth }
    })

    expect(wrapper.vm.imageHeights).toMatchObject({
      _base: null,
      sm: null,
      md: null,
      lg: null,
      xl: null
    })

    sizes = 'md:h-4/5 xl:h-1/2'
    wrapper.setProps({ src, sizes, maxWidth })
    expect(wrapper.vm.imageHeights).toMatchObject({
      _base: null,
      sm: null,
      md: Math.round(1024 / 100 * 80),
      lg: Math.round(1280 / 100 * 80),
      xl: Math.round(2560 / 100 * 50)
    })

    sizes = 'h-4/5 md:h-3/5 xl:h-1/2'
    wrapper.setProps({ src, sizes, maxWidth })
    expect(wrapper.vm.imageHeights).toMatchObject({
      _base: Math.round(640 / 100 * 80),
      sm: Math.round(768 / 100 * 80),
      md: Math.round(1024 / 100 * 60),
      lg: Math.round(1280 / 100 * 60),
      xl: Math.round(2560 / 100 * 50)
    })
  })

  it('correctly computes src', () => {
    let src = 'https://example.com/image?w={w}'
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src }
    })

    expect(wrapper.vm.assembleSrc({ w: 1280 })).toMatch('https://example.com/image?w=1280')

    src = 'https://example.com/image?w={w}&q=foo&h={h}'
    wrapper.setProps({ src })
    expect(wrapper.vm.assembleSrc({ w: 1280, h: 1000 })).toMatch('https://example.com/image?w=1280&q=foo&h=1000')
  })

  it('correctly assembles fallback src', () => {
    const src = 'https://example.com/image?w={w}&h={h}'
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src }
    })

    expect(wrapper.vm.fallbackSrc).toMatch('https://example.com/image?w=2560&h=')

    const maxWidth = 3000
    wrapper.setProps({ src, maxWidth })
    expect(wrapper.vm.fallbackSrc).toMatch('https://example.com/image?w=3000&h=')

    const sizes = 'md:w-70vw md:h-5/7'
    wrapper.setProps({ src, maxWidth, sizes })
    expect(wrapper.vm.fallbackSrc).toMatch('https://example.com/image?w=2100&h=1500')
  })

  it('correctly assembles srcset attribute', () => {
    const src = 'https://example.com/image?w={w}&h={h}'
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src }
    })

    expect(wrapper.vm.srcsetAttr).toMatch(
      [
        'https://example.com/image?w=640&h= 640w',
        'https://example.com/image?w=768&h= 768w',
        'https://example.com/image?w=1024&h= 1024w',
        'https://example.com/image?w=1280&h= 1280w',
        'https://example.com/image?w=2560&h= 2560w'
      ].join(',\n')
    )

    const maxWidth = 3000
    const sizes = 'md:w-70vw h-3/2'
    wrapper.setProps({ src, maxWidth, sizes })
    expect(wrapper.vm.srcsetAttr).toMatch(
      [
        'https://example.com/image?w=640&h=960 640w',
        'https://example.com/image?w=768&h=1152 768w',
        'https://example.com/image?w=717&h=1076 717w',
        'https://example.com/image?w=896&h=1344 896w',
        'https://example.com/image?w=2100&h=3150 2100w'
      ].join(',\n')
    )
  })

  it('correctly assembles sizes attribute', () => {
    const src = 'https://example.com/image?w={w}'
    const wrapper = shallowMount(ResponsiveImage, {
      propsData: { src }
    })

    expect(wrapper.vm.sizesAttr).toMatch(
      [
        '(min-width: 1280px) 2560w',
        '(min-width: 1024px) 1280w',
        '(min-width: 768px) 1024w',
        '(min-width: 640px) 768w',
        '640w'
      ].join(',\n')
    )

    const maxWidth = 3000
    const sizes = 'md:w-70vw'
    wrapper.setProps({ src, maxWidth, sizes })
    expect(wrapper.vm.sizesAttr).toMatch(
      [
        '(min-width: 1280px) 2100w',
        '(min-width: 1024px) 896w',
        '(min-width: 768px) 717w',
        '(min-width: 640px) 768w',
        '640w'
      ].join(',\n')
    )
  })
})
