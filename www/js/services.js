angular.module('devChat')
.constant('IP_ADDRESS', 'localhost')
.service('ChatService', function(IP_ADDRESS, CurrentUser){
    this.socket = new WebSocket('ws://' + IP_ADDRESS + ':3000');
    this.messageQueue = [];
    var thisService = this;
    this.socket.onopen = function() {
        this.send(JSON.stringify({
            login: CurrentUser.getCurrentUser()
        }));
        this.onmessage = function(message) {
            console.log(JSON.parse(message));
            thisService.onMessage(message.data);
        };
        var messageQueue = thisService.messageQueue;
        var length = messageQueue.length;
        for (var i = 0; i < length; i++) {
            console.log(messageQueue[i]);
            this.send(JSON.stringify(messageQueue[i]));
        }
    };
    this.sendMessage = function(message) {
            console.log(this.socket.readyState + "  " + this.socket.OPEN);
            if (this.socket.readyState == this.socket.OPEN) 
                this.socket.send(message);
            else
                this.messageQueue.push(message);
            };

    this.onMessage = function(message) {

    };
})
.service('LocalStorage', function() {
    this.localStorageSupported = window.localStorage !== undefined;
    this.append = function(chatId, message) {
        if (this.localStorageSupported) {
            var messages = this.get(chatId);
            console.log(messages + " from history");
            messages.push(message);
            window.localStorage.setItem(chatId, JSON.stringify(messages));
        }
    }
    this.get = function(chatId) {
        var messages = [];
        if (this.localStorageSupported) {
            var value = window.localStorage.getItem(chatId);
            if (value)
                messages = JSON.parse(value);
        }
        return messages;
    };
    this.getUser = function(username) {
        if (this.localStorageSupported) {
            if (username == 'kishu')
                return {
                    'username': 'kishu',
                    'avatar': 'img/default_avatar.png'
                };
            else {
                return {
                    'username': 'ritu',
                    'avatar': 'img/default_avatar.png'
                };
            }
        }
    };
    this.setCurrentUser = function(user) {
        if (this.localStorageSupported) {
            window.localStorage.setItem('currentUser', JSON.stringify(user));
        }
    };
    this.getCurrentUser = function() {
        if (this.localStorageSupported) {
            return JSON.parse(window.localStorage.getItem('currentUser'));
        }
    };
})
.factory('Login', function($resource, IP_ADDRESS) {
    return $resource('http://' + IP_ADDRESS + ':8080/account');
})
.factory('devChatAPI', function($resource, IP_ADDRESS) {
    var devChatAPI = {};
    devChatAPI.getAllUsers = function() {
        return $resource('http://'+ IP_ADDRESS +':8080/users');
    };
    devChatAPI.getUser = function() {
        return $resource('http://' + IP_ADDRESS + ':8080/users/:username');
    };
    devChatAPI.sendMessage = function(message) {
        return $resource('http://' + IP_ADDRESS + ':8080/messages');
    };
    devChatAPI.getMessages = function() {
        return $resource('http://' + IP_ADDRESS + ':8080/messages/:chatId');
    };
    devChatAPI.getAllChats = function() {
        return $resource('http://' + IP_ADDRESS + ':8080/chats');
    };
    return devChatAPI;
})
.factory('CurrentUser', function() {
    var currentUser = {};
    currentUser.setCurrentUser = function(user) {
        this.user  = user;
    };
    currentUser.getCurrentUser = function() {
        return this.user;
    };
    return currentUser;
});
;
