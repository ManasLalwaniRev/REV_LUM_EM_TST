// hash-password.js
// Usage: 1) `node hash-password.js` to enter password interactively (recommended).
//        2) `node hash-password.js --pw "mypassword"` (less secure; shows as shell history).
//
// It uses bcryptjs so you don't need native build tools.
// Install: npm install bcryptjs

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12; // change if you want (10-14 common)

function hashAndPrint(plain) {
  try {
    const hash = bcrypt.hashSync(plain, SALT_ROUNDS);
    console.log('\n\nBCRYPT HASH (store this, not the plain password):\n', hash);
    // Optionally: write to file or clipboard if you want — omitted for safety.
  } catch (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
}

// If user passed --pw "..." on the command line (not recommended)
const argvPwIndex = process.argv.findIndex(a => a === '--pw');
if (argvPwIndex !== -1 && process.argv.length > argvPwIndex + 1) {
  hashAndPrint(process.argv[argvPwIndex + 1]);
  process.exit(0);
}

// Interactive, no-echo prompt:
const readline = require('readline');

function promptHidden(promptText, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  const stdin = process.stdin;
  process.stdout.write(promptText);

  // switch to raw mode so we can capture characters and prevent echo
  if (!stdin.isTTY) {
    // fallback if not a TTY
    rl.question('\nTerminal not interactive. Enter password: ', answer => {
      rl.close();
      callback(answer);
    });
    return;
  }

  stdin.setRawMode(true);
  let password = '';

  stdin.on('data', onData);

  function onData(char) {
    char = char + '';

    switch (char) {
      case '\n':
      case '\r':
      case '\u0004': // Ctrl-D
        stdin.removeListener('data', onData);
        stdin.setRawMode(false);
        process.stdout.write('\n');
        rl.close();
        callback(password);
        break;
      case '\u0003': // Ctrl-C
        stdin.removeListener('data', onData);
        stdin.setRawMode(false);
        process.stdout.write('\n^C\n');
        rl.close();
        process.exit(1);
        break;
      case '\u0008': // backspace (some terminals)
      case '\u007f': // delete
        if (password.length > 0) {
          password = password.slice(0, -1);
        }
        break;
      default:
        // append char, do NOT echo it
        password += char;
        break;
    }
  }
}

promptHidden('Enter password to hash (input will be hidden): ', pw => {
  if (!pw || pw.length === 0) {
    console.error('No password entered. Exiting.');
    process.exit(2);
  }
  hashAndPrint(pw);
});
