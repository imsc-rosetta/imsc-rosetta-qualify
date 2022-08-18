const path = require('path');

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve:{
    fallback: { 
      "stream": require.resolve("stream-browserify"),
      "timers": require.resolve("timers-browserify"),
      "buffer": require.resolve("buffer/") 
    }
  }
};
