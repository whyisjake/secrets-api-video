// Shared caption chunking: used by the composition (burned-in captions) and,
// when run directly, to write out/secrets-api.srt next to the video.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chunksFor, LEAD_IN, sceneSeconds } from '../src/captions-core.mjs';

const stamp = s => {
	const ms = Math.round( s * 1000 );
	const p = ( n, w = 2 ) => String( n ).padStart( w, '0' );
	return `${ p( Math.floor( ms / 3600000 ) ) }:${ p( Math.floor( ms / 60000 ) % 60 ) }:${ p( Math.floor( ms / 1000 ) % 60 ) },${ p( ms % 1000, 3 ) }`;
};

if ( import.meta.url === `file://${ process.argv[ 1 ] }` ) {
	const root = join( dirname( fileURLToPath( import.meta.url ) ), '..' );
	const [ cut, outFile ] = process.argv.slice( 2 );
	const { scenes } = JSON.parse( readFileSync( join( root, 'script', `narration.${ cut }.json` ), 'utf8' ) );
	const manifest = JSON.parse( readFileSync( join( root, 'public', 'audio', cut, 'manifest.json' ), 'utf8' ) );
	let offset = 0;
	let n = 1;
	let out = '';
	for ( const m of manifest.scenes ) {
		const scene = scenes.find( s => s.id === m.id );
		for ( const c of chunksFor( scene.caption || scene.text ) ) {
			const a = offset + LEAD_IN + c.start * m.seconds;
			const b = offset + LEAD_IN + c.end * m.seconds;
			out += `${ n++ }\n${ stamp( a ) } --> ${ stamp( b ) }\n${ c.text }\n\n`;
		}
		offset += sceneSeconds( m.seconds );
	}
	writeFileSync( join( root, outFile ), out );
	console.log( `Wrote ${ outFile } (${ n - 1 } cues)` );
}
