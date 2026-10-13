import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Browser, CodeBlock, Eyebrow, Footage, Headline, Logo, Note, Reveal, Scene, Tag } from './components';
import { color, font } from './theme';

type P = { seconds: number };
const LEAD = 400;
// Scene-relative time in ms for a fraction of the narration.
const mk = ( seconds: number ) => ( f: number ) => LEAD + f * seconds * 1000;

const pad = '56px 110px 215px';

const Mono: React.FC< { children: React.ReactNode } > = ( { children } ) => (
	<span style={ { fontFamily: font.mono, fontSize: '0.86em', background: color.grey100, padding: '1px 7px', borderRadius: 6, color: color.dark } }>{ children }</span>
);

/** Eyebrow + serif title above a code column and a notes column. */
const Layout: React.FC< { eyebrow: string; title: string; code: React.ReactNode; notes?: React.ReactNode } > = ( { eyebrow, title, code, notes } ) => (
	<Scene>
		<AbsoluteFill style={ { padding: pad, justifyContent: 'center' } }>
			<Reveal delay={ 100 }>
				<Eyebrow>{ eyebrow }</Eyebrow>
			</Reveal>
			<Reveal delay={ 220 } style={ { marginTop: 14 } }>
				<Headline size={ 70 }>{ title }</Headline>
			</Reveal>
			<div style={ { display: 'flex', gap: 70, marginTop: 40, alignItems: 'flex-start' } }>
				<div>{ code }</div>
				<div style={ { flex: 1, paddingTop: 8 } }>{ notes }</div>
			</div>
		</AbsoluteFill>
	</Scene>
);

export const Intro: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ { padding: pad, justifyContent: 'center' } }>
				<Reveal delay={ 100 }>
					<Logo height={ 72 } />
				</Reveal>
				<Reveal delay={ 350 } style={ { marginTop: 56 } }>
					<Eyebrow>For plugin, theme and host developers</Eyebrow>
				</Reveal>
				<Reveal delay={ 500 } style={ { marginTop: 22 } }>
					<Headline size={ 150 }>The Secrets API</Headline>
				</Reveal>
				<Reveal delay={ at( 0.4 ) } style={ { marginTop: 50, display: 'flex', gap: 18 } }>
					<Tag mono>committed in r64337</Tag>
					<Tag mono>target: WordPress 7.2</Tag>
					<Tag mono>Trac #66187</Tag>
				</Reveal>
			</AbsoluteFill>
		</Scene>
	);
};

export const Why: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="The problem"
			title="Credentials sit in options."
			code={
				<div style={ { width: 1150 } }>
					<CodeBlock lines={ [ "update_option( 'my_plugin_api_key', $key );" ] } width={ 1150 } size={ 34 } />
					<Reveal delay={ at( 0.3 ) } style={ { marginTop: 34 } }>
						<Browser url="wp_options table (database view, not a WordPress screen)" width={ 1150 }>
							<Footage from={ 14 } length={ 8 } crop={ { x: 193, y: 220, w: 500, h: 28 } } width={ 1148 } />
						</Browser>
					</Reveal>
				</div>
			}
			notes={
				<Reveal delay={ at( 0.45 ) }>
					<Note title="Plain text in the database" accent={ color.red }>
						A database dump or a backup exposes every key. Shown: <Mono>connectors_ai_openai_api_key</Mono>.
					</Note>
				</Reveal>
			}
		/>
	);
};

export const Store: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Storing"
			title="wp_set_secret()"
			code={
				<CodeBlock
					size={ 34 }
					lines={ [ "$result = wp_set_secret( 'my-plugin/api_key', $key );", '', 'if ( is_wp_error( $result ) ) {', '    // e.g. secret_invalid_name', '}' ] }
					focus={ [ { at: at( 0.05 ), lines: [ 0 ] }, { at: at( 0.4 ), lines: [ 2, 3, 4 ] }, { at: at( 0.65 ), lines: [ 0 ] } ] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.3 ) }>
						<Note title="Returns true|WP_Error" />
					</Reveal>
					<Reveal delay={ at( 0.6 ) }>
						<Note title="Name: plugin-slug/key-name">
							Lowercase letters, numbers, hyphens, underscores. One slash. Up to 172 characters.
						</Note>
					</Reveal>
				</>
			}
		/>
	);
};

