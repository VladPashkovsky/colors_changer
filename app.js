const cols = document.querySelectorAll('.col')

// При нажатии на пробел меняем цвет, а также убираем поведение по-умолчанию, чтобы при нажатии обводка вокруг
// кнопки не оставалась
document.addEventListener('keydown', (event) => {
  event.preventDefault()
  if (event.code.toLowerCase() === 'space') {
    setRandomColors()
  }
})

//Меняем замок на закрытый при клике. Предварительно на button вешаем data-type='lock'.
// Его также необходимо продублировать на саму иконку, чтобы клик работал и при нажатии на картинку с замком.
// В конце просто type, потому что data он опускает
document.addEventListener('click', (event) => {
  const type = event.target.dataset.type

  if (type === 'lock') {
    const node =
      event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]

    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClickboard(event.target.textContent)
  }
})

function generateRandomColor() {
  // RGB
  // #FF0000
  // #00FF00
  // #0000FF

  const hexCodes = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
  }
  return '#' + color
}

// Функция для копирования выбранного вета при нажатии. Используем ее там, где обрабатываем click в блоке else
// На h2 вешаем data-type='copy'
function copyToClickboard(text) {
  return navigator.clipboard.writeText(text)
}

// Вместо функции generateRandomColor() можно было использоать библиотеку chroma, метод chroma.random(), подключаем
// с помощью cdn в html

// Если случайный цвет и цвет текста, и кнопки-замка будут сливаться, то (используя библиотеку chroma):

//Основная функция по изминению цвета, если 'fa-lock', цвет больше не меняется.
// Метод contains для проверки на вложенность
// var result = parent.contains(child);
// Возвращает true, если parent содержит child или parent == child.
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock')
    const text = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(text.textContent)
      return
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : generateRandomColor()
      : generateRandomColor()

    if (!isInitial) {
      colors.push(color)
    }

    text.textContent = color
    col.style.background = color

    setTextColor(text, color)
    setTextColor(button, color)
  })

  updateColorsHash(colors)
}

// Если случайный цвет и цвет текста, и кнопки-замка будут сливаться, то (используя библиотеку chroma):
function setTextColor(text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? 'black' : 'white'
}

//Функция, которая будет выбранные цвета добавлять в хэш, чтобы в дальнейшем этим можно будет с кем-нибудь делиться
// Используем ее setRandomColors()
function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1)
    })
    .join('-')
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => '#' + color)
  }
  return []
}

setRandomColors(true)
