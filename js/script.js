const filterByType = (type, ...values) => values.filter(value => typeof value === type),  //объявляется функция filterByType, которая принемает параметк type
	// и неорганиченное количество параметров values(массив). Функция возвращает
	//отфильтрованный массив values. Фильтрация происходит по типу данных type.

	hideAllResponseBlocks = () => { //функция для скрытия всех response-блоков
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block')); //поиск всех блоков с классом dialog__response-block, получение массива из коллекции.
		responseBlocksArray.forEach(block => block.style.display = 'none');//сокрытие всех таких блоков
	},

	showResponseBlock = (blockSelector, msgText, spanSelector) => { //функция для показа блоков. Принимает селектор для поиска блоков, текст для блока и селектор для места вставки текста
		hideAllResponseBlocks();//скрываем все response-блоки
		document.querySelector(blockSelector).style.display = 'block';//показываем переданный блок
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText; //если передан spanSelector, вставляем туда переданный текст
		}
	},

	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'), //функция показа блока с ошибкой

	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'), //функция показа блока в случае успеха

	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'), //функция показа блока с отсутствием результата

	tryFilterByType = (type, values) => {
		try { //пробуем отфильтровать данные по типу
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");//собственно, фильтруем данные
			const alertMsg = (valuesArray.length) ? //если данные удалост получить
				`Данные с типом ${type}: ${valuesArray}` : //в строку записывается тип данных и сами данные этого типа
				`Отсутствуют данные типа ${type}`; //иначе в строку записывается сообщение об отсутствии данных этого типа
			showResults(alertMsg); //выводим результат в response-блок
		} catch (e) {//если же фильтрация вызвала ошибку(например, введено значение неизвестного типа)
			showError(`Ошибка: ${e}`); //выводим ошибку в response-блок
		}
	};

const filterButton = document.querySelector('#filter-btn'); //ищем кнопку фильтрации

filterButton.addEventListener('click', e => { //вешаем на кнопку событие клика
	const typeInput = document.querySelector('#type'); //ищем поле с типом данных
	const dataInput = document.querySelector('#data'); //ищем поле с данными

	if (dataInput.value === '') { //если данные пустые
		dataInput.setCustomValidity('Поле не должно быть пустым!'); //выводим сообщение об этом
		showNoResults();//в repsonse-блоке показываем отсутствие результата поиска
	} else { //иначе
		dataInput.setCustomValidity(''); //убираем сообщение с предупреждением
		e.preventDefault(); //отменяем стандартное действие формы
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); //пытаем отфильтровать данные
	}
});