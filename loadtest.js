const ac = require('autocannon');

const instance = ac({
    url: 'http://localhost:8080',
    connections: 100,
    duration: 10,
    headers: {
        'content-type': 'application/json'
    },
    requests: [
        {
            method: 'POST',
            path: '/api/auth/signin',
            body: JSON.stringify(
                {
                    username: 'abcd5',
                    password: 'abcsddsadas'
                }
            ),
            onResponse: (status, res, context) => {
                if (status == 200) {
                    const { accessToken: accessToken, refreshToken: refreshToken } = JSON.parse(res);

                    context.accessToken = accessToken;
                    context.refreshToken = refreshToken;
                }
            }
        },
        {
            method: 'GET',
            path: '/api/content/app',
            setupRequest: (req, context) => {
                req.headers = {
                    'x-access-token': context.accessToken
                };
                return req;
            }
        }
    ]
}, (err, res) => {
    if (err) {
        console.log('error', err);
        return;
    }

    console.log(ac.printResult(res));
});