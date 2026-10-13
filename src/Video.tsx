import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, Series, staticFile, useVideoConfig } from 'remotion';

import { Api, Close, Encrypted, Health, Hook, Hosts, Plaintext } from './scenes';
import { Captions } from './components';
import { chunksFor, LEAD_IN, TAIL } from './captions-core.mjs';
import narration from '../script/narration.json';
import { color } from './theme';

export type Manifest = {
	source: 'elevenlabs' | 'scratch';
	scenes: { id: string; file: string; seconds: number }[];
};

const captionFor = ( id: string ) => {
	const s = ( narration.scenes as { id: string; text: string; caption?: string }[] ).find( x => x.id === id );
	return s ? s.caption || s.text : '';
};

export const framesFor = ( seconds: number, fps: number ) => Math.ceil( ( LEAD_IN + seconds + TAIL ) * fps );

const scenes: Record< string, React.FC< { seconds: number } > > = {
	hook: Hook,
	plaintext: Plaintext,
	api: Api,
	encrypted: Encrypted,
	health: Health,
	hosts: Hosts,
	close: Close,
};

export const SecretsApi: React.FC< { manifest: Manifest } > = ( { manifest } ) => {
	const { fps } = useVideoConfig();
	return (
		<AbsoluteFill style={ { background: color.white } }>
			<Series>
				{ manifest.scenes.map( scene => {
					const Component = scenes[ scene.id ];
					if ( ! Component ) {
						throw new Error( `No scene component for "${ scene.id }"` );
					}
					return (
						<Series.Sequence key={ scene.id } durationInFrames={ framesFor( scene.seconds, fps ) }>
							<Component seconds={ scene.seconds } />
							<Captions seconds={ scene.seconds } chunks={ chunksFor( captionFor( scene.id ) ) } />
							<Sequence from={ Math.round( LEAD_IN * fps ) }>
								<Html5Audio src={ staticFile( scene.file ) } />
							</Sequence>
						</Series.Sequence>
					);
				} ) }
			</Series>
		</AbsoluteFill>
	);
};
