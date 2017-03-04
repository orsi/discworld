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
      let $row = document.createElement('div');
      element.forEach(function (cell) {
        var $tile = document.createElement('tile');
        $tile.setAttribute('value', cell);
        $tile.style.width = '1px';
        $tile.style.height = '1px';
        $row.appendChild($tile);
      });
      $world.appendChild($row);
    });
  }
  $reverie.appendChild($world);
}
