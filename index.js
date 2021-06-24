/**
 * @param {File} file
 * @returns {string}
 */
const getDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('loadend', () => resolve(reader.result))
    reader.readAsDataURL(file)
  })
}

/**
 * @param {string} src
 * @returns {HTMLImageElement}
 */
const getImage = (src) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.src = src
  })
}

/**
 * @param {HTMLImageElement} img
 * @returns {Uint8ClampedArray}
 */
const getImageData = (img) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const { width, height } = img
  context.drawImage(img, 0, 0)
  const data = context.getImageData(0, 0, width, height)
  return data.data
}

const getMaxDifference = (red, green, blue) => {
  let maxDifference = 0

  if (Math.abs(red - green) > maxDifference) {
    maxDifference = Math.abs(red - green)
  }
  if (Math.abs(red - blue) > maxDifference) {
    maxDifference = Math.abs(red - blue)
  }
  if (Math.abs(green - blue) > maxDifference) {
    maxDifference = Math.abs(green - blue)
  }

  return maxDifference
}

/**
 * @param {Uint8ClampedArray} data
 * @param {number} [tolerance=10]
 * @returns {boolean}
 */
const isGreyScale = (data, tolerance = 10) => {
  let red = 0
  let green = 0
  let blue = 0

  for (let i = 0; i < data.length - 3; i += 4) {
    red += data[i]
    green += data[i + 1]
    blue += data[i + 2]
  }
  console.log({ red, green, blue })

  const isTolerant = getMaxDifference(red, green, blue) <= tolerance

  return (red === green && red === blue) || isTolerant
}

const code = document.querySelector('code')
const input = document.querySelector('input')

/**
 * @param {File} file
 * @returns {void}
 */
const displayIsGreyText = async (file) => {
  code.innerText = ''
  const src = await getDataUrl(file)
  const img = await getImage(src)
  const data = getImageData(img)
  const isGrey = isGreyScale(data)
  code.innerText = isGrey
}

input.addEventListener('change', () => displayIsGreyText(input.files[0]))
