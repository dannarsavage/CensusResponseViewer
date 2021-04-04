# Census Response Viewer
User guide (such as it is) can be found [here](./UserGuide.md).

Allows users to view county-level data regarding census response rates--shows the county on a map and delivers response rate info as a simple pie chart. Meant to be a trivial project for trying out JavaScript libraries & techniques.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run tests
```
npm run test
```
Note that this project uses jest. This framework seems not to play well with Esri JSAPI, so the tests of classes that involve that API fail. It's on my to-do list to address this. I'll gladly entertain a pull request.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
