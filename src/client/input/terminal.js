module.exports = {
  create: function (id, events) {
    return new Terminal(id, events);
  }
};

function Terminal (id, events) {
  this.element = document.querySelector(id);
  this.events = events;
}
Terminal.prototype.focus = function () {
  this.element.focus();
}
var historyIndex = -1;
var terminalHistory = [];
Terminal.prototype.prevHistory = function () {
  if (terminalHistory.length > 0 && historyIndex < terminalHistory.length - 1) {
    historyIndex++;
    this.element.value = terminalHistory[historyIndex];
  }
}
Terminal.prototype.nextHistory = function () {
  if (terminalHistory.length > 0 && historyIndex > -1) {
    historyIndex--;
    if (historyIndex === -1) {
      this.element.value = '';
    } else {
      this.element.value = terminalHistory[historyIndex];
    }

    // set caret at the end of line
    // strange hack for chrome
    var that = this;
    setTimeout(function () { that.element.value = that.element.value; }, 0);
  }
}
Terminal.prototype.submit = function () {
  input = this.element.value;
  
  // check if input is not empty
  if (input !== '') {
    // update terminal history if it's not the same
    // as last input
    if (terminalHistory[0] !== input) {
      terminalHistory.unshift(input);
    }
    // console.log(terminalHistory, historyIndex);
    historyIndex = -1;

    this.events.emit('message', input);

    this.element.value = '';
  }
}
