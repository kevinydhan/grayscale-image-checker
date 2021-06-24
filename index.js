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
 * @param {Uint8ClampedArray} data
 * @returns {boolean}
 */
const isGreyScale = (data) => {
  let red = 0
  let green = 0
  let blue = 0

  for (let i = 0; i < data.length - 3; i += 4) {
    red += data[i]
    green += data[i + 1]
    blue += data[i + 2]
  }

  return red === green && red === blue
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
  console.log({ isGrey })
  code.innerText = isGrey
}

input.addEventListener('change', () => displayIsGreyText(input.files[0]))