export const Read: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Reading"
			title="Three outcomes, never collapsed."
			code={
				<CodeBlock
					size={ 32 }
					lines={ [
						"$secret = wp_get_secret( 'my-plugin/api_key' );",
						'',
						'if ( is_wp_error( $secret ) ) {',
						'    // Exists, but could not be read.',
						'} elseif ( null === $secret ) {',
						'    // No such secret.',
						'} else {',
						'    $key = $secret->reveal(); // string|WP_Error',
						'}',
					] }
					focus={ [
						{ at: at( 0.1 ), lines: [ 0 ] },
						{ at: at( 0.22 ), lines: [ 6, 7, 8 ] },
						{ at: at( 0.42 ), lines: [ 4, 5 ] },
						{ at: at( 0.55 ), lines: [ 2, 3 ] },
						{ at: at( 0.78 ), lines: [ 7 ] },
					] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.22 ) }>
						<Note title="WP_Secret">It exists and decrypts.</Note>
					</Reveal>
					<Reveal delay={ at( 0.42 ) }>
						<Note title="null" accent={ color.grey500 }>It does not exist.</Note>
					</Reveal>
					<Reveal delay={ at( 0.55 ) }>
						<Note title="WP_Error" accent={ color.red }>It exists but could not be retrieved.</Note>
					</Reveal>
					<Reveal delay={ at( 0.8 ) }>
						<Note title="reveal() returns string|WP_Error" accent={ color.green }>Check it too.</Note>
					</Reveal>
				</>
			}
		/>
	);
};

export const Hidden: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Hidden by default"
			title="No accidental leaks."
			code={
				<CodeBlock
					size={ 27 }
					width={ 1250 }
					lines={ [
						'echo $secret;             // [secret:my-plugin/api_key]',
						'error_log( $secret );     // [secret:my-plugin/api_key]',
						'json_encode( $secret );   // "[secret:my-plugin/api_key]"',
						'var_dump( $secret );      // ["value"]=> "[secret:my-plugin/api_key]"',
						'',
						'serialize( $secret );     // throws LogicException',
						'clone $secret;            // throws LogicException',
						'',
						'$secret->reveal();        // the plaintext',
					] }
					focus={ [
						{ at: at( 0.15 ), lines: [ 0, 1, 2, 3 ] },
						{ at: at( 0.5 ), lines: [ 5, 6 ] },
						{ at: at( 0.78 ), lines: [ 8 ] },
					] }
				/>
			}
			notes={
				<Reveal delay={ at( 0.15 ) }>
					<Note title="A placeholder, not the value">The plaintext is never a property of the object.</Note>
				</Reveal>
			}
		/>
	);
};

export const Migrate: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Migrating"
			title="wp_import_option_as_secret()"
			code={
				<CodeBlock
					size={ 34 }
					lines={ [ '$result = wp_import_option_as_secret(', "    'my_plugin_api_key',  // existing option", "    'my-plugin/api_key'   // new secret name", ');' ] }
					focus={ [ { at: at( 0.1 ), lines: [ 0, 1, 2, 3 ] } ] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.3 ) }>
						<Note title="The option is left untouched">Delete it yourself once you have checked.</Note>
					</Reveal>
					<Reveal delay={ at( 0.55 ) }>
						<Note title="Flagged needs_rotation" accent={ color.red }>It already lived in plain text.</Note>
					</Reveal>
					<Reveal delay={ at( 0.75 ) }>
						<Note title="Returns true|WP_Error" accent={ color.grey500 } />
					</Reveal>
				</>
			}
		/>
	);
};

