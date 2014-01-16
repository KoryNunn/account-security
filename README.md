account-security

A simple account security helper.

Require the module

    var Security = require('account-security');

Instansiate it, plugging in your db calls.

The constructor takes three functions:

    new Security(
        function getAccount(email, callback){
            // get the account that matches this email
            // call callback with (error, email)
        },
        function createAccount(accountDetails, callback){
            // accountDetails will be the object passed into security.register
            // but with the password field now hashed
        },
        function saveAccount(account, callback){
            // account will be an object that was returned from getAccount.
        }
    );

Mongo with Mongoose example:

    var security = new Security(

        // Get account
        function(email, callback){
            db.Account.findOne({
                email: email
            }, callback);
        },

        // Create account
        function(accountDetails, callback){
            var newAccount = new db.Account({
                firstName: accountDetails.firstName,
                surname: accountDetails.surname,
                email: accountDetails.email,
                password: accountDetails.password
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
        security.register({
            email: // retrieved from the request somehow
            password: // retrieved from the request somehow
        },
        function(error, account){
            if(error){
                // handle error
            }

            // Wooo it worked!
        });
    }

    // Sign In
    function(request, response){
        security.authenticate(/* email from request */, /* password from request */, function(error, account){
            if(error){
                // handle error
            }

            // User authenticated. Set cookies or whatever..
        });
    },

    // Change Password
    function(request, response){
        security.changePassword(data.email, data.oldPassword, data.newPassword, function(error){
            if(error){
                // handle error
            }

            // password changed.
        });
    }