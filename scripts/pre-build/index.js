const createCMSConfig = require('./createCMSConfig');
const createAdditionalPOstDataFiles = require('./createAdditionalPostDataFiles');

const preBuild = async () => {
    console.log('Starting pre-build scripts \n');
    const CMSConfig = await createCMSConfig();
    console.log('CMS Config created: \n');
    console.log('...\n\n');
    console.log('\u{1F69C} Now creating additional post data json files... please wait.');
    const additionalPostData = await createAdditionalPOstDataFiles();
    console.log('Additonal post data created with success!');
}

module.exports = preBuild();