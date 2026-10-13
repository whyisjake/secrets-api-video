import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Headline, Logo } from './components';
import { color, font } from './theme';

const Lock: React.FC = () => (
	<svg width={ 120 } height={ 120 } viewBox="0 0 24 24" fill="none" stroke={ color.white } strokeWidth={ 1.6 } strokeLinecap="round" strokeLinejoin="round">
		<rect x="5" y="11" width="14" height="9" rx="2" fill={ color.blueberry } stroke={ color.blueberry } />
		<path d="M8 11V8a4 4 0 0 1 8 0v3" />
		<circle cx="12" cy="15.5" r="1.3" fill={ color.white } stroke="none" />
	</svg>
);

/** Static LinkedIn thumbnail, 1920x1080. Content stays inside a 120px safe margin. */
export const Thumbnail: React.FC = () => (
	<AbsoluteFill style={ { background: color.dark, color: color.white, fontFamily: font.sans, padding: 120 } }>
		<div style={ { display: 'flex', height: '100%', alignItems: 'center', gap: 70 } }>
			<div style={ { flex: 1 } }>
				<Logo tone="dark" height={ 88 } />
				<Headline size={ 150 } style={ { marginTop: 56, lineHeight: 1.02 } }>
					Lock up<br />your AI keys.
				</Headline>
				<div style={ { marginTop: 48 } }>
					<div style={ { fontSize: 40, fontWeight: 600, color: '#a7b6ff' } }>The Secrets API · Coming in WordPress 7.2</div>
				</div>
			</div>
			<div
				style={ {
					width: 520,
					padding: '44px 40px',
					borderRadius: 24,
					background: '#2b2b2b',
					border: `2px solid ${ color.blueberry }`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 32,
				} }
			>
				<Lock />
				<div style={ { fontFamily: font.mono, fontSize: 46, fontWeight: 700, color: color.white, letterSpacing: '0.02em' } }>sk-••••••••</div>
				<div style={ { fontSize: 28, fontWeight: 600, color: '#a7b6ff' } }>Encrypted, not plain text</div>
			</div>
		</div>
	</AbsoluteFill>
);
