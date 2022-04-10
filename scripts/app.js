function init() {

  // Variables
  const width = 10
  const height = 10
  const cellCount = width * height
  const cells = []
  const gemStartPosition = 94
  let gemCurrentPosition = gemStartPosition
  let darkClouds = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28]
  let direction = 'forward'
  let cloudsKilled = []

  // Elements
  const grid = document.getElementById('grid')
  const startBtn = document.getElementById('start')
  const cover = document.getElementById('cover')

  // Create the grid
  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.id = i
      cell.className = 'cell'
      cell.innerText = i
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  createGrid()

  function handleStartBtn() {
    cover.style.display = 'none'
    addGemClass(gemStartPosition)
    addClassDarkClouds()
    setInterval(darkCloudsMovement, 1000)
    setInterval(darkCloudsShot, 3000)
  }

  // ------- GEM --------- //

  function addGemClass(position) {
    cells[position].classList.add('gem')
  }

  function removeGemClass(position) {
    cells[position].classList.remove('gem')
  }

  // Gem movement  
  function handleKeyDown(e) {
    const key = e.keyCode 
    const left = 37 
    const right = 39
    const space = 32

    removeGemClass(gemCurrentPosition)

    if (key === left && gemCurrentPosition % width !== 0){
      console.log('MOVED LEFT')
      gemCurrentPosition-- // decrement currentPosition by 1 to move character left
    } else if (key === right && gemCurrentPosition % width !== width - 1){
      console.log('MOVED RIGHT')
      gemCurrentPosition++
    } else if (key === space) {
      gemShot()
    }
    addGemClass(gemCurrentPosition)
  }

  function gemShot() {
    let shotPosition = gemCurrentPosition
    let shotInterval = null

    function shotMovement() {
      cells[shotPosition].classList.remove('rainbow-shot')
      shotPosition -= width
      
      if (shotPosition < 0) {
        clearInterval(shotInterval)
        return
      }
      cells[shotPosition].classList.add('rainbow-shot')

      // Check Impact
      let killed
      if (cells[shotPosition].classList.contains('dark-clouds')) {
        killed = darkClouds.indexOf(shotPosition)
        cloudsKilled.push(killed)
        cells[shotPosition].classList.remove('rainbow-shot', 'dark-clouds')
        clearInterval(shotInterval)
        return
      }
    }
    shotInterval = setInterval(shotMovement, 100)
  }

  // --------- Dark Clouds ------------ //

  function addClassDarkClouds() {
    for (let i = 0; i < darkClouds.length; i++) {
      if (!cloudsKilled.includes(i)) {
        cells[darkClouds[i]].classList.add('dark-clouds')
      }
    }
  }

  function removeClassDarkClouds() {
    darkClouds.forEach(item => cells[item].classList.remove('dark-clouds'))
  }

  function darkCloudsMovement() {
    removeClassDarkClouds()
    const isRightEdge = darkClouds.some(item => item % width === width - 1)
    const isLeftEdge = darkClouds.some(item => item % width === 0)

    if (isRightEdge && direction === 'forward') {
      for ( let i = 0; i < darkClouds.length; i++) {
        darkClouds[i] += width
        direction = 'backward'
      }
    } else if (isLeftEdge && direction === 'backward') {
      for ( let i = 0; i < darkClouds.length; i++) {
        darkClouds[i] += width
        direction = 'forward'
      } 
    } else if (direction === 'forward') {
      for ( let i = 0; i < darkClouds.length; i++) {
        darkClouds[i] += 1
      } 
    } else if (direction === 'backward') {
      for ( let i = 0; i < darkClouds.length; i++) {
        darkClouds[i] -= 1
      } 
    }
    addClassDarkClouds()
    cells[gemCurrentPosition].classList.remove('colpito')
  }

  function darkCloudsShot() {
    // Check how many dark clouds are still alive
    const darkCloudsAlive = []
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains('dark-clouds')) {
        darkCloudsAlive.push(i)
      }
    }
    const shooter = Math.floor(Math.random() * darkCloudsAlive.length)

    let boltPosition = darkClouds[shooter]
    let boltInterval = null
    // Bolt shots
    function bolt() {
      cells[boltPosition].classList.remove('drop-lightning')
      boltPosition += width
      
      if (boltPosition > 100) {
        clearInterval(boltInterval)
        return
      }
      cells[boltPosition].classList.add('drop-lightning')

      // Check Impact
      if (cells[boltPosition].classList.contains('gem')) {
        cells[boltPosition].classList.remove('drop-lightning')
        cells[gemCurrentPosition].classList.add('colpito')
        clearInterval(boltInterval)
        return
      }
    }
    boltInterval = setInterval(bolt, 100)
  }

  // Events
  startBtn.addEventListener('click', handleStartBtn)
  document.addEventListener('keydown', handleKeyDown)
}

window.addEventListener('DOMContentLoaded', init)