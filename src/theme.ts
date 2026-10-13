import { Easing } from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadGaramond } from '@remotion/google-fonts/EBGaramond';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// WordPress design language: Blueberry primary, near-black, white, restrained greys.
export const color = {
	blueberry: '#3858e9',
	blueberryDark: '#2a45c4',
	blueberryTint: '#eef1fd',
	dark: '#1e1e1e',
	white: '#ffffff',
	paper: '#f7f7f7',
	grey100: '#f0f0f0',
	grey300: '#dddddd',
	grey500: '#949494',
	grey700: '#50575e',
	red: '#cc1818',
	redTint: '#fcf0f0',
	green: '#008a20',
	greenTint: '#eff9f1',
};

// Syntax colors, tuned for a white code panel.
export const syntax = {
	fn: '#3858e9',
	str: '#067647',
	var: '#1e1e1e',
	kw: '#b42318',
	comment: '#949494',
	punct: '#50575e',
};

const inter = loadInter( 'normal', { weights: [ '400', '500', '600', '700' ], subsets: [ 'latin' ] } );
const garamond = loadGaramond( 'normal', { weights: [ '400', '500' ], subsets: [ 'latin' ] } );
const mono = loadMono( 'normal', { weights: [ '400', '500', '700' ], subsets: [ 'latin' ] } );

export const font = {
	sans: `${ inter.fontFamily }, system-ui, sans-serif`,
	serif: `${ garamond.fontFamily }, Georgia, serif`,
	mono: `${ mono.fontFamily }, ui-monospace, Menlo, monospace`,
};

export const ease = {
	default: Easing.bezier( 0.25, 0.1, 0.25, 1 ),
	enter: Easing.bezier( 0, 0, 0.2, 1 ),
};

export const ms = ( value: number, fps: number ) => Math.round( ( value / 1000 ) * fps );
