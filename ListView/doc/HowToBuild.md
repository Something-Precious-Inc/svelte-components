# listview.js ビルド手順

## ビルド環境

Node.js / npm をインストールしてください（Node.js 12 の環境でビルドできることを確認済み）。

## 手順

1. main.js の変更
   ListView の公開ソッドを追加・削除した場合、main.js を変更します。
   例えば、ListView に fooFunc() メソッドを新規追加した場合、main.js の methods にメソッド名 "fooFunc" を追加します。
   ```javascript
    // src/ListView.svelte
    ...
    // fooFunc() を新規追加
    export function fooFunc() {
       ...
    }
   ```

   ```javascript
    // src/main.js
    ...
    const methods = [
        "fooFunc", // <- この行を追加
        "setItems",
        "getSelectedIndexes",
        "getSelectedItems",
        "add",
        "remove",
        "clear"
    ];
    ...
   ```

2. ビルドの実行
   プロジェクトのルートディレクトリで次のコマンドを実行します。
    ```
    > npm run build
    ```
    ビルドに成功すると、public ディレクトリに listview.{js,css} が生成されます。
    listview.js 冒頭の svelte-virtual-list のコピーライト記述は自動的に挿入されます(挿入する内容は rollup.config.jsで設定)。
