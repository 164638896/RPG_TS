/*
* name;
*/

// Facade :  只发送不接受Notification （管理mvc）
// Proxy :   只发送不接受Notification (管理数据，接收服务器的消息)
// Command : 可以发送和接受Notification（逻辑）
// Mediator :可以发送和接受Notification（显示，比如ui）

// 消息注册
// command: 用 registerCommand
// mediator: 用 listNotificationInterests

// sendNotification 发送的消息顺序(发给command和mediator都是用sendNotification)
// command: facade->view->Observer->ExecuteCommand 这里收到
// mediator: facade->view->Observer->handleNotification 这里收到, RemoveMediator 注册的消息也会自动删除


class AppFacade extends puremvc.Facade {
    constructor() {
        super();
    }
    
    static getInstance(): AppFacade {
        if (!puremvc.Facade.instance)
            puremvc.Facade.instance = new AppFacade();

        return <AppFacade> /*</>*/puremvc.Facade.instance;
    }

    startup() {
        this.sendNotification(NotiNames.STARTUP);
    }

    initializeController(): void {
        super.initializeController();

        this.registerCommand(NotiNames.STARTUP, StartUpCommand);
        this.registerCommand(NotiNames.PRELOAD, PreLoadCommand);
        this.registerCommand(NotiNames.ENTER_SCENE, EnterSceneCommand);
        this.registerCommand(NotiNames.SKILL, SkillCommand);
        // this.registerCommand(NotiNames.LevelUp, TestCommand);
        // this.registerMediator(new TestMediator());
        // this.registerProxy(new TestProxy());
    }
}