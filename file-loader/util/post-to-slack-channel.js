const Slack = require('slack-node');
const { logMessage } = require('../util/logger');

exports.postToSlackChannel = async (message) => {
    const webhookurl = process.env.SLACK_WEBHOOK_URL;
    const slack = new Slack();
    slack.setWebhook(webhookurl);
    slack.webhook({
        channel: "#alma",
        username: "webhookbot",
        text: message
    }, function(err, response) {
        logMessage('INFO',response);
        logMessage('DEBUG',err);
    });
    
}       