export const Rotate: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Rotation"
			title="The previous version stays."
			code={
				<CodeBlock
					size={ 32 }
					lines={ [
						"wp_set_secret( 'my-plugin/api_key', $new_key );",
						'',
						'$old = wp_get_secret(',
						"    'my-plugin/api_key',",
						'    WP_Secret_Version::PREVIOUS',
						');',
						'',
						"wp_retire_secret_version( 'my-plugin/api_key' );",
					] }
					focus={ [
						{ at: at( 0.08 ), lines: [ 0 ] },
						{ at: at( 0.4 ), lines: [ 2, 3, 4, 5 ] },
						{ at: at( 0.72 ), lines: [ 7 ] },
					] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.12 ) }>
						<Note title="Current becomes previous" />
					</Reveal>
					<Reveal delay={ at( 0.42 ) }>
						<Note title="Read it while you switch over" accent={ color.green } />
					</Reveal>
					<Reveal delay={ at( 0.74 ) }>
						<Note title="Retire it when done" accent={ color.grey500 }>One previous version is kept.</Note>
					</Reveal>
				</>
			}
		/>
	);
};

const Step: React.FC< { label: string; sub: string; accent?: string; width?: number } > = ( { label, sub, accent = color.blueberry, width = 290 } ) => (
	<div style={ { width, borderTop: `5px solid ${ accent }`, background: color.paper, borderRadius: 10, padding: '18px 20px 22px', border: `1px solid ${ color.grey300 }`, borderTopWidth: 5, borderTopColor: accent } }>
		<div style={ { fontSize: 30, fontWeight: 700 } }>{ label }</div>
		<div style={ { fontSize: 22, color: color.grey700, marginTop: 8, lineHeight: 1.35 } }>{ sub }</div>
	</div>
);

const Arrow: React.FC< { label: string } > = ( { label } ) => (
	<div style={ { width: 110, textAlign: 'center', fontSize: 20, color: color.grey700, paddingTop: 30 } }>
		<div style={ { fontSize: 38, lineHeight: 1, color: color.grey500 } }>→</div>
		{ label }
	</div>
);

export const Hood: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Scene>
			<AbsoluteFill style={ { padding: pad, justifyContent: 'center' } }>
				<Reveal delay={ 100 }>
					<Eyebrow>Under the hood</Eyebrow>
				</Reveal>
				<Reveal delay={ 220 } style={ { marginTop: 14 } }>
					<Headline size={ 70 }>libsodium, XChaCha20-Poly1305.</Headline>
				</Reveal>
				<div style={ { display: 'flex', alignItems: 'flex-start', marginTop: 44 } }>
					<Reveal delay={ at( 0.18 ) }>
						<Step label="Site key" sub="WP_SECRETS_KEY, or LOGGED_IN_KEY + LOGGED_IN_SALT. Not in the database." accent={ color.green } width={ 330 } />
					</Reveal>
					<Reveal delay={ at( 0.3 ) }><Arrow label="wraps" /></Reveal>
					<Reveal delay={ at( 0.34 ) }>
						<Step label="Root key" sub="32 random bytes, stored wrapped." />
					</Reveal>
					<Reveal delay={ at( 0.44 ) }><Arrow label="derives" /></Reveal>
					<Reveal delay={ at( 0.48 ) }>
						<Step label="Master key" sub="Per scope. Never stored." />
					</Reveal>
					<Reveal delay={ at( 0.58 ) }><Arrow label="wraps" /></Reveal>
					<Reveal delay={ at( 0.62 ) }>
						<Step label="Data key" sub="Random, one per value." />
					</Reveal>
				</div>
				<Reveal delay={ at( 0.72 ) } style={ { marginTop: 40 } }>
					<Browser url="wp_options table (database view, not a WordPress screen)" width={ 1700 }>
						<Footage from={ 26 } length={ 12 } crop={ { x: 455, y: 125, w: 950, h: 88 } } width={ 1698 } panTo={ 455 } />
					</Browser>
				</Reveal>
			</AbsoluteFill>
		</Scene>
	);
};

export const Health: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Site Health"
			title="Checks the setup."
			code={
				<Reveal delay={ 300 }>
					<Browser url="Tools › Site Health" width={ 1150 }>
						<Footage from={ 49 } length={ 8 } crop={ { x: 412, y: 576, w: 776, h: 108 } } width={ 1148 } />
					</Browser>
				</Reveal>
			}
			notes={
				<>
					<Reveal delay={ at( 0.2 ) }><Note title="Dedicated key" accent={ color.green }>Good.</Note></Reveal>
					<Reveal delay={ at( 0.4 ) }><Note title="Fallback to salts" accent={ color.blueberry }>Recommended: define WP_SECRETS_KEY.</Note></Reveal>
					<Reveal delay={ at( 0.6 ) }><Note title="Undecryptable secrets" accent={ color.red } /></Reveal>
					<Reveal delay={ at( 0.8 ) }><Note title="Secrets pending rotation" accent={ color.grey500 } /></Reveal>
				</>
			}
		/>
	);
};

