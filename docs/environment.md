# 環境建置流程

## 使用 ebcli & Elastic Beanstalk 建置與發佈
Elastic Beanstalk屬於platform as a service（Paas）
本身服務並不收費而是用多少資源收取多少

1. 在資料夾內執行 ``eb init`` 設定 AWS region、application name、platform 等資訊。第一次會要求`AWS_ACCESS_KEY_ID `與 `AWS_SECRET_ACCESS_KEY`，可以到 AWS console 的 IAM service 建立一組使用者 key 與 secret。


2. ``eb init``完成之後由於有使用到 `node`的`express`關係需要在根目錄上增加
`/.ebextensions/nodecommand.config`
 這一個資料夾與檔案，將檔案加入
 ```
 option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
 ```
3. 執行 `eb create` 建立 environment
```
~/eb$ eb create
Enter Environment Name
(default is eb-dev): eb-dev
Enter DNS CNAME prefix
(default is eb-dev): eb-dev
WARNING: The current directory does not contain any source code. Elastic Beanstalk is launching the sample application instead.
Environment details for: elasticBeanstalkExa-env
  Application name: elastic-beanstalk-example
  Region: us-west-2
  Deployed Version: Sample Application
  Environment ID: e-j3pmc8tscn
  Platform: 64bit Amazon Linux 2015.03 v1.4.3 running Docker 1.6.2
  Tier: WebServer-Standard
  CNAME: eb-dev.elasticbeanstalk.com
  Updated: 2018-05-17 01:02:24.813000+00:00
Printing Status:
INFO: createEnvironment is starting.
 -- Events -- (safe to Ctrl+C) Use "eb abort" to cancel the command.
```
完畢之後,如果有`git`版本控制，確定`code`的`git commit` 已經完成就能輸入`eb deploy`發布至AWS Elastic Beanstalk
4. 最後 `eb open` 顯示出網站瀏覽

# 初始資料設定
## 程式初始設定
* firebase config 
* jwt

兩個設定檔案我當放在`/config`需要變動直接改即可

## aws 初始設定
在aws elastic beanstalk中`environment`的`Configuration`

將`Modify software Node command` 輸入 __npmstart__

如下圖 
![Imgur](https://i.imgur.com/TdFba0P.png)
確保程式能順利執行

# token 設定方式

1. 參考api文件取得token
2. 將header加入(key/value)=>(Authorization/Bearer __your token__)如圖
![Imgur](https://i.imgur.com/R8a4Boc.png)

