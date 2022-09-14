function dataParse(str) {
  const st1 = str.split(':');// hours min
  const hour = +st1[0];
  const st2 = st1[1].split(' ');
  const min = +st2[0];
  const mer = st2[1];
  return { hour, min, mer };
}

// calculate the time in minutes from the start to the end
// interval string example 11:30 am - 12:00 pm
function intervalDuration(interval) {
  // get start
  const start = dataParse(interval.split('-')[0]);
  // get end
  const end = dataParse(interval.split('-')[1]);


  const sCombined = +`${start.hour}${start.min}`;
  const eCombined = +`${end.hour}${end.min}`;

// starts and finish am of the same day
// starts at night pm and finishing at evening pm
  if (start.mer === end.mer && sCombined < eCombined) {
    const sMin = start.hour * 60 + start.min;
    const eMin = end.hour * 60 + end.min;
    return eMin - sMin;
  }
  // starts in the morning am and finishing at evening pm
  else if (start.mer === 'am' && end.mer === 'pm') {
    const sMin = start.hour * 60 + start.min;
    const eMin = (12 + end.hour) * 60 + end.min;
    return eMin - sMin;
  }
  // starts in the morning or at night of one day and finishing in the morning of the other day
  else if (start.mer === 'am' && end.mer === 'am') {
    const sMin = start.hour * 60 + start.min;
    const eMin = (24 + end.hour) * 60 + end.min;
    return eMin - sMin;

    // starts in the evening or at night of one day and finishing in the morning of the other day
  } else if (start.mer === 'pm' && end.mer === 'am') {
    const sMin = (12 + start.hour) * 60 + start.min;
    const eMin = (24 + end.hour) * 60 + end.min;

    return (eMin - sMin);

  } // starts in the evening or at night of one day and finishing in the evening of other day
  else if (start.mer === 'pm' && end.mer === 'pm') {
    const sMin = (12 + start.hour) * 60 + start.min;
    const eMin = (24 + (12 + end.hour)) * 60 + end.min;
    return eMin - sMin;
  }

}

// consolend.log(diff('10:10 am', '10:30 am'));// 20min
// consolend.log(diff('10:10 am', '11:30 am'));// 80min
// consolend.log(diff('10:10 am', '1:30 pm'));// 200min
//
// consolend.log(diff('1:10 pm', '1:30 pm'));// 20min
// consolend.log(diff('1:10 pm', '2:30 pm'));// 80min
//
// consolend.log(diff('10:10 am', '9:30 am'));// 1400 min
// consolend.log(diff('1:10 pm', '10:30 am'));// 1280
// consolend.log(diff('1:10 pm', '1:05 pm'));//
//
//

module.exports = { intervalDuration };
