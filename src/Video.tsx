import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, Series, staticFile, useVideoConfig } from 'remotion';

import { chunksFor, LEAD_IN, TAIL } from './captions-core.mjs';
import { Captions } from './components';
import dev from '../script/narration.dev.json';
import linkedin from '../script/narration.linkedin.json';
import * as devScenes from './scenes-dev';
import * as linkedinScenes from './scenes-linkedin';
import { color } from './theme';

export type Manifest = {
	source: 'elevenlabs' | 'scratch';
	scenes: { id: string; file: string; seconds: number }[];
};

type SceneFC = React.FC< { seconds: number } >;
type Script = { scenes: { id: string; text: string; caption?: string }[] };

export const framesFor = ( seconds: number, fps: number ) => Math.ceil( ( LEAD_IN + seconds + TAIL ) * fps );

const cuts: Record< string, { script: Script; scenes: Record< string, SceneFC > } > = {
	linkedin: {
		script: linkedin,
		scenes: {
			hook: linkedinScenes.Hook,
			plaintext: linkedinScenes.Plaintext,
			api: linkedinScenes.Api,
			encrypted: linkedinScenes.Encrypted,
			health: linkedinScenes.Health,
			hosts: linkedinScenes.Hosts,
			close: linkedinScenes.Close,
		},
	},
	dev: { script: dev, scenes: devScenes.scenes },
};

export const SecretsApi: React.FC< { manifest: Manifest; cut: string } > = ( { manifest, cut } ) => {
	const { fps } = useVideoConfig();
	const { script, scenes } = cuts[ cut ];
	return (
		<AbsoluteFill style={ { background: color.white } }>
			<Series>
				{ manifest.scenes.map( scene => {
					const Component = scenes[ scene.id ];
					const entry = script.scenes.find( s => s.id === scene.id );
					if ( ! Component || ! entry ) {
						throw new Error( `No scene component or script entry for "${ scene.id }"` );
					}
					return (
						<Series.Sequence key={ scene.id } durationInFrames={ framesFor( scene.seconds, fps ) }>
							<Component seconds={ scene.seconds } />
							<Captions seconds={ scene.seconds } chunks={ chunksFor( entry.caption || entry.text ) } />
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
