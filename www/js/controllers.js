angular.module('devChat')

.controller('SplashCtrl', function() {

})
.controller('LoginCtrl',['$scope','$state','Login', 'CurrentUser',
    function($scope, $state, Login, CurrentUser) {
    console.log('Inside the login controller');
    $scope.doLogin = function() {
        Login.save({
            "username": $scope.username,
            "password": $scope.password
        }, function(data) {
            console.log(data);
            if (data.status == 200) {
                CurrentUser.setCurrentUser(data.user);
                $state.go('home.chats');
            } else {
                console.error("Not authorized");
            }
        }, function(error) {
            console.error(error);
        });
        };
}])
.controller('SignupCtrl', ['$scope', 'Login', '$state', function($scope, Login, $state) {
    console.log("Trying signup");
    $scope.doSignup = function() {
            Login.save({
            "first_name": $scope.first_name,
            "last_name" : $scope.last_name,
            "username": $scope.username,
            "password": $scope.password,
            "create": true
        }, function(data) {
            console.info(data);
            $state.go('home.chats');
        }, function(error) {
            console.error(error);
        });
    };
}])
.controller('HomeCtrl', function($scope) {
    console.log('Inside the main controller');
})
.controller('ChatsCtrl', ['$scope', 'devChatAPI','CurrentUser', function($scope, devChatAPI, CurrentUser) {
    $scope.chats = devChatAPI.getAllChats().query(function(chats) {
        console.log(chats);
        for (var i = 0; i < chats.length; i++) {
            chat = chats[i];
            console.log(chat);
            for (var j = 0; j < chat.participants.length; j++) {    
                var participant = chat.participants[j];
                if (participant._id != CurrentUser.user._id)
                    chat.with = participant;
            }
        }
    }, function(error) {
        console.error(error);
    });
}])
.controller('SettingsCtrl', function() {

})
.controller('QuestionsCtrl', ['$scope', 'devChatAPI', function($scope, devChatAPI) {
    console.log("Inside the questions controller");
    $scope.questions = devChatAPI.getQuestions().query();
}])
.controller('ChatCtrl', ['$scope', '$stateParams', 'LocalStorage', 'ChatService',
     'devChatAPI','CurrentUser',
 function($scope, $stateParams, LocalStorage, ChatService, devChatAPI, CurrentUser) {
    var _with = $stateParams.with;
    var _cur = CurrentUser.getCurrentUser();
    $scope.user = devChatAPI.getUser().get({username: _cur});
    $scope.with = devChatAPI.getUser().get({username: _with});
    $scope.messages = devChatAPI.getMessages(_cur, _with).query(function(messages) {
            console.log(messages);
        }, function(error) {
            console.log(error);
        });
    $scope.message = '';
    ChatService.onMessage = function(message) {
        console.log("New message arrived " + JSON.parse(message));
        $scope.messages.push(message);
    };
    $scope.sendMessage = function(message) {
        console.log('Message ' + message);
        message = {
            'content': message,
            'from': $scope.user.username,
            'sendTo': $scope.with.username,
            'timestamp': new Date(),
        };
        $scope.messages.push(message);
        //LocalStorage.append(chatId, message);
        //ChatService.sendMessage(message);
        devChatAPI.sendMessage().save(message, function(data) {
            console.log('Message successfully sent.\n' + data);
        }, function(error) {
            console.log('Error in sending message.\n' + error);
        });
    };
}]);
