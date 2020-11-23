# リスト表示UI

## 組み込み方法

- listview.js, listview.css を読み込む
- 組み込み先の HTML 要素を準備
- ListView インスタンスを作成
   インスタンス作成時は以下を指定する
   - target: 組み込み先の HTML 要素
   - props:
     - width: 表示幅（デフォルト値：auto）
     - height: 表示高さ（デフォルト値：100px）
     - items: 要素リストの初期値（name 属性を持つオブジェクトのリスト）（デフォルト値：[]）
     - multiSelect: 複数選択を有効にするかどうか（デフォルト値：false）

```html
<head>
  <!-- listview.css, listview.js の読み込み -->
  <link rel='stylesheet' href='/path/to/listview.css'>
  <script defer src='/path/to/listview.js'></script>
</head>

<body>
  <!-- 組み込み先 -->
  <div id="listView1" class="listView"><div>

  <script>    
    let listView1;
    document.addEventListener("DOMContentLoaded", function (event) {
        // ListView のインスタンス作成    
        listView1 = new ListView({   
            target: document.getElementById("listView1"), // 組み込み先の HTML 要素
            props: {
                width: "200px",  // 表示幅
                height: "100px", // 表示高さ
                items: [         // 要素リストの初期値
                    {name: "test1"},
                    {name: "test2"},
                    {name: "test3"},
                    {name: "test4"},                    
                    {name: "test5"}
                ],
                multiSelect: true // 複数選択を有効にする
            }
        });
    }
    ...
</script>
</body>
```

## ハイライトの設定

組み込み先 HTML 要素の配下の ul, li に対してスタイルを設定します。

```css  
.listView ul {
    margin: 0;
    padding: 0;
}
.listView li {
    user-select: none;
    border: 1px solid transparent;
    padding: 2px;
}
.listView li:hover {
    cursor: pointer;
}
.listView .selected {
    background: #cce8ff;
    border: 1px solid #99d1ff;
}
```

## メソッド

### setCallback(cb)

要素が選択された際に呼び出されるコールバック関数を設定します。
引数:

- `cb`: *(Function)* コールバック関数

```javascript
/**
 * 要素選択時のコールバック関数
 * @param sender ListView インスタンス
 * @param currSelCount 操作後の選択要素数
 */
function onSelect(sender, currSelCount) {
    console.log("currSelCount:" + currSelCount);
    let selectedItems = sender.getSelectedItems();
    ...
}
listView1.setCallback(onSelect);
```

### remove(index): Boolean

インデックスで指定されたリスト要素を削除します。削除に成功した場合は true、失敗した場合は false を返します。
引数:

- `index`: *(Number)* 削除する要素のインデックス

```javascript
listView1.remove(3);
```
### add(item): Boolean

要素を追加します。追加に成功した場合は true、失敗した場合は false を返します。
引数:

- `item`: *(object)* 追加する要素（name 属性を持つオブジェクト）

```javascript
listView1.add({name: 'bar1'});
```

### clear()

リストを空にします。

```javascript
listView1.clear();
```

### setItems(items): Boolean

リストを再初期化します。再初期化に成功した場合は true、失敗した場合は false を返します。
引数:

- `items`: *(Array)* name 属性を持つオブジェクトのリスト

```javascript
let newItems = [{name: "bar1"},{name: "bar2"},{name: "bar3"}];
listView1.setItems(newItems);
```

### getSelectedIndexes(): Array

選択されているリスト要素のインデックスの配列を返します。

```javascript
let index = listView1.getSelectedIndexes();
```
### getSelectedItems(): Array

選択されているリスト要素オブジェクトの配列を返します。

```javascript
let selectedItems = listView1.getSelectedItems();
```
