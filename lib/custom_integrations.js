/**
 * Helpers for configuring a bot as a custom integration
 * https://api.slack.com/custom-integrations
 */

var Botkit = require('botkit');
var HerokuKeepalive = require('@ponko2/botkit-heroku-keepalive');

function die(err) {
    console.log(err);
    process.exit(1);
}

module.exports = {
    configure: function (token, config, onInstallation) {

        var controller = Botkit.slackbot(config);

        var bot = controller.spawn({
            token: token
        });


        var herokuKeepalive;

        controller.setupWebserver(process.env.PORT || 8080, function (err, webserver) {
            herokuKeepalive = new HerokuKeepalive(controller);
        });

        bot.startRTM(function (err, bot, payload) {

            if (err) {
                die(err);
            }

            if(onInstallation) onInstallation(bot);

            herokuKeepalive.start();

        });

        return controller;
    }
};
