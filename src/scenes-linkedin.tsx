import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Browser, Code, Eyebrow, Footage, Headline, Lede, Logo, Reveal, Scene, Tag } from './components';
import { color, font, syntax } from './theme';

type P = { seconds: number };
const LEAD = 400;
const mk = ( seconds: number ) => ( f: number ) => LEAD + f * seconds * 1000;

const pad = '70px 130px 230px';
const center: React.CSSProperties = { padding: pad, justifyContent: 'center' };

const Card: React.FC< { title: string; children: React.ReactNode; accent?: string } > = ( { title, children, accent = color.blueberry } ) => (
	<div style={ { borderTop: `4px solid ${ accent }`, paddingTop: 20 } }>
		<div style={ { fontSize: 30, fontWeight: 700, marginBottom: 10 } }>{ title }</div>
		<div style={ { fontSize: 27, lineHeight: 1.4, color: color.grey700 } }>{ children }</div>
	</div>
);

const Mono: React.FC< { children: React.ReactNode } > = ( { children } ) => (
	<span style={ { fontFamily: font.mono, fontSize: '0.88em', background: color.grey100, padding: '2px 8px', borderRadius: 6, color: color.dark } }>{ children }</span>
);

export const Hook: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	const creds = [ 'AI provider API key', 'Payment service key', 'Email service key' ];
	return (
		<Scene>
			<AbsoluteFill style={ center }>
				<div style={ { display: 'flex', gap: 100, alignItems: 'center' } }>
					<div style={ { flex: 1 } }>
						<Reveal delay={ 100 }>
							<Logo height={ 64 } />
						</Reveal>
						<Reveal delay={ 350 } style={ { marginTop: 48 } }>
							<Eyebrow>Your API keys</Eyebrow>
						</Reveal>
						<Reveal delay={ 500 } style={ { marginTop: 24 } }>
							<Headline size={ 100 }>That key unlocks your account.</Headline>
						</Reveal>
						<Reveal delay={ at( 0.5 ) } style={ { marginTop: 32 } }>
							<Lede>Today it usually sits in the database as plain text.</Lede>
						</Reveal>
					</div>
					<div style={ { width: 700 } }>
						{ creds.map( ( c, i ) => (
							<Reveal key={ c } delay={ at( 0.3 + i * 0.1 ) } x={ 40 } y={ 0 }>
								<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', marginBottom: 16, border: `1px solid ${ color.grey300 }`, borderRadius: 12, fontSize: 30, fontWeight: 500 } }>
									<span>{ c }</span>
									<Tag bg={ color.redTint } fg={ color.red } style={ { fontSize: 20 } }>plain text</Tag>
								</div>
							</Reveal>
						) ) }
					</div>
				</div>
			</AbsoluteFill>
		</Scene>
	);
};

export const Plaintext: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ center }>
				<Reveal delay={ 100 }>
					<Eyebrow>In the database</Eyebrow>
				</Reveal>
				<Reveal delay={ 250 } style={ { marginTop: 32 } }>
					<Browser url="wp_options table (database view, not a WordPress screen)" width={ 1500 }>
						<Footage from={ 14 } length={ 8 } crop={ { x: 193, y: 220, w: 500, h: 28 } } width={ 1498 } />
					</Browser>
				</Reveal>
				<Reveal delay={ at( 0.55 ) } style={ { marginTop: 50 } }>
					<Headline size={ 84 }>
						A house key <span style={ { color: color.red } }>under the doormat.</span>
					</Headline>
				</Reveal>
			</AbsoluteFill>
		</Scene>
	);
};

const L = ( ...tokens: [ string, string ][] ) => tokens;
const { fn, str, var: v, kw, comment, punct } = syntax;

