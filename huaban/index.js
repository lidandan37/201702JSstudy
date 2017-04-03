(function() {
    // 获取操作元素
    var container = document.getElementById('container');
    // 获取到页面中所有列（ul）
    var oUls = container.getElementsByTagName('ul');
    // 获取到页面中所有图片
    var oImgs = container.getElementsByTagName('img');
    //获取窗口一屏的高度
    var winH = utils.win('clientHeight');

    // 将元素集合oUls转化为 数组ulsArr 进行排序
    var ulsArr = utils.likeArray(oUls);
    console.log(ulsArr);
    // ajax获取数据

    var data;
    function getData() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', './data.txt', false);
        xhr.onreadystatechange = function() {
            // this.status 200 201 202 都代表http请求ok
            if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
                // 将请求回来的 json字符串数据 转化为json对象
                data = utils.toJson(this.responseText);
                // 确保有数据后 在进行绑定
                data && data.length
                    ? bindData(data)
                    : null;
            }

        };
        xhr.send(null);
    }

    getData();
    // 绑定数据
    function bindData(data) {
        // data中有多少条数据 就循环多少次并创建多少个li
        // 并且每个li里 有一个a标签 一个p标签和一个img标签
        for (var i = 0; i < 50; i++) { // 为了多绑定些数据 i < 50
          // 0-7之间的随机整数 作为 索引 因为假数据中总共8条 索引范围0-7
            var ind = Math.round(Math.random() * 7);
            var cur = data[ind];
            // 创建li
            var oLi = document.createElement('li');
            // 创建a标签
            var oa = document.createElement('a');
            oa.href = 'javascript:;';
            oa.innerHTML = '采集';
            oLi.appendChild(oa);

            // 创建img
            var oImg = document.createElement('img');
            // 随机高 220 - 350之间的数
            oImg.style.height = Math.round(Math.random() * 130 + 220) + 'px';
            // 项目中设置为后台给的高度 height字段
            //   oImg.style.height = cur.height + 'px';
            // 图片加载的时候 根据data-real属性保存的 要加载的真实图片路径 加载时拿来加载
            oImg.setAttribute('data-real', cur.src);
            // oImg.src = cur.src;
            oLi.appendChild(oImg);

            // 创建文本标签p
            var op = document.createElement('p');
            op.innerHTML = cur.title;
            oLi.appendChild(op);
            // 根据每个ul（列）的自身高度 进行 从小到大排序 选出高度最低的那一列
            ulsArr.sort(function(a, b) {
                return a.offsetHeight - b.offsetHeight;
            });
            // 排完序后 数组集合中 ulsArr[0]第一项也就是 最矮的那一列
            ulsArr[0].appendChild(oLi);
        }
        // 打开浏览器 绑定完页面时 先加载一屏
        delayImg();
    }
    // 滚动条事件 滚动的时候 也需要检测和加载图片
    window.onscroll = function () {
      var sTop = utils.win('scrollTop');
      var bodyH = utils.win('scrollHeight');
        delayImg();
        // 窗口一屏高度+scrollTop(最大值) === scrollHeight
        // 说明滚动到底部了
        // 当快要到底部比scrollHeight 差800时 再次发送ajax请求 绑定数据
        if(winH + sTop >= bodyH - 800) {
            getData(); // 再次发送ajax请求获取数据
        }
    };
    // 图片延迟加载
    function delayImg() {
       for (var i = 0; i < oImgs.length; i++) {
         // oImgs[i].flag 如果为true 就说明已经加载过了 就不需要再执行checkImg(oImgs[i]);
         if(!oImgs[i].flag){ // 如果没有加载过 在执行 checkImg(oImgs[i]);
           checkImg(oImgs[i]); // 执行图片加载
         }

       }
    }
    // 检测哪些图片可以加载
    function checkImg(img) {
      // 窗口一屏的高度+scrollTop（滚动条滚出的高度）>= img距离body的上偏移+img自身高度
      // 获取滚动条滚动距离
      var sTop = utils.win('scrollTop');
      // 当前img上偏移
      var imgT = utils.offset(img).top;
      // 当前img自身高度
      var imgH = img.offsetHeight;
      if(winH + sTop >= imgT + imgH) { // 符合这个条件就可以加载真实图片
        // 获取到保存在当前img自身标签属性“data-real” 上加载的真实图片路径
          var imgSrc = img.getAttribute('data-real');
          // 检测图片资源有效性
          // 创建一个img 来检测图片路径
          var tempImg = new Image;
          tempImg.src = imgSrc; // 加载图片
          // 加载成功事件
          // 如果tempImg的src如果能够成功加载imgSrc这个图片 就会触发自身的onload事件 加载成功就说明我们的到的这个imgSrc是可以加载出来图片的路径
          tempImg.onload = function () {
            // 让当前页面中img 加载这个图片
            img.src = imgSrc;
            console.log('加载成功');
            // 避免重复加载
            img.flag = true; // 每一个加载成功的img 添加一个flag标识 如果为true说明已经加载成功了 不需要重复加载
          };
      }
    }

})();
