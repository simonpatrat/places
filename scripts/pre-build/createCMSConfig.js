const fs = require('fs');
const path = require('path');

const createCMSConfigs = async () => {
    let CMSConfig = '';
    const baseConfig = await fs.promises.readFile('public/admin/configs/base.yml');
    const collectionsConfigsPaths = await fs.promises.readdir('public/admin/configs/collections/');
    CMSConfig += baseConfig.toString();

    const collectionConfigs = await Promise.all(collectionsConfigsPaths.map(async collection => {
        const collectionContent = await fs.promises.readFile(path.resolve('public/admin/configs/collections', collection));
        return collectionContent.toString();
    }));

    collectionConfigs.forEach(collection => CMSConfig += '\n' + collection);

    await fs.promises.writeFile('public/admin/config.yml', CMSConfig);

    return CMSConfig;
}
module.exports = createCMSConfigs;