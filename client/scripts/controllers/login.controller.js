import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base'
import { Controller } from 'angular-ecmascript/module-helpers';

export default class LoginCtrl extends Controller {
  login() {
    if (_.isEmpty(this.user) || _.isEmpty(this.pass)) return;

    this.$ionicLoading.show({
      template: 'Verifying user data...'
    });

    Accounts.createUser({
      username: this.user,
      password: this.pass
    }, (err) => {
      this.$ionicLoading.hide();
      if (err) return this.handleError(err);
      this.$state.go('profile', { username: this.user });
    });
  }

  handleError(err) {
    this.$log.error('Login error', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Login failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

LoginCtrl.$inject = ['$state', '$timeout', '$ionicLoading', '$ionicPopup', '$log'];