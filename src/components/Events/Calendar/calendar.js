import { useEffect, useState, useContext } from 'react';
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
import PropTypes from 'prop-types';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { CalendarIcon } from './Calendar.styled';
import { saveToStorage } from 'services/localStorService';
import { ru, uk, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { StatusContext } from 'components/ContextStatus/ContextStatus';

const Calendar = ({
  showDetailsHandle,
  currentWeek,
  setCurrentWeek,
  selectedDate,
  setSelectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? selectedDate : new Date()
  );
  const [currentWeekNumber, setCurrentWeekNumber] = useState(
    getWeek(currentMonth)
  );
  const { selectedLanguage } = useContext(StatusContext);

  const changeMonthHandle = btnType => {
    if (btnType === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === 'next') {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = btnType => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeekNumber(getWeek(subWeeks(currentMonth, 1)));
      getCurrentWeekDates(subWeeks(currentMonth, 1));
      setSelectedDate(null);
      // saveToStorage('selectedDate', null);
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeekNumber(getWeek(addWeeks(currentMonth, 1)));
      getCurrentWeekDates(addWeeks(currentMonth, 1));
      setSelectedDate(null);
      // saveToStorage('selectedDate', null);
    }
  };

  const onDateClickHandle = (day, dayStr) => {
    setSelectedDate(day);
    showDetailsHandle(dayStr);
    // saveToStorage('selectedDate', day);
  };

  const getCurrentWeekDates = weekNumber => {
    const weekDates = [];
    let startWeek = startOfWeek(weekNumber, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      weekDates.push(format(addDays(startWeek, i), 'ccc dd MMM yy'));
    }
    saveToStorage('currentWeek', weekDates);
    const formattedStoredWeek = weekDates
      ? weekDates.map(dateStr => new Date(dateStr).toLocaleDateString())
      : [];
    if (JSON.stringify(formattedStoredWeek) !== JSON.stringify(currentWeek)) {
      setCurrentWeek(formattedStoredWeek);
    }
  };

  useEffect(() => getCurrentWeekDates(currentMonth), []);

  const { t, i18n } = useTranslation();

  const renderHeader = () => {
    let locale;
    if (selectedLanguage === 'fr') {
      locale = fr;
    } else if (selectedLanguage === 'ua') {
      locale = uk;
    } else {
      locale = ru;
    }

    const dateFormat = 'LLLLLLLLL yyyy';
    return (
      <div className="header row flex-middle">
        <div className="col col-center">
          <span>{t(format(currentMonth, dateFormat, { locale }))}</span>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEE';
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell `}
            key={day}
            onClick={() => {
              const dayStr = format(cloneDay, 'ccc dd MMM yy');
              onDateClickHandle(cloneDay, dayStr);
            }}
          >
            <span
              className={`cell number ${
                isSameDay(day, new Date()) ? 'today' : ''
              } ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
            >
              {formattedDate}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const renderFooter = () => {
    return (
      <div className="footer">
        <div className="btn-prev" onClick={() => changeWeekHandle('prev')}>
          <MdKeyboardArrowLeft size={30} />
        </div>
        <div className="btn-next" onClick={() => changeWeekHandle('next')}>
          <MdKeyboardArrowRight size={30} />
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-box">
      <div className="calendar">
        <CalendarIcon />

        {renderHeader()}
        {renderDays()}
        {renderCells()}
        {renderFooter()}
      </div>
    </div>
  );
};

export default Calendar;

Calendar.propTypes = {
  showDetailsHandle: PropTypes.any,
  currentWeek: PropTypes.any,
  setCurrentWeek: PropTypes.any,
  selectedDate: PropTypes.any,
  setSelectedDate: PropTypes.any,
};
