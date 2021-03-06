// Generated by CoffeeScript 1.10.0
var Account, google, oauth2Client, plus;

Account = require('../models/account');

google = require('googleapis');

plus = google.plus('v1');

oauth2Client = require('./google_access_token').oauth2Client;

module.exports = function(access_token, refresh_token, force, callback) {
  oauth2Client.setCredentials({
    access_token: access_token
  });
  return plus.people.get({
    userId: 'me',
    auth: oauth2Client
  }, function(err, profile) {
    var account;
    account = {
      label: "GMAIL oauth2",
      name: profile.displayName,
      login: profile.emails[0].value,
      oauthProvider: "GMAIL",
      initialized: false,
      oauthAccessToken: access_token,
      oauthRefreshToken: refresh_token
    };
    return Account.request('byEmailWithOauth', {
      key: profile.emails[0].value
    }, function(err, fetchedAccounts) {
      if (err) {
        return callback(err);
      }
      if (fetchedAccounts.length !== 0) {
        return fetchedAccounts[0].updateAttributes({
          oauthRefreshToken: refresh_token
        }, function(err) {
          return callback(err, fetchedAccounts[0]);
        });
      } else if (force) {
        return Account.create(account, function(err, account) {
          return callback(err, account);
        });
      } else {
        return callback();
      }
    });
  });
};
