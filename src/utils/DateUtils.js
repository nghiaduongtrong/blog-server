class DateUtils {

    /**
     * @param {String || Number}  value
     * @returns {Date} date 
     */
    convertToDate = (value) => {
        let date = new Date();
        if (value) {
            try {
                const timestamp = Number(value);
                const time = isNaN(timestamp) ? value : timestamp;
                date = new Date(time)
            } catch (err) {
                date = new Date(value);
            }
        }

        return date;
    }

    /**
     * @param {Anything}  date
     * @returns {Boolean}  
     */
    isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    }

    /**
     * @param {Number || Date}  target
     * @param {String}  datePattern
     * @param {Boolean}  utc
     * @returns {String} result  
     */
    format = (target, datePattern, utc = false) => {
        let result = datePattern;

        const monthsShortName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];

        let date = this.convertToDate(target);

        if (!this.isValidDate(date)) {
            return target;
        }

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        if (utc) {
            month = date.getUTCMonth() + 1;
            day = date.getUTCDate();
            year = date.getUTCFullYear();
            hours = date.getUTCHours();
            minutes = date.getUTCMinutes();
            seconds = date.getUTCSeconds();
        }

        // add '0' to the end of year
        if (year.toString().length < 4) {
            year = [...Array(4 - year.toString().length.fill('0'))].join('') + year;
        }

        const formatedDate = {
            MMM: monthsShortName[month - 1],
            MM: month < 10 ? "0" + month : month,
            dd: day < 10 ? "0" + day : day,
            yyyy: year,
            HH: hours < 10 ? "0" + hours : hours,
            mm: minutes < 10 ? "0" + minutes : minutes,
            ss: seconds < 10 ? "0" + seconds : seconds
        };

        for (const dateUnit in formatedDate) {
            result = result.replace(dateUnit, formatedDate[dateUnit]);
        }

        return result;
    }

    /**
     * @param {Date}  date
     * @returns {String}  
     */
    formatyyyMMddHHmmss = (date) => {
        return this.format(date, 'yyyy-MM-dd HH:mm:ss');
    }
}

module.exports = DateUtils;