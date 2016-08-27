// 向js的string对象原型添加新方法

// 重复一个字符串
if(!String.repeat){
	String.prototype.repeat = function(l){
		// 按给定的次数(l)，重复字符串
		return new Array(l+1).join(this);
	}
}

// 清除结尾和开头处的空白符
if(!String.trim){
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, '');
	}
}

// 自定义js库
(function(){
	// ADS命名空间
	if(!window.ADS){
		window['ADS'] = {};
	}

	function isCompatible(other){
		// 判断当前浏览器是否与该库兼容
		if(other === false
			|| !Array.prototype.push
			|| !Object.hasOwnProperty
			|| !document.createElement
			|| !document.getElementsByTagName){
			return false;
		}
		return true;
	};
	window['ADS']['isCompatible'] = isCompatible;

	function $(){
		var elements = new Array();
		for (var i = 0; i < arguments.length; i++){
			// arguments标识符 引用形参
			// arguments[0]表示第一个参数
			// 用于未知fn参数个数
			var element = arguments[i];

			// 如果参数是字符串
			if(typeof element == 'string'){
				element = document.getElementById(element);
            	// console.log(element.innerHTML);
			}

			// 如果只提供一个参数 则返回这个元素
			if(arguments.length == 1){
				return element;
			}

			// 否则添加于数组中
			elements.push(element);

		}
		// 返回包含多个被请求元素的数组
		return elements;

	};
	window['ADS']['$'] = $;

	function addEvent(node, type, listener){
		// 使用前面的方法检查兼容性以保证平稳退化
		if(!isCompatible()){
			return false;
		}

		if(!(node = $(node))){
			return false;
		}

		if(node.addEventListener){
			// for W3C
			node.addEventListener(type, listener, false);// 参数false表明在冒泡阶段
			return true;
		}else if(node.attachEvent){
			// for MSIE
			node['e' + type + listener] = listener;
			node[type + listener] = function(){
				node['e' + type + listener](window.event);
			}
			node.attachEvent('on' + type, node[type + listener]);
			return true;
		}

		return false;

	};
	window['ADS']['addEvent'] = addEvent;

	function removeEvent(node, type, listener){
		if(!(node = $(node))){
			return false;
		}

		if(node.removeEventListener){
			// for W3C
			node.removeEventListener(type, listener, false);
			return true;
		}else if(node.detachEvent){
			// for MSIE
			node.detachEvent('on' + type, node[type + listener]);
			node[type + listener] = null;
			return true;
		}

		return false;
	};
	window['ADS']['removeEvent'] = removeEvent;

	function getElementsByClassName(className, tag, parent){
		parent = parent || document;
		if(!(parent = $(parent))){
			return false;
		}

		// 查找所有匹配的标签
		var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
		var matchingElements = new Array();

		// 创建正则来判断className是否正确
		className = className.replace(/\-/g, "\\-");
		var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");

		var element;
		// 检查每个元素
		for(var i = 0; i < allTags.length; i++){
			element = allTags[i];
			if(regex.test(element.className)){
				matchingElements.push(element);
			}
		}

		// 返回所有匹配的元素
		return matchingElements;
	};
	window['ADS']['getElementsByClassName'] = getElementsByClassName;

	function toggleDisplay(node, value){
		if(!(node = $(node))){
			return false;
		}

		if(node.style.display != 'none'){
			node.style.display = 'none';
		}else{
			node.style.display = value || '';
		}

		return true;
	};
	window['ADS']['toggleDisplay'] = toggleDisplay;

	function insertAfter(node, referenceNode){
		// 向后插入新子节点
		if(!(node = $(node))){
			return false;
		}

		if(!(referenceNode = $(referenceNode))){
			return false;
		}

		return referenceNode.parentNode.insertBefore(
			node, referenceNode.nextSibling);
	};
	window['ADS']['insertAfter'] = insertAfter;

	function removeChildren(parent){
		if(!(parent = $(parent))){
			return false;
		}

		while(parent.firstChild){
			parent.firstChild.parentNode.removeChild(parent.firstChild);
		}

		// 返回父节点，以便实现方法的连缀
		return parent;
	};
	window['ADS']['removeChildren'] = removeChildren;

	function prependChild(parent, newChild){
		// 向前插入新子节点
		if(!(parent = $(parent))){
			return false;
		}

		if(!(newChild = $(newChild))){
			return false;
		}

		if(parent.firstChild){
			parent.insertBefore(newChild, parent.firstChild);
		}else{
			parent.appendChild(newChild);
		}

		return parent;
	}
	window['ADS']['prependChild'] = prependChild;

	function bindFunction(obj, func){
		return function(){
			// 返回匿名函数
			// 函数.apply(环境,参数)，改变函数的执行环境
			func.apply(obj, arguments);
		};
	};
	window['ADS']['bindFunction'] = bindFunction;

	function getBrowserWindowSize(){
		var de = document.documentElement;
		return {
			'width': (
				// .innerWidth包括窗口宽度和滚动条
				// 在IE下并不支持该属性
				window.innerWidth
				// .clientWidth窗口可视区域，只包括元素宽度
				// 在IE下支持
				|| (de && de.clientWidth)
				|| document.body.clientWidth
			),
			'height': (
				window.innerHeight
				|| (de && de.clientHeight)
				|| document.body.clientHeight
			)
		}
	};
	window['ADS']['getBrowserWindowSize'] = getBrowserWindowSize;

	// DOM常量
	window['ADS']['node'] = {
		ELEMENT_NODE	            : 1,
		ATTRIBUTE_NODE	            : 2,
		TEXT_NODE		            : 3,
		CDATA_SECTION_NODE	        : 4,
		ENTITY_REFERENCE_NODE	    : 5,
		ENTITY_NODE                 : 6,
		PROCESSING_INSTRUCTION_NODE	: 7,
		COMMENT_NODE	            : 8,
		DOCUMENT_NODE	            : 9,
		DOCUMENT_TYPE_NODE	        : 10,
		DOCUMENT_FRAGMENT_NODE	    : 11,
		NOTATION_NODE	            : 12
	}

	// 创建递归(爬树tree-walking)
	// 进行遍历且在每个节点执行一个匿名函数的调用
	function walkElementsLinear(func, node){
		var root = node || window.document;
		var nodes = root.getElementsByTagName("*");
		for(var i = 0; i < nodes.length; i++){
			func.call(nodes[i]);
		}
	}

	// 创建递归，跟踪节点的深度或构建一个路经
	function walkTheDOMRecursive(func, node, depth, returnedFromParent){
		var root = node || window.document;
		var returnedFromParent = func.call(root, depth++, returnedFromParent);
		var node = root.firstChild;
		while(node){
			// 处理root的子节点
			walkTheDOMRecursive(func, node, depth, returnedFromParent);
			node = node.nextSibling;
		}
	}
	window['ADS']['walkTheDOMRecursive'] = walkTheDOMRecursive;

	// 查找每个节点的属性
	function walkTheDOMWithAttributes(node, func, depth, returnedFromParent){
		var root = node || window.document;
		returnedFromParent = func(root, depth++, returnedFromParent);
		if(root.attributes){
			for(var i = 0; i < root.attributes.length; i++){
				walkTheDOMWithAttributes(root.attributes[i],
					func, depth-1, returnedFromParent);
			}
		}
		if(root.nodeType != ADS.node.ATTRIBUTE_NODE){
			node = root.firstChild;
			while(node){
				walkTheDOMWithAttributes(node, func, depth, returnedFromParent);
				node = node.nextSibling;
			}
		}
	}

	/* 例：把word-word转换为wordWord */
	// 主要处理嵌入的样式属性
	function camelize(s){
		return s.replace(/-(\w)/g, function(strMatch, p1){
			return p1.toUpperCase();
		});
	};
	window['ADS']['camelize'] = camelize;

	// 阻止事件冒泡
	function stopPropagation(eventObject){
		eventObject = eventObject || getEventObject(eventObject);
		if(eventObject.stopPropagation){
			eventObject.stopPropagation();
		} else{
			eventObject.cancelBubble = true;
		}
	}
	window['ADS']['stopPropagation'] = stopPropagation;

	function preventDefault(eventObject){
		eventObject = eventObject || getEventObject(eventObject);
		if(eventObject.preventDefault){
			eventObject.preventDefault();
		}else{
			eventObject.returnValue = false;
		}
	}
	window['ADS']['preventDefault'] = preventDefault;

	function addLoadEvent(loadEvent, waitForImages){
		if(!isCompatible()) return false;

		// 如果等待标记为true则使用常规的添加事件的方法
		if(waitForImages){
			return addEvent(window, 'load', loadEvent);
		}

		// 否则使用另外的方式包装loadEvent()
		// 使得this指向正确的内容且确保事件不会被执行两遍
		var init = function(){
			// 如果这个函数已经被调用过则返回
			if(arguments.callee.done) return;

			// 标记这个函数以便检验它是否运行过
			arguments.callee.done = true;

			// 在document环境中运行载入事件
			loadEvent.apply(document, arguments);
		};

		// 为DOMContentLoaded事件注册事件侦听器
		if(document.addEventListener){
			document.addEventListener("DOMContentLoaded", init, false);
		}

		// 对于Safari，使用setInterval()函数检测
		// document是否载入完成
		
	}

})();