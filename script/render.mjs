// `npm run render:<cut>`: renders a cut to its own, never-overwritten file,
// out/secrets-api-<cut>-v<N>.mp4 (+ .srt), where N is the next unused version.
// Pass an explicit version with `-- v3`; an existing file is never replaced.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const compositions = { linkedin: 'SecretsApiLinkedin', dev: 'SecretsApiDev' };
const [ cut, requested ] = process.argv.slice( 2 );

if ( ! compositions[ cut ] ) {
	throw new Error( `Unknown cut "${ cut }". Use: ${ Object.keys( compositions ).join( ', ' ) }` );
}

let version = requested;
if ( ! version ) {
	let n = 1;
	while ( existsSync( join( root, 'out', `secrets-api-${ cut }-v${ n }.mp4` ) ) ) {
		n++;
	}
	version = `v${ n }`;
}

const base = `out/secrets-api-${ cut }-${ version }`;
if ( existsSync( join( root, `${ base }.mp4` ) ) ) {
	throw new Error( `${ base }.mp4 already exists; refusing to overwrite.` );
}

const run = ( cmd, args ) => execFileSync( cmd, args, { cwd: root, stdio: 'inherit' } );
run( 'node', [ 'script/captions.mjs', cut, `${ base }.srt` ] );
run( 'npx', [ 'remotion', 'render', 'src/index.ts', compositions[ cut ], `${ base }.mp4` ] );
console.log( `\nRendered ${ base }.mp4` );
