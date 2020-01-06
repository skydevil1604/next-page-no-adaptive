$(document).ready(function () {

    
// Cursor

trackMouse('.hoverable', '.js-pointer');
trackMouse('.hov-light', '.js-pointer');

function trackMouse(hover, pointer) {

  var $hover = document.querySelectorAll(hover);
  var $pointer = document.querySelector(pointer);
  var $hoverLight = document.querySelectorAll('.hov-light');

  var off = 50;
  var first = !0;

  function mouseX(evt) {
    if (!evt) evt = window.event;
    if (evt.pageX) return evt.pageX;
    else if (evt.clientX) return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    else return 0;
  }

  function mouseY(evt) {
    if (!evt) evt = window.event;
    if (evt.pageY) return evt.pageY;
    else if (evt.clientY) return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    else return 0;
  }

  function follow(evt) {

    if (first) {
      first = !1;
      $pointer.style.opacity = 1;
    }

    TweenMax.to($pointer, .7, {
      left: (parseInt(mouseX(evt)) - off) + 'px',
      top: (parseInt(mouseY(evt)) - off) + 'px',
      ease: Power3.easeOut
    });
  }
  document.onmousemove = follow;

  (function hoverable(){
    $hover.forEach(function(item){
      item.addEventListener('mouseover', function(){
        $pointer.classList.add('hide');
            var title = $(this).data('title');
            console.log(title);
            $('.pointer__circle').text(title);
      });
      item.addEventListener('mouseout', function(){
        $pointer.classList.remove('hide');
        $('.pointer__circle').text('');
      });
    });
  })();

  (function hoverableLight(){
    $hoverLight.forEach(function(item){
      item.addEventListener('mouseover', function(){
        $pointer.classList.add('light');
      });
      item.addEventListener('mouseout', function(){
        $pointer.classList.remove('light');
      });
    });
  })();
}
//Cursor end    


//Scroll sections animation

    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            duration: "200%" // this works just fine with duration 0 as well
            // However with large numbers (>20) of pinned sections display errors can occur so every section should be unpinned once it's covered by the next section.
            // Normally 100% would work for this, but here 200% is used, as Panel 3 is shown for more than 100% of scrollheight due to the pause.
        }
    });

    // get all slides
    var slides = document.querySelectorAll("section.panel");

    // create scene for every slide
    for (var i=0; i<slides.length; i++) {
        new ScrollMagic.Scene({
                triggerElement: slides[i]
            })
            .setPin(slides[i], {pushFollowers: false})
            .addTo(controller);
    }
//Scroll sections animation end

//Slider 

    var multiItemSlider = (function () {
        return function (selector, config) {
          var
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
            _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
            _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
            _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
            _positionLeftItem = 0, // позиция левого активного элемента
            _transform = 0, // значение транфсофрмации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = []; // массив элементов
  
          // наполнение массива _items
          _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
          });
  
          var position = {
            getItemMin: function () {
              var indexItem = 0;
              _items.forEach(function (item, index) {
                if (item.position < _items[indexItem].position) {
                  indexItem = index;
                }
              });
              return indexItem;
            },
            getItemMax: function () {
              var indexItem = 0;
              _items.forEach(function (item, index) {
                if (item.position > _items[indexItem].position) {
                  indexItem = index;
                }
              });
              return indexItem;
            },
            getMin: function () {
              return _items[position.getItemMin()].position;
            },
            getMax: function () {
              return _items[position.getItemMax()].position;
            }
          };
  
          var _transformItem = function (direction) {
            var nextItem;
            if (direction === 'right') {
              _positionLeftItem++;
              if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                nextItem = position.getItemMin();
                _items[nextItem].position = position.getMax() + 1;
                _items[nextItem].transform += _items.length * 100;
                _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
              }
              _transform -= _step;
            }
            if (direction === 'left') {
              _positionLeftItem--;
              if (_positionLeftItem < position.getMin()) {
                nextItem = position.getItemMax();
                _items[nextItem].position = position.getMin() - 1;
                _items[nextItem].transform -= _items.length * 100;
                _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
              }
              _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
          };
  
          // обработчик события click для кнопок "назад" и "вперед"
          var _controlClick = function (e) {
            if (e.target.classList.contains('slider__control')) {
              e.preventDefault();
              var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
              _transformItem(direction);
            }
          };
  
          var _setUpListeners = function () {
            // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
            _sliderControls.forEach(function (item) {
              item.addEventListener('click', _controlClick);
            });
          };
  
          // инициализация
          _setUpListeners();
  
          return {
            right: function () { // метод right
              _transformItem('right');
            },
            left: function () { // метод left
              _transformItem('left');
            }
          };
  
        };
      }());
  
      var slider = multiItemSlider('.slider');

