
const enviroment = {
    // @ts-ignorets-ignore
    LOGROCKET_KEY: process.env.LOGROCKET_KEY || '',
    // @ts-ignorets-ignore
    GRAPHQL_URL: process.env.GRAPHQL_URL || 'http://192.168.1.41:1338/graphql',
    // @ts-ignorets-ignore
    IS_PRODUCTION: process.env.IS_PRODUCTION === 'true'
}

export default enviroment;