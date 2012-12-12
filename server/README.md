
# Node Server
_Event driven presentation layer_


### Setup
_Install node & npm_
```shell
brew install node
curl http://npmjs.org/install.sh | sh
```
_Socket.io & Express: This application uses socket.io and express for realtime events_
```shell
npm install socket.io express
```

### Configuration

For server configuration I suggest the following file structure:

```javascript
config.js // config module for server settings and paths
index.js // instantiate server and load dependencies
server.js // server constructor
test-data.js // create test data object for unit testing
```

