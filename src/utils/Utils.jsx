import Timestamp from 'time-stamp';

export default {
    formatTimestamp(myTimestamp) {
        let d = myTimestamp != null ? new Date(myTimestamp) : new Date();
        return Timestamp('YYYY-MM-DD HH:mm:ss', d);
    }
};