module.exports = function (plop) {
    // controller generator
    plop.setGenerator('controller', {
        description: 'Admin NetlifyCMS collection',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Collection name please'
        }],
        actions: [{
            type: 'add',
            path: '../../public/admin/configs/{{name}}.yaml',
            templateFile: 'templates/admin-collection.hbs'
        }]
    });
};