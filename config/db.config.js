const dialect = process.env.DB_DIALECT || 'postgres';
const isSqlite = dialect === 'sqlite';

module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || (isSqlite ? undefined : 5432),
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB: process.env.DB_NAME || 'eventdb',
    dialect,
    storage: isSqlite ? (process.env.DB_STORAGE || ':memory:') : undefined,
    dialectOptions: isSqlite ? {} : {
        connectTimeout: 60000
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    logging: process.env.NODE_ENV === 'test' ? false : undefined
};
