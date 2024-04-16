function countDownDays(futureDate) {
    var currentDate = new Date();
    var futureDateObj = new Date(futureDate);
    var timeDiff = futureDateObj.getTime() - currentDate.getTime();
    var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

export { countDownDays };
  