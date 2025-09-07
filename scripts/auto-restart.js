#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let devProcess = null;
let restartTimeout = null;

function startDevServer() {
  console.log('🚀 Starting development server...');
  
  devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  devProcess.on('error', (error) => {
    console.error('❌ Error starting dev server:', error);
    scheduleRestart();
  });

  devProcess.on('exit', (code) => {
    console.log(`📝 Dev server exited with code ${code}`);
    scheduleRestart();
  });
}

function scheduleRestart() {
  if (restartTimeout) {
    clearTimeout(restartTimeout);
  }
  
  console.log('⏰ Scheduling restart in 5 seconds...');
  restartTimeout = setTimeout(() => {
    console.log('🔄 Restarting development server...');
    startDevServer();
  }, 5000);
}

function cleanup() {
  console.log('\n🛑 Shutting down...');
  
  if (restartTimeout) {
    clearTimeout(restartTimeout);
  }
  
  if (devProcess) {
    devProcess.kill('SIGTERM');
  }
  
  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the development server
startDevServer();

console.log('✅ Auto-restart script running. Press Ctrl+C to stop.');




