const mysql = require( 'mysql' );
const { getDockerIP } = require('./configure');

const getConnection = async function() {
	const ip = await getDockerIP();
	const connection = mysql.createConnection( {
		host: ip,
		user: 'root',
		password: 'password',
	} );

	return connection;
};

const create = async function( dbname ) {
	const connection = await getConnection();

	await new Promise( ( resolve, reject ) => {
		connection.query( `CREATE DATABASE IF NOT EXISTS \`${ dbname }\`;`, function ( err ) {
			connection.destroy();

			if ( err ) {
				reject( Error( err ) );
			}

			resolve();
		} );
	} );
};

const deleteDatabase = async function( dbname ) {
	const connection = await getConnection();

	await new Promise( ( resolve, reject ) => {
		connection.query( `DROP DATABASE IF EXISTS \`${ dbname }\`;`, function( err ) {
			connection.destroy();

			if ( err ) {
				reject( Error( err ) );
			}

			resolve();
		} );
	} );
};

const assignPrivs = async function ( dbname ) {
	const connection = await getConnection();

	await new Promise( ( resolve, reject ) => {
		connection.query( `GRANT ALL PRIVILEGES ON \`${ dbname }\`.* TO 'wordpress'@'%' IDENTIFIED BY 'password';`, function( err ) {
			connection.destroy();

			if ( err ) {
				reject( Error( err ) );
			}

			resolve();
		} );
	} );
};

module.exports = { create, deleteDatabase, assignPrivs };
