const http = require('http');

async function testTranscribe() {
  const loginData = JSON.stringify({ email: 'candidate_1793639686829@example.com', password: 'Password@123' });
  
  const token = await new Promise((resolve) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8080,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b).data.token));
    });
    req.write(loginData);
    req.end();
  });

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const dummyAudio = Buffer.from('RIFF1234WAVEfmt 1234data1234dummy audio bytes');
  
  const parts = [
    `--${boundary}\r\nContent-Disposition: form-data; name="audio"; filename="recording.webm"\r\nContent-Type: audio/webm\r\n\r\n`,
    dummyAudio,
    `\r\n--${boundary}\r\nContent-Disposition: form-data; name="sessionId"\r\n\r\n2bda037e-52bd-4dc4-8425-99955f1b2190\r\n--${boundary}--\r\n`
  ];
  
  const body = Buffer.concat([
    Buffer.from(parts[0]),
    parts[1],
    Buffer.from(parts[2])
  ]);

  const req = http.request({
    hostname: '127.0.0.1',
    port: 8080,
    path: '/api/interviews/transcribe',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length,
      'Authorization': `Bearer ${token}`
    }
  }, (res) => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Response Body:', b);
    });
  });
  
  req.write(body);
  req.end();
}

testTranscribe().catch(console.error);

