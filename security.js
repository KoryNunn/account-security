var bcrypt = require("bcrypt-nodejs");

function Security(getAccount){
    this.getAccount = getAccount;
}

Security.prototype.register = function register(email, password, callback){
    this.getAccount({email: email}, function(error, account){
        if(error){
            callback(error);
            return;
        }
        if(account){
            callback(new Error('An account with this email address already exists'));
            return;
        }

        var hash = bcrypt.hashSync(password);

        callback(null, hash);
    });
};
Security.prototype.authenticate = function signIn(email, password, callback){
    email = email.toLowerCase();

    this.getAccount({email: email, hash: bcrypt.compareSync(password)}, function(error, account){
        if(error){
            callback(error);
            return;
        }
        if(!account){
            callback(new Error('No account with this email address is registered.'));
            return;
        }

        callback(null, account);
    });
};

module.exports = Security;