//Slider end

//Changing blocks onclick buttons

var HIDDEN_CLASS_NAME = 'hidden';
var TARGET_CLASS_NAME = 'target';
var SOURCE_CLASS_NAME = 'source';

var targetIdToShow = 1;

function main() {
	var targets = getElements(TARGET_CLASS_NAME);
	var sources = getElements(SOURCE_CLASS_NAME);
	sources.forEach(function (sourceNode) {
		var sourceNodeId = extractId(sourceNode, SOURCE_CLASS_NAME);
		sourceNode.addEventListener('click', function () {
            showTarget(targets, sourceNodeId);
		});
	});
	showTarget(targets, targetIdToShow);
}

function getElements(type) {
	return [].slice.call(document.querySelectorAll('.' + type)).sort(function (targetNode1, targetNode2) {
		var target1Num = extractId(targetNode1, TARGET_CLASS_NAME);
		var target2Num = extractId(targetNode2, TARGET_CLASS_NAME);
		return target1Num > target2Num;
	});
}

function extractId(targetNode, baseClass) {
	var currentClassIndex = targetNode.classList.length;
	while (currentClassIndex--) {
		var currentClass = targetNode.classList.item(currentClassIndex);
		var maybeIdNum = parseInt(currentClass.split('-')[1]);
		if (isNaN(maybeIdNum)) {
			continue;
		}
		var classStrinToValidate = baseClass + '-' + maybeIdNum;
		if (classStrinToValidate === currentClass) {
			return maybeIdNum;
		}
	}
}

function showTarget(targets, targetId) {
	targets.forEach(function (targetNode, targetIndex) {
    var currentTargetNodeId = extractId(targetNode, TARGET_CLASS_NAME);
		if (currentTargetNodeId === targetId) {
            targetNode.classList.remove(HIDDEN_CLASS_NAME);

		} else {
            targetNode.classList.add(HIDDEN_CLASS_NAME);
		}
	});
}

main();

//Changing blocks onclick buttons end

//Changing image src via hover

$(".main-content__works-buttons div").click(function(e) {
    e.preventDefault();
    $(".main-content__works-buttons div").removeClass('active');
    $(this).addClass('active');
  });



var $imgFirst = $("#first-works-image");
var $imgSecond = $("#second-works-image");
var $imgThird = $("#third-works-image");
var $imgFourth = $("#fourth-works-image");
var $imgFifth = $("#fifth-works-image");
var $imgSixth = $("#sixth-works-image");

if($imgFirst.parent().hasClass('active')) {
    $imgFirst.attr('src', 'img/gear_red.svg');
    $imgFirst.on('mouseout', function() { 
        $imgFirst.attr('src', 'img/gear_red.svg');
    });
} else {
    $imgFirst.attr('src', 'img/gear_dark copy.svg');
    $imgFirst.on('mouseover', function() { 
        $imgFirst.attr('src', 'img/gear_red.svg');
    });
    $imgFirst.on('mouseout', function() { 
        $imgFirst.attr('src', 'img/gear_dark copy.svg');
    });
}
///////////////
if($imgSecond.parent().hasClass('active')) {
    $imgSecond.attr('src', 'img/star_red.svg');
    $imgSecond.on('mouseout', function() { 
        $imgSecond.attr('src', 'img/star_red.svg');
    });
} else {
    $imgSecond.attr('src', 'img/stars_small.svg');
    $imgSecond.on('mouseover', function() { 
        $imgSecond.attr('src', 'img/star_red.svg');
    });
    $imgSecond.on('mouseout', function() { 
        $imgSecond.attr('src', 'img/stars_small.svg');
    });
}
///////////////////////
if($imgThird.parent().hasClass('active')) {
    $imgThird.attr('src', 'img/graphik_red.svg');
    $imgThird.on('mouseout', function() { 
        $imgThird.attr('src', 'img/graphik_red.svg');
    });
} else {
    $imgThird.attr('src', 'img/graphik_small.svg');
    $imgThird.on('mouseover', function() { 
        $imgThird.attr('src', 'img/graphik_red.svg');
    });
    $imgThird.on('mouseout', function() { 
        $imgThird.attr('src', 'img/graphik_small.svg');
    });
}
////////////////////////
if($imgFourth.parent().hasClass('active')) {
    $imgFourth.attr('src', 'img/lupa_red.svg');
    $imgFourth.on('mouseout', function() { 
        $imgFourth.attr('src', 'img/lupa_red.svg');
    });
} else {
    $imgFourth.attr('src', 'img/lupa_small.svg');
    $imgFourth.on('mouseover', function() { 
        $imgFourth.attr('src', 'img/lupa_red.svg');
    });
    $imgFourth.on('mouseout', function() { 
        $imgFourth.attr('src', 'img/lupa_small.svg');
    });
}
//////////////////////
if($imgFifth.parent().hasClass('active')) {
    $imgFifth.attr('src', 'img/hlopushka_red.svg');
    $imgFifth.on('mouseout', function() { 
        $imgFifth.attr('src', 'img/hlopushka_red.svg');
    });
} else {
    $imgFifth.attr('src', 'img/hlopushka_small.svg');
    $imgFifth.on('mouseover', function() { 
        $imgFifth.attr('src', 'img/hlopushka_red.svg');
    });
    $imgFifth.on('mouseout', function() { 
        $imgFifth.attr('src', 'img/hlopushka_small.svg');
    });
}
//////////////////////////
if($imgSixth.parent().hasClass('active')) {
    $imgSixth.attr('src', 'img/headphone_red.svg');
    $imgSixth.on('mouseout', function() { 
        $imgSixth.attr('src', 'img/headphone_red.svg');
    });
} else {
    $imgSixth.attr('src', 'img/headphone_small.svg');
    $imgSixth.on('mouseover', function() { 
        $imgSixth.attr('src', 'img/headphone_red.svg');
    });
    $imgSixth.on('mouseout', function() { 
        $imgSixth.attr('src', 'img/headphone_small.svg');
    });
}

