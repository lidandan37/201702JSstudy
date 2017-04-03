var utils = (function() {
    /**
         * [likeArray 类数组转化为数组]
         * @param  {[object]} list [要转化的类数组]
         * @return [Array]        [转化后的新数组]
         */
    function likeArray(list) {
        try { // 方案一
            return [].slice.call(list, 0); // 不兼容（ie8- 元素集合和节点集合） 利用call方法改变slice中的this
        } catch (e) { // 方案二 兼容写法
            var arr = [];
            for (var i = 0; i < list.length; i++) { // 将类数组中的每一项 取出来依次放到 arr这个数组里面
                arr.push(list[i]);
            }
            return arr;
        }
    }

    /**
         * [toJson 将JSON字符串转换为JSON对象]
         * @return [object] [JSON对象]
         */
    function toJson(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')');
    }

    return { // 将写好的方法 放到这个对象里 并且返回到外面
      likeArray: likeArray,
      toJson: toJson
    }

})()
