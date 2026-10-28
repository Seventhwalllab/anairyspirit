'use strict';
// `npx -y anairyspirit mcp` before anairyspirit is installed. An MCP client — or
// a registry's checker — starts the server and waits for `initialize`; a line
// on stderr and exit 1 reads to it as «does not start», and the agent never
// learns why. So the launcher answers MCP itself, over stdio (one JSON-RPC 2.0
// message per line), with one tool, `setup_required`, whose result says what
// the user has to run.
//
// It installs nothing. `setup` asks the user to accept the licence and downloads
// about 1.5 GB of models: the user's to do, not the agent's.

const TOOL = 'setup_required';
// Newest first: an `initialize` asking for one of these gets it back; any other
// gets the newest.
const PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];

const INSTRUCTIONS = 'anairyspirit — an AI agent\'s own long-term memory, on this machine — is not '
  + 'installed here yet, so there is no memory to read or write. Tell the user; the one tool, '
  + `${TOOL}, gives the command they have to run.`;

const TOOL_DEF = {
  name: TOOL,
  title: 'anairyspirit: setup required',
  description: 'anairyspirit (the memory) is not installed on this machine yet. Call this to get '
    + 'the command the user has to run to install it.',
  inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  annotations: { readOnlyHint: true, openWorldHint: false },
};

function setupText(version) {
  return [
    'anairyspirit is not installed on this machine yet, so there is no memory to read or write.',
    '',
    'Ask the user to run, in a terminal on this machine:',
    '',
    '  npx anairyspirit setup',
    '',
    `It downloads release v${version} for this machine, checks it against the release's signed `
      + 'checksums, asks the user to accept the licence, downloads the models (about 1.5 GB) and '
      + 'starts the memory service. Then restart this MCP client: the same configuration '
      + '(npx -y anairyspirit mcp) reaches the memory.',
    '',
    'Only the user can do this: the install asks them to accept the licence.',
  ].join('\n');
}

function reply(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function failure(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

/** One JSON-RPC message in, its response out — null for a notification. */
function respond(msg, version) {
  if (!msg || typeof msg !== 'object' || Array.isArray(msg)) {
    return failure(null, -32600, 'Invalid Request');
  }
  const { id, method, params } = msg;
  if (id === undefined || id === null) return null;
  switch (method) {
    case 'initialize': {
      const asked = params && params.protocolVersion;
      return reply(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: {} },
        serverInfo: { name: 'anairyspirit', version },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping':
      return reply(id, {});
    case 'tools/list':
      return reply(id, { tools: [TOOL_DEF] });
    case 'tools/call': {
      const name = params && params.name;
      if (name !== TOOL) return failure(id, -32602, `Unknown tool: ${name}`);
      return reply(id, { content: [{ type: 'text', text: setupText(version) }], isError: false });
    }
    default:
      return failure(id, -32601, `Method not found: ${method}`);
  }
}

/** Answer MCP on `input`/`output` until `input` closes; resolves to 0. */
function serve(input, output, version) {
  return new Promise((resolve) => {
    let buf = '';
    const send = (m) => output.write(`${JSON.stringify(m)}\n`);
    input.setEncoding('utf8');
    input.on('data', (chunk) => {
      buf += chunk;
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          send(failure(null, -32700, 'Parse error'));
          continue;
        }
        const out = respond(msg, version);
        if (out) send(out);
      }
    });
    input.on('end', () => resolve(0));
    input.on('error', () => resolve(0));
  });
}

module.exports = { TOOL, PROTOCOL_VERSIONS, respond, serve, setupText };
