
import postgres from "postgres";

export default postgres({	
	database: process.env.DBNAME,
	host: process.env.DBHOST,
	user: process.env.DBUSER,
	pass: process.env.DBPASS,
});