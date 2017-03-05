const socket = io.connect();
const $reverie = document.querySelector('#reverie');
const $terminal = document.querySelector('#terminal');

socket.on('world data', renderWorld);

function renderWorld (world) {
  console.log(world);
  let $world = document.querySelector('#world');
  if ($world) {
    $world.remove();
  }

  $world = document.createElement('section');
  $world.id = 'world';

  if (Array.isArray(world.cellMap)) {
    world.cellMap.forEach(function (element) {
      let $col = document.createElement('div');
      $col.className = 'column';
      $col.style.width = '10px';
      $col.style.display = 'inline-block';
      element.forEach(function (cell, index) {
        var $tile = document.createElement('tile');
        $tile.setAttribute('value', cell);
        $tile.style.float = 'left';
        $tile.style.width = '10px';
        $tile.style.height = '10px';
        $tile.style.clear = index === 0 ? 'left' : 'none';
        $col.appendChild($tile);
      });
      $world.appendChild($col);
    });
  }
  $reverie.appendChild($world);
}
