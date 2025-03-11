
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Get the path to node_modules/.bin
const binPath = path.resolve(__dirname, 'node_modules', '.bin');

// The command to run
const command = process.platform === 'win32' ? 'vite.cmd' : 'vite';
const fullCommand = path.join(binPath, command);

// Spawn the process
const child = spawn(fullCommand, {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start vite:', error);
  console.log('Try running: npm install');
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});
