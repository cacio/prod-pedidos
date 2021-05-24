/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Translation by: J.T.Sage <jtsage@gmail.com>
 *
 */

jQuery.extend(jQuery.mobile.datebox.prototype.options.lang, {
	'en': {
		setDateButtonLabel: "Definir data",
		setTimeButtonLabel: "Definir tempo",
		setDurationButtonLabel: "Definir Duração",
		calTodayButtonLabel: "Ir para hoje",
		titleDateDialogLabel: "Escolha Data",
		titleTimeDialogLabel: "Escolha Tempo",
		daysOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysOfWeekShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		monthsOfYear: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthsOfYearShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		durationLabel: ["Days", "Hours", "Minutes", "Seconds"],
		durationDays: ["Day", "Days"],
		tooltip: "Abrir Date Picker",
		nextMonth: "próximo mês",
		prevMonth: "Mês Anterior",
		timeFormat: 12,
		headerFormat: '%A, %B %-d, %Y',
		dateFieldOrder: ['m', 'd', 'y'],
		timeFieldOrder: ['h', 'i', 'a'],
		slideFieldOrder: ['y', 'm', 'd'],
		dateFormat: "%-m/%-d/%Y",
		useArabicIndic: false,
		isRTL: false,
		calStartDay: 0,
		clearButton: "claro",
		durationOrder: ['d', 'h', 'i', 's'],
		meridiem: ["AM", "PM"],
		timeOutput: "%l:%M %p",
		durationFormat: "%Dd %DA, %Dl:%DM:%DS",
		calDateListLabel: "outras datas"
	}
});
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
	useLang: 'en'
});

