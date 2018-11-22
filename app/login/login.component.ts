import { Component, OnInit } from "@angular/core";

var auth0GuardianJS = require('auth0-guardian-js')({
    // For US tenants: https://{name}.guardian.auth0.com
 	// For AU tenants: https://{name}.au.guardian.auth0.com
 	// For EU tenants: https://{name}.eu.guardian.auth0.com
    serviceUrl: "https://naranja-nativescript.guardian.auth0.com",
    requestToken: "{{ requestToken }}", // or ticket: "{{ ticket }}" - see below

    issuer: {
        // The issuer name to show in OTP Generator apps
        label: "naranja-login",
        name: "naranja-nativescript",
    },

    // The account label to show in OTP Generator apps
    accountLabel: "{{ userData.friendlyUserId }}",

    // Optional, for debugging purpose only,
    // ID that allows to associate a group of requests
    // together as belonging to the same "transaction" (in a wide sense)
    //globalTrackingId: "{{ globalTrackingId }}"
});


@Component({
    selector: "ns-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

    constructor() { }

    ngOnInit(): void
    {
    }

    public authenticate(method) {
        auth0GuardianJS.start(function (err, transaction) {
            if (err) {
                console.error(err);
                return;
            }

            if (!transaction.isEnrolled()) {
                console.log('You are not enrolled');
                return;
            }

            transaction.on('error', function(error) {
                console.error(error);
            });

            transaction.on('timeout', function() {
                console.log('Timeout');
            });

            transaction.on('auth-response', function(payload) {
                if (payload.recoveryCode) {
                    alert('The new recovery code is ' + payload.recoveryCode);
                }

                if (!payload.accepted) {
                    alert('Authentication has been rejected');
                    return;
                }

                auth0GuardianJS.formPostHelper('{{ postActionURL }}', { signature: payload.signature });
            });

            var enrollment = transaction.getEnrollments()[0];

            if (enrollment.getAvailableAuthenticatorTypes().length === 0) {
                alert('Somethings went wrong, seems that there is no authenticators');
                return;
            }

            method = "otp";
            transaction.requestAuth(enrollment, { method: method }, function(err, auth) {
                if (err) {
                    console.error(err);
                    return;
                }

                var data = {otpCode: "", recoveryCode: ""};
                if (method === 'sms' || method === 'otp') {
                    data.otpCode = prompt('Otp code');
                } else if (method === 'recovery-code') {
                    data.recoveryCode = prompt('Recovery code');
                }
                return auth.verify(data);
            });
        });
    }

    public enroll(transaction, method)
    {
      if (transaction.isEnrolled()) {
          console.log('You are already enrolled');
          return;
      }

      var enrollData = {phoneNumber: ""};

      if (method === 'sms') {
          enrollData.phoneNumber = prompt('Phone number'); // Collect phone number
      }

      return transaction.enroll(method, enrollData, function (err, otpEnrollment) {
          if (err) {
              console.error(err);
              return;
          }

          var uri = otpEnrollment.getUri();
          if (uri) {
//              showQR(uri);
          }

          var confirmData = {otpCode: ""};
          if (method === 'otp' || method === 'sms') {
              confirmData.otpCode = prompt('Otp code'); // Collect verification otp
          }

          otpEnrollment.confirm(confirmData);
      });
    }

}
