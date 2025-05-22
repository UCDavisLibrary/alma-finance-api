const { logMessage } = require('../util/logger');

exports.tokenGenerator = async () => {
    try {
        const response = await fetch(
        process.env.TOKEN_URL,
        {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${process.env.TOKEN_AUTH}`
            }}
        )
        let data = await response.json();
        if (data) {
            return data.access_token;
        }
    } catch(error) {
        logMessage('DEBUG','tokenGenerator',error);
        }
    }