export const Api: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ center }>
				<Reveal delay={ 150 }>
					<Eyebrow>The new Secrets API</Eyebrow>
				</Reveal>
				<Reveal delay={ 300 } style={ { marginTop: 22 } }>
					<Headline size={ 92 }>Locked up before it is saved.</Headline>
				</Reveal>
				<div style={ { marginTop: 50 } }>
					<Code
						size={ 34 }
						style={ { width: 1500 } }
						reveal={ [ at( 0.45 ), at( 0.45 ), at( 0.6 ), at( 0.6 ), at( 0.6 ), at( 0.6 ) ] }
						lines={ [
							L( [ '// For developers', comment ] ),
							L( [ 'wp_set_secret', fn ], [ '( ', punct ], [ "'acme/openai_api_key'", str ], [ ', ', punct ], [ '$key', v ], [ ' );', punct ] ),
							L( [ '$secret', v ], [ ' = ', punct ], [ 'wp_get_secret', fn ], [ '( ', punct ], [ "'acme/openai_api_key'", str ], [ ' );', punct ] ),
							L( [ 'if', kw ], [ ' ( ', punct ], [ '$secret', v ], [ ' instanceof ', kw ], [ 'WP_Secret', fn ], [ ' ) {', punct ] ),
							L( [ '    $key', v ], [ ' = ', punct ], [ '$secret', v ], [ '->', punct ], [ 'reveal', fn ], [ '();', punct ], [ '  // string|WP_Error', comment ] ),
							L( [ '}', punct ] ),
						] }
					/>
				</div>
			</AbsoluteFill>
		</Scene>
	);
};

export const Encrypted: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ center }>
				<Reveal delay={ 100 } style={ { display: 'flex', alignItems: 'center', gap: 20 } }>
					<Eyebrow>Now the database holds</Eyebrow>
					<Tag mono style={ { fontSize: 22 } }>_wp_secret_acme/openai_api_key</Tag>
				</Reveal>
				<Reveal delay={ 250 } style={ { marginTop: 26 } }>
					<Browser url="wp_options table (database view, not a WordPress screen)" width={ 1660 }>
						<Footage from={ 26 } length={ 12 } crop={ { x: 455, y: 125, w: 600, h: 88 } } width={ 1658 } panTo={ 815 } panMs={ 6000 } panDelay={ 600 } />
					</Browser>
				</Reveal>
				<div style={ { display: 'flex', gap: 56, marginTop: 56 } }>
					<Reveal delay={ at( 0.2 ) } style={ { flex: 1.2 } }>
						<Card title="The key is not in the database">
							It lives in your site&apos;s config file (<Mono>wp-config.php</Mono>).
						</Card>
					</Reveal>
					<Reveal delay={ at( 0.5 ) } style={ { flex: 1 } }>
						<Card title="Previous version kept" accent={ color.green }>
							Swap in a fresh credential without a scramble.
						</Card>
					</Reveal>
				</div>
			</AbsoluteFill>
		</Scene>
	);
};

const Result: React.FC< { title: string; status: string; good?: boolean; note: string } > = ( { title, status, good, note } ) => (
	<div style={ { border: `1px solid ${ color.grey300 }`, borderRadius: 12, padding: '22px 28px', background: color.white } }>
		<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 } }>
			<div style={ { fontSize: 30, fontWeight: 600 } }>{ title }</div>
			<Tag bg={ good ? color.greenTint : color.blueberryTint } fg={ good ? color.green : color.blueberry } style={ { fontSize: 20 } }>
				{ status }
			</Tag>
		</div>
		<div style={ { marginTop: 10, fontSize: 24, color: color.grey700, lineHeight: 1.4 } }>{ note }</div>
	</div>
);

export const Health: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ { ...center, flexDirection: 'row', alignItems: 'center', gap: 80 } }>
				<div style={ { width: 680 } }>
					<Reveal delay={ 100 }>
						<Eyebrow>Site Health</Eyebrow>
					</Reveal>
					<Reveal delay={ 250 } style={ { marginTop: 26 } }>
						<Headline size={ 92 }>Could your setup be stronger?</Headline>
					</Reveal>
					<div style={ { marginTop: 44, display: 'flex', flexDirection: 'column', gap: 18 } }>
						<Reveal delay={ at( 0.3 ) }>
							<Result title="Secrets API is using a fallback key" status="Recommended" note="No dedicated WP_SECRETS_KEY is defined. Define one." />
						</Reveal>
						<Reveal delay={ at( 0.55 ) }>
							<Result title="Secrets API is using a dedicated key" status="Good" good note="WP_SECRETS_KEY (base64-encoded 32 bytes)" />
						</Reveal>
					</div>
				</div>
				<Reveal delay={ 400 } x={ 40 } y={ 0 } style={ { flex: 1 } }>
					<Browser url="Tools › Site Health" width={ 1040 }>
						<Footage from={ 49 } length={ 8 } crop={ { x: 412, y: 576, w: 776, h: 108 } } width={ 1038 } />
					</Browser>
				</Reveal>
			</AbsoluteFill>
		</Scene>
	);
};

