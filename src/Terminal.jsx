import { Command } from '@tauri-apps/api/shell';
import React, { useState, useRef, useEffect } from 'react';

function Terminal() {
  const [output, setOutput] = useState('');
  const terminalRef = useRef(null);
  const commandHistory = useRef([]);
  const historyIndex = useRef(0);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const command = event.target.value.trim();
      if (command) {
        runCommand(command);
        commandHistory.current.push(command);
        historyIndex.current = commandHistory.current.length;
        event.target.value = '';
      }
    } else if (event.key === 'ArrowUp' && historyIndex.current > 0) {
      historyIndex.current--;
      event.target.value = commandHistory.current[historyIndex.current];
    } else if (event.key === 'ArrowDown' && historyIndex.current < commandHistory.current.length - 1) {
      historyIndex.current++;
      event.target.value = commandHistory.current[historyIndex.current];
    }
  };

  const runCommand = async (command) => {
    try {
        const command = new Command('git'); // Create a Command object for 'node'
    
        // Spawn the child process (node in this case)
        const child = await command.spawn();
    
        // Write the message to the standard input of the child process
        await child.stdin.write(message);
    
        // Alternatively, write an array of bytes (for binary data)
        // await child.stdin.write(new Uint8Array([0, 1, 2, 3, 4, 5]));
    
        // Close the standard input (optional)
        await child.stdin.end();
    
        // Read the standard output of the child process (if needed)
        const processOutput = await child.stdout.read();
        console.log('Process output:', processOutput.toString());
    
        // Wait for the child process to finish
        await child.wait();; // Wait for process to finish
    } catch (error) {
      console.error('Error running command:', error);
      setOutput(output + '\n' + 'Error: ' + error.message);
    }
  };

  useEffect(() => {
    const initialOutput = 'Welcome to the Secure Terminal\n';
    setOutput(initialOutput);
  }, []);

  return (
    <div className="terminal">
      <pre ref={terminalRef}>
        {output}
      </pre>
        <input type="text" onKeyDown={handleKeyDown}style={{zIndex:'100'}} />
    </div>
  );
}

export default Terminal;