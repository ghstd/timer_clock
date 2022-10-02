document.addEventListener('DOMContentLoaded', () => {

	// ============================================================================
	// Verify
	// ============================================================================

	function verifyTimer(input) {
		const valid = input.value.match(/(\d\d|\d|^\s*):(\d\d|\d|\s*$)/)

		if (valid && /[1-9]/.test(input.value)) {
			if (valid[1] === '') valid[1] = '0'
			if (valid[2] === '') valid[2] = '0'

			startTimer({
				min: parseInt(valid[1]),
				sec: parseInt(valid[2])
			})
		} else {
			showTimerMessage()
		}
	}

	// =========================

	function verifyClock(input) {
		const valid = input.value.match(/(^\d(?=:)|[01]\d|2[0-3]):([0-5]\d|\d$)/)

		if (valid) {

			startClock({
				hour: parseInt(valid[1]),
				min: parseInt(valid[2])
			})
		} else {
			showClockMessage()
		}
	}

	// ============================================================================
	// Start
	// ============================================================================

	function startTimer({ min = 0, sec = 0 }) {
		let interval = (min * 60 + sec) * 1000
		let element = ''

		const stopId = setInterval(() => {
			interval = interval - 1000
			if (interval < 0) {

				clearInterval(stopId)
				makeSignal(element, true)

			} else {
				min = Math.floor(interval / 1000 / 60)
				sec = interval / 1000 - min * 60
				const minuteNumber = `${min}`.replace(/^\d$/, `0${min}`)
				const secondNumber = `${sec}`.replace(/^\d$/, `0${sec}`)
				element.querySelector('.minute-number').innerHTML = minuteNumber
				element.querySelector('.second-number').innerHTML = secondNumber
			}
		}, 1000)

		element = createNote({ stopId, timerOn: true })
	}

	// =========================

	function startClock({ hour, min }) {
		const date = new Date()
		date.setHours(hour, min, 0, 0)
		const interval = date - Date.now()
		let element = ''

		const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		const text = getDescription()

		const stopId = setTimeout(() => {

			makeSignal(element)

		}, interval)

		element = createNote({ time, text, stopId })
	}

	// ============================================================================
	// Create Note
	// ============================================================================

	function createNote({ time = '', text = '', stopId, timerOn = false }) {
		const element = document.createElement('li')

		if (timerOn) {
			element.innerHTML = `
		<span class="notes-timer-numbers">
			<span class="minute-number"></span><span class="dotts-number">:</span><span class="second-number"></span>
		</span>
		<span data-delete-item class="notes-close"></span>
	`
		} else {
			element.innerHTML = `
		<span class="notes-time">${time}</span>
		<span class="notes-text">${text}</span>
		<span class="notes-icon"><span></span></span>
		<span data-delete-item class="notes-close"></span>
	`
		}
		function deleteItem(e) {
			if (e.target.dataset.hasOwnProperty('deleteItem')) {

				timerOn ? clearInterval(stopId) : clearTimeout(stopId)
				element.removeEventListener('click', deleteItem)
				element.remove()
			}
		}
		element.addEventListener('click', deleteItem)

		notes.insertAdjacentElement('beforeend', element)
		return element
	}

	// ============================================================================
	// Signal
	// ============================================================================

	function makeSignal(element, timerOn = false) {
		let audio = ''

		if (timerOn) {
			audio = new Audio('./audio/track_2.mp3')
			audio.play()
			element.classList.add('active')
			autoDeleteTimer(element)
		} else {
			audio = new Audio('./audio/track_1.mp3')
			audio.play()
			element.classList.add('active')
		}

		function stopSound(e) {
			if (e.target.dataset.hasOwnProperty('deleteItem')) {
				audio.pause()
				element.removeEventListener('click', stopSound)
			}
		}

		element.addEventListener('click', stopSound)
	}

	// ============================================================================
	// Others functions
	// ============================================================================

	function autoDeleteTimer(element) {
		setTimeout(() => { element.lastElementChild.click() }, 12000)
	}

	// =========================

	function showTimerMessage() {

		form.querySelector('.timer-message').classList.add('active')
		setTimeout(() => {
			form.querySelector('.timer-message').classList.remove('active')
		}, 3000)
	}

	function showClockMessage() {

		form.querySelector('.wake-up-message').classList.add('active')
		setTimeout(() => {
			form.querySelector('.wake-up-message').classList.remove('active')
		}, 3000)
	}

	// =========================

	function getDescription() {

		if (description.value) {
			const text = description.value
			closeDescription()
			return text
		}
		closeDescription()
	}

	// =========================

	function closeDescription() {

		if (description.classList.contains('active')) {
			description.classList.remove('active')
			description.value = ''
		}
	}

	// =========================

	function startStaticWatch(element) {

		requestAnimationFrame(function startWatch() {
			const date = new Date()
			element.innerHTML = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
			setTimeout(() => {
				requestAnimationFrame(startWatch)
			}, 200)
		})
	}

	// ============================================================================
	// get Elements
	// ============================================================================
	document.addEventListener('DOMContentLoaded', () => { })

	const input = document.querySelector('.input')
	const form = document.querySelector('.form')
	const button = document.querySelector('.submit')
	const swittch = document.querySelector('.app-mode input')
	const notes = document.querySelector('.notes')
	const description = document.querySelector('.description-text')
	const descriptionBtn = document.querySelector('.description-btn')
	const watch = document.querySelector('.watch')

	// =========================
	startStaticWatch(watch)

	setTimeout(() => {
		form.querySelector('.wake-up-label').classList.add('active')
	}, 500)
	// =========================

	// ============================================================================
	// addEventListener
	// ============================================================================

	descriptionBtn.addEventListener('click', () => {

		description.classList.toggle('active')

		if (description.classList.contains('active')) {
			description.focus()
		}
		description.value = ''
	})

	// =========================

	description.addEventListener('blur', (e) => {

		if (e.relatedTarget === button || e.relatedTarget === input || e.relatedTarget === descriptionBtn) {
		} else {
			closeDescription()
		}
	})

	// =========================

	swittch.addEventListener('click', () => {

		if (form.dataset.timer === 'on') {
			form.dataset.timer = 'off'
			descriptionBtn.disabled = false
			form.querySelector('.timer-label').classList.remove('active')
			setTimeout(() => {
				form.querySelector('.wake-up-label').classList.add('active')
			}, 500)
		} else {
			form.dataset.timer = 'on'
			descriptionBtn.disabled = true
			form.querySelector('.wake-up-label').classList.remove('active')
			setTimeout(() => {
				form.querySelector('.timer-label').classList.add('active')
			}, 500)
		}
	})

	// =========================

	form.addEventListener('submit', (e) => {
		e.preventDefault()

		if (form.dataset.timer === 'on') {
			verifyTimer(input)
		} else {
			verifyClock(input)
		}
		input.value = ''
		input.blur()
	})

	// =========================

	input.addEventListener('focus', () => {

		setTimeout(() => {
			input.value = ':'
			input.setSelectionRange(0, 0)
		})
	})

	input.addEventListener('blur', (e) => {

		if (e.relatedTarget === button) {
		} else {
			input.value = ''
		}
	})

	// =========================

	input.addEventListener('input', () => {
		const pos = input.selectionEnd
		const arr = [...input.value]

		if (/(\w\w)(?=:)/.test(input.value)) {
			input.setSelectionRange(pos + 2, pos + 2)
		}

		if (/\D\D/.test(input.value)) {
			arr.splice(pos - 1, 1)
			input.value = arr.join('')
			input.setSelectionRange(pos - 1, pos - 1)
		}

		if (/(^[3-9])|(^\d[4-9])|(:[6-9]$)|([6-9]\d$)/.test(input.value)) {
			arr.splice(pos - 1, 1)
			input.value = arr.join('')
			input.setSelectionRange(pos - 1, pos - 1)
		}

		if (!/:/.test(input.value)) {
			arr.splice(pos, 0, ':')
			input.value = arr.join('')
			input.setSelectionRange(pos, pos)
		}

		if (input.value.match(/(\w\w\w)(?=:)/)) {
			arr.splice(pos - 1, 1)
			input.value = arr.join('')
		}

		if (input.value.match(/(\w\w\w)(?!:)/)) {
			arr.splice(pos - 1, 1)
			input.value = arr.join('')
			input.setSelectionRange(pos - 1, pos - 1)
		}
	})

})