module.exports = {
    devtool: 'inline-source-map',
    entry: './src/client/js/client.ts',
    output: {
        path: __dirname + '/dist/client/js',
        filename: 'client.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader', options: { configFile: 'tsconfig.client.json' } }
        ]
    }
}