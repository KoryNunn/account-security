var bcrypt = require("bcrypt-nodejs");

function Security(getAccount, createAccount, saveAccount, errorMessages){
    this.getAccount = getAccount;
    this.createAccount = createAccount;
    this.saveAccount = saveAccount;
    this.errorMessages = errorMessages || {
        accountNamePassRequired: 'Both an account name and a password are required.',
        accountNameOldPassNewPass: 'An account name, old password, and new password are required.',
        accountExists: 'An account with this name already exists.',
        noAccount: 'No account with this name is registered.',
        incorrectPassword: 'The password provided was incorrect.'
    };
}

Security.prototype.register = function register(accountName, password, accountDetails, callback){
    var security = this;

    if(accountName == null || password == null){
        callback(new Error(security.errorMessages.accountNamePassRequired));
        return;
    }

    this.getAccount(accountName, function(error, account){
        if(error){
            callback(error);
            return;
        }
        if(account){
            callback(new Error(security.errorMessages.accountExists));
            return;
        }

        var hash = bcrypt.hashSync(password);

        security.createAccount(accountName, hash, accountDetails, function(error, account){
            if(error){
                callback(error);
                return;
            }
            security.saveAccount(account, callback);
        });
    });
};
Security.prototype.changePassword = function register(accountName, oldPassword, newPassword, callback){
    var security = this;

    if(accountName == null || oldPassword == null || newPassword == null){
        callback(new Error(security.errorMessages.accountNameOldPassNewPass));
        return;
    }

    this.authenticate(accountName, oldPassword, function(error, account){
        if(error){
            callback(error);
            return;
        }

        account.password = bcrypt.hashSync(newPassword);

        security.saveAccount(account, callback);
    });
};
Security.prototype.authenticate = function signIn(accountName, password, callback){
    var security = this;

    if(accountName == null || password == null){
        callback(new Error(security.errorMessages.accountNamePassRequired));
        return;
    }

    this.getAccount(accountName, function(error, account){
        if(error){
            callback(error);
            return;
        }
        if(!account){
            callback(new Error(security.errorMessages.noAccount));
            return;
        }
        if(!bcrypt.compareSync(password, account.password)){
            callback(new Error(security.errorMessages.incorrectPassword));
            return;
        }

        callback(null, account);
    });
};

module.exports = Security;
