// Generates one narration clip per scene and writes public/audio/manifest.json,
// which the composition reads to size each scene to its voiceover.
//
// Uses ElevenLabs when ELEVENLABS_API_KEY is set (in the environment or .env),
// otherwise falls back to macOS `say` as a scratch track for timing.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
const outDir = join( root, 'public', 'audio' );

function loadEnv() {
	const envPath = process.env.ENV_FILE || join( root, '.env' );
	if ( ! existsSync( envPath ) ) {
		return;
	}
	for ( const line of readFileSync( envPath, 'utf8' ).split( '\n' ) ) {
		const match = line.match( /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/ );
		if ( match && ! process.env[ match[ 1 ] ] ) {
			process.env[ match[ 1 ] ] = match[ 2 ].replace( /^['"]|['"]$/g, '' );
		}
	}
}

function durationSeconds( file ) {
	const info = execFileSync( 'afinfo', [ file ], { encoding: 'utf8' } );
	const match = info.match( /estimated duration:\s*([\d.]+)/ );
	if ( ! match ) {
		throw new Error( `Could not read duration of ${ file }` );
	}
	return Number( match[ 1 ] );
}

async function elevenLabs( text, file, { apiKey, voiceId, modelId } ) {
	const res = await fetch( `https://api.elevenlabs.io/v1/text-to-speech/${ voiceId }?output_format=mp3_44100_128`, {
		method: 'POST',
		headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
		body: JSON.stringify( {
			text,
			model_id: modelId,
			voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
		} ),
	} );
	if ( ! res.ok ) {
		// Status only: the body can echo request details.
		throw new Error( `ElevenLabs request failed with status ${ res.status }` );
	}
	writeFileSync( file, Buffer.from( await res.arrayBuffer() ) );
}

function scratch( text, file ) {
	execFileSync( 'say', [ '-v', process.env.SCRATCH_VOICE || 'Samantha', '-r', '175', '-o', file, '--data-format=LEI16@44100', text ] );
}

loadEnv();

const { voice, scenes } = JSON.parse( readFileSync( join( root, 'script', 'narration.json' ), 'utf8' ) );
const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const source = apiKey ? 'elevenlabs' : 'scratch';

if ( apiKey && ! voiceId ) {
	throw new Error( 'Set ELEVENLABS_VOICE_ID in .env to choose the narrator voice.' );
}

// `npm run narrate -- <scene-id> ...` regenerates only those clips and keeps the rest.
const only = process.argv.slice( 2 );
const manifestPath = join( outDir, 'manifest.json' );
const previous = only.length && existsSync( manifestPath ) ? JSON.parse( readFileSync( manifestPath, 'utf8' ) ) : null;

if ( only.length && ( ! previous || previous.source !== source ) ) {
	throw new Error( 'Partial regeneration needs an existing manifest from the same voice source.' );
}
if ( ! only.length ) {
	rmSync( outDir, { recursive: true, force: true } );
}
mkdirSync( outDir, { recursive: true } );

const manifest = { source, scenes: [] };

for ( const scene of scenes ) {
	if ( only.length && ! only.includes( scene.id ) ) {
		const kept = previous.scenes.find( s => s.id === scene.id );
		if ( ! kept ) {
			throw new Error( `No existing clip for "${ scene.id }"` );
		}
		manifest.scenes.push( kept );
		continue;
	}

	const file = `${ scene.id }.${ apiKey ? 'mp3' : 'wav' }`;
	const path = join( outDir, file );

	if ( apiKey ) {
		await elevenLabs( scene.text, path, { apiKey, voiceId, modelId: voice.modelId } );
	} else {
		scratch( scene.text, path );
	}

	const seconds = durationSeconds( path );
	manifest.scenes.push( { id: scene.id, file: `audio/${ file }`, seconds } );
	console.log( `${ scene.id.padEnd( 16 ) } ${ seconds.toFixed( 1 ) }s` );
}

const total = manifest.scenes.reduce( ( sum, s ) => sum + s.seconds, 0 );
writeFileSync( manifestPath, JSON.stringify( manifest, null, '\t' ) );
console.log( `\n${ source }: ${ total.toFixed( 1 ) }s of narration across ${ manifest.scenes.length } scenes` );
