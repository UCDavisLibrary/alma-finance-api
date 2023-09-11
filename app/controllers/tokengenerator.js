const { fetchTodaysToken } = require('./dbcalls');

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
        // console.log(response.status);
        let data = await response.json();
        if (data) {
            console.log(data);
            return data;
        }
    } catch(error) {
        console.log(error);
        }
    }

exports.retreiveToken = async () => {
    try {
        const token = await fetchTodaysToken();
        return token;
    } catch(error) {
        console.log(error);
        }
    }