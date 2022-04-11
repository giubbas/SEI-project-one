function init() {

  // Variables
  const width = 10
  const height = 10
  const cellCount = width * height
  const cells = []
  const gemStartPosition = 94
  let gemCurrentPosition = gemStartPosition
  let enemiesStart = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38]
  let enemies = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38]
  let direction = 'forward'
  let cloudsKilled = []
  let enemiesCurrentPosition = enemies
  let enemiesMoveInterval
  let enemiesBoltInterval
  let gemLives = 3
  let score = 0
  let isStarted

  // Elements
  const grid = document.getElementById('grid')
  const startBtn = document.getElementById('start')
  const cover = document.getElementById('cover')
  const scoreDisplay = document.getElementById('score')
  const backBtn = document.getElementById('back')
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
    cover.classList.add('display-none')
    addGemClass(gemStartPosition)
    addEnemies()
    isStarted = true
    enemiesMoveInterval = setInterval(enemiesMovement, 1000)
    enemiesBoltInterval = setInterval(enemiesShot, 2000)
  }

  // ---------------------------------------------- GEM ---------------------------------------------- //

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
      gemCurrentPosition-- 
    } else if (key === right && gemCurrentPosition % width !== width - 1){
      gemCurrentPosition++
    } else if (key === space) {
      cells[gemCurrentPosition].classList.add('rainbow-vomit')
      gemShot()
    }
    addGemClass(gemCurrentPosition)
  }
  // Add to Gem the 'rainbow-vomit' class
  function handleKeyup(e) {
    const key = e.keyCode
    if (key === 32) {
      cells.forEach(item => item.classList.remove('rainbow-vomit'))
    }
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
        score += 100
        scoreDisplay.innerText = score
        killed = enemies.indexOf(shotPosition)
        cloudsKilled.push(killed)
        cells[shotPosition].classList.remove('rainbow-shot', 'dark-clouds')
        cells[shotPosition].classList.add('colpito')

        // remove boom animation
        setTimeout(function() {
          cells[shotPosition].classList.remove('colpito')
        }, 200)

        clearInterval(shotInterval)
        return
      }
    }
    shotInterval = setInterval(shotMovement, 100)
  }

  // ---------------------------------------------- ENEMIES ---------------------------------------------- //

  // Draw enemies
  function addEnemies() {
    if (enemiesCurrentPosition.length > 0 && isStarted === false) {
      for (let i = 0; i < enemiesCurrentPosition.length; i++) {
        cells[enemiesCurrentPosition[i]].classList.add('dark-clouds')
      }
    } else {
      for (let i = 0; i < enemiesStart.length; i++) {
        cells[enemiesStart[i]].classList.add('dark-clouds')
        isStarted = false
        
      }
    }
  }
  
  function removeEnemies() {
    enemies.forEach(item => cells[item].classList.remove('dark-clouds'))
  }
  // Enemies movement
  function enemiesMovement() {
    trackEnemies()
    removeEnemies()

    const isRightEdge = enemies.some(item => item % width === width - 1)
    const isLeftEdge = enemies.some(item => item % width === 0)

    // Check if enemies reach the edge of the grid
    if (isRightEdge && direction === 'forward') {
      for ( let i = 0; i < enemiesCurrentPosition.length; i++) {
        enemiesCurrentPosition[i] += width
        direction = 'backward'
      }
    } else if (isLeftEdge && direction === 'backward') {
      for ( let i = 0; i < enemiesCurrentPosition.length; i++) {
        enemiesCurrentPosition[i] += width
        direction = 'forward'
      } 
    } else if (direction === 'forward') {
      for ( let i = 0; i < enemiesCurrentPosition.length; i++) {
        enemiesCurrentPosition[i] += 1
      } 
    } else if (direction === 'backward') {
      for ( let i = 0; i < enemiesCurrentPosition.length; i++) {
        enemiesCurrentPosition[i] -= 1
      } 
    }

    addEnemies()
    checkVictory()
    checkGameOver()
  }

  // Enemies lightning bolts
  function enemiesShot() {
    
    // Randomly select a shooter from the enemies
    const shooter = Math.floor(Math.random() * enemiesCurrentPosition.length)
    let boltPosition = enemiesCurrentPosition[shooter]
    let boltInterval = null
    
    // Shot movement
    function bolt() {
      cells[boltPosition].classList.remove('drop-lightning')
      boltPosition += width
      
      if (boltPosition > 100) {
        clearInterval(boltInterval)
        cells.forEach(item => item.classList.remove('colpito'))
        return
      }
      cells[boltPosition].classList.add('drop-lightning')

      // Check impact
      if (cells[boltPosition].classList.contains('gem')) {
        gemLives -= 1
        cells[boltPosition].classList.remove('drop-lightning')

        // Adding boom animation
        cells[gemCurrentPosition].classList.add('colpito')

        // Remove boom animation
        setTimeout(function() {
          for (let i = 90; i < cells.length; i++) {
            cells[i].classList.remove('colpito')
          }
        }, 200)
        clearInterval(boltInterval)
        return
      }
    }
    boltInterval = setInterval(bolt, 100)
  }

  // Taking track of enemies position
  function trackEnemies() {
    enemiesCurrentPosition.splice(0)

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains('dark-clouds')) {
        enemiesCurrentPosition.push(i)
      }
    }
  }

  // ---------------------------------------------- CHECK VICTORY AND GAMEOVER ---------------------------------------------- //

  function checkVictory() {
    if (enemiesCurrentPosition.length === 0) {
      clearInterval(enemiesMoveInterval)
      clearInterval(enemiesBoltInterval)
    }
  }

  function checkGameOver() {
    enemiesCurrentPosition.forEach(item => {
      if (item > 89 || gemLives === 0) {
        clearInterval(enemiesMoveInterval)
        clearInterval(enemiesBoltInterval)
      } 
    })
  }

  // ---------------------------------------------- BACK BUTTON ---------------------------------------------- //

  function back() {
    cover.classList.remove('display-none')
    clearInterval(enemiesMoveInterval)
    clearInterval(enemiesBoltInterval)
    score = 0
    cells.forEach(item => item.classList.remove('dark-clouds'))
  }

  // Events
  startBtn.addEventListener('click', handleStartBtn)
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyup)
  backBtn.addEventListener('click', back)
}

window.addEventListener('DOMContentLoaded', init)