export const Network: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Multisite"
			title="Network-scope twins."
			code={
				<CodeBlock
					size={ 29 }
					width={ 1250 }
					lines={ [
						"wp_set_network_secret( 'my-plugin/api_key', $key );",
						"wp_get_network_secret( 'my-plugin/api_key' );",
						"wp_delete_network_secret( 'my-plugin/api_key' );",
						"wp_list_network_secrets( 'my-plugin' );",
						"wp_retire_network_secret_version( 'my-plugin/api_key' );",
					] }
					focus={ [ { at: at( 0.05 ), lines: [ 0, 1, 2, 3, 4 ] } ] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.18 ) }><Note title="Separate scopes">No fallback from one to the other.</Note></Reveal>
					<Reveal delay={ at( 0.38 ) }><Note title="manage_secrets" accent={ color.green }>Administrators.</Note></Reveal>
					<Reveal delay={ at( 0.5 ) }><Note title="manage_network_secrets" accent={ color.green }>Super admins.</Note></Reveal>
					<Reveal delay={ at( 0.68 ) }><Note title="Not checked by the functions" accent={ color.red }>Callable from cron and REST. Check at your own boundary.</Note></Reveal>
				</>
			}
		/>
	);
};

export const Dropin: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	const row = ( g: string, i: string, delay: number ) => (
		<Reveal delay={ delay }>
			<div style={ { marginBottom: 22 } }>
				<div style={ { fontFamily: font.mono, fontSize: 24, color: color.blueberry, fontWeight: 700 } }>{ `$GLOBALS['${ g }']` }</div>
				<div style={ { fontFamily: font.mono, fontSize: 22, color: color.grey700 } }>{ `→ ${ i }` }</div>
			</div>
		</Reveal>
	);
	return (
		<Layout
			eyebrow="For hosts"
			title="The secrets.php drop-in."
			code={
				<CodeBlock
					size={ 28 }
					width={ 1200 }
					file="wp-content/secrets.php"
					lines={ [
						'<?php',
						'class Acme_Kms_Keyring implements WP_Secrets_Keyring {',
						'    public function wrap( string $key_material ) { /* KMS */ }',
						'    public function unwrap( string $wrapped ) { /* KMS */ }',
						"    public function get_key_source(): string { return 'Acme KMS'; }",
						'}',
						'',
						"$GLOBALS['wp_secrets_keyring'] = new Acme_Kms_Keyring();",
					] }
					focus={ [ { at: at( 0.35 ), lines: [ 1, 2, 3, 4, 5 ] }, { at: at( 0.6 ), lines: [ 7 ] } ] }
				/>
			}
			notes={
				<>
					{ row( 'wp_secrets_provider', 'WP_Secrets_Provider', at( 0.28 ) ) }
					{ row( 'wp_secrets_store', 'WP_Secrets_Store', at( 0.38 ) ) }
					{ row( 'wp_secrets_keyring', 'WP_Secrets_Keyring', at( 0.48 ) ) }
					<Reveal delay={ at( 0.62 ) }>
						<Note title="Loads before must-use plugins" accent={ color.green } />
					</Reveal>
					<Reveal delay={ at( 0.78 ) }>
						<Note title="Conformance suites ship in core tests" accent={ color.grey500 }>
							<Mono>tests/phpunit/includes/secrets/</Mono>
						</Note>
					</Reveal>
				</>
			}
		/>
	);
};

