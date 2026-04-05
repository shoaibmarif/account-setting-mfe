/**
 * Base Webpack Configuration for Remote Micro-frontends
 *
 * This configuration should be used by ALL remote applications.
 */

const path = require('node:path');
const { ModuleFederationPlugin } = require('webpack').container;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function createRemoteWebpackConfig(options) {
    const { name, port, exposes } = options;

    return function buildRemoteWebpackConfig(env, argv) {
        // Determine which .env file to use
        let envFile = '.env';
        const isProductionEnv = Boolean(env?.production);
        const isStagingEnv = Boolean(env?.staging);

        if (isProductionEnv) {
            envFile = '.env.production';
        }

        if (!isProductionEnv && isStagingEnv) {
            envFile = '.env.staging';
        }

        // Load environment variables
        const dotenv = require('dotenv');
        const envVars = dotenv.config({ path: path.resolve(__dirname, envFile) }).parsed || {};

        // Remote host URL
        const customMainUrl =
            process.env.REACT_HOST_MAIN_URL ||
            envVars.REACT_HOST_MAIN_URL ||
            'http://localhost:5173';

        const skipTsCheck = process.env.SKIP_TS_CHECK === 'true';

        return {
            mode: argv.mode || 'development',
            entry: './src/index.tsx',
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[name].bundle.js',
                chunkFilename: '[name].chunk.js',
                clean: true,
                publicPath: 'auto',
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                alias: {
                    customMain: path.resolve(__dirname, '../custom-main-shell/src'),
                },
            },
            module: {
                rules: [
                    {
                        test: /\.(ts|tsx)$/,
                        use: 'babel-loader',
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader', 'postcss-loader'],
                    },
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: 'asset/resource',
                    },
                ],
            },
            plugins: [
                ...(skipTsCheck
                    ? []
                    : [
                          new ForkTsCheckerWebpackPlugin({
                              async: false,
                          }),
                      ]),
                new ModuleFederationPlugin({
                    name,
                    filename: 'remoteEntry.js',
                    exposes,
                    remotes: {
                        customMain: `customMain@${customMainUrl}/remoteEntry.js`,
                    },
                    shared: {
                        react: {
                            singleton: true,
                            strictVersion: false,
                            requiredVersion: '19.2.3',
                        },
                        'react-dom': {
                            singleton: true,
                            strictVersion: false,
                            requiredVersion: '19.2.3',
                        },
                        'react-router-dom': {
                            singleton: true,
                            strictVersion: false,
                        },
                        'react-hook-form': {
                            singleton: true,
                            strictVersion: false,
                        },
                        'react-toastify': {
                            singleton: true,
                            strictVersion: false,
                        },
                        axios: {
                            singleton: true,
                            strictVersion: false,
                        },
                        zod: {
                            singleton: true,
                            strictVersion: false,
                        },
                        '@hookform/resolvers': {
                            singleton: true,
                            strictVersion: false,
                        },
                        'skywalking-client-js': {
                            singleton: true,
                            strictVersion: false,
                        },
                    },
                }),
                new Dotenv({
                    path: path.resolve(__dirname, envFile),
                    systemvars: true,
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'public/assets',
                            to: 'assets',
                            noErrorOnMissing: true,
                        },
                    ],
                }),
                new HtmlWebpackPlugin({
                    template: './public/index.html',
                }),
            ],
            devServer: {
                port: Number.parseInt(envVars.REMOTE_PORT) || port,
                open: false,
                historyApiFallback: true,
                client: {
                    overlay: false,
                    webSocketURL: {
                        hostname: 'localhost',
                        pathname: '/ws',
                        port: Number.parseInt(envVars.REMOTE_PORT) || port,
                        protocol: 'ws',
                    },
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            },
        };
    };
};
