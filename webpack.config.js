const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const { TamaguiPlugin } = require('tamagui-loader')

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv)

    config.plugins.push(
        new TamaguiPlugin({
            config: './tamagui.config.ts',
            components: ['tamagui'] // matching the yarn add you chose above
        })
    )

    return config
}