// Parallax effect on mouse move

var el = $('.transform-animation');

function move(x, y) {
  // обертка с доп свойствами
  el.addClass('text-active');

  // центр карточки
  var xser = el.offset().left + el.width() / 2;
  var yser = el.offset().top + el.height() / 2;

  // координаты мыши относительно центра карточки
  var otnX = x - xser;
  var otnY = y - yser;

  // вычисляем % - на каком расстоянии мышь от середины до края, центр = 0%
  var raznX = otnX / el.width() * 100 * 2;
  var raznY = otnY / el.height() * 100 * 2;

  // на сколько градусов нужно повернуть (100% = 30deg)
  var trX = raznY / 100 * 30 * -1;
  var trY = raznX / 100 * 20;

  // окруление
  trX = Math.round(trX * 1000) / 1000;
  trY = Math.round(trY * 1000) / 1000;

  // в css
  el.css('transform', 'rotateY(' + trY + 'deg) rotateX(' + trX + 'deg) rotateZ(0deg) scale(1.05)');
}

function resetTransform() {
  el.removeClass('text-active');
  el.css('transform', 'rotateY(0deg) rotateX(0deg) rotateZ(0deg) scale(1)');
}

el.mousemove(function(e) {
    move(e.pageX, e.pageY);
  })
  .mouseout(function(e) {
    resetTransform();
  });

// Parallax effect on mouse move end

var arrow = $('#arrow');
var footer = $('.footer');

footer.hover(function () {
        // over
        arrow.css('transform', 'rotate(45deg)');
    }, function () {
        // out
        arrow.css('transform', 'rotate(0deg)');
    }
);


//Progress bar loader

var preloader = $('.preloader'), 
    pw = preloader.width(),
    percent = preloader.find('.percent'),
    l = 8, 
    j = 0;

    var timer = setInterval(function(){
        var p = parseInt((100/l)*j),
            w = (150*p)/100;
            
            percent.text(p);
            
            if (p > 99){ 
                clearInterval(timer);
                setTimeout(function(){
                    preloader.slideUp(800);
                }, 1000);
            }
        j++;
    }, 500);

//Progress bar loader end

//Rotator pics at preloader

var slidesPic = document.querySelectorAll('.slide-pic');
var currentSlide = 0;
var slideInterval = setInterval(nextSlide,1000);

function nextSlide() {
    slidesPic[currentSlide].className = 'slide-pic';
    currentSlide = (currentSlide+1)%slidesPic.length;
    slidesPic[currentSlide].className = 'slide-pic showing';
}

//Rotator pics at preloader end

//Counter views

var num = 1000030021;

	function counter() {	    
    num++;
	    timeR = setTimeout(counter, 10);
		document.getElementById('counter').innerHTML = num;
		
		if(i >= 1000230021) {num = 1000030021;}
    }
counter();
//Counter views end

});