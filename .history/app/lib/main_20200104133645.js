$(document).ready(function () {
    /*var preloader    = $('#preloader'), // селектор прелоадера
        imagesCount  = $('img').length, // количество изображений
        dBody        = $('body'), //обращаемся к body
        percent      = 100 / imagesCount, // количество % на одну картинку
        progress     = 0, // точка отсчета
        imgSum       = 5, // количество картинок
        loadedImg    = 0; // счетчик загрузки картинок

    if (imagesCount >= imgSum && imagesCount > 0) {
        preloader.css('background', '#000');
        dBody.css('overflow', 'hidden');

        $(".dws-progress-bar").circularProgress({
            color: "#25ffe4",
            line_width: 17,
            height: "350px",
            width: "350px",
            percent: 0,
            // counter_clockwise: true,
            starting_position: 25
        }).circularProgress('animate', percent, 1000);

        for (var i = 0; i < imagesCount; i++) { // создаем клоны изображений
            var img_copy        = new Image();
            img_copy.src        = document.images[i].src;
            img_copy.onload     = img_load;
            img_copy.onerror    = img_load;
        }

        function img_load () {
            progress += percent;
            loadedImg++;
            if (progress >= 100 || loadedImg == imagesCount) {
                preloader.delay(400).fadeOut('slow');
                dBody.css('overflow', '');
            }
            $(".dws-progress-bar").circularProgress('animate', progress, 500);
        }
    } else {
        preloader.remove();
    }*/



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
            .addIndicators() // add indicators (requires plugin)
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
$(window).mousemove(function (e) {
	
    var y = e.pageY / window.innerHeight, 
        x = e.pageX / window.innerWidth;
	
	$('.main-content__header').css({
		'transform': "perspective(2000px) translateX(" + (x * 40) + "px) translateY(" +  (y * 40) + "px)"
	});
	
	$('.main-content__text').css({
		'transform': "perspective(2000px) translateX(" + (x * 40) + "px) translateY(" +  (y * 40) + "px)"
	});
	
	// $('.item--layer-three').css({
	// 	'transform': "translateX(" + (x * 80) + "px) translateY(" +  (y * 80) + "px)"
	// });
});

});