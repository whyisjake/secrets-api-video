// Caption chunking shared by the composition (burned-in captions) and script/captions.mjs (SRT).
export const FPS = 30;
export const LEAD_IN = 0.4;
export const TAIL = 0.9;
export const sceneSeconds = seconds => Math.ceil( ( LEAD_IN + seconds + TAIL ) * FPS ) / FPS;

const MAX = 72;

function split( sentence ) {
	if ( sentence.length <= MAX ) {
		return [ sentence ];
	}
	// Break at the comma or "and" nearest the middle.
	const mid = sentence.length / 2;
	let best = -1;
	for ( const m of sentence.matchAll( /, | and | with /g ) ) {
		const at = m[ 0 ] === ', ' ? m.index + 1 : m.index;
		if ( best < 0 || Math.abs( at - mid ) < Math.abs( best - mid ) ) {
			best = at;
		}
	}
	if ( best < 0 ) {
		return [ sentence ];
	}
	return [ ...split( sentence.slice( 0, best ).trim() ), ...split( sentence.slice( best ).trim() ) ];
}

/** Chunks with start/end as fractions (0..1) of the narration clip. */
export function chunksFor( text ) {
	const parts = text
		.split( /(?<=[.?!])\s+/ )
		.flatMap( split )
		.filter( Boolean );
	const total = parts.reduce( ( n, p ) => n + p.length, 0 );
	let acc = 0;
	return parts.map( p => {
		const start = acc / total;
		acc += p.length;
		return { text: p, start, end: acc / total };
	} );
}

