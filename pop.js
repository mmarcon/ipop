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

var socket = net.connect({port: port, host: server}, function (argument) {
    console.log('CONNECTED to <' + server + '>');
    sendCommand(socket, POP.USER + ' ' + username);
    sendCommand(socket, POP.PASS + ' ' + password);
});

socket.on('data', function(data) {
    data = data.toString();
    if (data.match(/\+OK\s+logged\s+in.*/gi)) {
        sendCommand(socket, POP.LIST);
    }
    console.log(data.toString());
});
socket.on('end', function() {
    console.log('client disconnected');
});