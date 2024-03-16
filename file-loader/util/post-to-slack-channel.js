const config = require('../config');
const Slack = require('slack-node');

exports.postToSlackChannel = async (message) => {
    const webhookurl = config.services.slack.webhookurl;
    const slack = new Slack();
    slack.setWebhook(webhookurl);
    slack.webhook({
        channel: "#alma",
        username: "webhookbot",
        text: message
    }, function(err, response) {
        console.log(response);
    });
    
}       