export const Hosts: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ center }>
				<Reveal delay={ 100 }>
					<Eyebrow>For hosting companies</Eyebrow>
				</Reveal>
				<Reveal delay={ 250 } style={ { marginTop: 22 } }>
					<Headline size={ 92 }>Bring your own vault.</Headline>
				</Reveal>
				<div style={ { display: 'flex', gap: 70, marginTop: 50, alignItems: 'flex-start' } }>
					<div style={ { width: 600 } }>
						<Reveal delay={ at( 0.1 ) }>
							<div style={ { fontFamily: font.mono, fontSize: 32, lineHeight: 1.7, background: color.paper, border: `1px solid ${ color.grey300 }`, borderRadius: 14, padding: '24px 34px' } }>
								<div style={ { color: color.grey700 } }>wp-content/</div>
								<div style={ { color: color.grey500, paddingLeft: 34 } }>object-cache.php</div>
								<div style={ { paddingLeft: 34, color: color.blueberry, fontWeight: 700 } }>secrets.php</div>
							</div>
						</Reveal>
						<Reveal delay={ at( 0.3 ) } style={ { marginTop: 26 } }>
							<Lede style={ { fontSize: 30 } }>A drop-in file, like <Mono>object-cache.php</Mono>, connects a host&apos;s own vault or key service.</Lede>
						</Reveal>
					</div>
					<div style={ { flex: 1 } }>
						<Reveal delay={ at( 0.2 ) } x={ 40 } y={ 0 }>
							<Browser url="Site Health › Info › Secrets API (demo drop-in)" width={ 1000 }>
								<Footage from={ 64 } length={ 8 } crop={ { x: 424, y: 504, w: 752, h: 172 } } width={ 998 } />
							</Browser>
						</Reveal>
						<Reveal delay={ at( 0.6 ) } y={ 10 } style={ { marginTop: 26 } }>
							<div style={ { padding: '18px 28px', borderRadius: 12, background: color.redTint, color: color.red, fontSize: 28, fontWeight: 600 } }>
								Broken drop-in: an error, not a silent fallback.
							</div>
						</Reveal>
					</div>
				</div>
			</AbsoluteFill>
		</Scene>
	);
};

export const Close: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	const item = ( label: string, text: string ) => (
		<div style={ { borderTop: '3px solid #fff', paddingTop: 20 } }>
			<div style={ { fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 } }>{ label }</div>
			<div style={ { fontSize: 36, marginTop: 10 } }>{ text }</div>
		</div>
	);
	return (
		<Scene tone="dark">
			<AbsoluteFill style={ { background: color.blueberry, ...center } }>
				<Reveal delay={ 100 }>
					<Logo tone="dark" height={ 64 } />
				</Reveal>
				<Reveal delay={ 300 } style={ { marginTop: 50 } }>
					<Headline size={ 124 }>Coming in WordPress 7.2</Headline>
				</Reveal>
				<Reveal delay={ 450 } style={ { marginTop: 24 } }>
					<div style={ { fontSize: 40, fontWeight: 600 } }>A step toward a more secure WordPress.</div>
				</Reveal>
				{ /* On screen for the whole scene, from the first moments, so "secretsapi.dev" is readable throughout. */ }
				<Reveal delay={ 600 } style={ { marginTop: 48 } }>
					<div style={ { display: 'inline-flex', alignItems: 'center', gap: 22, background: color.white, color: color.blueberry, borderRadius: 18, padding: '18px 40px' } }>
						<span style={ { fontSize: 26, fontWeight: 600, color: color.grey700 } }>Learn more</span>
						<span style={ { fontSize: 60, fontWeight: 700, fontFamily: font.mono } }>secretsapi.dev</span>
					</div>
				</Reveal>
				<div style={ { display: 'flex', gap: 60, marginTop: 56 } }>
					<Reveal delay={ at( 0.3 ) } style={ { flex: 1 } }>{ item( 'Next', 'Connectors, where you add AI keys, moves onto it next.' ) }</Reveal>
					<Reveal delay={ at( 0.5 ) } style={ { flex: 1 } }>{ item( 'Later', 'An admin screen, planned for 7.3.' ) }</Reveal>
				</div>
			</AbsoluteFill>
		</Scene>
	);
};
