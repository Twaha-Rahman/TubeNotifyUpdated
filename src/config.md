## This is the place where all the configurations of the project goes...
** Don't commit this to github! **

src.pages are the root level components, ones which are directly mounted on level 1 routes. (Ex. if you have a route called /login that mounts a Login component, then Login.js will be present in pages directory).
src.modules handles your state (actions + reducers using ducks file structure).
src.components have shared components, like Button, Input etc.
src.utils have utilities like your api wrapper, date utils, string utils etc.
config is where you store your environment variables like api endpoints. Don’t commit this to git.
store initialises the redux store.
index registers the routes, and renders the app.