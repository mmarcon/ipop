/*
 * Mail Server Username: ipop+marcon.me
 * Incoming Mail Server: mail.marcon.me
 * Incoming Mail Server: (SSL) mail.zyma.com
 * Outgoing Mail Server: mail.marcon.me (server requires authentication) port 25
 * Outgoing Mail Server: (SSL) mail.zyma.com (server requires authentication) port 465
 * Supported Incoming Mail Protocols: POP3, POP3S (SSL/TLS), IMAP, IMAPS (SSL/TLS)
 * Supported Outgoing Mail Protocols: SMTP, SMTPS (SSL/TLS)
 */

var server = 'mail.marcon.me',
    username = 'ipop+marcon.me',
    password = 'ipoptest',
    port = 110;

var net = require('net');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var POP = {
    STAT: 'STAT',
    LIST: 'LIST',
    RETR: 'RETR',
    QUIT: 'QUIT',
    USER: 'USER',
    PASS: 'PASS'
};

function sendCommand(socket, command) {
    socket.write(command + '\r\n');
}

function getInput(callback) {
    rl.question("What do you think of node.js? ", function(answer) {
        rl.close();
    });
}

var socket = net.connect({port: port, host: server}, function (argument) {
    console.log('CONNECTED to <' + server + '>');
    sendCommand(socket, POP.USER + ' ' + username);
    sendCommand(socket, POP.PASS + ' ' + password);
});

socket.on('data', function(data) {
    data = data.toString();
    var match, unread, i;
    if (data.match(/\+OK\s+logged\s+in.*/gi)) {
        console.log('LOGGED IN');
        sendCommand(socket, POP.LIST);
    }
    else if (match = data.match(/\+OK\s(\d+)\smessages/)) {
        console.log(match[1] + ' unread messages.')
        unread = parseInt(match[1], 10);
        for (i = 1; i <= unread; i++) {
            sendCommand(socket, POP.RETR + ' ' + i);
        }
    }
    else {
        console.log(data.toString());
    }
});
socket.on('end', function() {
    console.log('client disconnected');
});