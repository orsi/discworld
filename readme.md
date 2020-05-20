# Discworld

Discworld is a browser-based disc world generator written in Typescript. The backend hosts a web server to serve the frontend client at localhost:3000. Commands are issued through the client to the backend server which generates the map data to send back to the user.

# Installation

In order to install and run the generator, you can download the repository .zip by clicking the "Clone or Download" button above and extracting the files to a folder, or use the command `git clone https://github.com/jorsi/discworld` in your terminal. Afterwards, from a command line terminal in the project folder enter the following commands:

```
npm install
npm start
```

Discworld can now be accessed with your browser at http://localhost:3000.

# Instructions

Discworld will initially show nothing in the browser until a command is typed in to generate a world. The following commands and syntax are:

##### Commands

The command line is at the bottom of the screen. You do not need to focus on the command line in order to type -- all keyboard inputs will be directed towards the input.

`/create seed width height`
Where seed is any single word, phrase, or alphanumeric combination (no spaces), and width/height are numbers. Generally, any width or heights above 1000 will begin to drastically slow down your browser -- a good size is around 256-512 width/height.

`/destroy`
Destroys the current world and allows you to issue the `/create` command again.

##### Moving the map
You can move around the map using the mouse by right-clicking the screen in the direction you want to scroll.

##### Zooming in and out
You can zoom in and out of the map by using the mouse wheel.