export const FailClosed: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Fails closed"
			title="An error, never a fallback."
			code={
				<CodeBlock
					size={ 30 }
					width={ 1200 }
					lines={ [
						'// secrets.php throws, or sets the wrong type',
						'',
						"wp_set_secret( 'my-plugin/api_key', $key );",
						'// WP_Error: secret_store_unavailable',
						'',
						"wp_get_secret( 'my-plugin/api_key' );",
						'// WP_Error: secret_store_unavailable',
					] }
					focus={ [ { at: at( 0.1 ), lines: [ 0 ] }, { at: at( 0.25 ), lines: [ 2, 3, 5, 6 ] } ] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.3 ) }>
						<Note title="No silent downgrade" accent={ color.red }>Never reverts to wp_options.</Note>
					</Reveal>
					<Reveal delay={ at( 0.55 ) }>
						<Note title="Feature plugin examples, tested against" accent={ color.green }>
							AWS KMS, AWS Secrets Manager, HashiCorp Vault, OpenBao.
						</Note>
					</Reveal>
				</>
			}
		/>
	);
};

export const Audit: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	return (
		<Layout
			eyebrow="Auditing"
			title="The wp_secret_changed action."
			code={
				<CodeBlock
					size={ 29 }
					width={ 1200 }
					lines={ [
						"add_action( 'wp_secret_changed', 'log_secret_change', 10, 7 );",
						'',
						'function log_secret_change(',
						'    $name, $action, $user_id, $timestamp,',
						'    $old_fingerprint, $new_fingerprint, $network',
						') {',
						'    error_log( "$name: $action" );',
						'}',
					] }
					focus={ [ { at: at( 0.2 ), lines: [ 3, 4 ] } ] }
				/>
			}
			notes={
				<>
					<Reveal delay={ at( 0.25 ) }>
						<Note title="Actions" accent={ color.blueberry }>created, updated, deleted, imported, retired</Note>
					</Reveal>
					<Reveal delay={ at( 0.55 ) }>
						<Note title="Fingerprints, never values" accent={ color.green } />
					</Reveal>
				</>
			}
		/>
	);
};

export const Close: React.FC< P > = ( { seconds } ) => {
	const at = mk( seconds );
	const item = ( label: string, text: string, mono = false ) => (
		<div style={ { borderTop: '3px solid #fff', paddingTop: 18 } }>
			<div style={ { fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 } }>{ label }</div>
			<div style={ { fontSize: mono ? 27 : 34, marginTop: 8, fontFamily: mono ? font.mono : font.sans } }>{ text }</div>
		</div>
	);
	return (
		<Scene tone="dark">
			<AbsoluteFill style={ { background: color.blueberry, padding: pad, justifyContent: 'center' } }>
				<Reveal delay={ 100 }>
					<Logo tone="dark" height={ 64 } />
				</Reveal>
				<Reveal delay={ 300 } style={ { marginTop: 44 } }>
					<Headline size={ 120 }>Committed in r64337.</Headline>
				</Reveal>
				<Reveal delay={ 450 } style={ { marginTop: 18 } }>
					<div style={ { fontSize: 42, fontWeight: 600 } }>Ships in WordPress 7.2. Trac #66187.</div>
				</Reveal>
				<div style={ { display: 'flex', gap: 56, marginTop: 56 } }>
					<Reveal delay={ at( 0.15 ) } style={ { flex: 1 } }>{ item( 'Docs', 'secretsapi.dev', true ) }</Reveal>
					<Reveal delay={ at( 0.3 ) } style={ { flex: 1.6 } }>{ item( 'Feature plugin', 'github.com/ericmann/secrets-api', true ) }</Reveal>
					<Reveal delay={ at( 0.5 ) } style={ { flex: 1 } }>{ item( 'WP-CLI', 'Lives in the feature plugin.' ) }</Reveal>
					<Reveal delay={ at( 0.65 ) } style={ { flex: 1 } }>{ item( 'Admin screen', 'Planned for 7.3.' ) }</Reveal>
				</div>
			</AbsoluteFill>
		</Scene>
	);
};

export const scenes: Record< string, React.FC< P > > = {
	intro: Intro,
	why: Why,
	store: Store,
	read: Read,
	hidden: Hidden,
	migrate: Migrate,
	rotate: Rotate,
	hood: Hood,
	health: Health,
	network: Network,
	dropin: Dropin,
	failclosed: FailClosed,
	audit: Audit,
	close: Close,
};
