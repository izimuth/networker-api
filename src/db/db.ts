
import 'dotenv/config';
import sql from "./sql";

// import migrations
import createUsers from './migrate_create_users';
import migrate1 from './migrate_add_avatar_field';
import migrate2 from './migrate_create_links';
import migrate3 from './migrate_reset_tokens';

interface Migration
{
	notes: string;
	up(): Promise<void>;
	down(): Promise<void>;
}

// get argument
function getArgv(index: number, def?: string): string
{
	const args = process.argv.slice(3);

	return index < args.length ? args[index] : (def ?? '');
}

// get latest migration number
async function getLatestMigration()
{
	const result = await sql`SELECT * FROM db_migrations ORDER BY number DESC LIMIT 1`;
	return result.length > 0 ? result[0]['number'] : -1;
}

// add migration record
async function addMigrationRecord(notes: string, number: number)
{
	await sql`INSERT INTO db_migrations (notes, number) VALUES (${notes}, ${number})`;
}

// create list of migrations
const migrations: Migration[] = [
	createUsers,
	migrate1,
	migrate2,
	migrate3,
];

const commands = {
	async migrate()
	{
		// get highest migration number
		const latest = await getLatestMigration();

		// only run migrations where i > latest
		for(let i=0; i<migrations.length; i++)
		{
			if (i <= latest)
				continue;
			
			// print details
			console.log(`Running migration #${i}: ${migrations[i].notes}`);

			// run migration
			await migrations[i].up();

			// add record
			await addMigrationRecord(migrations[i].notes, i);
		}
	},

	async rollback()
	{
		const latest = await getLatestMigration();
		const until = parseInt(getArgv(0, '0'), 10);

		// print warning if until is invalid
		if (until > latest)
		{
			console.log(`Tried to roll database back to migration #${until}, but latest(${latest}) is a lower value`);
			return;
		}

		// roll migrations back
		for(let i=latest; i>=until; i--)
		{
			if (i < migrations.length)
			{
				console.log(`Rolling back migration #${i}: ${migrations[i].notes}`);
				await migrations[i].down();
			}
		}

		// delete migration records
		await sql`DELETE FROM db_migrations WHERE number >= ${until}`;
	},
}

async function executeCommand()
{
	const args = process.argv.slice(2);
	const cmd = args[0] as keyof typeof commands;

	if (commands[cmd])
	{
		try
		{
			await commands[cmd]();
			console.log('Complete.');
		}
		finally
		{
			await sql.end();
		}
	}
	else
	{
		console.log(`Unknown command: ${cmd}`);
	}
}

executeCommand();