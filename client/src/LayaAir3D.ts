import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;

// 程序入口
class LayaAir3D {
    constructor() {
        //初始化微信小游戏
        Laya.MiniAdpter.init();
        //初始化引擎
        Laya3D.init(0, 0, true);

        //等比缩放
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE;

        //开启统计信息
        Laya.Stat.show();

        AppFacade.getInstance().startup();
        //GameLoad.getInstance().preLoad();
    }
}

new LayaAir3D();