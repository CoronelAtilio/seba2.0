const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'seba'
});

async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

module.exports = checkConnection;