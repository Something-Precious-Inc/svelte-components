<script context="module">
    import { writable } from 'svelte/store';
    let activeObj = writable(null);
</script>

<script>
    import VirtualList from "@sveltejs/svelte-virtual-list";
    import { onMount, onDestroy } from "svelte";

    /** 表示幅 */
    export let width = "auto";
    /** 表示高さ */
    export let height = "100px";
    /** 要素リストの初期値 */
    export let items = [];
    /** 複数選択可能かどうか */
    export let multiSelect = false;

    let list = [...items];
    let currSelected = [];
    let prevSelected = [];
    let callback;
    let hiddenElem;
    let self;

    /** 最大長の名前 */
    $: maxLenName = list.reduce((maxName, item) => {
        if (maxName.length < item.name.length) {
            return item.name;
        } else {
            return maxName;
        }
    }, "");

    /** 要素の表示幅 */
    $: itemWidth = getItemWidth(maxLenName);

    onMount(() => {
        itemWidth = getItemWidth(maxLenName);
        window.addEventListener("resize", handleResize);
        if (multiSelect) {
            document.addEventListener("keyup", handleKeyup);
        }
    });

    onDestroy(() => {
        window.removeEventListener("resize", handleResize);
        if (multiSelect) {
            document.removeEventListener("keyup", handleKeyup);
        }
    });

    function handleSelect(event, item) {
        if ($activeObj && $activeObj != self) {
            return;
        }
        if (multiSelect && event.ctrlKey) {
            // 複数選択は Ctrl が離されたタイミングでコールバックを呼び出すのでここでは選択状態を変更するだけ
            const idx = currSelected.indexOf(item);
            if (idx != -1) {
                currSelected.splice(idx, 1);
                currSelected = currSelected;
            } else {
                currSelected = [...currSelected, item];
            }
            $activeObj = self;
        } else {
            if (
                currSelected.length == 1 &&
                currSelected.indexOf(item) != -1
            ) {
                return;
            }
            currSelected = [item];
            if (callback) {
                callback(currSelected.length);
            }
            prevSelected = [...currSelected];
            $activeObj = null;
        }
    }

    function handleResize() {
        itemWidth = getItemWidth(maxLenName);
    }

    function handleKeyup(event) {
        if ($activeObj && $activeObj == self && event.key == "Control") {
            if (!arrayEqauls(prevSelected, currSelected)) {
                if (callback) {
                    callback(currSelected.length);
                }
            }
            prevSelected = [...currSelected];
            $activeObj = null;
        }
    }

    function isValidObject(obj) {
        return obj && typeof obj === "object" && "name" in obj;
    }

    function getItemWidth(name) {
        if (hiddenElem) {
            hiddenElem.textContent = name;
            return hiddenElem.getBoundingClientRect().width;
        }
        return undefined;
    }

    function arrayEqauls(a, b) {
        if (a.length != b.length) {
            return false;
        }

        for (let i = 0; i < a.length; ++i) {
            if (b.indexOf(a[i]) == -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * 要素リストをセットします
     * @param {Array} newItems
     */
    export function setItems(newItems) {
        if (Array.isArray(newItems)) {
            for (let i = 0; i < newItems.length; i++) {
                if (!isValidObject(newItems[i])) {
                    return false;
                }
            }
            list = [...newItems];
            currSelected = [];
            prevSelected = [];
            return true;
        } else {
            return false;
        }
    }

    /**
     * 選択されているリスト要素のインデックスを返します
     * @return {Array}
     */
    export function getSelectedIndexes() {
        if (currSelected.length == 0) {
            return [];
        }
        return list.reduce((selectedIndexes, item, index) => {
            if (currSelected.includes(item)) {
                selectedIndexes.push(index);
            }
            return selectedIndexes;
        }, []);
    }

    /**
     * 選択中の要素配列を返します
     * @return {Array}
     */
    export function getSelectedItems() {
        const indexList = getSelectedIndexes();
        return indexList.map((index) => {
            return list[index];
        })
    }

    /**
     * リスト要素を追加します
     * @param {Object} newItem
     * @return {Boolean}
     */
    export function add(newItem) {
        if (isValidObject(newItem)) {
            list = [...list, newItem];
            return true;
        } else {
            return false;
        }
    }

    /**
     * インデックスで指定されたリスト要素を削除します
     * @param {number} index
     * @return {boolean}
     */
    export function remove(index) {
        if (0 <= index && index < list.length) {
            const currSelIndex = currSelected.indexOf(list[index]);
            list.splice(index, 1);
            list = list;
            if (currSelIndex != -1) {
                currSelected.splice(currSelIndex, 1);
                currSelected = currSelected;
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * リストを空にします
     */
    export function clear() {
        if (list.length != 0) {
            setItems([]);
        }
    }

    /**
     * 要素選択時のコールバックを設定します
     * @param {onSelectCallback} cb
     */
    export function setCallback(cb) {
        callback = cb;
    }
    /**
     * 要素選択時のコールバック
     * @callback onSelectCallback
     * @param {Number} currSelCount
     */
</script>

<style>
    div.list-view {
        margin: 0;
    }
    li.list-item {
        box-sizing: border-box;
        min-width: 100%;
        width: var(--item-width, auto);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    :global(svelte-virtual-list-row) {
        overflow: visible !important;
    }
</style>

<div class="list-view" style="width:{width}" bind:this={self}>
    {#if list.length > 0}
        <ul style="--item-width:{itemWidth ? itemWidth + 'px' : '100%'}">
            <VirtualList {height} items={list} let:item>
                <li
                    class="list-item"
                    class:selected={currSelected.indexOf(item) != -1}
                    class:inactive={$activeObj && $activeObj != self}
                    on:click={(event) => handleSelect(event, item)}>
                    {item.name}
                </li>
            </VirtualList>
        </ul>
    {/if}
    <ul style="visibility:hidden;height:0;overflow-y:scroll">
        <li
            bind:this={hiddenElem}
            style="display:inline-block;overflow:visible;min-width:auto;width:auto" />
    </ul>
</div>

