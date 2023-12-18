//Đừng xóa

// exports.dateOverlap = (
//   dateFrom,
//   dateTo,
//   newDateFrom,
//   newDateTo,
//   OrderByTime
// ) => {
//   if (!OrderByTime) {
//     let dbFromSecond = new Date(
//       `${dateFrom.slice(5, 7)} ${dateFrom.slice(8, 10)}, ${dateFrom.slice(
//         0,
//         4
//       )} ${dateFrom.slice(11, 19)}`
//     );
//     let dbToSecond = new Date(
//       `${dateTo.slice(5, 7)} ${dateTo.slice(8, 10)}, ${dateTo.slice(
//         0,
//         4
//       )} ${dateTo.slice(11, 19)}`
//     );

//     let newFromSecond = new Date(
//       `${newDateFrom.slice(5, 7)} ${newDateFrom.slice(
//         8,
//         10
//       )}, ${newDateFrom.slice(0, 4)} ${newDateFrom.slice(11, 19)}`
//     );
//     let newToSecond = new Date(
//       `${newDateTo.slice(5, 7)} ${newDateTo.slice(8, 10)}, ${newDateTo.slice(
//         0,
//         4
//       )} ${newDateTo.slice(11, 19)}`
//     );

//     if (
//       (newFromSecond.getTime() > dbFromSecond.getTime() &&
//         newFromSecond.getTime() < dbToSecond.getTime()) ||
//       (newToSecond.getTime() < dbToSecond.getTime() &&
//         newToSecond.getTime() > dbFromSecond.getTime()) ||
//       (newToSecond.getTime() > dbToSecond.getTime() &&
//         newFromSecond.getTime() < dbFromSecond.getTime())
//     ) {
//       return true;
//     }
//     return false;
//   } else {
//     let dbYearFrom = dateFrom.slice(0, 4);
//     let dbMonthFrom = dateFrom.slice(5, 7);
//     let dbDateFrom = dateFrom.slice(8, 10);
//     let datedbFrom = new Date(
//       dbYearFrom,
//       dbMonthFrom,
//       dbDateFrom,
//       dateFrom.slice(11, 13),
//       dateFrom.slice(14, 16),
//       dateFrom.slice(17, 19)
//     );
//     let datedbFromISO = datedbFrom.toISOString();

//     let dbYearTo = dateTo.slice(0, 4);
//     let dbMonthTo = dateTo.slice(5, 7);
//     let dbDateTo = dateTo.slice(8, 10);
//     let datedbTo = new Date(
//       dbYearTo,
//       dbMonthTo,
//       dbDateTo,
//       dateTo.slice(11, 13),
//       dateTo.slice(14, 16),
//       dateTo.slice(17, 19)
//     );
//     let datedbToISO = datedbTo.toISOString();

//     let newYearFrom = newDateFrom.slice(0, 4);
//     let newMonthFrom = newDateFrom.slice(5, 7);
//     let newDayFrom = newDateFrom.slice(8, 10);
//     let dateNewFrom = new Date(
//       newYearFrom,
//       newMonthFrom,
//       newDayFrom,
//       newDateFrom.slice(11, 13),
//       newDateFrom.slice(14, 16),
//       newDateFrom.slice(17, 19)
//     );
//     let dateNewFromISO = dateNewFrom.toISOString();

//     let newYearTo = newDateTo.slice(0, 4);
//     let newMonthTo = newDateTo.slice(5, 7);
//     let newDayTo = newDateTo.slice(8, 10);
//     let dateNewTo = new Date(
//       newYearTo,
//       newMonthTo,
//       newDayTo,
//       newDateTo.slice(11, 13),
//       newDateTo.slice(14, 16),
//       newDateTo.slice(17, 19)
//     );
//     let dateNewToISO = dateNewTo.toISOString();
//   }
// };
