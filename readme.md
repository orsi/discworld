# Discworld

Discworld is a browser-based disc world generator written in Typescript. The backend hosts a web server to serve the frontend client at localhost:3000. Commands are issued through the client to the backend server which generates the map data to send back to the user.

##### Browser Support
Discworld is created using [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and requires a browser that supports them. Discworld works best in Chrome, has some limited zooming in Firefox, and does not work in Safari.

# Installation

In order to install and run the generator, you can download the repository .zip by clicking the "Clone or Download" button above and extracting the files to a folder, or use the command `git clone https://github.com/orsi/discworld` in your terminal. Afterwards, from a command line terminal in the project folder enter the following commands:

```
npm install
npm start
```

Discworld can now be accessed with your browser at http://localhost:3000.

# Instructions

Discworld will initially show a discworld created with the seed 'reverie'.

##### Terminal

Press any key when the window is in focus and you will see a terminal in the bottom left corner. Press enter to create a new world with the given terminal input as the seed.

##### Moving the map
You can move around the map using the mouse by right-clicking the screen in the direction you want to scroll.

##### Zooming in and out
You can zoom in and out of the map by using the mouse wheel.
