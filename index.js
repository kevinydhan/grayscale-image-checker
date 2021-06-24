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

/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @returns {number}
 */
const getMaxDifference = (red, green, blue) => {
  const d1 = Math.abs(red - green)
  const d2 = Math.abs(red - blue)
  const d3 = Math.abs(green - blue)
  return Math.max(d1, d2, d3)
}

/**
 * @param {Uint8ClampedArray} data
 * @param {number} tolerance
 * @returns {boolean}
 */
const isGrayscale = (data, tolerance) => {
  let red = 0
  let green = 0
  let blue = 0
  let areEqual
  let isTolerant

  for (let i = 0; i < data.length - 3; i += 4) {
    red = data[i]
    green = data[i + 1]
    blue = data[i + 2]
    areEqual = red === green && red === blue
    isTolerant = getMaxDifference(red, green, blue) <= tolerance
    if (!areEqual && !isTolerant) return false
  }

  return true
}

const code = document.querySelector('code')
const fileInput = document.querySelector('input[type="file"]')

/**
 * @param {File} file
 * @returns {void}
 */
const displayIsGrayText = async (file) => {
  const numberInput = document.querySelector('input[type="number"]')
  code.innerText = ''
  const src = await getDataUrl(file)
  const img = await getImage(src)
  const data = getImageData(img)
  const isGrey = isGrayscale(data, numberInput.value)
  code.innerText = isGrey
}

fileInput.addEventListener('change', () => {
  displayIsGrayText(fileInput.files[0])
})
