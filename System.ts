/**
 * System.ts
 * 
 * @author Taichi Shinno
 * @author Aoi Matsumoto
 * @date   2021-08-19
 */

// import

import { ServerRequest, serve, Response }       from "https://deno.land/std@0.104.0/http/server.ts";
import { getCookies, setCookie, deleteCookie }  from "https://deno.land/std@0.104.0/http/cookie.ts";
import { mod }                                  from "https://deno.land/std@0.104.0/ws/mod.ts";


// export

/**
 * クラス StartupConfig😊
 * サーバーの起動構成を保持するクラス。
 */
export class StartupConfig {
    
    // フィールド
    host: String; // サーバーのhost名を格納するフィールド変数。
    port: String; // サーバーのport番号を格納するフィールド変数。

    /**
     * コンストラクタ
     * @param host サーバーのhost名
     * @param port サーバーのport番号
     */
    constructor(host: String, port: String) {
        this.host = host;
        this.port = port;
    }

}

/**
 * クラス Payload😊
 * ServerRequestなどを内包し、handler関数にわたるオブジェクト。
 */
export class Payload {
    
    // フィールド
    request:    ServerRequest;   // ServerRequestを格納するフィールド変数。
    response:   Response;        // Responseを格納するフィールド変数。
    cookie:     CookieModel;     // Cookieクラスのオブジェクトを格納するフィールド変数。
    database:   DatabaseModel;   // Databaseと接続する場合に、DatabaseModelクラスのオブジェクトを格納するフィールド変数。
    smtp:       SmtpModel;       // SMTPと接続する場合に、Smtpクラスのオブジェクトを格納するフィールド変数。
    modules:    object;          // 開発者が他に機能をhandler関数に渡したいときに追加されたモジュールなどを格納したフィールド変数。

    /**
     * コンストラクタ
     * @param request   payloadに追加するrequestオブジェクト
     * @param response  payloadに追加するresponseオブジェクト
     * @param cookie    payloadに追加するcookieオブジェクト
     * @param database  payloadに追加するdatabaseオブジェクト
     * @param smtp      payloadに追加するsmtpオブジェクト
     * @param modules   payloadに追加するmodulesオブジェクト
     */
    constructor(request: ServerRequest, response: Response, cookie: CookieModel, database: DatabaseModel, smtp: Smtp, modules: Object) {
        this.request    = request;
        this.response   = response;
        this.cookie     = cookie;
        this.database   = database;
        this.smtp       = smtp;
        this.modules    = modules;
    }
}

export class System {
    // フィールド
    static #startupConfig:  StartupConfig;  // 起動構成を保持する変数。
    static #router:         Router;         // Routerオブジェクトを保持する変数。
    static #cookie:         CookieModel;    // Permissionsオブジェクトを保持する変数。
    static #databaseModel:  DatabaseModel;  // DatabaseModelオブジェクトを保持する変数。
    static #smtpModel:      SmtpModel;      // SmtpModelオブジェクトを保持する変数。
    static #modules:        Object;         // 開発者が追加したモジュールを保持する変数。
    static #server:         any             // serverを保持する変数。

    // メソッド
    /**
     * listen
     * サーバーの起動とリクエストが呼ばれた時のコールバック関数であるhandlerの定義、
     * handlerに引数として渡すPayloadの初期化を行う。
     * @param module payloadに追加する関数を格納したオブジェクト。
     * @return StartupConfig 起動時の構成情報(StartupConfig)。
     */
    static async listen(module: Object): Promise<StartupConfig> {

        System.#server = serve({ port: System.#startupConfig.port });
        
        for await (const request of System.#server) {
            const payload = new Payload(request, { response }, System.#cookie, System.#databaseModel, System.#smtpModel, module);
            this.#router.routing(payload);
        }

        return System.#startupConfig;
        
    }

    /**
     * close
     * サーバーの停止を行う。
     */
    static async close(): Promise<void> {
        // クローズする。すごい
        System.#server.close();
    }

}