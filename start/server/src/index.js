const {ApolloServer} = require('apollo-server');

const typeDefs = require('./schema');

const { createStore } = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const resolvers = require('./resolvers');

const store = createStore();

const server = new ApolloServer({
    typeDefs, //Our Schema
    resolvers, //Our resolvers
    /*
    If you use this.context in your datasource, it's critical to create a new instance in the dataSources function and to not share a single instance.
    Otherwise, initialize may be called during the execution of asynchronous code for a specific user, and replace the this.context by the context of another user.
    */
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({store})
    })
});

server.listen().then(({ url }) => {
    console.log(`PHP shit JS forever, and server ready at ${url}`)
});
