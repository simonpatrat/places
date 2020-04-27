const createCMSConfig = require('./createCMSConfig');

const preBuild = async () => {
    console.log('Starting pre-build scripts \n');
    const CMSConfig = await createCMSConfig();
    console.log('CMS Config created: \n');
}

module.exports = preBuild();