import React from 'react';
import { AbsoluteFill, Freeze, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

import { color, ease, font, ms, syntax } from './theme';

export function useProgress( delay: number, duration = 500 ) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	return interpolate( frame, [ ms( delay, fps ), ms( delay + duration, fps ) ], [ 0, 1 ], {
		easing: ease.enter,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	} );
}

export const Reveal: React.FC< {
	delay?: number;
	duration?: number;
	y?: number;
	x?: number;
	style?: React.CSSProperties;
	children: React.ReactNode;
} > = ( { delay = 0, duration = 500, y = 20, x = 0, style, children } ) => {
	const p = useProgress( delay, duration );
	return (
		<div style={ { opacity: p, transform: `translate(${ ( 1 - p ) * x }px, ${ ( 1 - p ) * y }px)`, ...style } }>
			{ children }
		</div>
	);
};

export const Scene: React.FC< { tone?: 'light' | 'dark'; children: React.ReactNode } > = ( { tone = 'light', children } ) => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const fade = ms( 300, fps );
	const opacity = interpolate( frame, [ 0, fade, durationInFrames - fade, durationInFrames ], [ 0, 1, 1, 0 ], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	} );
	return (
		<AbsoluteFill
			style={ {
				background: tone === 'dark' ? color.dark : color.white,
				color: tone === 'dark' ? color.white : color.dark,
				fontFamily: font.sans,
			} }
		>
			<AbsoluteFill style={ { opacity } }>{ children }</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const Logo: React.FC< { tone?: 'light' | 'dark'; height?: number } > = ( { tone = 'light', height = 56 } ) => (
	<Img
		src={ staticFile( tone === 'dark' ? 'logo/wordpress-logo-white.svg' : 'logo/wordpress-logo-dark.svg' ) }
		style={ { height, width: height } }
	/>
);

export const Eyebrow: React.FC< { children: React.ReactNode; tone?: 'light' | 'dark' } > = ( { children, tone = 'light' } ) => (
	<div
		style={ {
			fontSize: 24,
			fontWeight: 600,
			letterSpacing: '0.1em',
			textTransform: 'uppercase',
			color: tone === 'dark' ? '#a7b6ff' : color.blueberry,
		} }
	>
		{ children }
	</div>
);

export const Headline: React.FC< { children: React.ReactNode; size?: number; style?: React.CSSProperties } > = ( {
	children,
	size = 96,
	style,
} ) => (
	<div style={ { fontFamily: font.serif, fontSize: size, fontWeight: 400, lineHeight: 1.04, letterSpacing: '-0.01em', ...style } }>
		{ children }
	</div>
);

export const Lede: React.FC< { children: React.ReactNode; style?: React.CSSProperties } > = ( { children, style } ) => (
	<div style={ { fontSize: 36, lineHeight: 1.35, color: color.grey700, ...style } }>{ children }</div>
);

export const Tag: React.FC< { children: React.ReactNode; bg?: string; fg?: string; mono?: boolean; style?: React.CSSProperties } > = ( {
	children,
	bg = color.blueberryTint,
	fg = color.blueberry,
	mono = false,
	style,
} ) => (
	<span
		style={ {
			display: 'inline-block',
			padding: '8px 18px',
			borderRadius: 999,
			background: bg,
			color: fg,
			fontSize: 24,
			fontWeight: 600,
			fontFamily: mono ? font.mono : font.sans,
			...style,
		} }
	>
		{ children }
	</span>
);

/** A neutral browser frame. */
export const Browser: React.FC< { url: string; width: number; style?: React.CSSProperties; children: React.ReactNode } > = ( {
	url,
	width,
	style,
	children,
} ) => (
	<div
		style={ {
			width,
			background: color.white,
			borderRadius: 14,
			border: `1px solid ${ color.grey300 }`,
			boxShadow: '0 24px 70px rgba(30,30,30,0.14)',
			overflow: 'hidden',
			...style,
		} }
	>
		<div style={ { height: 50, display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px', background: color.paper, borderBottom: `1px solid ${ color.grey300 }` } }>
			{ [ 0, 1, 2 ].map( i => (
				<div key={ i } style={ { width: 12, height: 12, borderRadius: 6, background: color.grey300 } } />
			) ) }
			<div style={ { marginLeft: 16, padding: '6px 18px', borderRadius: 8, background: color.white, border: `1px solid ${ color.grey300 }`, fontSize: 19, color: color.grey700, fontFamily: font.sans } }>
				{ url }
			</div>
		</div>
		{ children }
	</div>
);

export type Crop = { x: number; y: number; w: number; h: number };

/**
 * Muted slice of the demo recording, cropped to a region of the 1440x900 source.
 * The crop sits inside the demo's orange highlight outline. With `panTo`, the crop
 * slides horizontally to that x over `panMs`. Freezes on the last frame if the
 * scene outlasts the clip.
 */
export const Footage: React.FC< { from: number; length: number; crop: Crop; width: number; panTo?: number; panMs?: number; panDelay?: number } > = ( {
	from,
	length,
	crop,
	width,
	panTo,
	panMs = 4000,
	panDelay = 800,
} ) => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();
	const scale = width / crop.w;
	const maxFrame = Math.floor( length * fps ) - 1;
	const x = panTo === undefined
		? crop.x
		: interpolate( frame, [ ms( panDelay, fps ), ms( panDelay + panMs, fps ) ], [ crop.x, panTo ], {
				easing: ease.default,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
		  } );
	return (
		<div style={ { width, height: crop.h * scale, overflow: 'hidden', position: 'relative', background: color.white } }>
			<Freeze frame={ Math.min( frame, maxFrame ) }>
				<OffthreadVideo
					src={ staticFile( 'footage/demo.mp4' ) }
					muted
					startFrom={ Math.round( from * fps ) }
					endAt={ Math.round( ( from + length ) * fps ) }
					style={ { position: 'absolute', left: -x * scale, top: -crop.y * scale, width: 1440 * scale, height: 900 * scale } }
				/>
			</Freeze>
		</div>
	);
};

/** Burned-in captions: LinkedIn autoplays muted. */
export const Captions: React.FC< { chunks: { text: string; start: number; end: number }[]; seconds: number } > = ( { chunks, seconds } ) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame / fps - 0.4;
	const idx = chunks.findIndex( c => t >= c.start * seconds && t < c.end * seconds );
	const chunk = idx >= 0 ? chunks[ idx ] : undefined;
	if ( ! chunk ) {
		return null;
	}
	const local = t - chunk.start * seconds;
	const opacity = interpolate( local, [ 0, 0.15 ], [ 0, 1 ], { extrapolateRight: 'clamp' } );
	return (
		<AbsoluteFill style={ { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64, pointerEvents: 'none' } }>
			<div
				style={ {
					opacity,
					maxWidth: 1560,
					padding: '16px 34px',
					borderRadius: 14,
					background: 'rgba(30,30,30,0.94)',
					color: color.white,
					fontFamily: font.sans,
					fontSize: 46,
					fontWeight: 600,
					lineHeight: 1.25,
					textAlign: 'center',
				} }
			>
				{ chunk.text }
			</div>
		</AbsoluteFill>
	);
};

type Token = [ string, string ];

/** Monospace code panel with simple syntax coloring. Lines are arrays of [text, color]. */
export const Code: React.FC< { lines: Token[][]; size?: number; reveal?: number[]; style?: React.CSSProperties } > = ( {
	lines,
	size = 34,
	reveal,
	style,
} ) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	return (
		<div
			style={ {
				background: color.white,
				border: `1px solid ${ color.grey300 }`,
				borderRadius: 14,
				padding: '36px 44px',
				fontFamily: font.mono,
				fontSize: size,
				lineHeight: 1.6,
				boxShadow: '0 24px 70px rgba(30,30,30,0.10)',
				...style,
			} }
		>
			{ lines.map( ( line, i ) => {
				const t = reveal ? reveal[ i ] : 0;
				const p = interpolate( frame, [ ms( t, fps ), ms( t + 450, fps ) ], [ 0, 1 ], {
					easing: ease.enter,
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				} );
				return (
					<div key={ i } style={ { whiteSpace: 'pre', minHeight: size * 1.6, opacity: p, transform: `translateY(${ ( 1 - p ) * 10 }px)` } }>
						{ line.map( ( [ text, c ], j ) => (
							<span key={ j } style={ { color: c } }>
								{ text }
							</span>
						) ) }
					</div>
				);
			} ) }
		</div>
	);
};

export { syntax };
