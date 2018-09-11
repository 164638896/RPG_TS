import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;

// 程序入口
class LayaAir3D {
    constructor() {
        //初始化微信小游戏
        Laya.MiniAdpter.init();
        //初始化引擎
        Laya3D.init(1136, 640/*, true*/);

        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE;

        //开启统计信息
        Laya.Stat.show();

        AppFacade.getInstance().startup();
    }
}

new LayaAir3D();