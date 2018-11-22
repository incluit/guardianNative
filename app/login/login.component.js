"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth0GuardianJS = require('auth0-guardian-js')({
    // For US tenants: https://{name}.guardian.auth0.com
    // For AU tenants: https://{name}.au.guardian.auth0.com
    // For EU tenants: https://{name}.eu.guardian.auth0.com
    serviceUrl: "https://naranja-nativescript.guardian.auth0.com",
    requestToken: "{{ requestToken }}",
    issuer: {
        // The issuer name to show in OTP Generator apps
        label: "naranja-login",
        name: "naranja-nativescript",
    },
    // The account label to show in OTP Generator apps
    accountLabel: "{{ userData.friendlyUserId }}",
});
var LoginComponent = /** @class */ (function () {
    function LoginComponent() {
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.authenticate = function (method) {
        auth0GuardianJS.start(function (err, transaction) {
            if (err) {
                console.error(err);
                return;
            }
            if (!transaction.isEnrolled()) {
                console.log('You are not enrolled');
                return;
            }
            transaction.on('error', function (error) {
                console.error(error);
            });
            transaction.on('timeout', function () {
                console.log('Timeout');
            });
            transaction.on('auth-response', function (payload) {
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
            transaction.requestAuth(enrollment, { method: method }, function (err, auth) {
                if (err) {
                    console.error(err);
                    return;
                }
                var data = { otpCode: "", recoveryCode: "" };
                if (method === 'sms' || method === 'otp') {
                    data.otpCode = prompt('Otp code');
                }
                else if (method === 'recovery-code') {
                    data.recoveryCode = prompt('Recovery code');
                }
                return auth.verify(data);
            });
        });
    };
    LoginComponent.prototype.enroll = function (transaction, method) {
        if (transaction.isEnrolled()) {
            console.log('You are already enrolled');
            return;
        }
        var enrollData = { phoneNumber: "" };
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
            var confirmData = { otpCode: "" };
            if (method === 'otp' || method === 'sms') {
                confirmData.otpCode = prompt('Otp code'); // Collect verification otp
            }
            otpEnrollment.confirm(confirmData);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: "ns-login",
            moduleId: module.id,
            templateUrl: "./login.component.html",
        }),
        __metadata("design:paramtypes", [])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQy9DLG9EQUFvRDtJQUN0RCx1REFBdUQ7SUFDdkQsdURBQXVEO0lBQ3JELFVBQVUsRUFBRSxpREFBaUQ7SUFDN0QsWUFBWSxFQUFFLG9CQUFvQjtJQUVsQyxNQUFNLEVBQUU7UUFDSixnREFBZ0Q7UUFDaEQsS0FBSyxFQUFFLGVBQWU7UUFDdEIsSUFBSSxFQUFFLHNCQUFzQjtLQUMvQjtJQUVELGtEQUFrRDtJQUNsRCxZQUFZLEVBQUUsK0JBQStCO0NBTWhELENBQUMsQ0FBQztBQVFIO0lBRUk7SUFBZ0IsQ0FBQztJQUVqQixpQ0FBUSxHQUFSO0lBRUEsQ0FBQztJQUVNLHFDQUFZLEdBQW5CLFVBQW9CLE1BQU07UUFDdEIsZUFBZSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxXQUFXO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsV0FBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxLQUFLO2dCQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBRUgsV0FBVyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3RC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LENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLDRCQUE0QjtZQUNsQixDQUFDO1lBRUQsSUFBSSxXQUFXLEdBQUcsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsV0FBVyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQywyQkFBMkI7WUFDekUsQ0FBQztZQUVELGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBakdRLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsd0JBQXdCO1NBQ3hDLENBQUM7O09BQ1csY0FBYyxDQW1HMUI7SUFBRCxxQkFBQztDQUFBLEFBbkdELElBbUdDO0FBbkdZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG52YXIgYXV0aDBHdWFyZGlhbkpTID0gcmVxdWlyZSgnYXV0aDAtZ3VhcmRpYW4tanMnKSh7XG4gICAgLy8gRm9yIFVTIHRlbmFudHM6IGh0dHBzOi8ve25hbWV9Lmd1YXJkaWFuLmF1dGgwLmNvbVxuIFx0Ly8gRm9yIEFVIHRlbmFudHM6IGh0dHBzOi8ve25hbWV9LmF1Lmd1YXJkaWFuLmF1dGgwLmNvbVxuIFx0Ly8gRm9yIEVVIHRlbmFudHM6IGh0dHBzOi8ve25hbWV9LmV1Lmd1YXJkaWFuLmF1dGgwLmNvbVxuICAgIHNlcnZpY2VVcmw6IFwiaHR0cHM6Ly9uYXJhbmphLW5hdGl2ZXNjcmlwdC5ndWFyZGlhbi5hdXRoMC5jb21cIixcbiAgICByZXF1ZXN0VG9rZW46IFwie3sgcmVxdWVzdFRva2VuIH19XCIsIC8vIG9yIHRpY2tldDogXCJ7eyB0aWNrZXQgfX1cIiAtIHNlZSBiZWxvd1xuXG4gICAgaXNzdWVyOiB7XG4gICAgICAgIC8vIFRoZSBpc3N1ZXIgbmFtZSB0byBzaG93IGluIE9UUCBHZW5lcmF0b3IgYXBwc1xuICAgICAgICBsYWJlbDogXCJuYXJhbmphLWxvZ2luXCIsXG4gICAgICAgIG5hbWU6IFwibmFyYW5qYS1uYXRpdmVzY3JpcHRcIixcbiAgICB9LFxuXG4gICAgLy8gVGhlIGFjY291bnQgbGFiZWwgdG8gc2hvdyBpbiBPVFAgR2VuZXJhdG9yIGFwcHNcbiAgICBhY2NvdW50TGFiZWw6IFwie3sgdXNlckRhdGEuZnJpZW5kbHlVc2VySWQgfX1cIixcblxuICAgIC8vIE9wdGlvbmFsLCBmb3IgZGVidWdnaW5nIHB1cnBvc2Ugb25seSxcbiAgICAvLyBJRCB0aGF0IGFsbG93cyB0byBhc3NvY2lhdGUgYSBncm91cCBvZiByZXF1ZXN0c1xuICAgIC8vIHRvZ2V0aGVyIGFzIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBcInRyYW5zYWN0aW9uXCIgKGluIGEgd2lkZSBzZW5zZSlcbiAgICAvL2dsb2JhbFRyYWNraW5nSWQ6IFwie3sgZ2xvYmFsVHJhY2tpbmdJZCB9fVwiXG59KTtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1sb2dpblwiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9sb2dpbi5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZFxuICAgIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXV0aGVudGljYXRlKG1ldGhvZCkge1xuICAgICAgICBhdXRoMEd1YXJkaWFuSlMuc3RhcnQoZnVuY3Rpb24gKGVyciwgdHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRyYW5zYWN0aW9uLmlzRW5yb2xsZWQoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIG5vdCBlbnJvbGxlZCcpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbigndGltZW91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaW1lb3V0Jyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub24oJ2F1dGgtcmVzcG9uc2UnLCBmdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQucmVjb3ZlcnlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdUaGUgbmV3IHJlY292ZXJ5IGNvZGUgaXMgJyArIHBheWxvYWQucmVjb3ZlcnlDb2RlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBheWxvYWQuYWNjZXB0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0F1dGhlbnRpY2F0aW9uIGhhcyBiZWVuIHJlamVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhdXRoMEd1YXJkaWFuSlMuZm9ybVBvc3RIZWxwZXIoJ3t7IHBvc3RBY3Rpb25VUkwgfX0nLCB7IHNpZ25hdHVyZTogcGF5bG9hZC5zaWduYXR1cmUgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGVucm9sbG1lbnQgPSB0cmFuc2FjdGlvbi5nZXRFbnJvbGxtZW50cygpWzBdO1xuXG4gICAgICAgICAgICBpZiAoZW5yb2xsbWVudC5nZXRBdmFpbGFibGVBdXRoZW50aWNhdG9yVHlwZXMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnU29tZXRoaW5ncyB3ZW50IHdyb25nLCBzZWVtcyB0aGF0IHRoZXJlIGlzIG5vIGF1dGhlbnRpY2F0b3JzJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm90cFwiO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ucmVxdWVzdEF1dGgoZW5yb2xsbWVudCwgeyBtZXRob2Q6IG1ldGhvZCB9LCBmdW5jdGlvbihlcnIsIGF1dGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge290cENvZGU6IFwiXCIsIHJlY292ZXJ5Q29kZTogXCJcIn07XG4gICAgICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ3NtcycgfHwgbWV0aG9kID09PSAnb3RwJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLm90cENvZGUgPSBwcm9tcHQoJ090cCBjb2RlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdyZWNvdmVyeS1jb2RlJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnJlY292ZXJ5Q29kZSA9IHByb21wdCgnUmVjb3ZlcnkgY29kZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYXV0aC52ZXJpZnkoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGVucm9sbCh0cmFuc2FjdGlvbiwgbWV0aG9kKVxuICAgIHtcbiAgICAgIGlmICh0cmFuc2FjdGlvbi5pc0Vucm9sbGVkKCkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBhbHJlYWR5IGVucm9sbGVkJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5yb2xsRGF0YSA9IHtwaG9uZU51bWJlcjogXCJcIn07XG5cbiAgICAgIGlmIChtZXRob2QgPT09ICdzbXMnKSB7XG4gICAgICAgICAgZW5yb2xsRGF0YS5waG9uZU51bWJlciA9IHByb21wdCgnUGhvbmUgbnVtYmVyJyk7IC8vIENvbGxlY3QgcGhvbmUgbnVtYmVyXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFuc2FjdGlvbi5lbnJvbGwobWV0aG9kLCBlbnJvbGxEYXRhLCBmdW5jdGlvbiAoZXJyLCBvdHBFbnJvbGxtZW50KSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgdXJpID0gb3RwRW5yb2xsbWVudC5nZXRVcmkoKTtcbiAgICAgICAgICBpZiAodXJpKSB7XG4vLyAgICAgICAgICAgICAgc2hvd1FSKHVyaSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNvbmZpcm1EYXRhID0ge290cENvZGU6IFwiXCJ9O1xuICAgICAgICAgIGlmIChtZXRob2QgPT09ICdvdHAnIHx8IG1ldGhvZCA9PT0gJ3NtcycpIHtcbiAgICAgICAgICAgICAgY29uZmlybURhdGEub3RwQ29kZSA9IHByb21wdCgnT3RwIGNvZGUnKTsgLy8gQ29sbGVjdCB2ZXJpZmljYXRpb24gb3RwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb3RwRW5yb2xsbWVudC5jb25maXJtKGNvbmZpcm1EYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cblxufVxuIl19