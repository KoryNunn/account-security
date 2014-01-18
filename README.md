account-security

A simple account security helper.

Assumes the 'account' object has a password field to store the hashed password.

Require the module

    var Security = require('account-security');

Instansiate it, plugging in your db calls.

The constructor takes three functions:

    new Security(
        function getAccount(accountName, callback){
            // get the account that matches this email
            // call callback with (error, email)
        },
        function createAccount(accountName, password, accountDetails, callback){
            // accountDetails will be the object passed into security.register
            // but with the password field now hashed
        },
        function saveAccount(account, callback){
            // account will be an object that was returned from getAccount or createAccount.
        }
    );

Mongo with Mongoose example:

    var security = new Security(

        // Get account
        function(accountName, callback){
            db.Account.findOne({
                accountName: accountName
            }, callback);
        },

        // Create account
        function(accountName, hash, accountDetails, callback){
            var newAccount = new db.Account({
                firstName: accountDetails.firstName,
                surname: accountDetails.surname,
                accountName: accountName,
                password: hash
            });

            callback(null, newAccount);
        },

        // Save account
        function(account, callback){
            account.save(callback);
        }
    );

Use the object:

    // Register
    function(request, response){
        security.register(
            accountName: // retrieved from the request somehow,
            password: // retrieved from the request somehow,
            {
                // extra account data retrieved from the request somehow
            },
            function(error, account){
                if(error){
                    // handle error
                }

                // Wooo it worked!
            }
        );
    }

    // Sign In
    function(request, response){
        security.authenticate(
            /* accountName from request */,
            /* password from request */,
            function(error, account){
                if(error){
                    // handle error
                }

                // User authenticated. Set cookies or whatever..
            }
        );
    },

    // Change Password
    function(request, response){
        security.changePassword(
            /* accountName from request */,
            /* old password from request */,
            /* new password from request */,
            function(error){
                if(error){
                    // handle error
                }

                // password changed.
            }
        );
    }