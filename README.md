# mapbox-3d-demo

This project demonstrates how to use Mapbox GL to render a 3D model representing AON Center in Downtown Chicago.

![Mapbox 3D Demo Screenshot](/SCREENSHOT.png?raw=true)

It uses:

* [React](https://reactjs.org/)
* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)
* [three.js](https://threejs.org/)

Code is bundled for the browser using [webpack](https://webpack.js.org/).

The project was initialized with the [Create React App](https://github.com/facebook/create-react-app) CLI.

## Working Locally

To work on this project:

1. Open a new terminal window
2. [Clone the repo](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
3. `cd mapbox-3d-demo`
4. Open in a text editor to make changes to the code.

To start the development server, run `yarn start`. This will run webpack and start serving the app locally. To view it in the browser, go to http://localhost:3000.

The page will reload automatically if you make any edits.

## Deploying

The app is deployed to a CDN via [Netlify](https://www.netlify.com/), which uses a continuous integration process to build the production JavaScript bundle. Netlify listens for changes to this repo and will start new builds automatically—no need to run a command!

## Future Work

For a list of possible improvements, see [Issues](https://github.com/rbrtmrtn/mapbox-3d-demo/issues).
